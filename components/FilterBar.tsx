type FilterBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <section className="mt-8 max-w-md">
      <label htmlFor="bill-filter" className="font-medium">
        筛选账单
      </label>
      <input
        id="bill-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded border p-2"
        placeholder="输入账单标题"
      />
    </section>
  );
}
