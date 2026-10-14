type EventResponse = {
    eventId: number;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    allDay: boolean;
    location: string | null;
};

type TodayEventsPanelProps = {
    events: EventResponse[];
};

export default function TodayEventsPanel({
                                             events,
                                         }: TodayEventsPanelProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                    오늘 일정
                </h2>

                <span className="text-sm text-zinc-500">
                    {events.length}개
                </span>
            </div>

            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                {events.length === 0 && (
                    <p className="text-sm text-zinc-500">
                        오늘 예정된 일정이 없습니다.
                    </p>
                )}

                {events.map((event) => (
                    <div
                        key={event.eventId}
                        className="rounded-xl border border-zinc-200 p-3"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-medium text-zinc-900">
                                    {event.title}
                                </p>

                                {event.location && (
                                    <p className="mt-1 text-sm text-zinc-500">
                                        {event.location}
                                    </p>
                                )}
                            </div>

                            <p className="text-sm text-zinc-600">
                                {formatTime(event.startAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}