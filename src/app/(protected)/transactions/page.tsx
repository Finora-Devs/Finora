"use client";
import TransactionsPage from "@/components/transactions/TransactionsPage";
import {useTransactionContext} from "../context"

export default function Page() {

 const {transactionsArr, setTransactionsArr} = useTransactionContext();

    console.log(transactionsArr);


  return <TransactionsPage />;
}