"use client";

import {useEffect, useState} from "react";

import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingState from "@/components/common/LoadingState";
import {
    useToast,
} from "@/components/common/ToastProvider";
import TodoCreateForm from "@/components/todo/TodoCreateForm";
import TodoFilter from "@/components/todo/TodoFilter";
import TodoList from "@/components/todo/TodoList";

import {
    createTodo,
    deleteTodo,
    getTodos,
    updateTodo,
    updateTodoStatus,
    type TodoResponse,
} from "@/lib/todos-api";

export default function TodosPage() {
    const {showToast} = useToast();

    const [todos, setTodos] =
        useState<TodoResponse[]>([]);

    const [statusFilter, setStatusFilter] = useState<
        "TODO" | "DONE"
    >("TODO");

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const data = await getTodos();

                setTodos(data.content);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(
                    getErrorMessage(error),
                );
            } finally {
                setIsLoading(false);
            }
        };

        void fetchTodos();
    }, []);

    const handleCreateTodo = async (
        content: string,
        dueAt: string | null,
    ) => {
        try {
            const createdTodo = await createTodo({
                noteId: null,
                content,
                dueAt,
            });

            setTodos((prev) => [
                createdTodo,
                ...prev,
            ]);

            setErrorMessage("");

            showToast("할 일을 추가했습니다.");
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error),
            );

            throw error;
        }
    };

    const handleToggleTodoDone = async (
        todoId: number,
        isDone: boolean,
    ) => {
        const nextStatus = isDone
            ? "TODO"
            : "DONE";

        try {
            const updatedTodo =
                await updateTodoStatus(
                    todoId,
                    nextStatus,
                );

            setTodos((prev) =>
                prev.map((todo) =>
                    todo.todoId === updatedTodo.todoId
                        ? updatedTodo
                        : todo,
                ),
            );

            setErrorMessage("");

            showToast(
                nextStatus === "DONE"
                    ? "할 일을 완료했습니다."
                    : "할 일을 다시 진행 상태로 변경했습니다.",
            );
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error),
            );

            throw error;
        }
    };

    const handleDeleteTodo = async (
        todoId: number,
    ) => {
        try {
            await deleteTodo(todoId);

            setTodos((prev) =>
                prev.filter(
                    (todo) => todo.todoId !== todoId,
                ),
            );

            setErrorMessage("");

            showToast("할 일을 삭제했습니다.");
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error),
            );

            throw error;
        }
    };

    const handleUpdateTodo = async (
        todoId: number,
        content: string,
        dueAt: string | null,
    ) => {
        try {
            const updatedTodo = await updateTodo(
                todoId,
                {
                    content,
                    dueAt,
                },
            );

            setTodos((prev) =>
                prev.map((todo) =>
                    todo.todoId === updatedTodo.todoId
                        ? updatedTodo
                        : todo,
                ),
            );

            setErrorMessage("");

            showToast("할 일을 수정했습니다.");
        } catch (error) {
            setErrorMessage(
                getErrorMessage(error),
            );

            throw error;
        }
    };

    const filteredTodos = todos.filter(
        (todo) => todo.status === statusFilter,
    );

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <header>
                <h1 className="text-2xl font-semibold text-zinc-900">
                    Todo
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    할 일을 확인하고 관리하세요.
                </p>
            </header>

            <ErrorMessage message={errorMessage} />

            {isLoading ? (
                <LoadingState />
            ) : (
                <>
                    <TodoCreateForm
                        onCreate={handleCreateTodo}
                    />

                    <TodoFilter
                        value={statusFilter}
                        onChange={setStatusFilter}
                    />

                    <TodoList
                        todos={filteredTodos}
                        onToggleDone={
                            handleToggleTodoDone
                        }
                        onDelete={handleDeleteTodo}
                        onUpdate={handleUpdateTodo}
                    />
                </>
            )}
        </div>
    );
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "요청 처리에 실패했습니다.";
}