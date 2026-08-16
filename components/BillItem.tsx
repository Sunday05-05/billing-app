type BillItemProps = {
  id: number;
  title: string;
  amount: number;
  category: string;
  status: "pending" | "paid";
  billDate: string;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: (id: number) => Promise<void>;
};

export default function BillItem({
  id,
  title,
  amount,
  category,
  status,
  billDate,
  isDeleting,
  onEdit,
  onDelete,
}: BillItemProps) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-gray-600">
          ¥{amount.toFixed(2)} · {category}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {status === "paid" ? "已支付" : "待支付"} · {billDate}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={isDeleting}
          onClick={onEdit}
          className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          编辑
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => void onDelete(id)}
          className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "删除中..." : "删除"}
        </button>
      </div>
    </li>
  );
}
