import React, { useState, useEffect } from "react";
// import { TypstDocument } from "@myriaddreamin/typst.react";
import { useWasm } from "../hooks/useWasm.tsx";

// A sample JSON data for testing
const sampleJsonData = JSON.stringify(
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    linkedin: "johndoe",
    github: "johndoe",
    website: "johndoe.com",
    location: "New York, USA",
    education: [
      {
        institution: "University of Example",
        degree: "Bachelor of Science in Computer Science",
        start_date: "2018-09-01",
        end_date: "2022-06-01",
        highlights: ["Graduated with honors", "Dean's List for 4 semesters"],
      },
    ],
    experience: [
      {
        company: "Tech Corp",
        position: "Software Engineer",
        start_date: "2022-07-01",
        end_date: null,
        highlights: [
          "Developed and maintained web applications using React and Node.js.",
          "Collaborated with cross-functional teams to deliver high-quality software.",
        ],
      },
    ],
    skills: [
      {
        category: "Programming Languages",
        items: ["JavaScript", "TypeScript", "Python"],
      },
      {
        category: "Frameworks",
        items: ["React", "Node.js", "Express"],
      },
    ],
    projects: [],
    custom_sections: [],
  },
  null,
  2,
);

export const ResumePreview: React.FC = () => {
  const { renderTypst, isLoading } = useWasm();
  const [artifact, setArtifact] = useState<string | Uint8Array | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      renderTypst(sampleJsonData)
        .then(setArtifact)
        .catch((err) => {
          console.error("Failed to render document:", err);
          setError(err.message);
        });
    }
  }, [isLoading, renderTypst]);

  if (error) {
    return <div>Error rendering resume: {error}</div>;
  }

  if (!artifact) {
    return <div>Generating resume preview...</div>;
  }

  return <div>Done!</div>;
  {
    /* return <TypstDocument artifact={artifact} />; */
  }
};
