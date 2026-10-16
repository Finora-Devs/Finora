'use server';
/**
 * This file will contain any functions that need to read, write, or update date in the database NOT IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that read, write, or update data in the database in response to user actions, go to clientFunctions.ts
 */

import { Database } from "@/types/database.types";
import {createClient} from "./server"
import { SupabaseClient } from '@supabase/supabase-js'
import {Transaction, recurringTransaction} from "./types_and_helpers";

/**
 * Gets all transactions for the current user.
 */
export async function getTransactions(): Promise<Transaction[]>
{
    const supabase = await createClient();

    const transactionsQuery = await supabase
    .from("transactions")
    .select(`
        id,
        name,
        description,
        amount,
        category_id,
        frequency, 
        transaction_date, 
        categories!inner(
            name, 
            transaction_type
            )`
        ).order("id", {ascending: true});

    const { data, error } = transactionsQuery;
    if (error) throw error;
    return data as Transaction[];
}

/**
 * takes a supabase client and updates all recurring transactions with a next_due_date older than the current date.
 * @param supabase 
 */
async function updateRecurringTransactions(supabase: SupabaseClient<Database>)
{
    const {data, error} = await supabase
    .from("recurring_transactions")
    .select(`
                id,
                user_id,
                name,
                amount,
                category_id,
                frequency,
                next_due_date,
                description,
                is_active
            `)
    .lt("next_due_date", new Date())//may break, idk yet.

    if(error)
    {
        console.error("Supabase get error (reccuring_transactions", error)
        throw error;
    }
    else if(data)
    {
        const {data: { user }, error: userError} = await supabase.auth.getUser();
        if(userError || user === null)
        {
            console.error("user authentication failed", userError);
            throw userError;
        }
        else
        {
            //update transactions and recurring transactions.
            (data as recurringTransaction[]).forEach((recurring: recurringTransaction) => 
            {
                const next_due_date = new Date(recurring.next_due_date);
                while(next_due_date < new Date())
                {
                    insertTransaction(recurring, user, supabase);
                    updateRecurringTransaction(recurring, user, supabase);
                }
            })  
        }
    }
    else
    {
        console.log("No recurring transactions to retrieve.")
    }
}

//takes a recurring transaction and adds one billing cycle to the next_due_date. returns new due date?
async function updateRecurringTransaction(recurring: recurringTransaction, user: any, supabase: SupabaseClient<Database>)//USER SHOULD NOT BE ANY. User should always be the User type, but I can't delcare that for some reason.
{
    
}
//takes a recurring transaction and inserts one bill into the transaction table.
async function insertTransaction(recurring: recurringTransaction, user: any, supabase: SupabaseClient<Database>)//USER SHOULD NOT BE ANY. User should always be the User type, but I can't delcare that for some reason.
{

    const {error} = await supabase
    .from("transactions")
    .insert(
        {
            amount: recurring.amount,
            category_id: recurring.category_id,
            frequency: recurring.frequency,
            name: recurring.name,
            transaction_date: recurring.next_due_date, //may need to change this to take arg. depends on how I handle things in the loop.
            description: recurring.description,
            user_id: user.id
        }
    )

    if(error)
    {
        console.error("Supabase insert error (updateRecurring -> transactions)", error)
        throw error;
    }
}