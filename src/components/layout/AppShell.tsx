"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import {
    MonthlyBudgetContext,
    MonthlyBudgetContextProvider,
    TransactionContextProvider,
    UserContextProvider,
} from "../../app/(protected)/context";

type AppShellProps = {
    children: ReactNode;
};

/*
 * Attempted to call useUserContext() from the server but useUserContext is on the client.
 * It's not possible to invoke a client function from the server, it can only be rendered
 * as a Component or passed to props of a Client Component.
 */

export default function AppShell({ children }: AppShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const mobileSidebarRef = useRef<HTMLDialogElement>(null);

    // Open the mobile drawer and prevent the page behind it from scrolling.
    useEffect(() => {
        if (!isSidebarOpen) return;

        const dialog = mobileSidebarRef.current;
        if (!dialog) return;

        const previousOverflow = document.body.style.overflow;
        const previousFocus =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        dialog.showModal();
        document.body.style.overflow = "hidden";

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [isSidebarOpen]);

    // Close the mobile drawer when switching to the desktop layout.
    useEffect(() => {
        const desktopScreen = window.matchMedia("(min-width: 768px)");

        function handleScreenChange() {
            if (desktopScreen.matches) {
                setIsSidebarOpen(false);
            }
        }

        desktopScreen.addEventListener("change", handleScreenChange);

        return () => {
            desktopScreen.removeEventListener("change", handleScreenChange);
        };
    }, []);

    function closeSidebar() {
        setIsSidebarOpen(false);
    }

    return (
        <UserContextProvider>
            <MonthlyBudgetContextProvider>
            <TransactionContextProvider>
                <div className="min-h-screen bg-[#f3f7f5]">
                    {/* Desktop sidebar */}
                    <Sidebar />

                    {/* Mobile sidebar drawer */}
                    <dialog
                        ref={mobileSidebarRef}
                        id="mobile-sidebar"
                        aria-label="Finora navigation"
                        onCancel={(event) => {
                            event.preventDefault();
                            closeSidebar();
                        }}
                        onClick={(event) => {
                            // A click outside the drawer lands on the dialog.
                            const bounds = event.currentTarget.getBoundingClientRect();

                            if (
                                event.clientX < bounds.left ||
                                event.clientX > bounds.right ||
                                event.clientY < bounds.top ||
                                event.clientY > bounds.bottom
                            ) {
                                closeSidebar();
                            }
                        }}
                        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[270px] max-w-[85vw] border-0 bg-[#f7faf8] p-0 text-[#17324d] backdrop:bg-black/40 md:hidden"
                    >
                        <button
                            type="button"
                            onClick={closeSidebar}
                            aria-label="Close navigation"
                            className="absolute right-2 top-2 z-10 rounded-lg p-2 text-[#17324d] hover:bg-[#e5efeb]"
                        >
                            <X aria-hidden="true" className="h-5 w-5" />
                        </button>

                        <Sidebar
                            mobile
                            onNavigate={closeSidebar}
                        />
                    </dialog>

                    <div className="min-h-screen min-w-0 md:ml-[270px]">
                        <TopBar
                            onOpenSidebar={() => setIsSidebarOpen(true)}
                            isSidebarOpen={isSidebarOpen}
                        />

                        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </TransactionContextProvider>
            </MonthlyBudgetContextProvider>
        </UserContextProvider>
    );
}