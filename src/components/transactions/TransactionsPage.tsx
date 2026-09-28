import {
  ArrowDownRight,
  ArrowUpRight,
  List,
  Plus,
  Wallet,
} from "lucide-react";
import TransactionList from "./TransactionList";
import SpendingByCategory from "./SpendingByCategory";

const summaryCards = [
  {
    label: "Total Transactions",
    value: "24",
    icon: List,
    color: "text-[#3f8068]",
    background: "bg-[#e5f3ec]",
  },
  {
    label: "Total Income",
    value: "$2,000.00",
    icon: ArrowUpRight,
    color: "text-[#16834b]",
    background: "bg-[#e5f3ec]",
  },
  {
    label: "Total Expenses",
    value: "$1,480.25",
    icon: ArrowDownRight,
    color: "text-[#d94c5c]",
    background: "bg-[#fce8eb]",
  },
  {
    label: "Net Amount",
    value: "$519.75",
    icon: Wallet,
    color: "text-[#3173c9]",
    background: "bg-[#e8f1ff]",
  },
];

export default function TransactionsPage() {
  return (
    <section className="space-y-6">
      {/*Heading*/}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#123c35]">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-[#4e7069]">
            View and manage income and expenses.
          </p>
        </div>
      </div>

      {/* Top cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-[#dce7e2] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#4e7069]">
                    {card.label}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-[#17324d]">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.background}`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

     <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
  <div className="min-w-0">
    <TransactionList />
  </div>

  <SpendingByCategory />
</div>
    </section>
  );
}