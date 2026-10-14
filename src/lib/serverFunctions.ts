'use server';
/**
 * This file will contain any functions that need to read, write, or update date in the database NOT IN RESPONSE TO USER ACTIONS.
 * for functions that just manipulate data already in the browsers, go to types_and_helpers.ts
 * for functions that read, write, or update data in the database in response to user actions, go to clientFunctions.ts
 */

import { Database } from "@/types/database.types";
import {createClient} from "./server"
import { SupabaseClient } from '@supabase/supabase-js'
import {Transaction } from "./types_and_helpers";

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