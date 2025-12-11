import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// A default resume JSON to pre-populate the textarea
const defaultResumeJson = `{
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "image": "",
    "email": "john@gmail.com",
    "phone": "(912) 555-4321",
    "url": "https://johndoe.com",
    "summary": "A summary of John Doe…",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "https://twitter.com/john"
    }]
  },
  "work": [{
    "name": "Company",
    "position": "President",
    "url": "https://company.com",
    "startDate": "2013-01-01",
    "endDate": "2014-01-01",
    "summary": "Description…",
    "highlights": [
      "Started the company"
    ]
  }],
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "url": "https://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description…",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "education": [{
    "institution": "University",
    "url": "https://institution.com/",
    "area": "Software Development",
    "studyType": "Bachelor",
    "startDate": "2011-01-01",
    "endDate": "2013-01-01",
    "score": "4.0",
    "courses": [
      "DB1101 - Basic SQL"
    ]
  }],
  "awards": [{
    "title": "Award",
    "date": "2014-11-01",
    "awarder": "Company",
    "summary": "There is no spoon."
  }],
  "certificates": [{
    "name": "Certificate",
    "date": "2021-11-07",
    "issuer": "Company",
    "url": "https://certificate.com"
  }],
  "publications": [{
    "name": "Publication",
    "publisher": "Company",
    "releaseDate": "2014-10-01",
    "url": "https://publication.com",
    "summary": "Description…"
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }],
  "languages": [{
    "language": "English",
    "fluency": "Native speaker"
  }],
  "interests": [{
    "name": "Wildlife",
    "keywords": [
      "Ferrets",
      "Unicorns"
    ]
  }],
  "references": [{
    "name": "Jane Doe",
    "reference": "Reference…"
  }],
  "projects": [{
    "name": "Project",
    "startDate": "2019-01-01",
    "endDate": "2021-01-01",
    "description": "Description...",
    "highlights": [
      "Won award at AIHacks 2016"
    ],
    "url": "https://project.com/"
  }]
}
`;

export function ResumeEditor() {
  const [jsonText, setJsonText] = useState<string>(defaultResumeJson);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRender = async () => {
    setError(null);
    let resumeData;

    // 1. Validate and parse the JSON
    try {
      resumeData = JSON.parse(jsonText);
    } catch (e: unknown) {
      let message = "An unknown error occurred.";
      if (
        e &&
        typeof e === "object" &&
        "message" in e &&
        typeof (e as any).message === "string"
      ) {
        message = (e as { message: string }).message;
      }
      setError(`Failed to render PDF: ${message}`);
    }

    // 2. Make the API call
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      if (!apiBaseUrl) {
        setError(
          "API URL is not configured. Please set VITE_API_URL in your environment.",
        );
        setPdfUrl(null);
        return;
      }
      const response = await fetch(`${apiBaseUrl}/api/v1/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // 3. Get the PDF blob from the response
      const pdfBlob = await response.blob();

      // 4. Create a temporary URL for the blob
      const newPdfUrl = URL.createObjectURL(pdfBlob);

      // Revoke the old URL to free up memory
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // 5. Update the state to display the new PDF
      setPdfUrl(newPdfUrl);
    } catch (e: any) {
      setError(`Failed to render PDF: ${e.message}`);
      setPdfUrl(null);
    }
  };

  return (
    <div className="grid h-screen w-full grid-cols-2 gap-4 p-4">
      {/* Left Panel: Editor */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Resume JSON</h2>
          <Button onClick={handleRender}>Render PDF</Button>
        </div>
        <Textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="h-full w-full resize-none font-mono"
          placeholder="Paste your resume JSON here..."
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Right Panel: Preview */}
      <div className="flex flex-col">
        <h2 className="mb-4 text-2xl font-bold">Preview</h2>
        <div className="flex-1 rounded-md border">
          {pdfUrl ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              className="h-full w-full"
            >
              <p>
                Your browser does not support PDF previews. You can{" "}
                <a href={pdfUrl}>download the PDF</a> instead.
              </p>
            </object>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Click "Render PDF" to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
