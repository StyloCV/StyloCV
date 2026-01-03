import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
  useCallback,
} from "react";
import type { PyodideInterface } from "pyodide";
import { loadPyodide, version as pyodideVersion } from "pyodide";
import * as typst from "@myriaddreamin/typst-ts-web-compiler";
import type { TypstCompiler } from "@myriaddreamin/typst-ts-web-compiler";

interface WasmContextType {
  pyodide: PyodideInterface | null;
  typstCompiler: TypstCompiler | null;
  isLoading: boolean;
  error: Error | null;
  renderTypst: (jsonData: string) => Promise<string | Uint8Array | undefined>;
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

export const WasmContext = createContext<WasmContextType>({
  pyodide: null,
  typstCompiler: null,
  isLoading: true,
  error: null,
  renderTypst: async () => undefined,
});

interface WasmProviderProps {
  children: ReactNode;
}

export const WasmProvider: React.FC<WasmProviderProps> = ({ children }) => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [typstCompiler, setTypstCompiler] = useState<TypstCompiler | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initStarted = useRef(false);

  useEffect(() => {
    if (initStarted.current) {
      return;
    }
    initStarted.current = true;

    const initialize = async () => {
      try {
        // Initialize Pyodide
        await loadScript("/pyodide/pyodide.js");
        const pyodideInstance = await loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
        });
        await pyodideInstance.loadPackage("micropip");
        const micropip = pyodideInstance.pyimport("micropip");
        await micropip.install(["pydantic", "jinja2", "pyodide-http"]);
        const response = await fetch("/wheels/manifest.json");
        const manifest = await response.json();
        const wheelFilename = manifest.wheelFile;
        await micropip.install(`/wheels/${wheelFilename}`);
        setPyodide(pyodideInstance);
        console.log("Pyodide and cv_model loaded successfully.");

        // Initialize Typst
        const compiler = await typst.createCompiler();
        await compiler.init({
          getModule: () => "/typst-compiler/typst_ts_web_compiler_bg.wasm",
        });
        setTypstCompiler(compiler);
        console.log("Typst compiler loaded successfully.");
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(
            new Error("An unknown error occurred during WASM initialization."),
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const renderTypst = useCallback(
    async (jsonData: string) => {
      if (!pyodide || !typstCompiler) {
        console.error("Pyodide or Typst not initialized");
        return;
      }

      console.log("Generating Typst script from JSON...");
      const cvModel = pyodide.pyimport("cv_model");
      const render = cvModel.get("_render");
      const models = cvModel.get("_models");

      const resumeModel = models.Resume.model_validate_json(jsonData);
      const typstScript = render.generate(resumeModel, null, "typ");

      console.log("Compiling Typst script...");
      const artifact = await typstCompiler.compile({
        mainContent: typstScript,
      });

      console.log("Typst compilation successful.");
      return artifact;
    },
    [pyodide, typstCompiler],
  );

  const value = { pyodide, typstCompiler, isLoading, error, renderTypst };

  if (isLoading) {
    return <div>Loading WASM runtimes...</div>;
  }

  if (error) {
    return <div>Error initializing WASM runtimes: {error.message}</div>;
  }

  return <WasmContext.Provider value={value}>{children}</WasmContext.Provider>;
};
