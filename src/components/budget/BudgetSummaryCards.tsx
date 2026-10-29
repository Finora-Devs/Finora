import
{
    Wallet,
    ArrowDownRight,
    PiggyBank,
    Percent,
}from "lucide-react";

const summaryCards = [
    {
    label: "Monthly Budget",
    value: "$2,000.00",
    icon: Wallet,
    color: "text-[#3f8068]",
    background: "bg-[#e5f3ec]"
    },
    {
    label: "Amount Spent",
    value: "$1,400.00",
    icon: ArrowDownRight,
    color: "text-[#d94c5c]",
    background: "bg-[#fce8eb]",
    },
    {
    label: "Amount Remaining",
    value: "$600.00",
    icon: PiggyBank,
    color: "text-[#3173c9]",
    background: "bg-[#e8f1ff]",
    },
    {
    label: "Budget Used",
    value: "70%",
    icon: Percent,
    color: "text-[]",
    background: "bg-[#f0e7fc]",
    },
];

export default function BudgetSummaryCards()
{
    return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-[#dce7e2] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[#4e7069]">
                  {card.label}
                </p>

                <p className="mt-3 break-words text-2xl font-bold text-[#17324d]">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.background}`}
              >
                <Icon
                  aria-hidden="true"
                  className={`h-5 w-5 ${card.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
