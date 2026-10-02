import {} from "./client";
import { createClient } from "./server";
import { Transaction } from "./types_and_helpers";

export async function insertTransaction(amount: number, category_id: number, description: string | null, frequency: string, name: string, transaction_date: string)
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
                user_id: "0"//this should use the id of the current user. I will figure out if this is automatic or if i need to retrieve it later
         });
}
