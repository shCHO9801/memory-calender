import TodoItem from "@/components/todo/TodoItem";

type TodoResponse = {
    todoId: number;
    content: string;
    dueAt: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    completedAt: string | null;
};

type TodoListProps = {
    todos: TodoResponse[];
    onToggleDone: (todoId: number, isDone: boolean) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onUpdate: (
        todoId: number,
        content: string,
        dueAt: string | null
    ) => Promise<void>;
};

export default function TodoList({
                                     todos,
                                     onToggleDone,
                                     onDelete,
                                     onUpdate,
                                 }: TodoListProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="space-y-3">
                {todos.length === 0 && (
                    <p className="text-sm text-zinc-500">
                        등록된 할 일이 없습니다.
                    </p>
                )}

                {todos.map((todo) => (
                    <TodoItem
                        key={todo.todoId}
                        todo={todo}
                        onToggleDone={onToggleDone}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        </section>
    );
}