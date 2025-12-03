# TeamShop — Development Tasks

This document tracks the engineering tasks required to build TeamShop.

## Phase 1 — Project Setup & Standards

- [x] 1.1. Initialize Django project and GitLab repository (P1, P12 — R15, R17)
- [x] 1.2. Initialize React project with Vite (P1 — R14)
- [x] 1.3. Configure Tailwind CSS in React (P1 — R14)
- [x] 1.4. Set up concurrent development script (P1 — R14, R15)
- [x] 1.5. Configure Black and Flake8 for Django (P12 — R21)
- [x] 1.6. Configure ESLint and Prettier for React (P12 — R21)

## Phase 2 — Backend Core (Django)

- [x] 2.1. Create `ShoppingList` and `Item` models (P2 — R1, R2, R5)
- [x] 2.2. Create `UserSession` model or mechanism for anonymous ID (P2 — R1)
- [x] 2.3. Implement POST `/api/lists/create` endpoint (P3 — R1)
- [x] 2.4. Implement GET `/api/lists/{id}` endpoint (P3 — R3, R4)
- [x] 2.5. Implement POST `/api/lists/{id}/items` endpoint (P3 — R5)
- [x] 2.6. Implement PATCH/DELETE `/api/items/{id}` endpoints (P3 — R6)
- [x] 2.7. Refactor business logic to Services/Managers to follow SOLID (P12 — R20)

## Phase 3 — Frontend Core (React + Tailwind)

- [x] 3.1. Create Landing Page with "Create List" and "Join List" forms (French text) (P6 — R1, R3, R18)
- [x] 3.2. Create List View layout (mobile-first container) (P6 — R13)
- [x] 3.3. Implement `AddItemForm` component (P7 — R5)
- [x] 3.4. Implement `ItemRow` component for basic display (P7 — R5)
- [x] 3.5. Connect frontend to API for creating/joining lists (P7 — R1, R3)
- [x] 3.6. Connect frontend to API for adding/deleting items (P7 — R5, R6)
- [x] 3.7. Verify responsive design on desktop/tablet (P6 — R19)

## Phase 4 — Real-Time Sync

- [x] 4.1. Install and configure Django Channels & Daphne (P4 — R7)
- [x] 4.2. Create `ListConsumer` and routing (P4 — R7)
- [x] 4.3. Implement backend signals to broadcast updates (P5 — R7)
- [x] 4.4. Implement WebSocket client in React (P8 — R7)
- [x] 4.5. Handle real-time state updates in frontend (P8 — R7)

## Phase 5 — Shopping Mode

- [x] 5.1. Implement "Shopping Mode" toggle in UI (P7 — R8)
- [x] 5.2. Create "Pseudo" entry modal/prompt (P9 — R8)
- [x] 5.3. Implement "Claim" logic (Orange state) (P9 — R9)
- [x] 5.4. Implement "Validate" logic (Green state) (P9 — R10)
- [x] 5.5. Enforce ownership locks in backend (P9 — R11)
- [x] 5.6. Enforce ownership locks in frontend UI (P9 — R11)

## Phase 6 — End-of-Shopping Flow

- [x] 6.1. Implement POST `/api/lists/{id}/reset` endpoint (P10 — R12)
- [x] 6.2. Add "Finish Shopping" button and confirmation (P10 — R12)
- [x] 6.3. Handle list reset event via WebSockets (P10 — R7, R12)

## Phase 7 — Design & UX Pass

- [x] 7.1. Polish mobile UI (touch targets, spacing) (P6 — R13)
- [x] 7.2. Add animations for item additions/removals (P6 — R13)
- [x] 7.3. Ensure error states are handled gracefully (P3 — R4)
- [x] 7.4. Review all text for correct French grammar/tone (P6 — R18)

## Phase 8 — Deployment & Hosting

- [x] 8.1. Configure Whitenoise for static files (P11 — R16)
- [x] 8.2. Create Dockerfile (optional) (P11 — R16)
- [x] 8.3. Verify production build locally (P11 — R16)

## Phase 9 — Testing & QA

- [ ] 9.1. Test full flow with multiple devices (P1-P10 — R1-R13)
- [ ] 9.2. Verify real-time latency (P4 — R7)

## Phase 10 — Shopping Mode Enhancements (Rename Feature)

- [x] 10.1. Add "Rename" button in Shopping Mode UI (visible only when active) (P13 — R22)
- [x] 10.2. Create rename modal with input validation (P13 — R22)
- [x] 10.3. Implement pseudo uniqueness validation (P13 — R22)
- [x] 10.4. Update localStorage with new pseudo (P13 — R22)
- [x] 10.5. Create WebSocket event `PSEUDO_RENAMED` in backend (P13 — R22)
- [x] 10.6. Broadcast rename event to all connected users (P13 — R22)
- [x] 10.7. Update claimed item tags with new pseudo (P13 — R22)
- [x] 10.8. Handle real-time UI updates for pseudo changes (P13 — R22)
- [ ] 10.9. Test rename with multiple active users (P13 — R22)
- [ ] 10.10. Test edge case: user has claimed items (orange state) (P13 — R22)

## Phase 11 — Easter Egg (Christmas Cat Animation)

- [ ] 11.1. Create `ChristmasAnimation` component (P14 — R23)
- [ ] 11.2. Implement falling snowflakes animation (P14 — R23)
- [ ] 11.3. Create animated cat popping from gift box (P14 — R23)
- [ ] 11.4. Add text overlay "Ton bibou t'offre un petit chat pour Noël" (P14 — R23)
- [ ] 11.5. Implement client-side trigger logic: list_id === "P7XELY" AND item.name === "Chat" (P14 — R23)
- [ ] 11.6. Ensure animation is visible only to user who added the item (client-side only) (P14 — R23)
- [ ] 11.7. Ensure animation does not block UI interactions (P14 — R23)
- [ ] 11.8. Set animation duration and fade-out (~5-10 seconds) (P14 — R23)
- [ ] 11.9. Test case-sensitivity: "Chat" only (not "chat" or "CHAT") (P14 — R23)
- [ ] 11.10. Test list-specificity: only P7XELY (P14 — R23)
- [ ] 11.11. Test that animation doesn't interfere with real-time sync (P14 — R23)
