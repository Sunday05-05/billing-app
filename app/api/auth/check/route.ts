import { NextResponse } from "next/server";
import { verifyUserCredentials } from "@/lib/verify-user";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const user = await verifyUserCredentials(body);

    if (!user) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "验证成功",
      user,
    });
  } catch (error) {
    console.error("验证用户失败：", error);

    return NextResponse.json(
      { error: "服务器验证失败" },
      { status: 500 },
    );
  }
}