/**
 * This file will contain any functions that need to read, write, or update date in the database IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */
import {createClient} from "./client";
import { Transaction } from "./types_and_helpers";

export async function insertTransaction(amount: number, category_id: number, frequency: string, name: string, transaction_date: string)
{
    const supabase = await createClient();

    let next_due_date: Date = new Date();
    switch(frequency)
    {
        case "once":
            break;
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
                frequency: frequency,
                name: name,
                transaction_date: transaction_date,
                user_id: user.id
         });

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



