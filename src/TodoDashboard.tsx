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

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: 'low' | 'high';
}

interface Props {
  userId: number;
}

export default function TodoDashboard({ userId }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [loading, setLoading] = useState(false);

  // Mantém o número de tarefas concluídas
  const [doneCount, setDoneCount] = useState(0);
  useEffect(() => {
    setDoneCount(todos.filter((t) => t.done).length);
  }, [todos]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/todos?user=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  const activeTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);
  const highPriority = todos.filter((t) => t.priority === 'high');

  const getVisibleTodos = () => {
    if (filter === 'active') return activeTodos;
    if (filter === 'done') return doneTodos;
    return todos;
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Tarefas</h1>
        {todos.length && <span className="badge">{todos.length}</span>}
      </header>

      <div className="filters">
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('active')}>Ativas ({activeTodos.length})</button>
        <button onClick={() => setFilter('done')}>Concluídas ({doneTodos.length})</button>
      </div>

      {loading ? (
        <p>A carregar...</p>
      ) : todos.length === 0 ? (
        <p>Ainda não tens tarefas.</p>
      ) : (
        <ul>
          {getVisibleTodos().map((todo, index) => (
            <li key={index}>
              <span
                style={{
                  color: todo.priority === 'high' ? '#c0392b' : '#333',
                  fontWeight: todo.priority === 'high' ? 700 : 400,
                  textDecoration: todo.done ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </span>
              {todo.priority === 'high' ? <span className="flame">🔥</span> : null}
            </li>
          ))}
        </ul>
      )}

      <footer>
        <p>
          {doneCount} de {todos.length} concluídas · {highPriority.length} urgentes
        </p>
      </footer>
    </div>
  );
}
