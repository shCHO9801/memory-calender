export default function QuickMemo() {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-900">
                빠른 메모
            </h2>

            <textarea
                placeholder="일정이나 할 일을 자유롭게 입력하세요."
                className="mt-3 min-h-24 w-full resize-none rounded-xl border border-zinc-300 p-3 text-sm outline-none focus:border-zinc-500"
            />

            <button
                type="button"
                className="mt-3 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
                메모 작성
            </button>
        </section>
    );
}