"use client";

import {useEffect, useState} from "react";

import TodoFilter from "@/components/todo/TodoFilter";
import TodoCreateForm from "@/components/todo/TodoCreateForm";
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
    const [todos, setTodos] = useState<TodoResponse[]>([]);

    const [statusFilter, setStatusFilter] = useState<
        "TODO" | "DONE"
    >("TODO");

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const data = await getTodos();

                setTodos(data.content);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        };

        void fetchTodos();
    }, []);

    const handleCreateTodo = async (
        content: string,
        dueAt: string | null
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
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    const handleToggleTodoDone = async (
        todoId: number,
        isDone: boolean
    ) => {
        const nextStatus = isDone
            ? "TODO"
            : "DONE";

        try {
            const updatedTodo =
                await updateTodoStatus(
                    todoId,
                    nextStatus
                );

            setTodos((prev) =>
                prev.map((todo) =>
                    todo.todoId === updatedTodo.todoId
                        ? updatedTodo
                        : todo
                )
            );

            setErrorMessage("");
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    const handleDeleteTodo = async (
        todoId: number
    ) => {
        try {
            await deleteTodo(todoId);

            setTodos((prev) =>
                prev.filter(
                    (todo) => todo.todoId !== todoId
                )
            );

            setErrorMessage("");
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    const handleUpdateTodo = async (
        todoId: number,
        content: string,
        dueAt: string | null
    ) => {
        try {
            const updatedTodo = await updateTodo(
                todoId,
                {
                    content,
                    dueAt,
                }
            );

            setTodos((prev) =>
                prev.map((todo) =>
                    todo.todoId === updatedTodo.todoId
                        ? updatedTodo
                        : todo
                )
            );

            setErrorMessage("");
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <p className="text-sm text-zinc-500">
                    불러오는 중...
                </p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <p className="text-sm text-red-500">
                    {errorMessage}
                </p>
            </div>
        );
    }

    const filteredTodos = todos.filter(
        (todo) => todo.status === statusFilter
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

            <TodoCreateForm
                onCreate={handleCreateTodo}
            />

            <TodoFilter
                value={statusFilter}
                onChange={setStatusFilter}
            />

            <TodoList
                todos={filteredTodos}
                onToggleDone={handleToggleTodoDone}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
            />
        </div>
    );
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return "요청 처리에 실패했습니다.";
}