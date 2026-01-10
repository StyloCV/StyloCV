import { ResumeEditor } from "./components/ResumeEditor";
import { ResumePreview } from "./components/ResumePreview";
import { ResumeProvider, useResume } from "./contexts/ResumeContext";
import { Button } from "@/components/ui/button";

function AppContent() {
  const { triggerRender } = useResume();

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-800">StyloCV</h1>
        <Button onClick={triggerRender}>Render</Button>
      </header>
      <main className="grow grid grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
          <h2 className="p-4 text-lg font-semibold border-b text-gray-700">
            Editor
          </h2>
          <div className="grow p-4 overflow-auto">
            <ResumeEditor />
          </div>
        </div>
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
          <h2 className="p-4 text-lg font-semibold border-b text-gray-700">
            Preview
          </h2>
          <div className="grow p-4 overflow-auto">
            <ResumePreview />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}

export default App;
