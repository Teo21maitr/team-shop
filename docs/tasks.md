# TeamShop — Development Tasks

This document tracks the engineering tasks required to build TeamShop.

## Phase 1 — Project Setup

- [ ] 1.1. Initialize Django project and Git repository (P1 — R15)
- [ ] 1.2. Initialize React project with Vite (P1 — R14)
- [ ] 1.3. Configure Tailwind CSS in React (P1 — R14)
- [ ] 1.4. Set up concurrent development script (P1 — R14, R15)

## Phase 2 — Backend Core (Django)

- [ ] 2.1. Create `ShoppingList` and `Item` models (P2 — R1, R2, R5)
- [ ] 2.2. Create `UserSession` model or mechanism for anonymous ID (P2 — R1)
- [ ] 2.3. Implement POST `/api/lists/create` endpoint (P3 — R1)
- [ ] 2.4. Implement GET `/api/lists/{id}` endpoint (P3 — R3, R4)
- [ ] 2.5. Implement POST `/api/lists/{id}/items` endpoint (P3 — R5)
- [ ] 2.6. Implement PATCH/DELETE `/api/items/{id}` endpoints (P3 — R6)

## Phase 3 — Frontend Core (React + Tailwind)

- [ ] 3.1. Create Landing Page with "Create List" and "Join List" forms (P6 — R1, R3)
- [ ] 3.2. Create List View layout (mobile-first container) (P6 — R13)
- [ ] 3.3. Implement `AddItemForm` component (P7 — R5)
- [ ] 3.4. Implement `ItemRow` component for basic display (P7 — R5)
- [ ] 3.5. Connect frontend to API for creating/joining lists (P7 — R1, R3)
- [ ] 3.6. Connect frontend to API for adding/deleting items (P7 — R5, R6)

## Phase 4 — Real-Time Sync

- [ ] 4.1. Install and configure Django Channels & Daphne (P4 — R7)
- [ ] 4.2. Create `ListConsumer` and routing (P4 — R7)
- [ ] 4.3. Implement backend signals to broadcast updates (P5 — R7)
- [ ] 4.4. Implement WebSocket client in React (P8 — R7)
- [ ] 4.5. Handle real-time state updates in frontend (P8 — R7)

## Phase 5 — Shopping Mode

- [ ] 5.1. Implement "Shopping Mode" toggle in UI (P7 — R8)
- [ ] 5.2. Create "Pseudo" entry modal/prompt (P9 — R8)
- [ ] 5.3. Implement "Claim" logic (Orange state) (P9 — R9)
- [ ] 5.4. Implement "Validate" logic (Green state) (P9 — R10)
- [ ] 5.5. Enforce ownership locks in backend (P9 — R11)
- [ ] 5.6. Enforce ownership locks in frontend UI (P9 — R11)

## Phase 6 — End-of-Shopping Flow

- [ ] 6.1. Implement POST `/api/lists/{id}/reset` endpoint (P10 — R12)
- [ ] 6.2. Add "Finish Shopping" button and confirmation (P10 — R12)
- [ ] 6.3. Handle list reset event via WebSockets (P10 — R7, R12)

## Phase 7 — Design & UX Pass

- [ ] 7.1. Polish mobile UI (touch targets, spacing) (P6 — R13)
- [ ] 7.2. Add animations for item additions/removals (P6 — R13)
- [ ] 7.3. Ensure error states are handled gracefully (P3 — R4)

## Phase 8 — Deployment & Hosting

- [ ] 8.1. Configure Whitenoise for static files (P11 — R16)
- [ ] 8.2. Create Dockerfile (optional) (P11 — R16)
- [ ] 8.3. Verify production build locally (P11 — R16)

## Phase 9 — Testing & QA

- [ ] 9.1. Test full flow with multiple devices (P1-P10 — R1-R13)
- [ ] 9.2. Verify real-time latency (P4 — R7)
