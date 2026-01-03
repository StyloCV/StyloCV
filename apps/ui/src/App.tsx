import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { WasmProvider } from "@/contexts/WasmContext";

function App() {
  return (
    <WasmProvider>
      <main className="grid grid-cols-2 h-screen">
        <div className="col-span-1 p-4">
          <ResumeEditor />
        </div>
        <div className="col-span-1 p-4 bg-gray-100">
          <ResumePreview />
        </div>
      </main>
    </WasmProvider>
  );
}

export default App;
