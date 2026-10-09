"use client";

import {useEffect, useState} from "react";

import {getAccessToken} from "@/lib/auth-storage";
import TodoFilter from "@/components/todo/TodoFilter";
import TodoCreateForm from "@/components/todo/TodoCreateForm";
import TodoList from "@/components/todo/TodoList";

type TodoResponse = {
    todoId: number;
    content: string;
    dueAt: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    completedAt: string | null;
};

type TodoPageResponse = {
    content: TodoResponse[];
    page: number;
    size: number;
    hasNext: boolean;
};

export default function TodosPage() {
    const [todos, setTodos] = useState<TodoResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState<
        "TODO" | "DONE"
    >("TODO");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const createTodo = async (
        content: string,
        dueAt: string | null
    ) => {
        const token = getAccessToken();

        if (!token) {
            throw new Error("로그인이 필요합니다.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    noteId: null,
                    content,
                    dueAt,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("할 일 생성에 실패했습니다.");
        }

        const createdTodo: TodoResponse = await response.json();

        setTodos((prev) => [createdTodo, ...prev]);
    };

    const toggleTodoDone = async (
        todoId: number,
        isDone: boolean
    ) => {
        const token = getAccessToken();

        if (!token) {
            throw new Error("로그인이 필요합니다.");
        }

        const nextStatus = isDone ? "TODO" : "DONE";

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos/${todoId}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: nextStatus,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("할 일 상태 변경에 실패했습니다.");
        }

        const updatedTodo: TodoResponse = await response.json();

        setTodos((prev) =>
            prev.map((todo) =>
                todo.todoId === updatedTodo.todoId
                    ? updatedTodo
                    : todo
            )
        );
    };

    const deleteTodo = async (todoId: number) => {
        const token = getAccessToken();

        if (!token) {
            throw new Error("로그인이 필요합니다.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos/${todoId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("할 일 삭제에 실패했습니다.");
        }

        setTodos((prev) =>
            prev.filter((todo) => todo.todoId !== todoId)
        );
    };

    const updateTodo = async (
        todoId: number,
        content: string,
        dueAt: string | null
    ) => {
        const token = getAccessToken();

        if (!token) {
            throw new Error("로그인이 필요합니다.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos/${todoId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content,
                    dueAt,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("할 일 수정에 실패했습니다.");
        }

        const updatedTodo: TodoResponse = await response.json();

        setTodos((prev) =>
            prev.map((todo) =>
                todo.todoId === updatedTodo.todoId
                    ? updatedTodo
                    : todo
            )
        );
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const token = getAccessToken();

            if (!token) {
                setErrorMessage("로그인이 필요합니다.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error();
                }

                const data: TodoPageResponse = await response.json();

                setTodos(data.content);
            } catch {
                setErrorMessage("할 일 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, []);

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

    const filteredTodos =
        todos.filter((todo) => todo.status === statusFilter);

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

            <TodoCreateForm onCreate={createTodo}/>

            <TodoFilter
                value={statusFilter}
                onChange={setStatusFilter}
            />

            <TodoList
                todos={filteredTodos}
                onToggleDone={toggleTodoDone}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
            />
        </div>
    );
}