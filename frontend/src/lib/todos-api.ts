import {apiFetch} from "@/lib/api";

export type TodoStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "DONE";

export type TodoResponse = {
    todoId: number;
    content: string;
    dueAt: string | null;
    status: TodoStatus;
    completedAt: string | null;
};

export type TodoPageResponse = {
    content: TodoResponse[];
    page: number;
    size: number;
    hasNext: boolean;
};

export type CreateTodoRequest = {
    noteId: number | null;
    content: string;
    dueAt: string | null;
};

export type UpdateTodoRequest = {
    content: string;
    dueAt: string | null;
};

export async function getTodos(): Promise<TodoPageResponse> {
    return apiFetch<TodoPageResponse>(
        "/api/todos"
    );
}

export async function createTodo(
    request: CreateTodoRequest
): Promise<TodoResponse> {
    return apiFetch<TodoResponse>(
        "/api/todos",
        {
            method: "POST",
            body: JSON.stringify(request),
        }
    );
}

export async function updateTodoStatus(
    todoId: number,
    status: TodoStatus
): Promise<TodoResponse> {
    return apiFetch<TodoResponse>(
        `/api/todos/${todoId}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({
                status,
            }),
        }
    );
}

export async function updateTodo(
    todoId: number,
    request: UpdateTodoRequest
): Promise<TodoResponse> {
    return apiFetch<TodoResponse>(
        `/api/todos/${todoId}`,
        {
            method: "PUT",
            body: JSON.stringify(request),
        }
    );
}

export async function deleteTodo(
    todoId: number
): Promise<void> {
    await apiFetch<void>(
        `/api/todos/${todoId}`,
        {
            method: "DELETE",
        }
    );
}