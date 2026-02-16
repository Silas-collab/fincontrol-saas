import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TransactionModal } from '../modals/TransactionModal';
import { TransferModal } from '../modals/TransferModal';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar 
        onAddIncome={() => setShowIncomeModal(true)}
        onAddExpense={() => setShowExpenseModal(true)}
        onAddTransfer={() => setShowTransferModal(true)}
      />

      <main className="ml-64 min-h-screen transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Modais de Transação */}
      <TransactionModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        type="INCOME"
      />

      <TransactionModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        type="EXPENSE"
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </div>
  );
}
