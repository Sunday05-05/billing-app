import BillItem from "@/components/BillItem";

export type Bill = {
  id: number;
  title: string;
  amount: number;
  category: string;
  status: "pending" | "paid";
  billDate: string;
};

type BillListProps = {
  bills: Bill[];
  emptyMessage?: string;
  deletingId: number | null;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (id: number) => Promise<void>;
};

export default function BillList({
  bills,
  emptyMessage = "还没有账单",
  deletingId,
  onEditBill,
  onDeleteBill,
}: BillListProps) {
  return (
    <section className="mt-8 max-w-md">
      <h2 className="text-xl font-semibold">账单列表</h2>

      {bills.length === 0 ? (
        <p className="mt-4 text-gray-600">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {bills.map((bill) => (
            <BillItem
              key={bill.id}
              id={bill.id}
              title={bill.title}
              amount={bill.amount}
              category={bill.category}
              status={bill.status}
              billDate={bill.billDate}
              isDeleting={deletingId === bill.id}
              onEdit={() => onEditBill(bill)}
              onDelete={onDeleteBill}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
