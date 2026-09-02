import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoDashboard from "./TodoDashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoDashboard userId={1} />
    </QueryClientProvider>
  );
};

export default App;
