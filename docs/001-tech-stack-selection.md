# ADR 001: Initial Technology Stack Selection

- **Status**: Accepted
- **Date**: 2025-12-04

## Context

The DataCV project requires a decoupled architecture with a clear separation between the frontend and backend. The backend will handle data validation, storage, and rendering logic, while the frontend will provide an interactive user interface for resume creation and editing. The initial phase focuses on establishing a robust foundation for both.

## Decision

We have decided to use the following technology stack:

1.  **Backend**: **FastAPI** (Python)
2.  **Frontend**: **Vite + React** (TypeScript)

---

### Backend: FastAPI

FastAPI was chosen for its modern features and tight integration with the existing Python ecosystem of the project.

#### Key Reasons:

-   **Pydantic Integration**: The `cv_model` package is built on Pydantic. FastAPI uses Pydantic for native request/response validation and serialization, allowing for direct reuse of our data models and eliminating redundant validation logic.
-   **High Performance**: It offers performance on par with Node.js and Go, ensuring a responsive API.
-   **Automatic API Docs**: Out-of-the-box generation of interactive Swagger UI and ReDoc documentation provides a clear contract for frontend development.
-   **Asynchronous Support**: Built-in `async/await` is critical for future integration with long-running processes like LLM agents (Phase 3) without blocking the server.

#### Alternatives Considered:

-   **Django**: Considered too heavyweight and opinionated for an API-centric service. Integrating Pydantic is less direct.
-   **Flask**: More lightweight but lacks the built-in data validation and auto-documentation that FastAPI provides, requiring more boilerplate.
-   **Node.js (Express/NestJS)**: Would require rewriting the existing Python data model and validation logic in TypeScript, adding complexity and negating previous work.

---

### Frontend: Vite + React

Vite with React was chosen for its speed, flexibility, and suitability for building a Single Page Application (SPA).

#### Key Reasons:

-   **Fast Development Experience**: Vite's native ES module dev server provides near-instant startup and Hot Module Replacement (HMR), significantly speeding up the development cycle.
-   **Optimized for SPAs**: The project is a highly interactive, client-side rendered resume editor, which is the ideal use case for Vite.
-   **Flexibility and Decoupling**: As a build tool, Vite is unopinionated and perfectly suited for a decoupled architecture where the frontend is a pure consumer of a separate backend API.
-   **WASM Support**: Excellent built-in WebAssembly support is a key enabler for the Phase 2 goal of running a Typst renderer preview in the browser.

#### Alternatives Considered:

-   **Next.js**: Its primary features (Server-Side Rendering, Static Site Generation) are designed for SEO and content-driven websites, which is unnecessary for this application. Its built-in API routes are also redundant given the FastAPI backend. The added complexity is not justified.
