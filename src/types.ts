export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  id_user: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}
