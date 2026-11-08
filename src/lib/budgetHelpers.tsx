import type { Transaction } from "@/lib/types_and_helpers";

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