
import {Transaction} from "./types_and_helpers";
/**
 * gets the net change in a user's money based on the given transaction array. to find net change for all time, pass all transactions
 * To find net change for a particular month, pass an array with only transaction from that month using filter
 */
export function getNetSpending(transactionArr: Transaction[])
{
    let amount = 0;
    transactionArr.forEach((t) => 
    {
        //if transaction is income, add amount to result
        if(t.categories.transaction_type === "income")
        {
            amount += t.amount;
        }
        //otherwise it must be an expense, so subtract
        else
        {
            amount -= t.amount;
        }
    })
    return amount;
}

/**
 * returns a positive number representing the amount of money in the given spending type for the given array. to find income for all time, 
 * pass all transactions. To find income for a particular month, pass an array with only transaction from that month using filter
 */
export function getTotalOfType(type: "income" | "expense", transactionArr: Transaction[])
{
    let amount = 0;
    transactionArr.forEach((t) => 
    {
        if(t.categories.transaction_type === type)
        {
            amount += t.amount;
        }
    })
    return amount
}