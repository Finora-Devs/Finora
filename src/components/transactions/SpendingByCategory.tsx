const categories = [
    { name: "Housing", amount: "$518.09", percent: 35, color: "#5794f6" },
    { name: "Food", amount: "$266.45", percent: 18, color: "#ff8963" },
    { name: "Transportation", amount: "$177.63", percent: 12, color: "#ffce32" },
    { name: "Tuition", amount: "$148.02", percent: 10, color: "#48c4ac" },
    { name: "Entertainment", amount: "$118.42", percent: 8, color: "#c65be3" },
    { name: "Utilities", amount: "$103.62", percent: 7, color: "#7b6be8" },
    { name: "Subscriptions", amount: "$74.01", percent: 5, color: "#7437ed" },
    { name: "Other", amount: "$74.01", percent: 5, color: "#b978d9" },
];

const chartColors = categories
    .reduce<{ stops: string[]; position: number }>(
        (result, category) => {
            const end = result.position + category.percent;

            result.stops.push(
                `${category.color} ${result.position}% ${end}%`,
            );

            result.position = end;
            return result;
        },
        { stops: [], position: 0 },
    )
    .stops.join(", ");

export default function SpendingByCategory() {
    return (
        <section className="self-start rounded-xl border border-[#dce7e2] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#17324d]">
                    Spending by Category
                </h2>

                <span className="whitespace-nowrap rounded-lg border border-[#dce7e2] px-3 py-2 text-xs text-[#607394]">
                    This Month
                </span>
            </div>

            <div className="my-7 flex justify-center">
                <div
                    role="img"
                    aria-label="Spending by category. Category amounts are listed below."
                    className="flex h-52 w-52 items-center justify-center rounded-full"
                    style={{
                        background: `conic-gradient(${chartColors})`,
                    }}
                >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center">
                        <strong className="text-xl text-[#17324d]">
                            $1,480.25
                        </strong>
                        <span className="mt-1 text-xs text-[#7185a1]">
                            Total Spent
                        </span>
                    </div>
                </div>
            </div>

            <ul className="space-y-3 text-sm">
                {categories.map((category) => (
                    <li
                        key={category.name}
                        className="flex items-center gap-2 text-[#17324d]"
                    >
                        <span
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{ backgroundColor: category.color }}
                        />
                        <span className="min-w-0 flex-1">
                            {category.name}
                        </span>
                        <span className="font-medium">
                            {category.amount}
                        </span>
                        <span className="w-9 text-right text-[#7185a1]">
                            {category.percent}%
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}