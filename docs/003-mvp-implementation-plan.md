# ADR 003: MVP Implementation and Deployment Plan

- **Status**: Draft
- **Date**: 2025-12-04

## 1. Objective

To define the high-level tasks required to build, test, and deploy the MVP of the DataCV application. This plan will guide the initial development sprints.

## 2. Implementation Tasks

This breaks down the work defined in `002-mvp-requirements.md` into actionable steps.

### 2.1. Project Scaffolding

-   **Task**: Create the directory structure for the new applications within the `StyloCV/apps/` folder.
    -   `apps/api/`: For the FastAPI backend.
    -   `apps/ui/`: For the Vite + React frontend.
-   **Task**: Initialize the projects using their respective command-line tools.
    -   `poetry new api` or similar for the FastAPI app.
    -   `npm create vite@latest ui -- --template react-ts` for the frontend.

### 2.2. Backend Tasks (FastAPI)

-   **Task**: Create the main FastAPI application file (`main.py`).
-   **Task**: Implement the `/render` endpoint.
    -   It will accept a POST request with a body that validates against the `cv_model.Resume` model.
    -   It will call the `cv_model.generate()` function to create the PDF in a temporary in-memory file.
    -   It will return the PDF to the client using FastAPI's `StreamingResponse` or `FileResponse`.
-   **Task**: Add CORS (Cross-Origin Resource Sharing) middleware to the FastAPI app to allow requests from the frontend development server.
-   **Task**: Create a `Dockerfile` for the backend application to prepare it for deployment.

### 2.3. Frontend Tasks (Vite + React)

-   **Task**: Set up the frontend project with the chosen technology stack.
    -   **Styling**: Use **Tailwind CSS** for utility-first styling.
    -   **Component Toolkit**: Use **shadcn/ui**. Components will be added on an as-needed basis, giving us full ownership of the code.
    -   **State Management**: For the MVP, use only React's built-in hooks (`useState`, `useContext`). Avoid complex state management libraries like Redux. If a global state manager is needed in the future, a lightweight library like **Zustand** is the recommended choice.
-   **Task**: Create the main two-panel layout component (Editor view | Preview view) using shadcn/ui components where applicable.
-   **Task**: Implement the editor panel.
    -   For the MVP, use a simple `<textarea>` or a lightweight component like `react-simple-code-editor`.
    -   Manage the JSON content using React state (`useState`).
    -   Pre-populate the editor with a valid default resume JSON.
-   **Task**: Implement the preview panel.
    -   It will display the PDF received from the backend. An `<embed>` tag is the simplest starting point.
-   **Task**: Implement the "Render" button logic.
    -   On click, it will make an API call (`fetch` or `axios`) to the backend's `/render` endpoint, sending the current editor content.
    -   It will receive a PDF blob in response and create an object URL to display in the preview panel.

## 3. MVP Deployment Strategy

The goal is a simple, scalable, and cost-effective deployment. We will treat the backend and frontend as two separate services.

### 3.1. Backend Deployment (FastAPI)

-   **Method**: **Containerization**.
-   **Proposed Service**: A serverless container platform like **Google Cloud Run** or **AWS Fargate**.
-   **Workflow**:
    1.  The `Dockerfile` will be used to build a container image.
    2.  This image will be pushed to a container registry (e.g., Docker Hub, Google Artifact Registry, Amazon ECR).
    3.  The service (e.g., Cloud Run) will be configured to pull and run this image.
-   **Why?**: This approach is highly scalable (including scaling to zero to save costs), requires no server management, and integrates well with CI/CD pipelines.

### 3.2. Frontend Deployment (Vite + React)

-   **Method**: **Static Site Hosting**.
-   **Proposed Service**: A dedicated static hosting provider like **Netlify**, **Vercel**, or **Cloudflare Pages**.
-   **Workflow**:
    1.  The `vite build` command will be run to generate a `dist` folder containing optimized static assets (HTML, JS, CSS).
    2.  These assets will be deployed to the hosting provider.
-   **Why?**: These services are incredibly fast (serving from a global CDN), simple to use, and often have generous free tiers. They are built specifically for this kind of frontend application.

## 4. Future Phase: Data Persistence

While the MVP is stateless, the subsequent phase will introduce user accounts and resume storage. The plan for this is as follows:

-   **ORM/Data Modeling**: Use **SQLModel** due to its native integration with Pydantic and FastAPI. This allows for a single, unified data model for validation, API operations, and database interaction.
-   **Development Database**: Use **SQLite** for local development. Its file-based, zero-configuration nature makes it ideal for a fast and simple development loop.
-   **Production Database**: Use **PostgreSQL**. It is the recommended choice for production due to its robustness, reliability, and powerful native `JSONB` support, which is perfectly suited for storing and querying the nested structure of the resume data.
