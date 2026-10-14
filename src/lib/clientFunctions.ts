/**
 * This file will contain any functions that need to read, write, or update date in the database IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */
import {createClient} from "./client";
import {CATEGORY_NAME, Transaction} from "./types_and_helpers";
import type {Dispatch, SetStateAction } from "react";

/**
 * 
 */
export async function insertTransaction(formData: FormData, setTransactionsArr: Dispatch<SetStateAction<Transaction[]>>)
{
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const amount = formData.get("amount") as unknown as number; //may need to get this a different way, but works for now.
    const transaction_date = formData.get("date") as string;
    const frequency = formData.get("frequency") as string;
    let description = formData.get("notes") as string | null;
    const category = formData.get("category") as string;

    let category_id;
    
    switch(category)
    {
        case CATEGORY_NAME.EMPLOYMENT:
            category_id = 1;
            break;
        case CATEGORY_NAME.FINANCIAL_AID:
            category_id = 2;
            break;
        case CATEGORY_NAME.SCHOLARSHIPS:
            category_id = 3;
            break;
        case CATEGORY_NAME.ALLOWANCE:
            category_id = 4;
            break;
        case CATEGORY_NAME.SELF_EMPLOYMENT:
            category_id = 5;
            break;
        case CATEGORY_NAME.OTHER_INCOME:
            category_id = 6;
            break;
        case CATEGORY_NAME.FOOD:
            category_id = 7;
            break;
        case CATEGORY_NAME.HOUSING:
            category_id = 8;
            break;
        case CATEGORY_NAME.TRANSPORTATION:
            category_id = 9;
            break
        case CATEGORY_NAME.TUITION:
            category_id = 10;
            break;
        case CATEGORY_NAME.ENTERTAINMENT:
            category_id = 11;
            break;
        case CATEGORY_NAME.UTILITIES:
            category_id = 12;
            break;
        case CATEGORY_NAME.SUBSCRIPTIONS:
            category_id = 13;
            break;
        default:
            category_id = 14;
            break;
    } 

    if(frequency !== "once")
    {
        //insert recurring transaction and break.
        //insertReccurring should also insert any needed transactions.
    }

    if(!description)
    {
        description = "";
    }

    const {data: { user }, error: userError} = await supabase.auth.getUser();
    if(userError || user === null)
    {
        console.error("user authentication failed", userError);
        throw userError;
    }
    else
    {
        const {data,  error} = await supabase
        .from('transactions')
        .insert(
            { 
                amount: amount,
                category_id: category_id,
                frequency: frequency,
                name: name,
                transaction_date: transaction_date,
                description: description,
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
            console.log("updated local array");
            console.log(`new transaction category id: ${category_id}`);
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

//this function takes the information from the regular insertTransaction function and inserts a new row into the recurring_transactions table. calls another function that updates the transaction list.
async function insertRecurringTransaction(name: string, amount: number, transaction_date: string, frequency: string, description: string, category_id: number, setTransactionArr: Dispatch<SetStateAction<Transaction[]>>)
{
    const supabase = await createClient();

    const {data: { user }, error: userError} = await supabase.auth.getUser();
    if(userError || user === null)
    {
        console.error("user authentication failed", userError);
        throw userError;
    }
    else
    {
        const {data,  error} = await supabase
        .from('recurring_transactions')
        .insert(
            { 
                amount: amount,
                category_id: category_id,
                description: description,
                frequency: frequency,
                name: name,
                next_due_date: transaction_date,
                user_id: user.id
            }).select(`
                    id
                    user_id,
                    name,
                    amount,
                    category_id,
                    frequency,
                    next_due_date
                    description,
                    is_active
                `)
        if(data)
        {
            //insert transactions into the transaction table until the table is upt to date.
            //may need to create an object just to make this cleaner.
        }

        if(error)
        {
            console.error("Supabase insert reccuring error: ", error);
            throw error;
        }
        else
        {
            console.log("Insert recurring Success");
        }
    }
}

//this function will take a recurring transaction and checks the next_due_date. Repeatedly adds transactions to the table and update the recurring transaction until everything is up to date.
async function updateTransactions(current_due_date: string)
{
    const supabase = await createClient();

    let next_due_date: Date = new Date(current_due_date);
    const currentDate: Date = new Date();

    while(next_due_date < currentDate)
    {
        //add transaction to table and update recurring transaction's next_due_date.
        const {data, error} = await supabase
            .from("recurring_transactions")
            .update({
                next_due_date: ""//needs to set new date based on frequency.
            })
            .eq("id", 3/*need to replace this with argument*/)
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
export async function updateTransaction(transactionID: number, amount: number, category_id: number, frequency: string, name: string, transaction_date: string, setTransactionArr: Dispatch<SetStateAction<Transaction[]>>)
{
    const supabase = await createClient();

    const {data: { user }, error: userError} = await supabase.auth.getUser();
    if(userError || user === null)
    {
        console.error("user authentication failed", userError);
        throw userError;
    }
    else
    {
        const {data, error} = await supabase
            .from("transactions")
            .update(
                {
                    amount: amount, 
                    category_id: category_id, 
                    frequency: frequency, 
                    name: name, 
                    transaction_date: transaction_date,
                })
            .eq("id", transactionID)
            .select(`
                    id,
                    name,
                    description,
                    amount,
                    frequency, 
                    transaction_date, 
                    categories!inner(
                        name, 
                        transaction_type
                        )`);
        if(error)
        {
            console.error("supabase update error", error)
            throw error;
        }
        else
        {
            setTransactionArr(arr => //will (hopefully) update the transaction array to reflect the new state of the database.
                {
                    return arr.map(prev => 
                        {
                            if(prev.id === transactionID)
                            {
                                return data[0] as Transaction;
                            }
                            else
                            {
                                return prev;
                            }
                        });
                })
        }
    }
}