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
import {
  createTypstCompiler,
  type TypstCompiler,
  createTypstFontBuilder,
} from "@myriaddreamin/typst.ts/compiler";
import typstWasm from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url";
import useFonts from "../hooks/useFonts";

interface WasmContextType {
  pyodide: PyodideInterface | null;
  typstCompiler: TypstCompiler | null;
  isLoading: boolean;
  error: Error | null;
  renderTypst: (jsonData: string) => Promise<Uint8Array | undefined>;
}

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
  const { fonts, loading: fontsLoading, error: fontsError } = useFonts();

  useEffect(() => {
    if (initStarted.current || fontsLoading) {
      return;
    }
    initStarted.current = true;

    const initialize = async () => {
      try {
        // Initialize Pyodide
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

        // Initialize Typst
        const compiler = await createTypstCompiler();
        await compiler.init({
          getModule: () => typstWasm,
        });
        const fontBuilder = await createTypstFontBuilder();
        await fontBuilder.init();
        for (const font of fonts) {
          await fontBuilder.addFontData(new Uint8Array(font.data));
        }
        await fontBuilder.build(async (fontResolver) => {
          compiler.setFonts(fontResolver);
        });
        setTypstCompiler(compiler);
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
  }, [fonts, fontsLoading]);

  const renderTypst = useCallback(
    async (jsonData: string) => {
      if (!pyodide || !typstCompiler) {
        console.error("Pyodide or Typst not initialized");
        return;
      }

      const cvModel = pyodide.pyimport("cv_model");
      const typstScript = cvModel.generate_typ_fm_model(jsonData);
      typstCompiler.addSource("/main.typ", typstScript);
      const artifact = await typstCompiler.compile({
        mainFilePath: "/main.typ",
      });

      if (artifact.result === undefined) {
        console.error(
          "Typst compilation failed. Diagnostics:",
          artifact.diagnostics,
        );
      }
      typstCompiler.reset();
      return artifact.result;
    },
    [pyodide, typstCompiler],
  );

  const value = { pyodide, typstCompiler, isLoading, error, renderTypst };

  if (isLoading || fontsLoading) {
    return <div>Loading WASM runtimes and fonts...</div>;
  }

  const combinedError = error || fontsError;
  if (combinedError) {
    return <div>Error initializing WASM runtimes: {combinedError.message}</div>;
  }

  return <WasmContext.Provider value={value}>{children}</WasmContext.Provider>;
};
