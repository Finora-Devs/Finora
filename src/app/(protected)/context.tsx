"use client";
import {createContext, useContext, useState, useEffect} from "react"//probably need to remember what each of these do in case dr. nicholson asks.
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { Transaction } from "@/lib/types_and_helpers";
import { getTransactions } from "@/lib/serverFunctions"

type ProtectedLayoutProps = {
    children: ReactNode;
};

//in the future this may be changed to a much more complex object that holds multiple arrays of data from different parts of the database. I'll let you know if I make any changes like that and tell you what you will need to change to compensate.
/**
 * This line creates a context for holding transactions. When you want to reference the list of transactions currently in the browser,
 * use the useTransactionContext() function below.
 */
export const TransactionContext = createContext<{transactionsArr: Transaction[], setTransactionsArr: Dispatch<SetStateAction<Transaction[]>>} | undefined>(undefined);

/**
 * This function creates a wrapper component that can be placed around the app shell (or any other component Steven makes) which 
 * makes the TransactionContext available to every child component. I have already wrapped the app shell, so don't worry about this.
 */
export default function TransactionContextProvider({children}: ProtectedLayoutProps)
{
    const [transactionsArr, setTransactionsArr] = useState<Transaction[]>([]);

    useEffect(() => //this seems to be working, but I need to check supabase to see if its ignoring any columns.
    { 
        const loadTransactions = async () => 
        {
            try
            {
                setTransactionsArr(await getTransactions());
            }
            catch (error)
            {
                console.error("Something went wrong", error);
            }
        }
        loadTransactions();
    }, []) //runs only once.

    return(
        <TransactionContext value={{transactionsArr, setTransactionsArr}}>
            {children}
        </TransactionContext>
    );
}


/**
 * This is a custom version of the built in useContext() hook. This checks to make sure that the context has been initialized to SOMETHING
 * before actually calling it.
 * 
 * Use it like this: const {transactionsArr, setTransactionsArr} = useTransactionContext();
 * 
 * transactionArr is the array of transactions. 
 * 
 * setTransactionsArr is a function that can be called to replace transactionArr with a new array.
 * 
 * setTransactionsArr(prev => [
 *       ...prev, //all the elements that were already in the array
 *       {
 *           id: 2,              //This is the transaction that is being added to the array.
 *           name: "",
 *           description: "",
 *           amount: 0,
 *           frequency: "",
 *           transaction_date: "",
 *           next_due_date: "",
 *           categories: {
 *               name: "",
 *               transaction_type: ""
 *           }
 *       }
 * 
 *      We may need to do other operations like sorting. I don't know how to do that off the top of my head, but you can probably find it
 *      online. The main thing is that you must pass a new array, you can't mutuate the original. That's why we aren't just using .push()
 *      to add to the array.
 * 
 *      In the future, I will make a function that fills the array with the transactions from the database upon login. For now, it just has a 
 *      default value of one transaction.
 */
export function useTransactionContext()
{
    const context = useContext(TransactionContext)

    if(context === undefined)
    {
        throw new Error("useTransactionContext must be use within a TransactionContext")
    }
    return context;
}