import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: "low" | "high";
}

export default function TodoDashboard({ userId }: { userId: number }) {
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const {
    data: todos = [],
    isPending,
    isError,
  } = useQuery<Todo[]>({
    queryKey: ["todos", userId],
    queryFn: () => fetch(`/api/todos?user=${userId}`).then((r) => r.json()),
  });

  const { active, done, highPriority } = todos.reduce(
    (acc, t) => {
      t.done ? acc.done.push(t) : acc.active.push(t);
      if (t.priority === "high") acc.highPriority.push(t);
      return acc;
    },
    { active: [] as Todo[], done: [] as Todo[], highPriority: [] as Todo[] },
  );

  const visibleTodos =
    filter === "active" ? active : filter === "done" ? done : todos;

  return (
    <div className="dashboard">
      <header>
        <h1>Tarefas</h1>
        {todos.length > 0 && <span className="badge">{todos.length}</span>}
      </header>

      <div className="filters">
        <button onClick={() => setFilter("all")}>Todas</button>
        <button onClick={() => setFilter("active")}>
          Ativas ({active.length})
        </button>
        <button onClick={() => setFilter("done")}>
          Concluídas ({done.length})
        </button>
      </div>

      {isPending ? (
        <p>A carregar...</p>
      ) : isError ? (
        <p>Erro ao carregar tarefas.</p>
      ) : todos.length === 0 ? (
        <p>Ainda não tens tarefas.</p>
      ) : (
        <ul>
          {visibleTodos.map((todo) => {
            const isHigh = todo.priority === "high";
            return (
              <li key={todo.id}>
                <span
                  style={{
                    color: isHigh ? "#c0392b" : "#333",
                    fontWeight: isHigh ? 700 : 400,
                    textDecoration: todo.done ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
                {isHigh && <span className="flame">🔥</span>}
              </li>
            );
          })}
        </ul>
      )}

      <footer>
        <p>
          {done.length} de {todos.length} concluídas · {highPriority.length}{" "}
          urgentes
        </p>
      </footer>
    </div>
  );
}
