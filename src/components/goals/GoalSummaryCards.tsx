import {
    CheckCircle2,
    PiggyBank,
    Target,
    Wallet,
} from "lucide-react";

// Sample values
const summaryCards = [
    {
        label: "Active Goals",
        value: "3",
        icon: Target,
        color: "text-[#3f8068]",
        background: "bg-[#e5f3ec]",
    },
    {
        label: "Total Saved",
        value: "$1,200.00",
        icon: PiggyBank,
        color: "text-[#16834b]",
        background: "bg-[#e5f3ec]",
    },
    {
        label: "Amount Remaining",
        value: "$1,800.00",
        icon: Wallet,
        color: "text-[#3173c9]",
        background: "bg-[#e8f1ff]",
    },
    {
        label: "Completed Goals",
        value: "1",
        icon: CheckCircle2,
        color: "text-[#8246c8]",
        background: "bg-[#f0e7fc]",
    },
];

export default function GoalSummaryCards() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Summary cards */}
            {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="min-w-0 rounded-xl border border-[#dce7e2] bg-white p-5"
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