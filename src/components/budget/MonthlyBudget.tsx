export default function BudgetPage(){
    return(
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                 <h1 className="text-3xl font-bold text-[#123c35]">
                    Budget
                 </h1>

                 <p className="mt-2 text-sm text-[#4e7069]">
                    Plan Your Monthly Spending and Manage Budget Category
                 </p>
                </div>
                <div className="text-center sm:mr-4">
          <p className="mb-1 text-xs text-[#4e7069]">
            Month
          </p>

          <p className="rounded-lg bg-white px-3 text-sm text-[#17324d]">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
        </div>
      </div>
    {/*Summary cards*/ }
    {/*Monthly budget */}
    {/*Budget category */}


        </section>
    );
}