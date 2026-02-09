export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

// Invoice Types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
}

// Brief Types
export interface DesignBrief {
  clientName: string;
  projectName: string;
  objective: string;
  targetAudience: string;
  toneAndStyle: string;
  deadline: string;
}