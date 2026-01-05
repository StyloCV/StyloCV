import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

interface ResumeContextType {
  jsonString: string;
  setJsonString: (json: string) => void;
  renderTrigger: number;
  triggerRender: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const defaultResumeJson = JSON.stringify(
  {
    basics: {
      name: "John Doe",
      label: "Programmer",
      image: "",
      email: "john@gmail.com",
      phone: "(912) 555-4321",
      url: "https://johndoe.com",
      summary: "A summary of John Doe…",
      location: {
        address: "2712 Broadway St",
        postalCode: "CA 94115",
        city: "San Francisco",
        countryCode: "US",
        region: "California",
      },
      profiles: [
        {
          network: "Twitter",
          username: "john",
          url: "https://twitter.com/john",
        },
      ],
    },
    work: [
      {
        name: "Company",
        position: "President",
        url: "https://company.com",
        startDate: "2013-01-01",
        endDate: "2014-01-01",
        summary: "Description…",
        highlights: ["Started the company"],
      },
    ],
    volunteer: [
      {
        organization: "Organization",
        position: "Volunteer",
        url: "https://organization.com/",
        startDate: "2012-01-01",
        endDate: "2013-01-01",
        summary: "Description…",
        highlights: ["Awarded 'Volunteer of the Month'"],
      },
    ],
    education: [
      {
        institution: "University",
        url: "https://institution.com/",
        area: "Software Development",
        studyType: "Bachelor",
        startDate: "2011-01-01",
        endDate: "2013-01-01",
        score: "4.0",
        courses: ["DB1101 - Basic SQL"],
      },
    ],
    awards: [
      {
        title: "Award",
        date: "2014-11-01",
        awarder: "Company",
        summary: "There is no spoon.",
      },
    ],
    certificates: [
      {
        name: "Certificate",
        date: "2021-11-07",
        issuer: "Company",
        url: "https://certificate.com",
      },
    ],
    publications: [
      {
        name: "Publication",
        publisher: "Company",
        releaseDate: "2014-10-01",
        url: "https://publication.com",
        summary: "Description…",
      },
    ],
    skills: [
      {
        name: "Web Development",
        level: "Master",
        keywords: ["HTML", "CSS", "JavaScript"],
      },
    ],
    languages: [
      {
        language: "English",
        fluency: "Native speaker",
      },
    ],
    interests: [
      {
        name: "Wildlife",
        keywords: ["Ferrets", "Unicorns"],
      },
    ],
    references: [
      {
        name: "Jane Doe",
        reference: "Reference…",
      },
    ],
    projects: [
      {
        name: "Project",
        startDate: "2019-01-01",
        endDate: "2021-01-01",
        description: "Description...",
        highlights: ["Won award at AIHacks 2016"],
        url: "https://project.com/",
      },
    ],
  },
  null,
  2,
);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [jsonString, setJsonString] = useState<string>(defaultResumeJson);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const triggerRender = useCallback(() => {
    setRenderTrigger((prev) => prev + 1);
  }, []);

  const value = {
    jsonString,
    setJsonString,
    renderTrigger,
    triggerRender,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
