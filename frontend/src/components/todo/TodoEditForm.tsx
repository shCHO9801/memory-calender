"use client";

import {useState} from "react";

type TodoEditFormProps = {
    todoId: number;
    content: string;
    dueAt: string | null;
    onUpdate: (
        todoId: number,
        content: string,
        dueAt: string | null
    ) => Promise<void>;
    onCancel: () => void;
};

export default function TodoEditForm({
                                         todoId,
                                         content,
                                         dueAt,
                                         onUpdate,
                                         onCancel,
                                     }: TodoEditFormProps) {
    const [editContent, setEditContent] = useState(content);
    const [editDueAt, setEditDueAt] = useState(
        dueAt ? dueAt.slice(0, 16) : ""
    );

    const handleUpdate = async () => {
        if (!editContent.trim()) {
            return;
        }

        await onUpdate(
            todoId,
            editContent.trim(),
            editDueAt || null
        );

        onCancel();
    };

    return (
        <div className="space-y-2">
            <input
                type="text"
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />

            <input
                type="datetime-local"
                value={editDueAt}
                onChange={(event) => setEditDueAt(event.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => void handleUpdate()}
                    className="text-xs font-medium text-zinc-900"
                >
                    저장
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-zinc-400"
                >
                    취소
                </button>
            </div>
        </div>
    );
}