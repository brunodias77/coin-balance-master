
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'fixed-expense' | 'variable-expense';
}

export interface FinancialSummary {
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'fixed-expense' | 'variable-expense';
  color: string;
}
