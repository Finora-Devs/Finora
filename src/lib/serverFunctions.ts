import { Database } from "@/types/database.types";
import {createClient} from "./server"
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js'

type Transaction =
 {
    id: number;
    name: string;
    amount: number;
    frequency: string;
    transaction_date: string;
    next_due_date: string | null;
    categories: {
    name: string;
    transaction_type: string;
 };
}

/**
 * Function should run once when the when the user first signs in. It will retrieve and update all of the users data.
 * Maybe use just the database to manipulate data here, than use get Tranasctions after manipulation in done.
 */
export async function start()
{
    const supabase = await createClient();

    const transactions: Transaction[] = await getTransactions(supabase) as Transaction[];
    const currentDate = new Date();
    let transactionDate: Date = new Date(transactions[0].transaction_date);//will need to test this and confirm that the string is formatted correctly for this use.
    let i = 1;

    //checking for recurring transaction that are due so that they can be added to the database.
    while(transactionDate.getFullYear() >= currentDate.getFullYear()-1)//should go through transactions starting from the most recent until it has checked the entire current and previous year.
    {


        //update for loop
        transactionDate = new Date(transactions[i].transaction_date);
        i++;
    }

    //if Next_due_date is less than current date, add a new transaction with an updated next_due_date. if the new due date is still less than the current date, repeat until it is not.
    //this will need to check at least a year's worth of transactions.

    //need to find recurring transactions, find if they are due for one or more new transactions, add the appropriate number of transactions.
}

/**
 * 
 * @returns
 */
async function getTransactions(supabase: SupabaseClient<Database>): Promise<Transaction[]>
{
    const transactionsQuery = supabase
    .from("transactions")
    .select(`
        id,
        name,
        amount,
        frequency, 
        transaction_date, 
        next_due_date,
        categories!inner(
            name, 
            transaction_type
            )`
        ).order("transaction_date", {ascending: false});


    const { data, error } = await transactionsQuery;
    if (error) throw error;
    return data as Transaction[];
}


