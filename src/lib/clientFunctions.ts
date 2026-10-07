/**
 * This file will contain any functions that need to read, write, or update date in the database IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */
import {createClient} from "./client";
import { FREQUENCY, Transaction } from "./types_and_helpers";
import type {Dispatch, SetStateAction } from "react";

/**
 * 
 * @param amount The amount of money earned/lost in the transaction. must be positive
 * @param category_id 
 * @param frequency 
 * @param name 
 * @param transaction_date 
 * @param setTransactionsArr This is the function that updates the array of all transactions. Doing this should immediately update the webpage.
 */
export async function insertTransaction(amount: number, category_id: number, frequency: string, name: string, transaction_date: string, setTransactionsArr: Dispatch<SetStateAction<Transaction[]>>)
{
    const supabase = await createClient();

    //I think this won't be necessary once I start setting up the automatic updates for
    //repeating transactions
    let next_due_date: Date = new Date();
    switch(frequency)
    {
        case "once":
            break;
        case "daily":
            next_due_date.setDate(next_due_date.getUTCDate() + 1)
        case "weekly":
            next_due_date.setDate(next_due_date.getUTCDate() + 7)
            break;
        case "monthly":
            next_due_date.setDate(next_due_date.getUTCDate() + 30)
            break;
        case "yearly":
            next_due_date.setDate(next_due_date.getUTCFullYear() + 1)
            break;

    }
    ////////////////////////////////////////////////////////////////////////////////////////

    const {data: { user }, error: userError} = await supabase.auth.getUser();
    if(userError || user === null)
    {
        console.error("user authentication failed", userError);
        throw userError;
    }
    else
    {
        const {data,  error } = await supabase
        .from('transactions')
        .insert(
            { 
                amount: amount,
                category_id: category_id,
                frequency: frequency,
                name: name,
                transaction_date: transaction_date,
                user_id: user.id
         }).select(`
            id,
            name,
            description,
            amount,
            frequency, 
            transaction_date, 
            categories!inner(
                name, 
                transaction_type
                )
                `)
        if(data)
        {
            setTransactionsArr(prev => [...prev, (data[0] as Transaction)]) //updates the local copy of the transaction list.
        }

         if(error)
         {
            console.error("Supabase insert error: ", error);
            throw error;
         }
         else
         {
            console.log("Insert Success");
         }
    }
}

//Delete a transaction from the database.
export async function deleteTransaction(transactionID: number, setTransactionsArr: Dispatch<SetStateAction<Transaction[]>>)
{
    const supabase = await createClient();

    const error = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionID)//should delete whatever transaction has the matching id.

    if(error.error)
    {
        console.error("Supabase delete error: ", error); //may need to handle if the user tries to delete something twice before the first deletion goes through
        throw error;
    }
     else
    {
        console.log("delete Success");
        setTransactionsArr(prev =>
            prev.filter((transaction) => transaction.id !== transactionID)) //updates the transaction array to remove the deleted transaction.
    }
}



//changes an existing transaction with new information
export async function updateTransaction()
{

}



