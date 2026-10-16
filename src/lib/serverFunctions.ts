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
import next from "next";

/**
 * Gets all transactions for the current user.
 */
export async function getTransactions(): Promise<Transaction[]>
{
    const supabase = await createClient();

    //inserts 2-3 transactions at a time instead of just one.
    //await updateRecurringTransactions(supabase); //updates the transaction list and related recurring transactions.

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
 * takes a supabase client and updates the transaction table based on the recurring transactions table.
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
    .lt("next_due_date", new Intl.DateTimeFormat("sv-SE").format(new Date()))

    if(error)
    {
        console.error("Supabase get error (reccuring_transactions", error)
        throw error;
    }
    else if(data)
    {
        const {data: { user }, error: userError} = await supabase.auth.getUser();//probably need to just do this in the calling function...
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
                const currentDate = new Date()
                while(next_due_date < currentDate) //there may be a way to do all of this in one loop. Need to look into this later.
                {
                    insertTransaction(recurring, user, supabase);

                    switch(recurring.frequency)
                        {
                            case "daily":
                                next_due_date.setDate(next_due_date.getDate() + 1);
                                break;
                            case "weekly":
                                next_due_date.setDate(next_due_date.getDate() + 7);
                                break;
                            case "monthly":
                                next_due_date.setDate(next_due_date.getDate() + 30);
                                break;
                            case "yearly":
                                next_due_date.setDate(next_due_date.getDate() + 365);
                                break;
                        }
                    recurring.next_due_date = new Intl.DateTimeFormat("sv-SE").format(next_due_date); //updates the local recurring transaction with the next due date.
                    updateRecurringTransaction(recurring, user, supabase);//can't await this here. maybe an arrow function would work?
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
    const {error} = await supabase
        .from("recurring_transactions")
        .update({next_due_date: recurring.next_due_date})
        .eq("id", recurring.id);

    if(error)
    {
        console.error("Supabase update error (updateRecurringTransaction -> recurring_transactions table)", error)
        throw error;
    }
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
        console.error("Supabase insert error (updateRecurringTransactions -> insertTransaction -> transactions table)", error)
        throw error;
    }
}