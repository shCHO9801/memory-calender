import Sidebar from "@/components/Sidebar";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar/>

            <main className="min-w-0 flex-1 px-4 py-8">
                {children}
            </main>
        </div>
    );
}