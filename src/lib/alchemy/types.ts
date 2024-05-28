export interface Transaction {
    date: string;
    id: string;
    amount: number | null;
    from: string;
    to: string | null;
    status: string;
  }