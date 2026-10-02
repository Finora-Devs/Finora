"use client";
import {createContext, useContext, useState, useEffect} from "react"//probably need to remember what each of these do in case dr. nicholson asks.
import { Transaction } from "@/lib/serverFunctions";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type ProtectedLayoutProps = {
    children: ReactNode;
};

export const TransactionContext = createContext<{transactionsArr: Transaction[], setTransactionsArr: Dispatch<SetStateAction<{
    id: number;
    name: string;
    description: string;
    amount: number;
    frequency: string;
    transaction_date: string;
    next_due_date: string;
    categories: {
        name: string;
        transaction_type: string;
    };
}[]>>} | undefined>(undefined);

export default function TransactionContextProvider({children}: ProtectedLayoutProps)
{
    const [transactionsArr, setTransactionsArr] = useState([{id: 1, name: "", description: "", amount: 0, frequency: "", transaction_date: "", next_due_date: "", categories: {name: "", transaction_type: ""}}]);
    return(
        <TransactionContext value={{transactionsArr, setTransactionsArr}}>
            {children}
        </TransactionContext>
    );
}

export function useTransactionContext() //custom version of useContext that makes sure there is a context before returning it.
{
    const context = useContext(TransactionContext)

    if(context === undefined)
    {
        throw new Error("useTransactionContext must be use within a TransactionContext")
    }
    return context;
}