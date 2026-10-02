/**
 * This file will contain any functions or types we need to handle data that is already in the browser. NOTHING in this file should try to access
 * supabase.
 * for functions that read, write, or update data in the database in response to user actions, go to clientFunctions.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */

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

 //this function will take a category ID and return the amount of money spent in that category. This will be called to get the numbers needed for the pie chart.
export function getCategoryAmount(category_id: number): number
{
    return 0;
}

//this function will need to filter the transactionsArr based on the category selected in the dropdown menu. The transactionPage will need to display the newly filtered array.
export function categoryOnChange()
{

}