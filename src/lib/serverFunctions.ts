import { Database } from "@/types/database.types";
import {createClient} from "./server"
import { SupabaseClient } from '@supabase/supabase-js'

export type Transaction =
 {
    id: number;
    name: string;
    description: string | null;
    amount: number;
    frequency: string;
    transaction_date: string;
    next_due_date: string | null;
    categories: {
        name: string;
        transaction_type: string;
        };
 };

/**
 * Function should run once when the when the user first signs in. It will retrieve and update all of the users data.
 * Maybe use just the database to manipulate data here, than use get Tranasctions after manipulation in done?
 */
export async function start()
{
    const supabase = await createClient();

    const transactions: Transaction[] = await getTransactions(supabase) as Transaction[];
    const currentDate = new Date();
    let transactionDate: Date = new Date(transactions[0].transaction_date); //will need to test this and confirm that the string is formatted correctly for this use.
    let i = 1;

    while(transactionDate.getUTCDate() >= currentDate.getUTCDate() - 365)//check everything from now down to one year ago.
    {
        if(!(transactions[i].frequency === "once"))
        {
            insertRecurringTransaction(transactions[i], currentDate, transactions, supabase); //if the transaction repeats, insert appropriate transactions.
        }
        transactionDate = new Date(transactions[i].transaction_date);
        i++;
    }

    //use UTC dates to maintain consistency when users travel across time zones.
    //find the most recent unique transaction names that recurr. compare to current date. add necessary transactions.
    //does the data base store the last time a user logged in? Really only need to check a year before the user's last sign-in to make sure I have accounted for all frequencies.
    //will use let transactionDate: Date = new Date(transactions[0].transaction_date); as a stand in for last user sign in for now.
}

function insertRecurringTransaction(transaction: Transaction, currentDate: Date, transactions: Transaction[], supabase: SupabaseClient<Database>)
{
    //??If the transaction has already been placed at the date specified, return. This transaction has already been handled.???
    if(!transaction.next_due_date || new Date(transaction.next_due_date) > currentDate) //if the next_due_date does NOT exist OR is in the future.
    {
        return; //just return. There is no further action needed.
    }

    let newTransaction: Transaction = structuredClone(transaction);
    switch(newTransaction.frequency)
    {//return record when inserted to get additional information like the id.
        case "daily":
            newTransaction.next_due_date = new Intl.DateTimeFormat("sv-SE").format(new Date(newTransaction.next_due_date!).getUTCDate() + 1)//need to make sure this provides the proper format. sets next_due_date one day in the future
            break;
        case "weekly":
            newTransaction.next_due_date = new Intl.DateTimeFormat("sv-SE").format(new Date(newTransaction.next_due_date!).getUTCDay() + 7)//sets next_due_date one week in the future
            break;
        case "monthly":
            newTransaction.next_due_date = new Intl.DateTimeFormat("sv-SE").format(new Date(newTransaction.next_due_date!).getUTCMonth() + 1)//sets next_due_date one month in the future
            break;
        case "yearly":
            newTransaction.next_due_date = new Intl.DateTimeFormat("sv-SE").format(new Date(newTransaction.next_due_date!).getUTCFullYear() + 1)//sets next_due_date one year in the future
            break;
    }

    transactions.push()
    //add transaction at due date.
    //call insertRecurringTransaction() on the newly created transaction
}

/**
 * Gets all transactions for the current user.
 * 
 */
async function getTransactions(supabase: SupabaseClient<Database>): Promise<Transaction[]>
{
    const transactionsQuery = supabase
    .from("transactions")
    .select(`
        id,
        name,
        description,
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


/*transaction 
        id,
        name,
        description,
        amount,
        transaction_date, 
        categories!inner(
            name, 
            transaction_type
            )

Recurring
        id
        name
        amount
        frequency
        next_due_date
            */