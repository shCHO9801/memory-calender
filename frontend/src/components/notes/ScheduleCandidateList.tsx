"use client";

import type {
    ClassificationItem,
} from "@/types/schedule";

type ScheduleCandidateListProps = {
    noteId: number;
    candidates: ClassificationItem[];
    registeredCandidates: Record<string, boolean>;

    onChange: (
        noteId: number,
        index: number,
        field: keyof ClassificationItem,
        value: string | null,
    ) => void;

    onRegister: (
        noteId: number,
        index: number,
        candidate: ClassificationItem,
    ) => void;
};

export default function ScheduleCandidateList({
                                                  noteId,
                                                  candidates,
                                                  registeredCandidates,
                                                  onChange,
                                                  onRegister,
                                              }: ScheduleCandidateListProps) {
    if (candidates.length === 0) {
        return (
            <div className="mt-4 rounded-xl bg-zinc-50 p-4">
                <p className="text-sm text-zinc-500">
                    추출된 일정이나 할 일이 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-4">
            {candidates.map((candidate, index) => {
                const candidateKey =
                    `${noteId}-${index}`;

                const isRegistered =
                    registeredCandidates[candidateKey];

                return (
                    <div
                        key={candidateKey}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className={
                                        candidate.type === "EVENT"
                                            ? "rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                                            : "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                    }
                                >
                                    {candidate.type === "EVENT"
                                        ? "일정"
                                        : "할 일"}
                                </span>

                                {candidate.needsConfirmation && (
                                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                        확인 필요
                                    </span>
                                )}
                            </div>

                            {isRegistered && (
                                <span className="text-xs font-medium text-zinc-500">
                                    등록 완료
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-zinc-500">
                                    내용
                                </label>

                                <input
                                    value={candidate.content}
                                    disabled={isRegistered}
                                    onChange={(event) =>
                                        onChange(
                                            noteId,
                                            index,
                                            "content",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100 disabled:text-zinc-500"
                                />
                            </div>

                            {candidate.type === "EVENT" && (
                                <>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-zinc-500">
                                                시작 시간
                                            </label>

                                            <input
                                                type="datetime-local"
                                                value={
                                                    candidate.startAt ??
                                                    ""
                                                }
                                                disabled={
                                                    isRegistered
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    onChange(
                                                        noteId,
                                                        index,
                                                        "startAt",
                                                        event
                                                            .target
                                                            .value ||
                                                        null,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-zinc-500">
                                                종료 시간
                                            </label>

                                            <input
                                                type="datetime-local"
                                                value={
                                                    candidate.endAt ??
                                                    ""
                                                }
                                                disabled={
                                                    isRegistered
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    onChange(
                                                        noteId,
                                                        index,
                                                        "endAt",
                                                        event
                                                            .target
                                                            .value ||
                                                        null,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-zinc-500">
                                            장소
                                        </label>

                                        <input
                                            value={
                                                candidate.location ??
                                                ""
                                            }
                                            disabled={isRegistered}
                                            onChange={(event) =>
                                                onChange(
                                                    noteId,
                                                    index,
                                                    "location",
                                                    event.target
                                                        .value ||
                                                    null,
                                                )
                                            }
                                            placeholder="장소 없음"
                                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
                                        />
                                    </div>
                                </>
                            )}

                            {candidate.type === "TODO" && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-zinc-500">
                                        마감 시간
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={
                                            candidate.dueAt ?? ""
                                        }
                                        disabled={isRegistered}
                                        onChange={(event) =>
                                            onChange(
                                                noteId,
                                                index,
                                                "dueAt",
                                                event.target.value ||
                                                null,
                                            )
                                        }
                                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    disabled={
                                        isRegistered ||
                                        !candidate.content.trim()
                                    }
                                    onClick={() =>
                                        onRegister(
                                            noteId,
                                            index,
                                            candidate,
                                        )
                                    }
                                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-default disabled:bg-zinc-200 disabled:text-zinc-500"
                                >
                                    {isRegistered
                                        ? "등록 완료"
                                        : candidate.type ===
                                        "EVENT"
                                            ? "일정 등록"
                                            : "할 일 등록"}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}