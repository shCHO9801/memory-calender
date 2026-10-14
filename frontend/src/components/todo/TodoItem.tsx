import {useState} from "react";
import TodoEditForm from "@/components/todo/TodoEditForm";

type TodoResponse = {
    todoId: number;
    content: string;
    dueAt: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    completedAt: string | null;
};

type TodoItemProps = {
    todo: TodoResponse;
    onToggleDone: (todoId: number, isDone: boolean) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onUpdate: (
        todoId: number,
        content: string,
        dueAt: string | null
    ) => Promise<void>;
};


export default function TodoItem({
                                     todo,
                                     onToggleDone,
                                     onDelete,
                                     onUpdate,
                                 }: TodoItemProps) {
    const isDone = todo.status === "DONE";
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex items-start gap-3 border-b border-zinc-100 py-4 last:border-b-0">
            <button
                type="button"
                onClick={() => void onToggleDone(todo.todoId, isDone)}
                className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border ${
                    isDone
                        ? "border-zinc-900 bg-zinc-900"
                        : "border-zinc-300 bg-white"
                }`}
                aria-label="Todo 상태 변경"
            />

            <div className="min-w-0 flex-1">
                {isEditing ? (
                    <TodoEditForm
                        todoId={todo.todoId}
                        content={todo.content}
                        dueAt={todo.dueAt}
                        onUpdate={onUpdate}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <p
                            className={`text-sm font-medium ${
                                isDone
                                    ? "text-zinc-400 line-through"
                                    : "text-zinc-900"
                            }`}
                        >
                            {todo.content}
                        </p>

                        {todo.dueAt && (
                            <p className="mt-1 text-xs text-zinc-500">
                                {formatDateTime(todo.dueAt)}
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
    <span className="text-xs text-zinc-400">
        {formatStatus(todo.status)}
    </span>

                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-zinc-400 hover:text-zinc-900"
                >
                    수정
                </button>

                <button
                    type="button"
                    onClick={() => void onDelete(todo.todoId)}
                    className="text-xs text-zinc-400 hover:text-red-500"
                >
                    삭제
                </button>
            </div>
        </div>
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

function formatStatus(status: TodoResponse["status"]) {
    switch (status) {
        case "TODO":
            return "할 일";
        case "IN_PROGRESS":
            return "진행 중";
        case "DONE":
            return "완료";
    }
}