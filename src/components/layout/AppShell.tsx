import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import TransactionContextProvider, { /*TestContext*/TransactionContext } from "../../app/(protected)/context";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({children}: AppShellProps) {
    return (
        <TransactionContextProvider>    
            <div className="min-h-screen bg-[#f3f7f5]">
                <Sidebar />

                <div className="ml-[270px] min-h-screen">
                    <TopBar />

                    <main className="p-8">
                        {children}
                    </main>
                </div>
            </div>
       </TransactionContextProvider>
    );
}