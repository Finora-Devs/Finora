import {} from "./client";
import { createClient } from "./server";

export async function insertTransaction(amount: number, category_id: number, description: string | null, frequency: string, name: string, transaction_date: string)
{
    const supabase = await createClient();

    const next_due_date: Date = switch(frequency)
    {
        case "once":
            new Date();
            break;
        case "weekly":
            
            break;
        case "monthly":

            break;
        case "yearly":

            break;

    }

    const { error } = await supabase
        .from('transactions')
        .insert(
            { 
                amount: amount,
                category_id: category_id,
                description: description,
                frequency: frequency,
                name: name,
                next_due_date: Intl.DateTimeFormat("sv-SE").format(new Date()),//add time based on frequency
                transaction_date: transaction_date,
                user_id: "0"//this should use the id of the current user. I will figure out how to retieve that later.
         })
}

/*
 *        amount: number
          category_id: number
          created_at?: string
          description?: string | null
          frequency?: string
          id?: number
          name: string
          next_due_date?: string | null
          transaction_date: string
          user_id: string 
 */