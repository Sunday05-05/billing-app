import "server-only";

import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
});

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password_hash: string;
};

export async function verifyUserCredentials(input: unknown) {
  // 第一步：检查邮箱和密码格式
  const result = credentialsSchema.safeParse(input);

  if (!result.success) {
    return null;
  }

  const email = result.data.email.toLowerCase();
  const password = result.data.password;

  // 第二步：根据邮箱查询用户
  const [rows] = await db.execute<UserRow[]>(
    `
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  const user = rows[0];

  if (!user) {
    return null;
  }

  // 第三步：比较输入密码与数据库哈希
  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash,
  );

  if (!passwordMatches) {
    return null;
  }

  // 不要把 password_hash 返回给浏览器
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
  };
}