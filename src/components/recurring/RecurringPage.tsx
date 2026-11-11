export default function RecurringPage() {
    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-3xl font-bold text-[#123c35]">
                        Recurring Expenses
                    </h1>

                    <p className="mt-2 text-sm text-[#4e7069]">
                        Manage repeating expenses and keep track of upcoming
                        payments.
                    </p>
                </div>

                {/* Current month display */}
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

            {/* Recurring expense summary cards will go here */}

            {/* Recurring expense list will go here */}
        </section>
    );
}