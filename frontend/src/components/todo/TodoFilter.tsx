type TodoStatusFilter =
    | "TODO"
    | "DONE";

type TodoFilterProps = {
    value: TodoStatusFilter;
    onChange: (value: TodoStatusFilter) => void;
};

const filters: {
    label: string;
    value: TodoStatusFilter;
}[] = [
    {label: "할 일", value: "TODO"},
    {label: "완료", value: "DONE"},
];

export default function TodoFilter({
                                       value,
                                       onChange,
                                   }: TodoFilterProps) {
    return (
        <div className="flex gap-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    type="button"
                    onClick={() => onChange(filter.value)}
                    className={`rounded-lg px-3 py-2 text-sm ${
                        value === filter.value
                            ? "bg-zinc-900 text-white"
                            : "bg-white text-zinc-600 hover:bg-zinc-100"
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}