import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session-user";
import { z } from "zod";

export const runtime = "nodejs";

type BillRouteContext = {
  params: Promise<{ id: string }>;
};

const updateBillSchema = z.object({
  title: z.string().trim().min(1).max(255),
  amount: z.coerce.number().positive(),
  category: z.string().trim().min(1).max(50),
  status: z.enum(["pending", "paid"]),
  billDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function PUT(
  request: Request,
  { params }: BillRouteContext,
) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const billId = Number(id);

    if (!Number.isSafeInteger(billId) || billId <= 0) {
      return NextResponse.json(
        { error: "账单编号不合法" },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();
    const result = updateBillSchema.safeParse(body);

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

    const [updateResult] = await db.execute<ResultSetHeader>(
      `
        UPDATE bills
        SET
          title = ?,
          amount_cents = ?,
          category = ?,
          status = ?,
          bill_date = ?
        WHERE id = ? AND user_id = ?
      `,
      [title, amountCents, category, status, billDate, billId, userId],
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "账单不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: billId,
      title,
      amount_cents: amountCents,
      category,
      status,
      bill_date: billDate,
    });
  } catch (error) {
    console.error("修改账单失败：", error);

    return NextResponse.json(
      { error: "修改账单失败" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: BillRouteContext,
) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const billId = Number(id);

    if (!Number.isSafeInteger(billId) || billId <= 0) {
      return NextResponse.json(
        { error: "账单编号不合法" },
        { status: 400 },
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM bills WHERE id = ? AND user_id = ?",
      [billId, userId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "账单不存在" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "账单已删除",
      id: billId,
    });
  } catch (error) {
    console.error("删除账单失败：", error);

    return NextResponse.json(
      { error: "删除账单失败" },
      { status: 500 },
    );
  }
}
