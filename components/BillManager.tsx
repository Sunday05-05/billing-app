"use client";

import { useEffect, useState } from "react";
import BillForm, { type NewBillInput } from "@/components/BillForm";
import BillList, { type Bill } from "@/components/BillList";
import EditBillForm from "@/components/EditBillForm";
import FilterBar from "@/components/FilterBar";

type ApiBill = {
  id: number;
  title: string;
  amount_cents: number;
  category: string;
  status: "pending" | "paid";
  bill_date: string;
};

export default function BillManager() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBills() {
      try {
        const response = await fetch("/api/bills", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("读取账单失败");
        }

        const data = (await response.json()) as ApiBill[];
        const loadedBills: Bill[] = data.map((bill) => ({
          id: bill.id,
          title: bill.title,
          amount: bill.amount_cents / 100,
          category: bill.category,
          status: bill.status,
          billDate: bill.bill_date,
        }));

        setBills(loadedBills);
        setLoadError("");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setLoadError("账单加载失败，请稍后重试");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadBills();

    return () => controller.abort();
  }, []);

  const normalizedFilter = filterText.trim().toLowerCase();
  const filteredBills = bills.filter((bill) =>
    bill.title.toLowerCase().includes(normalizedFilter),
  );

  async function addBill(input: NewBillInput) {
    const response = await fetch("/api/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const responseBody: unknown = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseBody === "object" &&
        responseBody !== null &&
        "error" in responseBody &&
        typeof responseBody.error === "string"
          ? responseBody.error
          : "账单保存失败，请稍后重试";

      throw new Error(errorMessage);
    }

    const createdBill = responseBody as ApiBill;

    setBills((currentBills) => [
      {
        id: createdBill.id,
        title: createdBill.title,
        amount: createdBill.amount_cents / 100,
        category: createdBill.category,
        status: createdBill.status,
        billDate: createdBill.bill_date,
      },
      ...currentBills,
    ]);
  }

  async function updateBill(id: number, input: NewBillInput) {
    const response = await fetch(`/api/bills/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const responseBody: unknown = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof responseBody === "object" &&
        responseBody !== null &&
        "error" in responseBody &&
        typeof responseBody.error === "string"
          ? responseBody.error
          : "账单修改失败，请稍后重试";

      throw new Error(errorMessage);
    }

    const updatedBill = responseBody as ApiBill;

    setBills((currentBills) =>
      currentBills.map((bill) =>
        bill.id === id
          ? {
              id: updatedBill.id,
              title: updatedBill.title,
              amount: updatedBill.amount_cents / 100,
              category: updatedBill.category,
              status: updatedBill.status,
              billDate: updatedBill.bill_date,
            }
          : bill,
      ),
    );
  }

  async function deleteBill(id: number) {
    const confirmed = window.confirm("确定删除这条账单吗？");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setActionError("");

    try {
      const response = await fetch(`/api/bills/${id}`, {
        method: "DELETE",
      });
      const responseBody: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof responseBody === "object" &&
          responseBody !== null &&
          "error" in responseBody &&
          typeof responseBody.error === "string"
            ? responseBody.error
            : "账单删除失败，请稍后重试";

        throw new Error(errorMessage);
      }

      setBills((currentBills) =>
        currentBills.filter((bill) => bill.id !== id),
      );
      if (editingBill?.id === id) {
        setEditingBill(null);
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "账单删除失败，请稍后重试",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <BillForm onAddBill={addBill} />
      {editingBill && (
        <EditBillForm
          key={editingBill.id}
          bill={editingBill}
          onSave={updateBill}
          onCancel={() => setEditingBill(null)}
        />
      )}
      <FilterBar value={filterText} onChange={setFilterText} />
      {actionError && <p className="mt-4 text-red-600">{actionError}</p>}
      {isLoading ? (
        <p className="mt-8 text-gray-600">正在加载账单...</p>
      ) : loadError ? (
        <p className="mt-8 text-red-600">{loadError}</p>
      ) : (
        <BillList
          bills={filteredBills}
          emptyMessage={
            bills.length === 0 ? "还没有账单" : "没有符合条件的账单"
          }
          deletingId={deletingId}
          onEditBill={(bill) => {
            setActionError("");
            setEditingBill(bill);
          }}
          onDeleteBill={deleteBill}
        />
      )}
    </>
  );
}
