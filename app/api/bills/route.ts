import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session-user";
import { z } from "zod";
import type { ResultSetHeader } from "mysql2";

export const runtime = "nodejs";

const createBillSchema = z.object({
  title: z.string().trim().min(1).max(255),
  amount: z.coerce.number().positive(),
  category: z.string().trim().min(1).max(50),
  status: z.enum(["pending", "paid"]).default("pending"),
  billDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }

    const [rows] = await db.query(`
      SELECT
        id,
        title,
        amount_cents,
        category,
        status,
        DATE_FORMAT(bill_date, '%Y-%m-%d') AS bill_date,
        created_at
      FROM bills
      WHERE user_id = ?
      ORDER BY id DESC
    `, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("读取账单失败：", error);

    return NextResponse.json(
      { error: "读取账单失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const result = createBillSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "账单数据不合法",
          details: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { title, amount, category, status, billDate } = result.data;
    const amountCents = Math.round(amount * 100);

    const [insertResult] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO bills
          (user_id, title, amount_cents, category, status, bill_date)
        VALUES
          (?, ?, ?, ?, ?, ?)
      `,
      [userId, title, amountCents, category, status, billDate],
    );

    return NextResponse.json(
      {
        id: insertResult.insertId,
        title,
        amount_cents: amountCents,
        category,
        status,
        bill_date: billDate,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("新增账单失败：", error);

    return NextResponse.json(
      { error: "新增账单失败" },
      { status: 500 },
    );
  }
}
