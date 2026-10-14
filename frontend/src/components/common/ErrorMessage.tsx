type ErrorMessageProps = {
    message: string;
};

export default function ErrorMessage({
                                         message,
                                     }: ErrorMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3"
        >
            <p className="text-sm text-red-600">
                {message}
            </p>
        </div>
    );
}