"use client";

import { useState, type FormEvent } from "react";

export type NewBillInput = {
  title: string;
  amount: number;
  category: string;
  status: "pending" | "paid";
  billDate: string;
};

type BillFormProps = {
  onAddBill: (bill: NewBillInput) => Promise<void>;
};

function getTodayForDateInput() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BillForm({ onAddBill }: BillFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"pending" | "paid">("pending");
  const [billDate, setBillDate] = useState(getTodayForDateInput);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("请输入账单标题");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("请输入大于 0 的金额");
      return;
    }

    if (!category.trim()) {
      setMessage("请输入账单分类");
      return;
    }

    if (!billDate) {
      setMessage("请选择账单日期");
      return;
    }

    setIsSubmitting(true);
    setMessage("正在保存账单...");

    try {
      await onAddBill({
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        status,
        billDate,
      });

      setMessage("账单已保存到数据库");
      setTitle("");
      setAmount("");
      setCategory("");
      setStatus("pending");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "账单保存失败，请稍后重试",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-md rounded-lg border p-6"
    >
      <h2 className="text-xl font-semibold">新增账单</h2>

      <div className="mt-4">
        <label htmlFor="title">账单标题</label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded border p-2"
          placeholder="例如：午餐"
        />
        <p className="mt-2 text-sm text-gray-600">当前输入：{title}</p>
      </div>

      <div className="mt-4">
        <label htmlFor="amount">金额（元）</label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="mt-1 w-full rounded border p-2"
          placeholder="例如：20.00"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="category">分类</label>
        <input
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-1 w-full rounded border p-2"
          placeholder="例如：餐饮"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="status">状态</label>
        <select
          id="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "pending" | "paid")
          }
          className="mt-1 w-full rounded border p-2"
        >
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="bill-date">账单日期</label>
        <input
          id="bill-date"
          type="date"
          value={billDate}
          onChange={(event) => setBillDate(event.target.value)}
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? "正在保存..." : "新增账单"}
      </button>

      {message && <p className="mt-4 text-sm font-medium">{message}</p>}
    </form>
  );
}
