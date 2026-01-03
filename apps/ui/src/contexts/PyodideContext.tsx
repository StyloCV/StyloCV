import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
} from "react";
import type { PyodideInterface } from "pyodide";
import { loadPyodide, version as pyodideVersion } from "pyodide";

interface PyodideContextType {
  pyodide: PyodideInterface | null;
  isLoading: boolean;
  error: Error | null;
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

export const PyodideContext = createContext<PyodideContextType>({
  pyodide: null,
  isLoading: true,
  error: null,
});

interface PyodideProviderProps {
  children: ReactNode;
}

export const PyodideProvider: React.FC<PyodideProviderProps> = ({
  children,
}) => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initStarted = useRef(false);

  useEffect(() => {
    if (initStarted.current) {
      return;
    }
    initStarted.current = true;

    const initializePyodide = async () => {
      try {
        await loadScript("/pyodide/pyodide.js");
        const pyodideInstance = await loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
        });

        await pyodideInstance.loadPackage("micropip");
        const micropip = pyodideInstance.pyimport("micropip");
        await micropip.install(["pydantic", "jinja2", "pyodide-http"]);

        // Find the wheel file and install it
        const response = await fetch("/wheels/manifest.json");
        const manifest = await response.json();
        const wheelFilename = manifest.wheelFile;
        await micropip.install(`/wheels/${wheelFilename}`);
        setPyodide(pyodideInstance);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(
            new Error(
              "An unknown error occurred during Pyodide initialization.",
            ),
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializePyodide();
  }, []);

  const value = { pyodide, isLoading, error };

  if (isLoading) {
    return <div>Loading Pyodide runtime...</div>;
  }

  if (error) {
    return <div>Error initializing Pyodide: {error.message}</div>;
  }

  return (
    <PyodideContext.Provider value={value}>{children}</PyodideContext.Provider>
  );
};
