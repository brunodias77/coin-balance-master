
import { useState, useEffect } from 'react';
import { Transaction, FinancialSummary } from '../types/finance';

const STORAGE_KEY = 'finance-app-data';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const getSummary = (): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalFixedExpenses = transactions
      .filter(t => t.type === 'fixed-expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalVariableExpenses = transactions
      .filter(t => t.type === 'variable-expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalFixedExpenses - totalVariableExpenses;

    return {
      totalIncome,
      totalFixedExpenses,
      totalVariableExpenses,
      balance
    };
  };

  const getTransactionsByType = (type: Transaction['type']) => {
    return transactions.filter(t => t.type === type);
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getSummary,
    getTransactionsByType
  };
};
