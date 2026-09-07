/**
 * EXERCÍCIO DE CODE REVIEW
 *
 * Este componente funciona (mais coisas menos outras), mas está longe de
 * production-ready. Faz-lhe um code review como farias a um PR de um colega:
 *   - bugs de comportamento
 *   - anti-patterns de React
 *   - código que pode ser otimizado / simplificado
 *
 * Para cada ponto, explica O QUE está mal e COMO o mudarias.
 */

import { useEffect, useState } from 'react';

type ExpenseStatus = 'pending' | 'approved';

interface Expense {
  id: number;
  description: string;
  amount: number;
  status: ExpenseStatus;
  overBudget: boolean;
  hasReceipt: boolean;
}

interface Props {
  teamId: number;
}

const FILTERS: { key: 'all' | ExpenseStatus; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'approved', label: 'Aprovadas' },
];

function fetchExpenses(teamId: number) {
  return fetch(`/api/expenses?team=${teamId}`).then((r) => r.json());
}

export default function ExpenseReviewPanel({ teamId }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<'all' | ExpenseStatus>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchExpenses(teamId).then((data) => {
      setExpenses(data);
      setIsLoading(false);
    });
  }, []);

  // Guarda quantas despesas ainda aguardam aprovação
  const [pendingSummary, setPendingSummary] = useState(0);
  useEffect(() => {
    setPendingSummary(expenses.filter((e) => e.status === 'pending').length);
  }, [expenses]);

  const pendingExpenses = expenses.filter((e) => e.status === 'pending');
  const approvedExpenses = expenses.filter((e) => e.status === 'approved');
  const overBudgetExpenses = expenses.filter((e) => e.overBudget);

  function visibleExpenses() {
    if (filter === 'pending') return pendingExpenses;
    if (filter === 'approved') return approvedExpenses;
    return expenses;
  }

  const countByFilter = {
    all: expenses.length,
    pending: pendingExpenses.length,
    approved: approvedExpenses.length,
  };

  return (
    <div className="review-layout">
      <aside className="review-sidebar">
        <h2>Despesas {expenses.length && `(${expenses.length})`}</h2>
        <p>{pendingSummary} por aprovar</p>
        <nav>
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}>
              {f.label} · {countByFilter[f.key]}
            </button>
          ))}
        </nav>
        <p className="attention">{overBudgetExpenses.length} acima do limite</p>
      </aside>

      <main className="review-list">
        {isLoading ? (
          <p>A carregar...</p>
        ) : expenses.length === 0 ? (
          <p>Sem despesas submetidas.</p>
        ) : (
          visibleExpenses().map((expense, index) => (
            <article key={index} style={{ opacity: expense.status === 'approved' ? 0.5 : 1 }}>
              <h3>{expense.description}</h3>
              <p>
                {expense.amount}€
                {expense.overBudget ? ' — acima do limite' : ''}
              </p>
              <p title={expense.overBudget ? 'Requer aprovação extra' : 'Dentro do limite'}>
                {expense.overBudget ? '⚠️ Fora do orçamento' : 'Dentro do orçamento'}
              </p>
              {!expense.hasReceipt ? <span className="warn">Falta recibo</span> : null}
            </article>
          ))
        )}
      </main>
    </div>
  );
}
