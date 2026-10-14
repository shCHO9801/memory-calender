type TodoResponse = {
    todoId: number;
    content: string;
    dueAt: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    completedAt: string | null;
};

type TodoPanelProps = {
    todos: TodoResponse[];
};

export default function TodoPanel({todos}: TodoPanelProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                    할 일
                </h2>

                <span className="text-sm text-zinc-500">
                    {todos.length}개
                </span>
            </div>

            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                {todos.length === 0 && (
                    <p className="text-sm text-zinc-500">
                        남아있는 할 일이 없습니다.
                    </p>
                )}

                {todos.map((todo) => (
                    <div
                        key={todo.todoId}
                        className="rounded-xl border border-zinc-200 p-3"
                    >
                        <p className="font-medium text-zinc-900">
                            {todo.content}
                        </p>

                        {todo.dueAt && (
                            <p className="mt-1 text-sm text-zinc-500">
                                마감 {formatDateTime(todo.dueAt)}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}