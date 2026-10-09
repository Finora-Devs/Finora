import { ArrowUpRight, BriefcaseBusiness, GraduationCap, Wallet } from "lucide-react";
import IncomeList from "./IncomeList";
import IncomeBySource from "./IncomeBySource";
import { formatMoney, incomeEntries, lastMonthIncome, totalIncome } from "./incomeData";

const jobIncome = incomeEntries.filter((entry) => entry.category === "Employment").reduce((sum, entry) => sum + entry.amount, 0);
const studentAid = incomeEntries.filter((entry) => entry.category === "Scholarships" || entry.category === "Financial Aid").reduce((sum, entry) => sum + entry.amount, 0);
const summaryCards = [
  { label: "Total Income", value: totalIncome, note: "September 2026", icon: Wallet, color: "text-[#16834b]", background: "bg-[#e5f3ec]" },
  { label: "Job Income", value: jobIncome, note: "September 2026", icon: BriefcaseBusiness, color: "text-[#3173c9]", background: "bg-[#e8f1ff]" },
  { label: "Financial Aid / Scholarships", value: studentAid, note: "September 2026", icon: GraduationCap, color: "text-[#c68a00]", background: "bg-[#fff5d9]" },
  { label: "Last Month’s Income", value: lastMonthIncome, note: "August 2026", icon: ArrowUpRight, color: "text-[#8246c8]", background: "bg-[#f0e7fc]" },
];

export default function IncomePage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#123c35]">Income</h1>
          <p className="mt-2 text-sm text-[#4e7069]">View and manage all of your income sources.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-[#dce7e2] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#4e7069]">{card.label}</p>
                  <p className="mt-3 text-2xl font-bold text-[#17324d]">{formatMoney(card.value)}</p>
                  <p className="mt-2 text-xs text-[#7185a1]">{card.note}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.background}`}>
                  <Icon aria-hidden="true" className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="min-w-0"><IncomeList /></div>
        <IncomeBySource />
      </div>
    </section>
  );
}
