"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
    ArrowLeftRight,
    BarChart3,
    House,
    Leaf,
    LogOut,
    Repeat2,
    Settings,
    Target,
    TrendingDown,
    TrendingUp,
    WalletCards,
} from "lucide-react";

type NavigationItem = {
    name: string;
    href: string;
    icon: LucideIcon;
};

const navigationItems: NavigationItem[] =
    [
        {
            name: "Home",
            href: "/dashboard",
            icon: House,
        },
        {
            name: "Transactions",
            href: "/transactions",
            icon: ArrowLeftRight,
        },
        {
            name: "Income",
            href: "/income",
            icon: TrendingUp,
        },
        {
            name: "Expenses",
            href: "/expenses",
            icon: TrendingDown,
        },
        {
            name: "Budget",
            href: "/budget",
            icon: WalletCards,
        },
        {
            name: "Goals",
            href: "/goals",
            icon: Target,
        },
        {
            name: "Recurring",
            href: "/recurring",
            icon: Repeat2,
        },
        {
            name: "Reports",
            href: "/reports",
            icon: BarChart3,
        }
    ];

export default function Sidebar() {
    const pathname = usePathname();
    return(
        <aside className="fixed left-0 top-0 flex h-screen w-[270px] flex-col border-r border-[#dce7e2] bg-[#f7faf8] px-5 py-6">
            <Link href="/dashboard" className="flex items-start gap-3 px-2">
                <Leaf
                    className="mt-1 h-12 w-12 text-[#3f8068]"
                    strokeWidth={1.8}
                />

                <div>
                    <h1 className="text-3xl font-bold text-[#123c35]">
                        Finora
                    </h1>

                    <p className="mt-1 text-sm leading-5 text-[#4e7069]">
                        Plan Today
                        <br />
                        A Brighter Tomorrow
                    </p>
                </div>
            </Link>

            <nav className="mt-8 flex flex-col gap-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                                    ? "bg-[#3f8068] text-white"
                                    : "text-[#17324d] hover:bg-[#e5efeb]"
                                }`}
                        >
                            <Icon className="h-5 w-5" strokeWidth={1.8} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-[#17324d] hover:bg-[#e5efeb]"
                >
                    <Settings className="h-5 w-5" strokeWidth={1.8} />
                    <span>Settings</span>
                </Link>

                <button
                    type="button"
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#17324d] hover:bg-[#e5efeb]"
                >
                    <LogOut className="h-5 w-5" strokeWidth={1.8} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}

