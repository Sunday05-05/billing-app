import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BillManager from "@/components/BillManager";
import LogoutButton from "@/components/LogoutButton";

export default async function BillsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <nav className="flex gap-4 text-sm" aria-label="页面导航">
        <Link href="/" className="text-blue-600 hover:underline">
          返回首页
        </Link>
        <LogoutButton />
      </nav>

      <p className="mt-6 text-sm text-gray-600">
        当前用户：{session.user.email}
      </p>

      <h1 className="mt-2 text-3xl font-bold">账单管理</h1>
      <p className="mt-2 text-gray-600">
        新增账单，并按标题筛选列表。
      </p>

      <BillManager />
    </main>
  );
}
