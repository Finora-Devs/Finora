import { useCategoryBudgetContext, useMonthlyBudgetContext, useTransactionContext } from "@/app/(protected)/context";
import type { categoryBudget, monthlyBudget, Transaction } from "@/lib/types_and_helpers";

export type BudgetAmounts = {
  amount: number;
};

export type CategoryBudgetAmounts = {
    amount: number;
    categoryID: number;
};

function isInMonth(
    transactionDate: string,
    month: number,
    year: number
): boolean {
    const date = new Date(transactionDate);
    return (
        !Number.isNaN(date.getTime()) &&
        date.getMonth() === month &&
        date.getFullYear() === year
    );
}

export function getMonthlySpending(
    transaction: Transaction[],
    month: number,
    year: number
): number {
    return transaction
    .filter((transaction) =>
        transaction.categories.transaction_type === "expense" &&
        isInMonth(transaction.transaction_date, month, year)
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getCategorySpending(
    transactions: Transaction[],
    categoryID: number,
    month: number,
    year: number
): number {
    return transactions
        .filter((transaction) =>
            transaction.category_id === categoryID &&
            transaction.categories.transaction_type === "expense" &&
            isInMonth(transaction.transaction_date, month, year)
        )
        .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getBudgetPercentage(
    spending: number,
    budgetAmount: number
): number {
    if (budgetAmount <= 0) {
        return 0;
    }
    return Math.max(0, (spending / budgetAmount) * 100);
}

export type BudgetStatus =
    | "no_budget"
    | "under_budget"
    | "approaching_budget"
    | "over_budget";

export function getBudgetStatus(
    spending: number,
    budgetAmount: number,
    ): BudgetStatus {
    if (budgetAmount <= 0) {
        return "no_budget";
    }
    const percentage = getBudgetPercentage(
    spending,
    budgetAmount
    );
    if (percentage > 100) {
        return "over_budget";
    }
    if (percentage > 90) {
        return "approaching_budget";
    }
    return "under_budget";
}

export function getRemainingBudget(
    spending: number,
    budgetAmount: number
): number {
    return budgetAmount - spending;
}


/**
 * Checks if any budgets have the approaching_budget or over_budget status, and if they do, triggers the appropriate warning.
 */
export function checkForWarnings(/*monthlyBudget: monthlyBudget, categoryBudgets: categoryBudget[], transactionsArr: Transaction[]*/)
{

    const {monthlyBudget} = useMonthlyBudgetContext()
    const {categoryBudget: categoryBudgets} = useCategoryBudgetContext()
    const {transactionsArr} = useTransactionContext()


    const twoWeeksInMilli = 1_209_600_000;
    const currentDate: Date = new Date();

    if(monthlyBudget)
    {
        switch(getBudgetStatus(getMonthlySpending(transactionsArr, monthlyBudget.month.getMonth(), monthlyBudget.month.getFullYear()), monthlyBudget.amount))
        {
            case "over_budget":
                if((monthlyBudget.lastEmailForExceeding === null || monthlyBudget.lastEmailForExceeding.getTime() - currentDate.getTime() > twoWeeksInMilli) && monthlyBudget.emailsEnabled) //if the user has never recieved an email OR it has been two weeks since the last email AND emails are enabled
                {
                    //send over budget email
                }
                //change warning state for monthly budget to over budget to trigger warning popup.
                break;
            case "approaching_budget":
                if((monthlyBudget.lastEmailForApproaching === null || monthlyBudget.lastEmailForApproaching.getTime() - currentDate.getTime() > twoWeeksInMilli) && monthlyBudget.emailsEnabled)
                {
                    //send approaching budget email
                }
                //change warning state for monthly budget to over budget to trigger warning popup.
                break;
            default:
                //change warning state for monthly budget to under budget.
                break;
        }
    }

    if(categoryBudgets)
    {
        categoryBudgets.forEach((budget) =>
        {
            switch(getBudgetStatus(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount))
            {
                case "over_budget":
                    if((budget.lastEmailForExceeding === null || budget.lastEmailForExceeding.getTime() - currentDate.getTime() > twoWeeksInMilli) && budget.emailsEnabled) //if the user has never recieved an email OR it has been two weeks since the last email AND emails are enabled
                    {
                        //send over budget email
                    }
                    //change warning state for category budget to over budget to trigger warning popup.
                    break;
                case "approaching_budget":
                    if((budget.lastEmailForApproaching === null || budget.lastEmailForApproaching.getTime() - currentDate.getTime() > twoWeeksInMilli && budget.emailsEnabled)) //if the user has never recieved an email OR it has been two weeks since the last email AND emails are enabled
                    {
                        //send approaching budget email
                    }
                    //change warning state for category budget to over budget to trigger warning popup.
                    break;
                default:
                    //change warning state for category budget to under budget.
                    break;
            }
        })
    }
}