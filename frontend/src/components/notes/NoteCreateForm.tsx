"use client";

import {FormEvent} from "react";

type NoteCreateFormProps = {
    content: string;
    isSubmitting: boolean;
    onContentChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function NoteCreateForm({
                                           content,
                                           isSubmitting,
                                           onContentChange,
                                           onSubmit,
                                       }: NoteCreateFormProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <form onSubmit={onSubmit}>
                <textarea
                    value={content}
                    onChange={(event) =>
                        onContentChange(event.target.value)
                    }
                    placeholder="기록을 작성해주세요."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
                />

                <div className="mt-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isSubmitting ? "저장 중..." : "노트 저장"}
                    </button>
                </div>
            </form>
        </section>
    );
}