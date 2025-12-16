import { useState, useEffect } from "react";
import type { PyodideInterface } from "pyodide";

// By declaring this global, we tell TypeScript that the `window` object
// will have a `loadPyodide` function, which is loaded from the script tag.
declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

// This promise ensures that we only try to load and initialize Pyodide once.
const pyodidePromise = new Promise<PyodideInterface>((resolve, reject) => {
  const script = document.createElement("script");
  // The vite-plugin-static-copy ensures this file is available at the root.
  script.src = "/pyodide/pyodide.js";
  script.async = true;

  script.onload = () => {
    // `loadPyodide` is now available on the window object.
    window
      .loadPyodide({
        // This is the base URL for Pyodide to find its packages and other files.
        indexURL: "/pyodide/",
      })
      .then((pyodideInstance) => {
        console.log("Pyodide loaded. Now loading packages...");
        return pyodideInstance.loadPackage(["pydantic", "jinja2"]).then(() => {
          console.log("Python packages loaded successfully.");
          return pyodideInstance;
        });
      })
      .then(resolve)
      .catch(reject);
  };

  script.onerror = () => {
    reject(new Error("Failed to load the Pyodide script."));
  };

  document.body.appendChild(script);
});

/**
 * A custom hook to initialize and use the Pyodide runtime.
 */
export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // This effect runs only once on component mount.
    pyodidePromise
      .then((pyodideInstance) => {
        setPyodide(pyodideInstance);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { pyodide, isLoading, error };
};
