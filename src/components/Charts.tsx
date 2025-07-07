
import React from 'react';
import { Transaction } from '../types/finance';

interface ChartsProps {
  transactions: Transaction[];
}

const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  const getTotalByType = (type: Transaction['type']) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = getTotalByType('income');
  const totalFixed = getTotalByType('fixed-expense');
  const totalVariable = getTotalByType('variable-expense');
  const total = totalIncome + totalFixed + totalVariable;

  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const getCategoryData = () => {
    const categories = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          name: transaction.category,
          value: 0,
          type: transaction.type
        };
      }
      acc[transaction.category].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; type: Transaction['type'] }>);

    return Object.values(categories).sort((a, b) => b.value - a.value);
  };

  const categoryData = getCategoryData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Gráfico de Pizza - Visão Geral */}
      <div className="finance-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição Geral</h3>
        <div className="relative">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              
              {/* Receitas */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${getPercentage(totalIncome)}, 100`}
              />
              
              {/* Gastos Fixos */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray={`${getPercentage(totalFixed)}, 100`}
                strokeDashoffset={-getPercentage(totalIncome)}
              />
              
              {/* Gastos Variáveis */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray={`${getPercentage(totalVariable)}, 100`}
                strokeDashoffset={-(getPercentage(totalIncome) + getPercentage(totalFixed))}
              />
            </svg>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Receitas</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(totalIncome)} ({getPercentage(totalIncome).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Gastos Fixos</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(totalFixed)} ({getPercentage(totalFixed).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Gastos Variáveis</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(totalVariable)} ({getPercentage(totalVariable).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categorias */}
      <div className="finance-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Categorias</h3>
        {categoryData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryData.slice(0, 8).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">
                      {category.type === 'income' ? 'Receita' : 
                       category.type === 'fixed-expense' ? 'Gasto Fixo' : 'Gasto Variável'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    category.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(category.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
