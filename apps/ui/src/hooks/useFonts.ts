import { useState, useEffect } from "react";

// The hook now returns an array of objects, where each object contains the font data.
// This is the format expected by the WasmContext.
type FontData = { data: ArrayBuffer };

const useFonts = () => {
  const [fonts, setFonts] = useState<FontData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // The manifest is now a simple array of strings (font paths).
        const response = await fetch("/fonts/manifest.json");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch font manifest: ${response.status} ${response.statusText}`,
          );
        }
        const fontPaths: string[] = await response.json();

        // Fetch each font file and get its ArrayBuffer.
        const loadedFonts = await Promise.all(
          fontPaths.map(async (path) => {
            const fontResponse = await fetch(path);
            if (!fontResponse.ok) {
              throw new Error(`Failed to fetch font at ${path}`);
            }
            const fontData = await fontResponse.arrayBuffer();
            return { data: fontData };
          }),
        );

        setFonts(loadedFonts);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred while loading fonts."));
        }
      } finally {
        setLoading(false);
      }
    };

    loadFonts();
  }, []);

  return { fonts, loading, error };
};

export default useFonts;
