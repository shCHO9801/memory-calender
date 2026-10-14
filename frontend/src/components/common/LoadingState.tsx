type LoadingStateProps = {
    message?: string;
};

export default function LoadingState({
                                         message = "불러오는 중...",
                                     }: LoadingStateProps) {
    return (
        <div className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-zinc-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />

                <span>{message}</span>
            </div>
        </div>
    );
}