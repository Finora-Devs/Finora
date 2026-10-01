"use client";
import {createContext, useContext, useState, useEffect} from "react"//probably need to remember what each of these do in case dr. nicholson asks.
import { Transaction } from "@/lib/serverFunctions";
import type { ReactNode, Dispatch, SetStateAction } from "react";

/*
export const TransactionContext = createContext<Transaction[] | null>(null); //default value of null. This value will onlt be used if there is no context provider above the component, which should never happen. I will be required to handle the possibility of null when trying to retrieve the context
export const TestContext = createContext<{val: number, updateFunction: Dispatch<SetStateAction<number>>}>({val: 0, updateFunction: () => {}});   //context must start with a capital letter or the provider will break for some reason.

type ProtectedLayoutProps = {
    children: ReactNode;
};

export default function TestContextProvider({children}: ProtectedLayoutProps)//Returns a component, which I can then use.
{
    const [val, updateFunction] = useState(0) //0 is the initial stat

    return(
        <TestContext value = {{val, updateFunction}}> {/*{{}} to store objects*//*}
           {children}  {/* //children in this context seems to be any html tags that would be wraped by context normally. *//*}
        </TestContext>
    );
}

export const TestContextNum = () => {
    return useContext(TestContext);//an arrow function that takes no args and returns the value in TestContext
}*/

export const TestContext = createContext<number | undefined>(undefined);