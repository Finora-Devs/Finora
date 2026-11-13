import {
    CalendarClock,
    CalendarDays,
    Repeat2,
    Wallet,
} from "lucide-react";

// Sample values for the UI
const summaryCards = [
    {
        label: "Recurring Expenses",
        value: "5",
        detail: "Repeating expense schedules",
        icon: Repeat2,
        color: "text-[#3f8068]",
        background: "bg-[#e5f3ec]",
    },
    {
        label: "Expected This Month",
        value: "$1,180.00",
        detail: "Scheduled recurring expenses",
        icon: Wallet,
        color: "text-[#d94c5c]",
        background: "bg-[#fce8eb]",
    },
    {
        label: "Due Next 7 Days",
        value: "$80.00",
        detail: "Upcoming scheduled payments",
        icon: CalendarDays,
        color: "text-[#3173c9]",
        background: "bg-[#e8f1ff]",
    },
    {
        label: "Next Payment",
        value: "$50.00",
        detail: "Internet · November 15, 2026",
        icon: CalendarClock,
        color: "text-[#8246c8]",
        background: "bg-[#f0e7fc]",
    },
];

export default function RecurringSummaryCards() {
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

                                <p className="mt-2 text-xs leading-5 text-[#4e7069]">
                                    {card.detail}
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