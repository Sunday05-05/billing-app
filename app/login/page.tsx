"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (!result || result.error) {
        setErrorMessage("邮箱或密码错误");
        return;
      }

      router.push("/bills");
      router.refresh();
    } catch {
      setErrorMessage("登录失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        返回首页
      </Link>

      <h1 className="mt-6 text-3xl font-bold">登录</h1>
      <p className="mt-2 text-gray-600">
        使用邮箱和密码登录账单系统。
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-lg border p-6"
      >
        <div>
          <label htmlFor="email" className="font-medium">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded border p-2"
            placeholder="name@example.com"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="font-medium">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded border p-2"
            placeholder="请输入密码"
          />
        </div>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? "正在登录..." : "登录"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        还没有账户？{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          立即注册
        </Link>
      </p>
    </main>
  );
}
