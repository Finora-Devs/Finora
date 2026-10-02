// UI sample data. Replace with backend data when integration is ready.
export const incomeEntries = [
  { id: "1", name: "Paycheck", category: "Employment", date: "Sep 22, 2026", frequency: "Biweekly", amount: 587.5 },
  { id: "2", name: "Paycheck", category: "Employment", date: "Sep 8, 2026", frequency: "Biweekly", amount: 612.5 },
  { id: "3", name: "Fall Scholarship", category: "Scholarships", date: "Sep 5, 2026", frequency: "Semesterly", amount: 300 },
  { id: "4", name: "Financial Aid Refund", category: "Financial Aid", date: "Sep 3, 2026", frequency: "Just Once", amount: 200 },
  { id: "5", name: "Family Support", category: "Family Support", date: "Sep 2, 2026", frequency: "Monthly", amount: 100 },
  { id: "6", name: "Side Gig (Tutoring)", category: "Side Hustle", date: "Sep 2, 2026", frequency: "Weekly", amount: 100 },
  { id: "7", name: "Purchase Refund", category: "Refunds", date: "Sep 1, 2026", frequency: "Just Once", amount: 50 },
  { id: "8", name: "Birthday Gift", category: "Other", date: "Sep 1, 2026", frequency: "Just Once", amount: 50 },
];
export const incomeCategories = [
  { name: "Employment", color: "#5794f6" },
  { name: "Scholarships", color: "#ffce32" },
  { name: "Financial Aid", color: "#b36af5" },
  { name: "Family Support", color: "#ff7b96" },
  { name: "Side Hustle", color: "#48c4ac" },
  { name: "Refunds", color: "#7437ed" },
  { name: "Other", color: "#b978d9" },
];
export const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
export const lastMonthIncome = 1700;
export function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
