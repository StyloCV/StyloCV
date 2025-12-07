# ADR 002: MVP Requirements - Core Editor

- **Status**: Draft
- **Date**: 2025-12-04

## 1. Objective

To build a Minimum Viable Product (MVP) that demonstrates the core functionality of the DataCV application: editing resume content as data and previewing the rendered output. The focus is on the end-to-end pipeline, not on polished features.

## 2. Core User Story

As a user, I can edit my resume content in a raw data format (JSON), trigger a render, and see the generated document, so that I can quickly produce a formatted resume.

## 3. Key Components & Requirements

### 3.1. Frontend Application (Vite + React)

-   **Layout**: A simple, two-panel web interface.
    -   **Left Panel**: A basic text editor (e.g., a simple `<textarea>` or a lightweight code editor) that is pre-populated with a default `resume.json` example.
    -   **Right Panel**: A preview area to display the rendered resume.
-   **Interaction**:
    -   A single "Render" or "Update Preview" button.
    -   On click, the frontend will send the current content of the JSON editor to the backend API.
-   **Preview Display**:
    -   The frontend will receive a file from the backend. For the MVP, this will be a **PDF** to ensure accuracy and simplicity.
    -   It will display this file in the right-hand panel. For a PDF, this could be done using an `<embed>` tag or a library like `react-pdf`.
-   **Future Goal**: The preview format will be evolved to **SVG** to support advanced features (see Section 5).

### 3.2. Backend API (FastAPI)
-   **Endpoint**: A single API endpoint (e.g., `/render`).
    -   **Request**: Accepts a POST request with a JSON body containing the resume data, conforming to the `cv_model.Resume` Pydantic model.
    -   **Processing**:
        1.  Validates the incoming JSON against the `Resume` model.
        2.  Calls the existing `cv_model.generate()` function to produce the resume document (PDF for the MVP).
    -   **Response**: Sends the generated file back to the frontend. The most straightforward approach for the MVP would be returning a PDF file with the appropriate `Content-Type` header (`application/pdf`).

## 4. Decisions to Defer (Out of Scope for MVP)

-   **User Authentication**: The app will operate as if a single user is already logged in.
-   **Database Storage**: No user accounts or saving of resumes to a database. The state is ephemeral.
-   **Advanced UI**: The editor will be for raw JSON, not a user-friendly form-based UI.
-   **Real-time Preview**: The preview will only update on a manual button click, not as the user types.
-   **Error Handling**: Minimal error handling. If validation fails, a simple error message is sufficient.

## 5. Future Enhancements

This section captures ideas that are out of scope for the MVP but should inform architectural decisions.

-   **Editor/Preview Sync**: Implement two-way synchronization between the editor and preview panels.
    -   Clicking an element in the preview (e.g., a job title) will navigate the cursor to the corresponding data in the JSON editor.
    -   Placing the cursor on a section in the JSON editor will scroll the preview to the corresponding visual element.
    -   **Architectural Implication**: This requires a marked-up preview format like **SVG** (preferred) or HTML, where visual elements contain metadata linking them to the source JSON. An investigation will be needed to confirm that `typst` can output SVG with the required custom metadata attributes.
