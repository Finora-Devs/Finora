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
    ALL = "All",
    FOOD = "Food",
    HOUSING = "Housing",
    TRANSPORTATION = "Transportation",
    TUITION = "Tuition",
    ENTERTAINMENT = "Entertainment",
    UTILITIES = "Utilities",
    SUBSCRIPTIONS = "Subscriptions",
    EMPLOYMENT = "Employment",
    SCHOLARSHIPS = "Scholarships",
    FINANCIAL_AID = "Financial Aid",
    FAMILY_SUPPORT = "Family Support",
    SIDE_HUSTLE = "Side Hustle",
    REFUNDS = "Refunds",
    OTHER = "Other"
 }
 export enum FREQUENCY //When I have time, I am going to see if I can replace the frequency value in transactions with these.
 {
   ONCE,
   DAILY,
   WEEKLY,
   MONTHLY,
   YEARLY
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
 export function sortBy(search: string = "", sortingOrder: SORTING_ORDER = SORTING_ORDER.DATE, descending: boolean = true, category: CATEGORY = CATEGORY.ALL, include: boolean = true, arr: Transaction[]): Transaction[]
 {
   const newArr = arr.filter((transaction) => 
      {
         const matchSearch: boolean = transaction.name.toLowerCase().includes(search.toLowerCase());
         let matchCategory: boolean = transaction.categories.name.toLowerCase() === category.toLowerCase();
         if(category === CATEGORY.ALL)
         {
            matchCategory = true;
         }
         
         if(include)
         {
            return matchCategory && matchSearch;
         }
         else
         {
            return !matchCategory && matchSearch;
         }
      })

      switch(sortingOrder)
      {
         case SORTING_ORDER.DATE:
            newArr.sort((a, b) => //return -1 if a is smaller than b, 0 if a = b, and 1 if a is bigger than b
               {               //need to test this. been ages since I wrote a sorting function. still need to add in ascending and descending.
                  if(new Date(a.transaction_date) > new Date(b.transaction_date))
                  {
                     return -1;
                  }
                  else if(new Date(a.transaction_date) < new Date(b.transaction_date))
                  {
                     return 1;
                  }
                  else 
                  {
                     return 0;
                  }
               })
            break;
         case SORTING_ORDER.NAME:
            newArr.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            break;
         case SORTING_ORDER.AMOUNT:
            newArr.sort((a, b) => b.amount - a.amount);
            break;
         case SORTING_ORDER.CATEGORY:
            newArr.sort((a, b) => a.categories.name.toLowerCase().localeCompare(b.categories.name.toLowerCase()));
            break;
         case SORTING_ORDER.FREQUENCY:
            newArr.sort((a, b) => a.frequency.localeCompare(b.frequency));//this one will not work.
            break;
      }

      if(descending)
      {
         return newArr;
      }
      else
      {
         return newArr.reverse();
      }
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

//prints the transaction ids of all transaction in an array. This is for testing, it should not be used in the final version of the website.
export function logAllTransactions(transactionsArr: Transaction[])
{
    transactionsArr.forEach((transaction) => 
    {
        console.log(transaction.id);
    });
}