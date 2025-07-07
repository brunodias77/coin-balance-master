
import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import Header from '../components/Header';
import FinancialSummaryCard from '../components/FinancialSummaryCard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';

const Index = () => {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    getSummary, 
    getTransactionsByType 
  } = useFinance();
  
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'fixed' | 'variable' | 'charts'>('overview');

  const summary = getSummary();
  const incomeTransactions = getTransactionsByType('income');
  const fixedExpenseTransactions = getTransactionsByType('fixed-expense');
  const variableExpenseTransactions = getTransactionsByType('variable-expense');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'income', label: 'Receitas', icon: '💰' },
    { id: 'fixed', label: 'Gastos Fixos', icon: '🏠' },
    { id: 'variable', label: 'Gastos Variáveis', icon: '🛒' },
    { id: 'charts', label: 'Gráficos', icon: '📈' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <FinancialSummaryCard summary={summary} />

        {/* Navegação por Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Botão Adicionar Transação */}
          <button
            onClick={() => setShowForm(true)}
            className="finance-button flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Transação
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <TransactionList
                transactions={transactions.slice(0, 10)}
                onDelete={deleteTransaction}
                title="Transações Recentes"
                emptyMessage="Nenhuma transação encontrada. Adicione sua primeira transação!"
              />
              {transactions.length > 0 && <Charts transactions={transactions} />}
            </div>
          )}

          {activeTab === 'income' && (
            <TransactionList
              transactions={incomeTransactions}
              onDelete={deleteTransaction}
              title="Receitas"
              emptyMessage="Nenhuma receita cadastrada. Adicione suas fontes de renda!"
            />
          )}

          {activeTab === 'fixed' && (
            <TransactionList
              transactions={fixedExpenseTransactions}
              onDelete={deleteTransaction}
              title="Gastos Fixos"
              emptyMessage="Nenhum gasto fixo cadastrado. Adicione seus gastos mensais!"
            />
          )}

          {activeTab === 'variable' && (
            <TransactionList
              transactions={variableExpenseTransactions}
              onDelete={deleteTransaction}
              title="Gastos Variáveis"
              emptyMessage="Nenhum gasto variável cadastrado. Adicione seus gastos do dia a dia!"
            />
          )}

          {activeTab === 'charts' && <Charts transactions={transactions} />}
        </div>
      </main>

      {/* Modal do Formulário */}
      {showForm && (
        <TransactionForm
          onSubmit={(transaction) => {
            addTransaction(transaction);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
