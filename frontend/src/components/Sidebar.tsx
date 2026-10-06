"use client";

import {usePathname, useRouter} from "next/navigation";

const menus = [
    {
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        label: "Calendar",
        path: "/calendar",
    },
    {
        label: "Todo",
        path: "/todos",
    },
    {
        label: "Notes",
        path: "/notes",
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="hidden min-h-screen w-56 shrink-0 border-r border-zinc-200 bg-white lg:block">
            <div className="p-6">
                <h1 className="text-lg font-semibold text-zinc-900">
                    Memory Calendar
                </h1>
            </div>

            <nav className="px-3">
                <ul className="space-y-1">
                    {menus.map((menu) => {
                        const isActive = pathname === menu.path;

                        return (
                            <li key={menu.path}>
                                <button
                                    type="button"
                                    onClick={() => router.push(menu.path)}
                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                        isActive
                                            ? "bg-zinc-900 font-medium text-white"
                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    }`}
                                >
                                    {menu.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}