"use client";

import { useState, type FormEvent } from "react";
import type { NewBillInput } from "@/components/BillForm";
import type { Bill } from "@/components/BillList";

type EditBillFormProps = {
  bill: Bill;
  onSave: (id: number, input: NewBillInput) => Promise<void>;
  onCancel: () => void;
};

export default function EditBillForm({
  bill,
  onSave,
  onCancel,
}: EditBillFormProps) {
  const [title, setTitle] = useState(bill.title);
  const [amount, setAmount] = useState(String(bill.amount));
  const [category, setCategory] = useState(bill.category);
  const [status, setStatus] = useState<"pending" | "paid">(bill.status);
  const [billDate, setBillDate] = useState(bill.billDate);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !category.trim() || !billDate) {
      setMessage("请完整填写账单信息");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("请输入大于 0 的金额");
      return;
    }

    setIsSaving(true);
    setMessage("正在保存修改...");

    try {
      await onSave(bill.id, {
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        status,
        billDate,
      });
      onCancel();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "账单修改失败，请稍后重试",
      );
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-md rounded-lg border border-blue-300 bg-blue-50 p-6"
    >
      <h2 className="text-xl font-semibold">编辑账单</h2>

      <div className="mt-4">
        <label htmlFor={`edit-title-${bill.id}`}>账单标题</label>
        <input
          id={`edit-title-${bill.id}`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded border bg-white p-2"
        />
      </div>

      <div className="mt-4">
        <label htmlFor={`edit-amount-${bill.id}`}>金额（元）</label>
        <input
          id={`edit-amount-${bill.id}`}
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="mt-1 w-full rounded border bg-white p-2"
        />
      </div>

      <div className="mt-4">
        <label htmlFor={`edit-category-${bill.id}`}>分类</label>
        <input
          id={`edit-category-${bill.id}`}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-1 w-full rounded border bg-white p-2"
        />
      </div>

      <div className="mt-4">
        <label htmlFor={`edit-status-${bill.id}`}>状态</label>
        <select
          id={`edit-status-${bill.id}`}
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "pending" | "paid")
          }
          className="mt-1 w-full rounded border bg-white p-2"
        >
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor={`edit-date-${bill.id}`}>账单日期</label>
        <input
          id={`edit-date-${bill.id}`}
          type="date"
          value={billDate}
          onChange={(event) => setBillDate(event.target.value)}
          className="mt-1 w-full rounded border bg-white p-2"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSaving ? "保存中..." : "保存修改"}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          取消
        </button>
      </div>

      {message && <p className="mt-4 text-sm font-medium">{message}</p>}
    </form>
  );
}
