

export type Transaction =
 {
    id: number;
    name: string;
    description: string | null;
    amount: number;
    frequency: string;
    transaction_date: string;
    next_due_date: string | null;
    categories: {
        name: string;
        transaction_type: string;
        };
 };