"use client";
import { useTransactionContext } from "../context";

export default function DashboardPage() {

    const {transactionsArr, setTransactionsArr} = useTransactionContext();//worked.

    console.log(transactionsArr);

    /*setTransactionsArr(prev => [ this is how the context is updated. should be done in response to button clicks obviously, but i havent done that part yet.
        ...prev,
        {
            id: 2,
            name: "",
            description: "",
            amount: 0,
            frequency: "",
            transaction_date: "",
            next_due_date: "",
            categories: {
                name: "",
                transaction_type: ""
            }
        }
    ]);*/

    return (
        <div>
            <h2 className="text-3xl font-bold text-[#123c35]">
                Dashboard
            </h2>


            <p className="mt-2 text-[#4e7069]">
                Dashboard content will be added later.
            </p>
        </div>
    );
}