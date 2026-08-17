import bcrypt from "bcryptjs";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

type DatabaseError = Error & {
  code?: string;
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "注册信息不合法", details: result.error.issues },
        { status: 400 },
      );
    }

    const name = result.data.name;
    const email = result.data.email.toLowerCase();
    const passwordHash = await bcrypt.hash(result.data.password, 12);

    const [insertResult] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `,
      [name, email, passwordHash],
    );

    return NextResponse.json(
      { id: insertResult.insertId, name, email },
      { status: 201 },
    );
  } catch (error) {
    if ((error as DatabaseError).code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "该邮箱已注册，请直接登录" },
        { status: 409 },
      );
    }

    console.error("注册失败：", error);

    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 },
    );
  }
}
