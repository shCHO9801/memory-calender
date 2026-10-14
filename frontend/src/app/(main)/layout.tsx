import Sidebar from "@/components/Sidebar";
import {ToastProvider} from "@/components/common/ToastProvider";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-zinc-50">
                <Sidebar/>

                <main className="min-w-0 flex-1 px-4 py-8">
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}