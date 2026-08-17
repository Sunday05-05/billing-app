"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type ErrorResponse = {
  error?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setErrorMessage("两次输入的密码不一致");
      setIsSubmitting(false);
      return;
    }

    const email = String(formData.get("email") ?? "");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email,
          password,
        }),
      });
      const responseBody = (await response.json()) as ErrorResponse;

      if (!response.ok) {
        setErrorMessage(responseBody.error ?? "注册失败，请稍后重试");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        router.push("/login?registered=1");
        return;
      }

      router.push("/bills");
      router.refresh();
    } catch {
      setErrorMessage("注册失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        返回首页
      </Link>

      <h1 className="mt-6 text-3xl font-bold">创建账户</h1>
      <p className="mt-2 text-gray-600">
        每个邮箱只能注册一次，账户之间的账单相互独立。
      </p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border p-6">
        <div>
          <label htmlFor="name" className="font-medium">姓名</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
            className="mt-2 w-full rounded border p-2"
            placeholder="请输入姓名"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="font-medium">邮箱</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            className="mt-2 w-full rounded border p-2"
            placeholder="name@example.com"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="font-medium">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            className="mt-2 w-full rounded border p-2"
            placeholder="至少 8 位"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="confirmPassword" className="font-medium">
            确认密码
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            className="mt-2 w-full rounded border p-2"
            placeholder="再次输入密码"
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
          {isSubmitting ? "正在注册..." : "注册并登录"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          已有账户？{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            直接登录
          </Link>
        </p>
      </form>
    </main>
  );
}
