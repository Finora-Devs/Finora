/**
 * This file will contain any functions that need to read, write, or update date in the database IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */
import {createClient} from "./client";
import { FREQUENCY, getFrequencyAsString, Transaction } from "./types_and_helpers";
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
export async function insertTransaction(amount: number, category_id: number, frequency: FREQUENCY, name: string, transaction_date: string, setTransactionsArr: Dispatch<SetStateAction<Transaction[]>>)
{
    const supabase = await createClient();

    let next_due_date: Date = new Date();
    switch(frequency)
    {
        case FREQUENCY.ONCE:
            break;
        case FREQUENCY.DAILY:
            next_due_date.setDate(next_due_date.getUTCDate() + 7)
            break;
        case FREQUENCY.MONTHLY:
            next_due_date.setDate(next_due_date.getUTCDate() + 30)
            break;
        case FREQUENCY.YEARLY:
            next_due_date.setDate(next_due_date.getUTCFullYear() + 1)
            break;

    }

    const {data: { user }, error: userError} = await supabase.auth.getUser();
    if(userError || user === null)
    {
        console.error("user authentication failed", userError);
        throw userError;
    }
    else
    {
        const { error } = await supabase
        .from('transactions')
        .insert(
            { 
                amount: amount,
                category_id: category_id,
                frequency: getFrequencyAsString(frequency).toLowerCase(),
                name: name,
                transaction_date: transaction_date,
                user_id: user.id
         })//need to chain select onto this and use it to update the transactionARR.

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



