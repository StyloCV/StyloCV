import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WasmProvider } from "./contexts/WasmContext.tsx";
import { TypstDocument } from "@myriaddreamin/typst.react";

TypstDocument.setWasmModuleInitOptions({
  beforeBuild: [],
  getModule: () => "/typst-renderer/typst_ts_renderer_bg.wasm",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WasmProvider>
      <App />
    </WasmProvider>
  </StrictMode>,
);
