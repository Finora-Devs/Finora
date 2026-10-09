/**
 * This file will contain any functions or types we need to handle data that is already in the browser. NOTHING in this file should try to access
 * supabase.
 * for functions that read, write, or update data in the database in response to user actions, go to clientFunctions.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */

export type Transaction =
 {
    id: number,
    name: string,
    description: string | null,
    amount: number,
    category_id: number,
    frequency: string,
    transaction_date: string,
    next_due_date: string | null,
    categories: {
        name: string,
        transaction_type: string,
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
 export enum CATEGORY_NAME
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
 export enum Category_ID
 {
    ALL,
    INCOME,
    EXPENSE,
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
 //enum to be used when sorting transactions by frequency.
 export enum FREQUENCY
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
 export function sortBy(search: string = "", sortingOrder: SORTING_ORDER = SORTING_ORDER.DATE, descending: boolean = true, category: CATEGORY_NAME = CATEGORY_NAME.ALL, include: boolean = true, arr: Transaction[]): Transaction[]
 {
   const newArr = arr.filter((transaction) => 
      {
         const matchSearch: boolean = transaction.name.toLowerCase().includes(search.toLowerCase());
         let matchCategory: boolean = transaction.categories.name.toLowerCase() === category.toLowerCase();
         if(category === CATEGORY_NAME.ALL)//if set to all, display all expense and income.
         {                                 //if set to income, display categories that are income.
            matchCategory = true;          //if set to expense, display categories that are expense.
         }
         /*
         if(category === CATEGORY_NAME.INCOME)
         {

         }
         if(category === CATEGORY_NAME.EXPENSE)
         {

         }
         */
         
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
            newArr.sort((a, b) => 
               {
                  let aSortVal;
                  let bSortVal;
                  switch(a.frequency)
                  {
                     case "once":
                        aSortVal = FREQUENCY.ONCE;
                        break;
                     case "daily":
                        aSortVal = FREQUENCY.DAILY;
                        break;
                     case "weekly":
                        aSortVal = FREQUENCY.WEEKLY;
                        break;
                     case "monthly":
                        aSortVal = FREQUENCY.MONTHLY;
                        break;
                     case "yearly":
                        aSortVal = FREQUENCY.YEARLY;
                        break;
                     default:
                        aSortVal = 5; //error.
                        break;
                  }
                  switch(b.frequency)
                  {
                     case "once":
                        bSortVal = FREQUENCY.ONCE;
                        break;
                     case "daily":
                        bSortVal = FREQUENCY.DAILY;
                        break;
                     case "weekly":
                        bSortVal = FREQUENCY.WEEKLY;
                        break;
                     case "monthly":
                        bSortVal = FREQUENCY.MONTHLY;
                        break;
                     case "yearly":
                        bSortVal = FREQUENCY.YEARLY;
                        break;
                     default:
                        bSortVal = 5; //error.
                        break;
                  }

                  return aSortVal - bSortVal;
               })
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

//prints the transaction ids of all transaction in an array. This is for testing, it should not be used in the final version of the website.
export function logAllTransactions(transactionsArr: Transaction[])
{
    transactionsArr.forEach((transaction) => 
    {
        console.log(transaction.id);
    });
}