# 💾 DataCV Project Plan and Architecture Document

This document outlines the phased development plan and architectural structure for the **DataCV** project, demonstrating expertise in software architecture, MLOps-ready infrastructure, and decoupled system design.

## 1. Project Overview

| Detail | Description |
 | ----- | ----- |
| **Project Name** | **DataCV** |
| **Short Description** | DataCV is a smart resume generation platform that separates your professional content from the document design and uses an intelligent agent to optimize keywords against any job description. |
| **Core Goal** | To build a full-lifecycle application that showcases expertise in software architecture, MLOps-ready infrastructure, and decoupled system design. |

## 2. Work Breakdown Structure (WBS) / Phase Plan

The project is divided into three logical phases, prioritizing core functionality first to achieve a Minimum Viable Product (MVP).

### Phase 1: Foundation (MVP)

This phase establishes the essential data and rendering pipeline.

| ID | Milestone | Deliverable |
 | ----- | ----- | ----- |
| **P1.1** | **Data Model Package** | Tested, reusable Python package (`resume_data_model`) defining the **Pydantic schemas** for resume content. |
| **P1.2** | **Core Rendering Package** | Python package (`resume_renderer`) that accepts the Pydantic model and outputs raw **Typst script** (templated text). |
| **P1.3** | **Backend API Setup** | **FastAPI** backend that can validate JSON input against Pydantic schema and store data. |
| **P1.4** | **Basic Frontend UI** | Simple UI to submit JSON and display the resulting raw Typst code output. |
| **P1.5** | **CI/CD Foundation** | Automated GitHub Actions/Azure pipeline to **test and deploy** the backend API and frontend. |

### Phase 2: Core Feature Development & User Experience

This phase delivers a functional, client-facing product with high-fidelity rendering.

| ID | Milestone | Deliverable |
 | ----- | ----- | ----- |
| **P2.1** | **Rendering Preview** | **WebAssembly (WASM)** module for Typst integrated into the frontend to display a live **SVG/PDF preview**. |
| **P2.2** | **Template Management** | Implementation of **3 distinct Typst templates** and API logic to allow template selection. |
| **P2.3** | **Full CRUD API** | Extend FastAPI for secure **Create, Read, Update, and Delete (CRUD)** operations for resume data. |
| **P2.4** | **Frontend Editor** | User-friendly, structured form UI replacing raw JSON input. |
| **P2.5** | **PDF Generation** | Final step integration to compile the Typst script into a downloadable **PDF file**. |

### Phase 3: Advanced Agent Integration (Key Differentiator)

This final phase integrates the intelligent LLM feature.

| ID | Milestone | Deliverable |
 | ----- | ----- | ----- |
| **P3.1** | **LLM Agent Prompt Design** | Rigorously tested prompt utilizing the LLM's **Structured Output** feature to return valid, modified Pydantic data. |
| **P3.2** | **Agent Integration API** | New API endpoint that handles the job description input, calls the LLM, and saves the modified data. |
| **P3.3** | **Agent UI Integration** | Frontend feature to input a job description and display a **diff/suggestion window** for user approval of changes. |
| **P3.4** | **MLOps Lite CI/CD** | Implement **version control for LLM prompts** and add **integration tests** to verify the LLM's structured output integrity. |

## 3. Project Repository Structure (Monorepo)

The project will use a **Monorepository** structure managed within a single organization to demonstrate skills in complex dependency and build management.

```
/DataCV (Root Repository)
├── /apps # Deployable application services
│ ├── /api # FastAPI Backend (LLM, Rendering API, Data Persistence)
│ │ ├── Dockerfile
│ │ ├── requirements.txt
│ │ └── ...
│ └── /web-ui # Frontend (React/Vue/etc.)
│ ├── package.json
│ └── ... ├── /packages # Internal Python libraries shared between apps
│ ├── /resume-data-model # Python Pydantic schemas (Shared dependency)
│ │ └── ...
│ ├── /resume-renderer # Python Templating/Typst logic
│ │ └── ...
│ └── /llm-agent # Python package for core LLM prompt/call logic
│ └── ...
├── /templates # Directory for all Typst template files
└── /.github (or /.azure-devops) └── /workflows # CI/CD pipeline definitions
```
