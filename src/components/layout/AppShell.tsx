import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import {TransactionContextProvider, UserContext, UserContextProvider} from "../../app/(protected)/context";

type AppShellProps = {
    children: ReactNode;
};

/*
 * Attempted to call useUserContext() from the server but useUserContext is on the client. 
 * It's not possible to invoke a client function from the server, it can only be rendered 
 * as a Component or passed to props of a Client Component.
 */


export default function AppShell({children}: AppShellProps) {
    return (
        <UserContextProvider> {/*Busted due to async nonsense. Gimme a little bit to find  the fix.*/}
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
        </UserContextProvider>
    );
}