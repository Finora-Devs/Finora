/**
 * This file will contain any functions or types we need to handle data that is already in the browser. NOTHING in this file should try to access
 * supabase.
 * for functions that read, write, or update data in the database in response to user actions, go to clientFunctions.ts
 * for functions that initialize data in the browser using the database, go to serverFunctions.ts
 */

import { useMonthlyBudgetContext, useSavingGoalsContext, useTransactionContext } from "@/app/(protected)/context";
import { getBudgetStatus, getCategorySpending, getMonthlySpending, getRemainingBudget } from "./budgetHelpers";
import { addContributionWithOutForm, deleteMonthlyBudget } from "./clientFunctions";
import { Dispatch, SetStateAction } from "react";
import { ArrowUpRight, Award, BanknoteArrowUp, BriefcaseBusiness, Car, DollarSign, Faucet, Gamepad2, GraduationCap, House, LucideIcon, ShoppingBag, University, Utensils } from "lucide-react";
import { getTotalOfType } from "./transactionHelpers";

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

export type recurringTransaction = 
{
  id: number,
  name: string,
  amount: number,
  category_id: number,
  frequency: string,
  next_due_date: Date,
  description: string | null,
  is_active: boolean,
}

export type monthlyBudget =
{
   id: number,
   month: Date,
   amount: number,
   emailsEnabled: boolean,
   lastEmailForApproaching: Date | null,
   lastEmailForExceeding: Date | null
}
export type categoryBudget =
{
   id: number,
   categoryId: number,
   month: Date,
   amount: number,
   emailsEnabled: boolean,
   lastEmailForApproaching: Date | null,
   lastEmailForExceeding: Date | null
}

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

export type SavingGoal = {
   id: number;
   name:string;
   targetAmount: number;
   currentAmount: number;
   targetDate: Date | null;
   description: string | null;
   priority: number;
};

