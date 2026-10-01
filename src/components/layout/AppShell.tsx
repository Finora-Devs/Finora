import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { TestContext } from "@/app/(protected)/context";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({children}: AppShellProps) {
    return (
        <TestContext value = {0}> {/*This one finally worked. Now need to figure out how to update values*/}
            <div className="min-h-screen bg-[#f3f7f5]">
                <Sidebar />

            <div className="ml-[270px] min-h-screen">
                <TopBar />

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    </TestContext>
    );
}