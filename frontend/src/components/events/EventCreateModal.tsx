"use client";

import {FormEvent, useState} from "react";

type EventCreateModalProps = {
    initialDate: string | null;
    onClose: () => void;
    onCreate: (
        title: string,
        description: string | null,
        startAt: string,
        endAt: string | null,
        allDay: boolean,
        location: string | null
    ) => Promise<void>;
};

const HOUR_OPTIONS = Array.from({length: 24}, (_, index) =>
    String(index).padStart(2, "0")
);

const MINUTE_OPTIONS = ["00", "10", "20", "30", "40", "50"];

export default function EventCreateModal({
                                             initialDate,
                                             onClose,
                                             onCreate,
                                         }: EventCreateModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(initialDate ?? getTodayString());

    const [startHour, setStartHour] = useState("09");
    const [startMinute, setStartMinute] = useState("00");

    const [endHour, setEndHour] = useState("10");
    const [endMinute, setEndMinute] = useState("00");

    const [location, setLocation] = useState("");
    const [allDay, setAllDay] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();

        if (!title.trim() || !date) {
            return;
        }

        if (!allDay) {
            const startMinutes =
                Number(startHour) * 60 + Number(startMinute);

            const endMinutes =
                Number(endHour) * 60 + Number(endMinute);

            if (endMinutes <= startMinutes) {
                setErrorMessage("종료 시간은 시작 시간보다 늦어야 합니다.");
                return;
            }
        }

        const startAt = allDay
            ? `${date}T00:00:00`
            : `${date}T${startHour}:${startMinute}:00`;

        const endAt = allDay
            ? null
            : `${date}T${endHour}:${endMinute}:00`;

        try {
            setIsSubmitting(true);

            await onCreate(
                title.trim(),
                description.trim() || null,
                startAt,
                endAt,
                allDay,
                location.trim() || null
            );

            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        일정 추가
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-zinc-400 hover:text-zinc-900"
                    >
                        닫기
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            제목
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="일정 제목"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            날짜
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <input
                            type="checkbox"
                            checked={allDay}
                            onChange={(event) => setAllDay(event.target.checked)}
                        />
                        하루 종일
                    </label>

                    {!allDay && (
                        <div className="space-y-4">
                            <TimeSelector
                                label="시작 시간"
                                hour={startHour}
                                minute={startMinute}
                                onHourChange={setStartHour}
                                onMinuteChange={setStartMinute}
                            />

                            <TimeSelector
                                label="종료 시간"
                                hour={endHour}
                                minute={endMinute}
                                onHourChange={setEndHour}
                                onMinuteChange={setEndMinute}
                            />
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            장소
                        </label>

                        <input
                            type="text"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            placeholder="장소"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            메모
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="일정에 대한 메모"
                            className="min-h-20 w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !date}
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
                        >
                            {isSubmitting ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

type TimeSelectorProps = {
    label: string;
    hour: string;
    minute: string;
    onHourChange: (value: string) => void;
    onMinuteChange: (value: string) => void;
};

function TimeSelector({
                          label,
                          hour,
                          minute,
                          onHourChange,
                          onMinuteChange,
                      }: TimeSelectorProps) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
                {label}
            </label>

            <div className="flex items-center gap-2">
                <select
                    value={hour}
                    onChange={(event) => onHourChange(event.target.value)}
                    className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                >
                    {HOUR_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <span className="text-sm text-zinc-500">시</span>

                <select
                    value={minute}
                    onChange={(event) => onMinuteChange(event.target.value)}
                    className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                >
                    {MINUTE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <span className="text-sm text-zinc-500">분</span>
            </div>
        </div>
    );
}

function getTodayString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}