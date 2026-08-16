import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <p className="text-sm font-medium text-blue-600">Next.js 学习项目</p>
      <h1 className="mt-2 text-4xl font-bold">个人账单管理系统</h1>
      <p className="mt-4 text-gray-600">
        记录、查看和筛选日常账单，逐步学习完整的全栈开发流程。
      </p>

      <nav className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="主要页面">
        <Link
          href="/bills"
          className="rounded-lg border p-6 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <span className="text-xl font-semibold">管理账单</span>
          <span className="mt-2 block text-sm text-gray-600">
            新增、查看和筛选账单
          </span>
        </Link>

        <Link
          href="/login"
          className="rounded-lg border p-6 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <span className="text-xl font-semibold">登录</span>
          <span className="mt-2 block text-sm text-gray-600">
            登录功能将在后续阶段完成
          </span>
        </Link>
      </nav>
    </main>
  );
}
