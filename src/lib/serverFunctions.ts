'use server';
/**
 * This file will contain any functions that need to read, write, or update date in the database NOT IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that read, write, or update data in the database in response to user actions, go to clientFunctions.ts
 */

import { Database } from "@/types/database.types";
import {createClient} from "./server"
import { SupabaseClient, User } from '@supabase/supabase-js'
import {Transaction, recurringTransaction} from "./types_and_helpers";

/**
 * Gets all transactions for the current user.
 */
export async function getTransactions(): Promise<Transaction[]>
{
    const supabase = await createClient();

    /*
        inserts inserts transaction 1 day early and 2 days late. May be some confusion between my code and supabase
        about UTC time and local, or my code might have a flaw.
    */
    await updateRecurringTransactions(supabase); //updates the transaction list and related recurring transactions.

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
 * currently works as intended. may update to also add one more payment cycle if the due date lands on the 
 * current day.
 * @param supabase 
 */
async function updateRecurringTransactions(supabase: SupabaseClient<Database>)
{
    const currentDate: Date = new Date()
    currentDate.setHours(0,0,0,0);

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
    .lt("next_due_date", new Intl.DateTimeFormat("sv-SE").format(currentDate)) //only get records which are overdue for an update.

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

            const currentDate: Date = new Date();
            currentDate.setHours(0,0,0,0);

            for(const recurring of data as recurringTransaction[])
            {

                const nextDueDates: Date[] = [new Date(`${recurring.next_due_date}T00:00:00`)]; //create array to hold all dates where transactions need to be added.

                while(nextDueDates[0] <= currentDate)//while the next due date is older than the current date
                {
                    //there may be a better option than structured clone. need to look into it.
                    nextDueDates.push(structuredClone(nextDueDates[0]));//copy the current newest due date to prepare for the update.
                    switch(recurring.frequency)//update the latest due date.
                        {
                            case "daily":
                                nextDueDates[0].setDate(nextDueDates[0].getDate() + 1);
                                break;
                            case "weekly":
                                nextDueDates[0].setDate(nextDueDates[0].getDate() + 7);
                                break;
                            case "monthly":
                                nextDueDates[0].setDate(nextDueDates[0].getDate() + 30);
                                break;
                            case "yearly":
                                nextDueDates[0].setDate(nextDueDates[0].getDate() + 365);
                                break;
                        }
                }
                //nextDueDates[0] is ahead of the current date, so leave while loop.
                const next_due_date: string = new Intl.DateTimeFormat("sv-SE").format(nextDueDates.shift()); //retrieve the largest due date which is in the future as a string. this prepares it to be used in updateTransaction();

                await insertTransactions(recurring, nextDueDates, user, supabase); //update the transactions table with all dates before the present

                await updateRecurringTransaction(recurring, next_due_date, user, supabase); //update the recurring transactions table's next_due_date to be one payment cycle ahead of the current day.
            }
        }
    }
    else
    {
        console.log("No recurring transactions to retrieve.")
    }
}

//takes a recurring transaction and adds one billing cycle to the next_due_date.
async function updateRecurringTransaction(recurring: recurringTransaction, next_due_date: string, user: any, supabase: SupabaseClient<Database>)//USER SHOULD NOT BE ANY. User should always be the User type, but I can't delcare that for some reason.
{
    const {error} = await supabase
        .from("recurring_transactions")
        .update({next_due_date: next_due_date})
        .eq("id", recurring.id);

    if(error)
    {
        console.error("Supabase update error (updateRecurringTransaction -> recurring_transactions table)", error)
        throw error;
    }
}
//takes a recurring transaction and inserts one bill into the transaction table.
async function insertTransactions(recurring: recurringTransaction, dates: Date[], user: any, supabase: SupabaseClient<Database>)//USER SHOULD NOT BE ANY. User should always be the User type, but I can't delcare that for some reason.
{

    const newTransactions: {
            amount: number,
            category_id: number,
            frequency: string,
            name: string,
            transaction_date: string, //may need to change this to take arg. depends on how I handle things in the loop.
            description: string | null,
            user_id: string,
            recurring_transaction_id: number
        }[] = [];

    dates.forEach((Date) => 
        {
            newTransactions.push(
                {
                    amount: recurring.amount,
                    category_id: recurring.category_id,
                    frequency: recurring.frequency,
                    name: recurring.name,
                    transaction_date: new Intl.DateTimeFormat("sv-SE").format(Date),
                    description: recurring.description,
                    user_id: user.id,
                    recurring_transaction_id: recurring.id
                })
        })

    const {error} = await supabase
    .from("transactions")
    .insert(newTransactions); //should insert as many transactions are necessary to catch up to the current date.

    if(error)
    {
        console.error("Supabase insert error (updateRecurringTransactions -> insertTransaction -> transactions table)", error)
        throw error;
    }
}

export async function getUser(): Promise<User> //throws error for some reason, but works if left untyped.
{
    const supabase = await createClient();

    //getSession().session.user for client. not as secure, but faster. consider using this instead in the client.
    const {data: { user }, error: userError} = await supabase.auth.getUser();//probably need to just do this in the calling function...
        if(userError || user === null)
        {
            console.error("user authentication failed", userError);
            throw userError;
        }
        console.log("user successfully retrieved from supabase.")
    return user;
}