type EmptyStateProps = {
    title: string;
    description?: string;
};

export default function EmptyState({
                                       title,
                                       description,
                                   }: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-zinc-700">
                {title}
            </p>

            {description && (
                <p className="mt-1 text-sm text-zinc-400">
                    {description}
                </p>
            )}
        </div>
    );
}