export type TransactionErrors = Partial<Record<keyof TransactionDraft, string>>;

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
  SCHOLARSHIPS = "Scholarship",
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
//can probably use [...incomeCategories, ...expenseCatgories] to create an array of all categories, then use a category id to easily access category name
export const incomeCategories = [
{ name: "Employment", value: CATEGORY_NAME.EMPLOYMENT ,textColor: "#3aa561", backgroundColor: "#dfece4" },
{ name: "Financial Aid", value: CATEGORY_NAME.FINANCIAL_AID ,textColor: "#5d9ad2", backgroundColor: "#e5f2fe" },
{ name: "Scholarship", value: CATEGORY_NAME.SCHOLARSHIPS ,textColor: "#6380ff", backgroundColor: "#dbdde8" },
{ name: "Allowance", value: CATEGORY_NAME.ALLOWANCE ,textColor: "#aa32ff", backgroundColor: "#e4beff" },
{ name: "Self Employment", value: CATEGORY_NAME.SELF_EMPLOYMENT ,textColor: "#46c785", backgroundColor: "#e0eee7" },
{ name: "Other Income", value: CATEGORY_NAME.OTHER_INCOME ,textColor: "#b978d9", backgroundColor: "#fbfafb" },
] as const;
export const expenseCategories = [
{ name: "Food", value: CATEGORY_NAME.FOOD, textColor: "#ff8963", backgroundColor: "#fff0ec" },
{ name: "Housing", value: CATEGORY_NAME.HOUSING, textColor: "#5794f6", backgroundColor: "#dae7fb" },
{ name: "Transportation", value: CATEGORY_NAME.TRANSPORTATION, textColor: "#ffce32", backgroundColor: "#fff5d6" },
{ name: "Tuition", value: CATEGORY_NAME.TUITION, textColor: "#9fc448", backgroundColor: "#dce6c5" },
{ name: "Entertainment", value: CATEGORY_NAME.ENTERTAINMENT, textColor: "#ed3737", backgroundColor: "#ffd3d3" },
{ name: "Utilities", value: CATEGORY_NAME.UTILITIES, textColor: "#9a5be3", backgroundColor: "#efe6fa" },
{ name: "Subscriptions", value: CATEGORY_NAME.SUBSCRIPTIONS, textColor: "#7437ed", backgroundColor: "#c9b6ef" },
{ name: "Other Expense", value: CATEGORY_NAME.OTHER, textColor: "#b978d9", backgroundColor: "#fbfafb" },
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
export const labelClass = "block text-sm font-medium text-[#4e7069]";

/**
 * Takes a string @param categoryName and returns the id which corrosponds to that name
 */
export function getCategoryID(categoryName: string)
{
   return [...incomeCategories, ...expenseCategories].findIndex((item) => categoryName.toLowerCase() === item.value.toLowerCase()) + 1 //indexes start at zero, but Ids start at one
}
/**
 * 
 * takes a number @param categoryID and return the category label which corrosponds to that name.
 */
export function getCategoryName(categoryID: number)
{
   return [...incomeCategories, ...expenseCategories].at(categoryID-1)?.name; //category ids start at one, but indexes start at zero.
}

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
 export function sortTransactionList(search: string = "", sortingOrder: SORTING_ORDER = SORTING_ORDER.DATE, descending: boolean = true, category: CATEGORY_NAME = CATEGORY_NAME.ALL, include: boolean = true, type: string, month: number, year: number, arr: Transaction[]): Transaction[]
 {
   return sortBy(sortingOrder, descending, filterTransactions(search, category, include, type, month, year, arr));
 }
   export function filterTransactions(search: string = "", category: CATEGORY_NAME = CATEGORY_NAME.ALL, include: boolean = true, type: string, month: number, year: number, arr: Transaction[])
   {
      const newArr = arr.filter((transaction) => 
      {
         const matchSearch: boolean = transaction.name.toLowerCase().includes(search.toLowerCase());
         let matchCategory: boolean = transaction.categories.name.toLowerCase() === category.toLowerCase();
         let matchType: boolean = transaction.categories.transaction_type.toLowerCase() === type.toLowerCase();


         if(type === "All")
         {
            matchType = true;
         }

         if(category === CATEGORY_NAME.ALL)
         {
            matchCategory = true;
         }

         const transactionDate = new Date(`${transaction.transaction_date}T00:00:00`); //force interpret date as local

         if(include)
         {
            return (matchCategory && matchSearch) && matchType && (transactionDate.getMonth() === month && transactionDate.getFullYear() === year);
         }
         else
         {
            return (!matchCategory && matchSearch) && matchType && (transactionDate.getMonth() === month && transactionDate.getFullYear() === year);
         }
      })
      return newArr;
   }
   export function sortBy(sortingOrder: SORTING_ORDER = SORTING_ORDER.DATE, descending: boolean = true, arr: Transaction[]): Transaction[]
 {

      switch(sortingOrder)
      {
         case SORTING_ORDER.DATE:
            arr.sort((a, b) => //return -1 if a is smaller than b, 0 if a = b, and 1 if a is bigger than b
               {               //need to test this. been ages since I wrote a sorting function. still need to add in ascending and descending.
                  if(new Date(a.transaction_date) > new Date(b.transaction_date))
                  {
                     return -1;
                  }
                  else if(new Date(a.transaction_date +"T00:00:00") < new Date(b.transaction_date + "T00:00:00"))
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
            arr.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            break;
         case SORTING_ORDER.AMOUNT:
            arr.sort((a, b) => b.amount - a.amount);
            break;
         case SORTING_ORDER.CATEGORY:
            arr.sort((a, b) => a.categories.name.toLowerCase().localeCompare(b.categories.name.toLowerCase()));
            break;
         case SORTING_ORDER.FREQUENCY:
            arr.sort((a, b) => 
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
         return arr;
      }
      else
      {
         return arr.reverse();
      }
 }

export function validateTransaction(draft: TransactionDraft, isIncomeForm: boolean): TransactionErrors {
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
  if(isIncomeForm)
  {
   if(!incomeCategories.some((category) => category.value === draft.category))
   {
      errors.category = "Select an income category.";
   }
  }
  else
  {
   if (!expenseCategories.some((category) => category.value === draft.category))
   {
      errors.category = "Select an expense category.";
   }
  }
  if (
    !frequencies.some((frequency) => frequency.value === draft.frequency)
  )
    errors.frequency = "Select a frequency.";
  if (draft.description.length > 500)
    errors.description = "Use 500 characters or fewer.";
  return errors;
}

export function categoryBreakdown(records: Transaction[]) 
{
   let position = 0;
   const total = getTotalOfType("expense", records);
   ;
   return expenseCategories.map((category) => 
   {
      const amount = records
         .filter(
            (record) => record.categories.name === category.value,
         )
         .reduce((sum, record) => sum + record.amount, 0);

      return {
      ...category,
      amount: amount,
      percent: Math.max(0, amount / total * 100),
      }
});
}
export function incomeCategoryBreakdown(records: Transaction[]) {
         return incomeCategories.map((category) => 
   {
      const amount = records
         .filter(
            (record) => record.categories.name === category.value,
         )
         .reduce((sum, record) => sum + record.amount, 0);
      return {
      ...category,
      amount: amount,
      percent: amount / getTotalOfType("expense", records)
      }
});
        }

export const formatMoney = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });



export function getAsMonthlyBudget(monthlyBudget: {
   id: number;
   budget_month: string;
   budget_amount: number;
   email_notifications_enabled: boolean;
   last_approaching_email_at: string | null;
   last_exceeded_email_at: string | null;
} | null)
{
   if(!monthlyBudget)
   {
      return null;
   }

   return {
            id: monthlyBudget.id,
            month: new Date(monthlyBudget.budget_month + "T00:00:00"), //force interpret date as local
            amount: monthlyBudget.budget_amount,
            emailsEnabled: monthlyBudget.email_notifications_enabled,
            lastEmailForApproaching: monthlyBudget.last_approaching_email_at ? new Date(monthlyBudget.last_approaching_email_at + "T00:00:00") : null,
            lastEmailForExceeding: monthlyBudget.last_exceeded_email_at ? new Date(monthlyBudget.last_exceeded_email_at + "T00:00:00") : null,
            } as monthlyBudget
}

export function getAsCategoryBudgets(categoryBudgets: {
    id: number;
    category_id: number;
    budget_month: string;
    budget_amount: number;
    email_notifications_enabled: boolean;
    last_approaching_email_at: string | null;
    last_exceeded_email_at: string | null;
}[] | null)
{
   if(!categoryBudgets)
   {
      return null;
   }

   return categoryBudgets.map((prev) => 
        {
            return {
                id: prev.id,
                categoryId: prev.category_id,
                month: new Date(prev.budget_month + "T00:00:00"), //force interpret date as local
                amount: prev.budget_amount,
                emailsEnabled: prev.email_notifications_enabled,
                lastEmailForApproaching: prev.last_approaching_email_at ? new Date(prev.last_approaching_email_at + "T00:00:00") : null, //force interpret date as local
                lastEmailForExceeding: prev.last_exceeded_email_at ? new Date(prev.last_exceeded_email_at + "T00:00:00") : null, //force interpret date as local
            } as categoryBudget
        }) as categoryBudget[];
}
/**
 * Does the same thing as getCategoryBudgets, but with a single object instead of an array.
 */
export function getAsCategoryBudget(categoryBudget: {
    id: number;
    category_id: number;
    budget_month: string;
    budget_amount: number;
    email_notifications_enabled: boolean;
    last_approaching_email_at: string | null;
    last_exceeded_email_at: string | null;
} | null)
{
   if(!categoryBudget)
   {
      return null;
   }

return {
         id: categoryBudget.id,
         categoryId: categoryBudget.category_id,
         month: new Date(categoryBudget.budget_month + "T00:00:00"),
         amount: categoryBudget.budget_amount,
         emailsEnabled: categoryBudget.email_notifications_enabled,
         lastEmailForApproaching: categoryBudget.last_approaching_email_at ? new Date(categoryBudget.last_approaching_email_at + "T00:00:00") : null, //force interpret date as local
         lastEmailForExceeding: categoryBudget.last_exceeded_email_at ? new Date(categoryBudget.last_exceeded_email_at + "T00:00:00") : null, //force interpret date as local
      } as categoryBudget
}

export async function checkContributions( monthlyBudget: monthlyBudget[] | null, 
                                    setMonthlyBudget: Dispatch<SetStateAction<monthlyBudget[] | null>>,
                                    transactionsArr: Transaction[],
                                    savingGoals: SavingGoal[],
                                    setSavingGoals: Dispatch<SetStateAction<SavingGoal[]>>  
                                 )
{
   
    const incompleteGoals = savingGoals.filter((goal) =>
    {
        return goal.currentAmount < goal.targetAmount;
    })
    .sort((a,b) => a.priority - b.priority);

    //only update contributions if there are two budgets and at least one goal.
    if(monthlyBudget && monthlyBudget.length > 1 && incompleteGoals.length > 0)
    {
        //should get the amount under budget, or -amount over budget.
        let amount = getRemainingBudget(getMonthlySpending(transactionsArr, monthlyBudget[1].month.getMonth(), monthlyBudget[1].month.getFullYear()), monthlyBudget[1].amount)

        const amountIsPositive: boolean = amount > 0
        amount = Math.abs(amount)

        //goes through all the incomplete goals and adds the amount until the goal is complete, then moves to the next goal. break when amount = 0;
        for(let i = 0; i<incompleteGoals.length; i++)
        {
            //if amount is negative, subtract amount from goal
            if(!amountIsPositive && amount >= incompleteGoals[i].currentAmount)
            {
                await addContributionWithOutForm(-incompleteGoals[i].currentAmount, incompleteGoals[i].id, savingGoals, setSavingGoals);
                amount -= incompleteGoals[i].currentAmount;
            }
            else if(!amountIsPositive)
            {
                await addContributionWithOutForm(-amount, incompleteGoals[i].id, savingGoals, setSavingGoals);
                break;
            }

            //if amount is positive, add amount to goal
            const diff = incompleteGoals[i].targetAmount - incompleteGoals[i].currentAmount;
            if(amountIsPositive && amount >= diff)
            {
                await addContributionWithOutForm(diff, incompleteGoals[i].id, savingGoals, setSavingGoals);
                amount -= diff;
            }
            else if(amountIsPositive)
            {
                await addContributionWithOutForm(amount, incompleteGoals[i].id, savingGoals, setSavingGoals);
                break;
            }

            if(amount === 0) break;
        }

        deleteMonthlyBudget(monthlyBudget[1].id, setMonthlyBudget);
    }
    //delete the extra budget regardless of whether or not there were any goals to update.
    else if(monthlyBudget && monthlyBudget.length > 1)
    {
        deleteMonthlyBudget(monthlyBudget[1].id, setMonthlyBudget);
    }
    else
    {
        return;
    }
}

export function formatDate(date: Date)
{
   const day = `${date.getDate()}`.padStart(2, "0");
   const month = `${date.getMonth() + 1}`.padStart(2, "0");
   const year = `${date.getFullYear()}`.padStart(4, "0");

   return `${month}/${day}/${year}`
}

export function getIcon(categoryID: number)
{
   switch(categoryID)
   {
       case 1:
           return ArrowUpRight;
           break;
       case 2:
           return Award;
           break;
       case 3:
           return GraduationCap;
           break;
       case 4:
           return DollarSign;
           break;
       case 5:
           return BriefcaseBusiness;
           break;
       case 6:
           return ShoppingBag;
           break;
       case 7:
           return Utensils;
           break;
       case 8:
           return House;
           break;
       case 9:
           return Car;
           break;
       case 10:
           return University;
           break;
       case 11:
           return Gamepad2;
           break;
       case 12:
           return Faucet;
           break;
       case 13:
           return DollarSign;
           break;
       case 14:
           return ShoppingBag;
           break;
         default :
            return Utensils;
            break;
   }


}