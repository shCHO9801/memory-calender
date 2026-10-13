"use client";

import type {EventDetail} from "@/lib/events-api";

type DashboardEventDetailModalProps = {
    event: EventDetail;
    onClose: () => void;
};

export default function DashboardEventDetailModal({
                                                      event,
                                                      onClose,
                                                  }: DashboardEventDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-400">
                            EVENT
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-zinc-900">
                            {event.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-zinc-400 hover:text-zinc-900"
                    >
                        닫기
                    </button>
                </div>

                <div className="space-y-5">
                    <DetailItem
                        label="일시"
                        value={formatEventDateTime(event)}
                    />

                    {event.location && (
                        <DetailItem
                            label="장소"
                            value={event.location}
                        />
                    )}

                    {event.description && (
                        <div>
                            <p className="text-xs font-medium text-zinc-400">
                                메모
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                                {event.description}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

type DetailItemProps = {
    label: string;
    value: string;
};

function DetailItem({
                        label,
                        value,
                    }: DetailItemProps) {
    return (
        <div>
            <p className="text-xs font-medium text-zinc-400">
                {label}
            </p>

            <p className="mt-1 text-sm text-zinc-700">
                {value}
            </p>
        </div>
    );
}

function formatEventDateTime(event: EventDetail) {
    if (event.allDay) {
        return `${formatDate(event.startAt)} · 하루 종일`;
    }

    const start = `${formatDate(event.startAt)} ${formatTime(event.startAt)}`;

    if (!event.endAt) {
        return start;
    }

    const startDate = formatDate(event.startAt);
    const endDate = formatDate(event.endAt);

    if (startDate === endDate) {
        return `${startDate} ${formatTime(event.startAt)} ~ ${formatTime(event.endAt)}`;
    }

    return `${start} ~ ${endDate} ${formatTime(event.endAt)}`;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
    }).format(new Date(value));
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value));
}