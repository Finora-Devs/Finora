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
    categories: {
        name: string,
        transaction_type: string,
        };
 };

export type TransactionDraft = {
  name: string;
  amount: string;
  date: string;
  category: string;
  frequency: string;
  description: string;
};

export const emptyTransactionDraft: TransactionDraft = {
  name: "",
  amount: "",
  date: "",
  category: "",
  frequency: "once",
  description: "",
};

export type TransactionErrors = Partial<Record<keyof TransactionDraft, string>>;


 export type recurringTransaction = 
 {
   id: number,
   user_id: string,
   name: string,
   amount: number,
   category_id: number,
   frequency: string,
   next_due_date: string,
   description: string | null,
   is_active: boolean,
 }

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
   EXPENSE = "Expense",
   INCOME = "Income",

   FOOD = "Food",
   HOUSING = "Housing",
   TRANSPORTATION = "Transportation",
   TUITION = "Tuition",
   ENTERTAINMENT = "Entertainment",
   UTILITIES = "Utilities",
   SUBSCRIPTIONS = "Subscriptions",
   OTHER = "Other",

   EMPLOYMENT = "Employment",
   SCHOLARSHIPS = "Scholarships",
   FINANCIAL_AID = "Financial Aid",
   ALLOWANCE = "Allowance",
   SELF_EMPLOYMENT = "Self Employment",
   OTHER_INCOME = "Other Income"
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

 export const incomeCategories = [
  { name: "Employment", value: CATEGORY_NAME.EMPLOYMENT ,color: "#5794f6" },
  { name: "Scholarships", value: CATEGORY_NAME.SCHOLARSHIPS ,color: "#ffce32" },
  { name: "Financial Aid", value: CATEGORY_NAME.FINANCIAL_AID ,color: "#b36af5" },
  { name: "Allowance", value: CATEGORY_NAME.ALLOWANCE ,color: "#ff7b96" },
  { name: "Self Employment", value: CATEGORY_NAME.SELF_EMPLOYMENT ,color: "#48c4ac" },
  { name: "Other Income", value: CATEGORY_NAME.OTHER_INCOME ,color: "#7437ed" },
 ] as const;

 export const expenseCategories = [
  { name: "Food", value: CATEGORY_NAME.FOOD, color: "#ff8963" },
  { name: "Housing", value: CATEGORY_NAME.HOUSING, color: "#5794f6" },
  { name: "Transportation", value: CATEGORY_NAME.TRANSPORTATION, color: "#ffce32" },
  { name: "Tuition", value: CATEGORY_NAME.TUITION, color: "#48c4ac" },
  { name: "Entertainment", value: CATEGORY_NAME.ENTERTAINMENT, color: "#c65be3" },
  { name: "Utilities", value: CATEGORY_NAME.UTILITIES, color: "#7b6be8" },
  { name: "Subscriptions", value: CATEGORY_NAME.SUBSCRIPTIONS, color: "#7437ed" },
  { name: "Other", value: CATEGORY_NAME.OTHER, color: "#b978d9" },
] as const;
 
 export const frequencies = [
  { value: "once", label: "Just Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;
 
 export const fieldClass =
   "mt-2 w-full rounded-lg border border-[#dce7e2] " +
   "bg-[#f7faf8] px-3 py-2.5 text-sm text-[#17324d] " +
   "placeholder:text-[#7185a1] focus:border-[#3f8068] " +
   "focus:outline-none focus:ring-2 focus:ring-[#3f8068]/20";

 /**
  * @param search a string. if not empty, only return transactions which have names that match the string
  * @param sortingOrder what should be used to sort the array of transactions.
  * @param descending determines if the array is sorted in ascending or descending order.
  * @param category which category to affect with include.
  * @param include if set to include, returned array will only have Transactions which match @param category. if false, return only transaction which do NOT match.
  * @param month a number representing which month of transactions you would like returned. This number can be easily retrieved from a Date object useing the getMonth() function.
  * @param year a number representing which year you would like of transactions you would like returned. This number can be easily retrieved from a Date object useing the getFullYear() function.
  * @param arr the array to be sorted.
  * @returns an array of Transactions identical to @param arr but sorted and filtered.
  */
 export function sortBy(search: string = "", sortingOrder: SORTING_ORDER = SORTING_ORDER.DATE, descending: boolean = true, category: CATEGORY_NAME = CATEGORY_NAME.ALL, include: boolean = true, type: string, month: number, year: number, arr: Transaction[]): Transaction[]
 {
   const newArr = arr.filter((transaction) => 
      {
         const matchSearch: boolean = transaction.name.toLowerCase().includes(search.toLowerCase());
         let matchCategory: boolean = transaction.categories.name.toLowerCase() === category.toLowerCase();
         let matchType: boolean = transaction.categories.transaction_type.toLowerCase() === type.toLowerCase();

         console.log(type);

         if(type === "All")
         {
            matchType = true;
         }

         if(category === CATEGORY_NAME.ALL)
         {
            matchCategory = true;
         }
         // else if(category === CATEGORY_NAME.INCOME)
         // {
         //    matchCategory = transaction.categories.transaction_type === "income" //if transaction is an income. will break if the database changes.
         // }
         // else if(category === CATEGORY_NAME.EXPENSE)
         // {
         //    matchCategory = transaction.categories.transaction_type === "expense" //if transaction is an expense
         // }

         const transactionDate = new Date(`${transaction.transaction_date}T00:00:00`);

         if(include)
         {
            return (matchCategory && matchSearch) && matchType && (transactionDate.getMonth() === month && transactionDate.getFullYear() === year);
         }
         else
         {
            return (!matchCategory && matchSearch) && matchType && (transactionDate.getMonth() === month && transactionDate.getFullYear() === year);
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

export function validateTransaction(draft: TransactionDraft): TransactionErrors {
  const errors: TransactionErrors = {};
  if (!draft.name.trim()) errors.name = "Enter a transaction name or payee.";
  else if (draft.name.trim().length > 100)
    errors.name = "Use 100 characters or fewer.";
  const amount = draft.amount.trim();
  if (
    !/^\d+(\.\d{1,2})?$/.test(amount) || //checks if input number matches this format: 1.12, any amount of numbers, optionally followed by a . and either one or two more numbers.
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0 ||
    Number(amount) > 999999999.99
  )
    errors.amount =
      "Enter an amount greater than zero, with up to two decimal places.";
  if (!draft.date /*|| normalizeDate(draft.date) !== draft.date*/)  //it should not be possible to enter an invalid date with the way the form works.
    errors.date = "Select a valid date.";
  if (!expenseCategories.some((category) => category.value === draft.category))
    errors.category = "Select an expense category.";
  if (
    !frequencies.some((frequency) => frequency.value === draft.frequency)
  )
    errors.frequency = "Select a frequency.";
  if (draft.description.length > 500)
    errors.description = "Use 500 characters or fewer.";
  return errors;
}

export function categoryBreakdown(records: Transaction[]) { //Does this already exist somewhere?
          return expenseCategories.map((category) => ({
            ...category,
            amount: records
              .filter(
                (record) => record.categories.name === category.value,
              )
              .reduce((sum, record) => sum + record.amount, 0),
          }));
        }

export const formatMoney = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });