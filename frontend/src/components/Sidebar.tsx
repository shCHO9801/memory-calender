"use client";

import {
    type ReactNode,
    useEffect,
    useState,
} from "react";
import {
    usePathname,
    useRouter,
} from "next/navigation";

type MenuItem = {
    label: string;
    path: string;
    icon: ReactNode;
};

const menus: MenuItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardIcon />,
    },
    {
        label: "Events",
        path: "/events",
        icon: <CalendarIcon />,
    },
    {
        label: "Todo",
        path: "/todos",
        icon: <CheckIcon />,
    },
    {
        label: "Notes",
        path: "/notes",
        icon: <NoteIcon />,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isCollapsed, setIsCollapsed] =
        useState(false);

    const [isMobileOpen, setIsMobileOpen] =
        useState(false);

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, []);

    useEffect(() => {
        if (!isMobileOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [isMobileOpen]);

    const handleNavigate = (
        path: string,
    ) => {
        setIsMobileOpen(false);
        router.push(path);
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
                <button
                    type="button"
                    onClick={() =>
                        setIsMobileOpen(true)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="메뉴 열기"
                >
                    <MenuIcon />
                </button>

                <p className="text-sm font-semibold text-zinc-900">
                    Memory Calendar
                </p>

                <div className="h-10 w-10" />
            </header>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="메뉴 닫기"
                        onClick={() =>
                            setIsMobileOpen(false)
                        }
                        className="absolute inset-0 bg-black/30"
                    />

                    <aside className="relative z-10 flex h-full w-72 flex-col border-r border-zinc-200 bg-white shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-5">
                            <h1 className="font-semibold text-zinc-900">
                                Memory Calendar
                            </h1>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileOpen(
                                        false,
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                aria-label="메뉴 닫기"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <Navigation
                            pathname={pathname}
                            onNavigate={
                                handleNavigate
                            }
                        />
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside
                className={`sticky top-0 hidden h-screen shrink-0 border-r border-zinc-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col ${
                    isCollapsed
                        ? "w-[72px]"
                        : "w-56"
                }`}
            >
                <div
                    className={`flex h-20 items-center border-b border-zinc-100 ${
                        isCollapsed
                            ? "justify-center px-3"
                            : "justify-between px-5"
                    }`}
                >
                    {!isCollapsed && (
                        <h1 className="truncate text-lg font-semibold text-zinc-900">
                            Memory Calendar
                        </h1>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            setIsCollapsed(
                                (prev) => !prev,
                            )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        aria-label={
                            isCollapsed
                                ? "사이드바 펼치기"
                                : "사이드바 접기"
                        }
                        title={
                            isCollapsed
                                ? "사이드바 펼치기"
                                : "사이드바 접기"
                        }
                    >
                        {isCollapsed ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </button>
                </div>

                <Navigation
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={
                        handleNavigate
                    }
                />
            </aside>
        </>
    );
}

type NavigationProps = {
    pathname: string;
    collapsed?: boolean;
    onNavigate: (path: string) => void;
};

function Navigation({
                        pathname,
                        collapsed = false,
                        onNavigate,
                    }: NavigationProps) {
    return (
        <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
                {menus.map((menu) => {
                    const isActive =
                        pathname === menu.path;

                    return (
                        <li key={menu.path}>
                            <button
                                type="button"
                                onClick={() =>
                                    onNavigate(
                                        menu.path,
                                    )
                                }
                                title={
                                    collapsed
                                        ? menu.label
                                        : undefined
                                }
                                className={`flex w-full items-center rounded-lg py-2.5 text-sm transition ${
                                    collapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                } ${
                                    isActive
                                        ? "bg-zinc-900 font-medium text-white"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                }`}
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                    {menu.icon}
                                </span>

                                {!collapsed && (
                                    <span>
                                        {menu.label}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

function DashboardIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
            />
            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
            />
            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
            />
            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
            />
            <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />
            <path d="m8 12 2.5 2.5L16 9" />
        </svg>
    );
}

function NoteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M5 3h10l4 4v14H5z" />
            <path d="M15 3v5h5M8 12h8M8 16h8" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="m6 6 12 12M18 6 6 18" />
        </svg>
    );
}

function ChevronLeftIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}