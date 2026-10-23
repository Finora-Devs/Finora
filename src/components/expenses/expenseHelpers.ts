
export type ExpenseRecord = {
  id: string | number;
  name: string;
  amount: number;
  transaction_date: string;
  frequency: string;
  description?: string | null;
  categories: { name: string; transaction_type: string };
};

export const expenseCategories = [
  { name: "Food", value: "food", color: "#ff8963" },
  { name: "Housing", value: "housing", color: "#5794f6" },
  { name: "Transportation", value: "transportation", color: "#ffce32" },
  { name: "Tuition", value: "tuition", color: "#48c4ac" },
  { name: "Entertainment", value: "entertainment", color: "#c65be3" },
  { name: "Utilities", value: "utilities", color: "#7b6be8" },
  { name: "Subscriptions", value: "subscriptions", color: "#7437ed" },
  { name: "Other", value: "other", color: "#b978d9" },
] as const;


export const expenseFrequencies = [
  { value: "once", label: "Just Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export type SortField = "date" | "name" | "amount" | "category" | "frequency";
export type ExpenseDraft = {
  name: string;
  amount: string;
  date: string;
  category: string;
  frequency: string;
  description: string;
};
export type ExpenseErrors = Partial<Record<keyof ExpenseDraft, string>>;
export const emptyExpenseDraft: ExpenseDraft = {
  name: "",
  amount: "",
  date: "",
  category: "",
  frequency: "once",
  description: "",
};
export const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });
export function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
export function previousMonth(month: string) {
  const [year, number] = month.split("-").map(Number);
  return number === 1
    ? `${year - 1}-12`
    : `${year}-${String(number - 1).padStart(2, "0")}`;
}
export function monthLabel(month: string) {
  const [year, number] = month.split("-").map(Number);
  return new Date(year, number - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
export function normalizeDate(value: string) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/.exec(value);
  if (!match) return "";
  const normalized = `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  const date = new Date(`${normalized}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === normalized
    ? normalized
    : "";
}
export function displayDate(value: string) {
  const date = normalizeDate(value);
  if (!date) return value;
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export function categoryKey(name: string) {
  const normalized = name.trim().toLowerCase();
  return (
    expenseCategories.find((category) => category.value === normalized)
      ?.value ?? "other"
  );
}
export function expensesInMonth(records: ExpenseRecord[], month: string) {
  return records.filter(
    (record) =>
      record.categories.transaction_type === "expense" &&
      normalizeDate(record.transaction_date).slice(0, 7) === month,
  );
}
export function categoryBreakdown(records: ExpenseRecord[]) {
  return expenseCategories.map((category) => ({
    ...category,
    amount: records
      .filter(
        (record) => categoryKey(record.categories.name) === category.value,
      )
      .reduce((sum, record) => sum + record.amount, 0),
  }));
}
const frequencyRank: Record<string, number> = {
  yearly: 7,
  annually: 7,
  semesterly: 6,
  monthly: 5,
  biweekly: 4,
  weekly: 3,
  daily: 2,
  once: 1,
  "just once": 1,
};
const textCompare = (a: string, b: string) =>
  a.localeCompare(b, "en-US", { sensitivity: "base" });
function compare(a: ExpenseRecord, b: ExpenseRecord, field: SortField): number {
  switch (field) {
    case "date":
      return textCompare(
        normalizeDate(b.transaction_date),
        normalizeDate(a.transaction_date),
      );
    case "amount":
      return b.amount - a.amount;
    case "name":
      return textCompare(a.name, b.name);
    case "category":
      return textCompare(a.categories.name, b.categories.name);
    case "frequency":
      return (
        (frequencyRank[b.frequency.toLowerCase()] ?? 0) -
        (frequencyRank[a.frequency.toLowerCase()] ?? 0)
      );
  }
}
export function visibleExpenses(
  records: ExpenseRecord[],
  search: string,
  selectedCategory: string,
  include: boolean,
  field: SortField,
  reversed: boolean,
) {
  const term = search.trim().toLowerCase();
  
  return records
    .filter((record) => {
      if (record.categories.transaction_type !== "expense") return false;
      if (
        term &&
        ![
          record.name,
          record.categories.name,
          record.frequency,
          record.transaction_date,
          String(record.amount),
        ].some((value) => value.toLowerCase().includes(term))
      )
        return false;
      if (selectedCategory === "all") return true;
      const matches = categoryKey(record.categories.name) === selectedCategory;
      return include ? matches : !matches;
    })
    .sort((a, b) => {
      const primary = compare(a, b, field);
      if (primary) return reversed ? -primary : primary;
   
      for (const fallback of [
        "date",
        "category",
        "name",
        "amount",
        "frequency",
      ] as const) {
        if (fallback === field) continue;
        const result = compare(a, b, fallback);
        if (result) return result;
      }
      return textCompare(String(a.id), String(b.id));
    });
}
export function validateExpense(draft: ExpenseDraft): ExpenseErrors {
  const errors: ExpenseErrors = {};
  if (!draft.name.trim()) errors.name = "Enter an expense name or payee.";
  else if (draft.name.trim().length > 100)
    errors.name = "Use 100 characters or fewer.";
  const amount = draft.amount.trim();
  if (
    !/^\d+(\.\d{1,2})?$/.test(amount) ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0 ||
    Number(amount) > 999999999.99
  )
    errors.amount =
      "Enter an amount greater than zero, with up to two decimal places.";
  if (!draft.date || normalizeDate(draft.date) !== draft.date)
    errors.date = "Select a valid date.";
  if (!expenseCategories.some((category) => category.value === draft.category))
    errors.category = "Select an expense category.";
  if (
    !expenseFrequencies.some((frequency) => frequency.value === draft.frequency)
  )
    errors.frequency = "Select a frequency.";
  if (draft.description.length > 500)
    errors.description = "Use 500 characters or fewer.";
  return errors;
}
