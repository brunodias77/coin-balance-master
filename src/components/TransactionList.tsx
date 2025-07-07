
import React from 'react';
import { Transaction } from '../types/finance';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  title: string;
  emptyMessage: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDelete, 
  title, 
  emptyMessage 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return 'text-green-600 bg-green-50 border-green-200';
      case 'fixed-expense': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'variable-expense': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return 'Receita';
      case 'fixed-expense': return 'Gasto Fixo';
      case 'variable-expense': return 'Gasto Variável';
      default: return type;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="finance-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="finance-card">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{transactions.length} transação(ões)</p>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.type)}`}>
                    {getTypeLabel(transaction.type)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
