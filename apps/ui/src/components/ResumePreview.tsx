import React, { useState, useEffect, useCallback } from "react";
import { TypstDocument } from "@myriaddreamin/typst.react";
import { useResume } from "../contexts/ResumeContext";
import { useWasm } from "../hooks/useWasm";

export const ResumePreview: React.FC = () => {
  const { jsonString, renderTrigger } = useResume();
  const { renderTypst, isLoading: isWasmLoading } = useWasm();

  const [artifact, setArtifact] = useState<Uint8Array | undefined>(undefined);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderResume = useCallback(async () => {
    if (isWasmLoading) {
      setError("WASM is not ready yet.");
      return;
    }
    setIsRendering(true);
    setError(null);
    setArtifact(undefined);

    try {
      renderTypst(jsonString)
        .then(setArtifact)
        .catch((err) => {
          console.error("Failed to render document:", err);
          setError(err.message);
        });
    } catch (err: any) {
      console.error("Failed to render document:", err);
      setError(err.message || "An unknown error occurred during rendering.");
    } finally {
      setIsRendering(false);
    }
  }, [jsonString, renderTypst, isWasmLoading]);

  useEffect(() => {
    if (renderTrigger > 0) {
      renderResume();
    }
  }, [renderTrigger, renderResume]);

  if (error) {
    return <div>Error rendering resume: {error}</div>;
  }

  if (isRendering) {
    return <div>Rendering...</div>;
  }

  if (!artifact) {
    return <div>Click "Render" to see your resume preview.</div>;
  }

  return <TypstDocument fill="#ffffff" artifact={artifact} />;
};
