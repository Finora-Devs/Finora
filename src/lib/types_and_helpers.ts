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

 export enum SORTING_ORDER
 {
    DATE,
    NAME,
    AMOUNT,
    CATEGORY,
    FREQUENCY
 }
 export enum CATEGORY 
 {
    ALL,
    FOOD,
    HOUSING,
    TRANSPORTATION,
    TUITION,
    ENTERTAINMENT,
    UTILITIES,
    SUBSCRIPTIONS,
    EMPLOYMENT,
    SCHOLARSHIPS,
    FINANCIAL_AID,
    FAMILY_SUPPORT,
    SIDE_HUSTLE,
    REFUNDS,
    OTHER
 }

 /**
  * @param search a string. if not empty, only return transactions which have names that match the string
  * @param sortingOrder what should be used to sort the array of transactions.
  * @param descending determines if the array is sorted in ascending or descending order.
  * @param category which category to affect with include.
  * @param include if set to include, returned array will only have Transactions which match @param category. if false, return only transaction which do NOT match.
  * @param arr the array to be sorted.
  * @returns an array of Transactions identical to @param arr but sorted and filtered.
  */
 export function sortBy(search: string = "", sortingOrder: SORTING_ORDER = 0, descending: boolean = true, category: CATEGORY = 0, include: boolean = true, arr: Transaction[]): Transaction[]
 {
    return []
 }

 //this function will take a category ID and return the amount of money spent in that category. This will be called to get the numbers needed for the pie chart.
export function getCategoryAmount(category_id: number): number
{
    return 0;
}

//this function will need to filter the transactionsArr based on the category selected in the dropdown menu. The transactionPage will need to display the newly filtered array.
export function categoryOnChange()
{

}