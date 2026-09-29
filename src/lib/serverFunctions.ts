import {createClient} from "./server"
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

/**
 * This function should be called to retrieve user transaction data when the user first arrives at the webpage and has signed in.
 * @returns
 */
/*export async function getTransactions1()
{
    const supabase = await createClient();

    const transactionsQuery = supabase
    .from("transactions")
    .select(`
        id,
        name,
        amount,
        frequency, 
        transaction_date, 
        categories!inner(
            name, 
            transaction_type
            )`
        ).order("transaction_date", {ascending: false});

    type Transaction = QueryData<typeof transactionsQuery>;

    const { data, error } = await transactionsQuery;
    if (error) throw error;
    const transactions: Transaction = data;
}*/
