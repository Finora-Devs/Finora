import { recurringTransaction } from "./types_and_helpers";


//right now recurring income is excluded by checking if the category is greater than or equal to 7, which is the smallest category id that is an expense. this is a terrible way to do this, but im in a rush.
export function getAmountDueThisMonth(recurringTransactions: recurringTransaction[])
{
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    let amount = 0;

    const rts = recurringTransactions.filter((rt) => rt.next_due_date.getMonth() === currentDate.getMonth() && rt.category_id >= 7);

    rts.forEach((rt) => 
    {
        const nextDate = new Date(rt.next_due_date);
        while(nextDate.getMonth() === currentDate.getMonth() && nextDate >= currentDate)
        {
            amount += rt.amount;

            switch(rt.frequency)
            {
                case "daily":
                    nextDate.setDate(nextDate.getDate() + 1);
                    break;
                case "weekly":
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case "monthly":
                    nextDate.setDate(nextDate.getDate() + 30);
                    break;
                case "yearly":
                    nextDate.setDate(nextDate.getDate() + 365);
                    break;
            }
        }
    })
    return amount;
}

//broken; always returns 0
export function getAmountDueNextWeek(recurringTransactions: recurringTransaction[])
{
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    //one week in the future
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7)

    let amount = 0;

    recurringTransactions
    .filter((rt) => currentDate <= rt.next_due_date && rt.next_due_date <= nextWeek && rt.category_id >= 7)
    .forEach((rt) => 
    {
        const nextDate = new Date(rt.next_due_date);
        while(currentDate <= nextDate && nextDate <= nextWeek)
        {
            amount += rt.amount;

            switch(rt.frequency)
            {
                case "daily":
                    nextDate.setDate(nextDate.getDate() + 1);
                    break;
                case "weekly":
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case "monthly":
                    nextDate.setDate(nextDate.getDate() + 30);
                    break;
                case "yearly":
                    nextDate.setDate(nextDate.getDate() + 365);
                    break;
            }
        }
    });

    return amount;
}

export function getAmountNextPayment(recurringTransactions: recurringTransaction[])
{
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    const sorted = recurringTransactions.filter((rt) => rt.category_id >= 7).sort((a, b) =>
    {
        if(a.next_due_date > b.next_due_date)
        {
           return 1;
        }
        else if(a.next_due_date < b.next_due_date )
        {
           return -1;
        }
        else 
        {
           return 0;
        }
    })

    for(let i = 0; i < sorted.length; i++)
    {
        if(sorted[i].next_due_date >= currentDate)
        {
            return sorted[i];
        }
    }
    //should only happen if the user has no recurring transactions.
    return null;
}

export function isDueSoon(reccuringTransaction: recurringTransaction)
{
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);

    if(currentDate <= reccuringTransaction.next_due_date && reccuringTransaction.next_due_date <= nextWeek)
        return true;
}