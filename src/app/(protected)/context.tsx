"use client";
import {createContext, useContext, useState, useEffect} from "react"//probably need to remember what each of these do in case dr. nicholson asks.
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { categoryBudget, monthlyBudget, Transaction } from "@/lib/types_and_helpers";
import { getCategoryBudgets, getMonthlyBudget, getTransactions, getUser } from "@/lib/serverFunctions"
import { User } from "@supabase/supabase-js";
import MonthlyBudget from "@/components/budget/MonthlyBudget";

type ProtectedLayoutProps = {
    children: ReactNode;
};

/**
 * This line creates a context for holding transactions. When you want to reference the list of transactions currently in the browser,
 * use the useTransactionContext() function below.
 */
export const TransactionContext = createContext<{transactionsArr: Transaction[], setTransactionsArr: Dispatch<SetStateAction<Transaction[]>>} | undefined>(undefined);

/**
 * This function creates a wrapper component that can be placed around the app shell (or any other component Steven makes) which 
 * makes the TransactionContext available to every child component. I have already wrapped the app shell, so don't worry about this.
 */
export function TransactionContextProvider({children}: ProtectedLayoutProps)
{
    const [transactionsArr, setTransactionsArr] = useState<Transaction[]>([]);

    useEffect(() => //Seems to run twice for some reason.
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
 *           category_id: 1
 *           frequency: "",
 *           transaction_date: "",
 *           categories: {
 *               name: "",
 *               transaction_type: ""
 *           }
 *       }
 * 
 *      We may need to do other operations like sorting. I don't know how to do that off the top of my head, but you can probably find it
 *      online. The main thing is that you must pass a new array, you can't mutuate the original. That's why we aren't just using .push()
 *      to add to the array.
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





type UserData =
{
    id: string,
    email: string
}


//need to look into maintaining a loading state. keep seeing it, but not sure why we would need it.
export const UserContext = createContext<{user: UserData , setUser: Dispatch<SetStateAction<UserData>>}| undefined>(undefined);

export function UserContextProvider({children}: ProtectedLayoutProps)
{
    const defaultUser: UserData = {id: "Loading...", email: "Loading...@Loading.Lod"}

    const [user, setUser] = useState(defaultUser)
    useEffect(() =>
    { 
        const loadUser = async () => 
        {
            try
            {
                setUser(await getUser()); //now returns id string and email string
            }
            catch (error)
            {
                console.error("user retrieval failure", error);
                throw error;
            }
        }
        loadUser();
    }, []) //runs only once.

    return(
        <UserContext value={{user, setUser}}>
            {children}
        </UserContext>
    );
}


/**
 * A custom version of useContext that checks for null or undefined before returning.
 * This should be used instead of useContext() for retrieving the UserContext.
 * 
 * 
 */
export function useUserContext():   {user: UserData, setUser: Dispatch<SetStateAction<UserData>>}
{
    const context = useContext(UserContext);

    if(!context || !context.user)
    {
        throw new Error("User Not Found")
    }

    const {user, setUser} = context;
    
    return {user, setUser};
}

export const MonthlyBudgetContext = createContext<{monthlyBudget: monthlyBudget | null , setMonthlyBudget: Dispatch<SetStateAction<monthlyBudget | null>>} | null>(null);

export function MonthlyBudgetContextProvider({children}: ProtectedLayoutProps)
{
    const [monthlyBudget, setMonthlyBudget] = useState<monthlyBudget | null>(null);

    useEffect(() =>
    { 
        const loadMonthlyBudget = async () => 
        {
            try
            {
                setMonthlyBudget(await getMonthlyBudget());
            }
            catch (error)
            {
                console.error("user retrieval failure", error);
                throw error;
            }
        }
        loadMonthlyBudget();
    }, []) //runs only once.

    return(
        <MonthlyBudgetContext value={{monthlyBudget, setMonthlyBudget}}>
            {children}
        </MonthlyBudgetContext>
    );
}

/**
 * This hook will return a state variable holding the user's budget for the current month, if it exists. If there is no budget for the current month but there
 * was a budget previously, this will return a new budget with the same amount and emailsEnabled values. If the users has NEVER made a budget, the state will be null.
 */
export function useMonthlyBudgetContext(): {monthlyBudget: monthlyBudget | null, setMonthlyBudget: Dispatch<SetStateAction<monthlyBudget | null>>}
{
    const context = useContext(MonthlyBudgetContext);

    //does the context exist, even if the value of monthlyBudget is null. I think.
    if(!context)
    {
        throw new Error("useMonthlyBudgetContext must be use within a MonthlyBudgetContext")
    }

    const {monthlyBudget, setMonthlyBudget} = context;
    
    return {monthlyBudget, setMonthlyBudget};
}

export const CategoryBudgetContext = createContext<{categoryBudget: categoryBudget[] | null , setCategoryBudget: Dispatch<SetStateAction<categoryBudget[] | null>>} | null>(null);

export function CategoryBudgetContextProvider({children}: ProtectedLayoutProps)
{
    const [categoryBudget, setCategoryBudget] = useState<categoryBudget[] | null>(null);

    useEffect(() =>
    { 
        const loadCategoryBudget = async () => 
        {
            try
            {
                setCategoryBudget(await getCategoryBudgets());
            }
            catch (error)
            {
                console.error("user retrieval failure", error);
                throw error;
            }
        }
        loadCategoryBudget();
    }, []) //runs only once.

    return(
        <CategoryBudgetContext value={{categoryBudget, setCategoryBudget}}>
            {children}
        </CategoryBudgetContext>
    );
}

/**
 * This hook will return a state variable containing an array of categoryBudgets from the last month that had a budget. if they don't exist the variable will instead contain null..
 */
export function useCategoryBudgetContext(): {categoryBudget: categoryBudget[] | null, setCategoryBudget: Dispatch<SetStateAction<categoryBudget[] | null>>}
{
    const context = useContext(CategoryBudgetContext);

    //does the context exist, even if the value of monthlyBudget is null. I think.
    if(!context)
    {
        throw new Error("useCategoryBudgetContext must be use within a CategoryBudgetContext")
    }

    const {categoryBudget, setCategoryBudget} = context;
    
    return {categoryBudget, setCategoryBudget};
}