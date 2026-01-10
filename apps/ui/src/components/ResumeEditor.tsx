import { Textarea } from "@/components/ui/textarea";
import { useResume } from "../contexts/ResumeContext";

export function ResumeEditor() {
  const { jsonString, setJsonString } = useResume();

  return (
    <Textarea
      value={jsonString}
      onChange={(e) => setJsonString(e.target.value)}
      className="h-full w-full resize-none font-mono border-0 focus:ring-0"
      placeholder="Paste your resume JSON here..."
    />
  );
}
