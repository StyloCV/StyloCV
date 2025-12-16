import { ResumeEditor } from "@/components/ResumeEditor";
import { usePyodide } from "@/hooks/usePyodide";

function App() {
  const { pyodide, isLoading, error } = usePyodide();

  if (isLoading) {
    return <div>Loading Pyodide...</div>;
  }

  if (error) {
    return <div>Error loading Pyodide: {error.message}</div>;
  }

  return (
    <main>
      <ResumeEditor />
    </main>
  );
}

export default App;
