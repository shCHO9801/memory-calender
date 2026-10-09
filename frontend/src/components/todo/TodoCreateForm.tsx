"use client";

import {FormEvent, useState} from "react";

type TodoCreateFormProps = {
    onCreate: (content: string, dueAt: string | null) => Promise<void>;
};

export default function TodoCreateForm({
                                           onCreate,
                                       }: TodoCreateFormProps) {
    const [content, setContent] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [showDueAt, setShowDueAt] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setIsSubmitting(true);

            await onCreate(
                content.trim(),
                dueAt ? dueAt : null
            );

            setContent("");
            setDueAt("");
            setShowDueAt(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-200 bg-white"
        >
            <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl text-zinc-400">
                    +
                </span>

                <input
                    type="text"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="새로운 할 일"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />

                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isSubmitting ? "추가 중" : "추가"}
                </button>
            </div>

            <div className="border-t border-zinc-100 px-4 py-3">
                <button
                    type="button"
                    onClick={() => setShowDueAt((prev) => !prev)}
                    className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                    {showDueAt ? "마감일 숨기기" : "마감일 추가"}
                </button>

                {showDueAt && (
                    <div className="mt-3">
                        <input
                            type="datetime-local"
                            value={dueAt}
                            onChange={(event) => setDueAt(event.target.value)}
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                        />
                    </div>
                )}
            </div>
        </form>
    );
}