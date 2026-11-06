import GoalSummaryCards from "./GoalSummaryCards";
import GoalList from "./GoalList";

export default function GoalsPage() {
    return (
        <section className="space-y-6">
            {/* Heading */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-3xl font-bold text-[#123c35]">
                        Savings Goals
                    </h1>

                    <p className="mt-2 text-sm text-[#4e7069]">
                        Set savings targets, track your progress, and plan
                        for what matters to you.
                    </p>
                </div>
                <div className="text-center sm:mr-4">
                    <p className="mb-1 text-xs text-[#4e7069]">
                        Month
                    </p>

                    <p className="rounded-full bg-white px-3 py-1 text-sm text-[#17324d]">
                        {new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            year: "numeric",
                        }).format(new Date())}
                    </p>
                </div>
            </div>

            {/* Goal summary cards */}
            <GoalSummaryCards />

            {/* Explanation of goal priority */}
            <div className="rounded-xl border border-[#dce7e2] bg-[#e5f3ec] p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-[#123c35]">
                    Your highest-priority goal
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#4e7069]">
                    Choose one active goal as your highest priority. At the end
                    of each month, finishing under budget adds to its progress,
                    while finishing over budget increases the amount remaining.
                    Your target amount stays the same.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#4e7069]">
                    You can change your highest-priority goal at any time
                    and record contributions toward any active goal.
                </p>
            </div>

            {/* Savings goal list */}
            <GoalList />
        </section>
    );
}