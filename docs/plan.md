# TeamShop — Implementation Plan

This document outlines the technical plan to implement TeamShop based on the requirements defined in `requirements.md`.

## Plan Items

### Setup & Architecture

#### P1. Project Initialization
- **Description:** Initialize the monorepo structure with Django (backend) and React (frontend). Configure Tailwind CSS for the frontend.
- **Technical Decisions:**
  - Use `django-admin startproject` for backend.
  - Use `vite` for fast React scaffolding.
  - Configure `concurrently` or a Makefile to run both servers during dev.
  - Initialize GitLab repository for version control (R17).
- **Dependencies:** None
- **Covers Requirements:** R14, R15, R17
- **Priority:** High

#### P12. Code Quality & Standards
- **Description:** Enforce code quality standards, SOLID principles, and clean code practices across the stack.
- **Technical Decisions:**
  - **Backend:** Use `Black` and `Flake8` for Python linting/formatting. Structure business logic in Services or Managers to keep Views thin (SOLID - Single Responsibility) (R20, R21).
  - **Frontend:** Use `ESLint` and `Prettier` for React. Component composition to avoid prop drilling and large components (SOLID) (R20, R21).
  - **Versioning:** Commit messages should follow conventional commits (R17).
- **Dependencies:** P1
- **Covers Requirements:** R17, R20, R21
- **Priority:** High

### Backend (Django)

#### P2. Database Models
- **Description:** Create Django models for `ShoppingList`, `Item`, and `UserSession` (for anonymous tracking).
- **Technical Decisions:**
  - `ShoppingList`: `id` (UUID or short code), `created_at`.
  - `Item`: `name`, `status` (pending, claimed, bought), `claimed_by` (pseudo), `list_id` (FK).
  - Use SQLite for MVP (R16).
- **Dependencies:** P1
- **Covers Requirements:** R1, R2, R5, R9
- **Priority:** High

#### P3. Core API Endpoints
- **Description:** Implement REST API views for creating lists, joining lists, and basic item CRUD.
- **Technical Decisions:**
  - `POST /api/lists/`: Create new list (R1).
  - `GET /api/lists/{id}/`: Get list details (R3).
  - `POST /api/lists/{id}/items/`: Add item (R5).
  - `PATCH /api/items/{id}/`: Update item (R6).
  - `DELETE /api/items/{id}/`: Delete item (R6).
- **Dependencies:** P2
- **Covers Requirements:** R1, R3, R4, R5, R6
- **Priority:** High

### Real-Time Collaboration

#### P4. WebSocket Infrastructure
- **Description:** Set up Django Channels for real-time communication.
- **Technical Decisions:**
  - Install `channels` and `daphne`.
  - Configure `InMemoryChannelLayer` for dev/MVP (low cost).
  - Create a `ListConsumer` to handle group updates.
- **Dependencies:** P1, P2
- **Covers Requirements:** R7
- **Priority:** High

#### P5. Real-Time Events
- **Description:** Broadcast events on model changes.
- **Technical Decisions:**
  - Use Django signals or override `save()` methods to send messages to the channel group when items are added/modified.
  - Events: `ITEM_ADDED`, `ITEM_UPDATED`, `ITEM_DELETED`, `LIST_RESET`.
- **Dependencies:** P4, P3
- **Covers Requirements:** R7
- **Priority:** High

### Frontend (React + Tailwind)

#### P6. Mobile-First & Responsive Layout
- **Description:** Create the base layout and routing, ensuring responsiveness and French localization.
- **Technical Decisions:**
  - Use `react-router-dom`.
  - Implement a responsive container that mimics a mobile app view but scales to desktop (R19).
  - Configure Tailwind theme for "Orange" (claiming) and "Green" (done) states.
  - Hardcode UI text in French (R18).
- **Dependencies:** P1
- **Covers Requirements:** R13, R14, R18, R19
- **Priority:** High

#### P7. List Interaction UI
- **Description:** Build components for the list view, adding items, and item rows.
- **Technical Decisions:**
  - `AddItemForm`: Sticky bottom input.
  - `ItemRow`: Swipeable or clickable actions.
  - `ShoppingToggle`: Switch between Edit/Shopping modes.
- **Dependencies:** P6, P3
- **Covers Requirements:** R5, R6, R8
- **Priority:** High

#### P8. WebSocket Client Integration
- **Description:** Connect React to Django Channels.
- **Technical Decisions:**
  - Use `react-use-websocket` or native `WebSocket` API.
  - Update local state (React Query or Context) upon receiving events.
- **Dependencies:** P7, P4
- **Covers Requirements:** R7
- **Priority:** High

### Shopping Mode Logic

#### P9. Pseudo & Claiming Logic
- **Description:** Implement the flow for entering a pseudo and claiming items.
- **Technical Decisions:**
  - Store `pseudo` in `localStorage`.
  - When clicking an item in Shopping Mode:
    - If free -> `PATCH` status to `claimed`, set `claimed_by`.
    - If claimed by self -> `PATCH` status to `bought`.
    - If claimed by other -> Show lock icon (R11).
- **Dependencies:** P7, P3
- **Covers Requirements:** R8, R9, R10, R11
- **Priority:** Medium

#### P10. End-of-Shopping Reset
- **Description:** Implement the cleanup logic.
- **Technical Decisions:**
  - `POST /api/lists/{id}/reset/`:
    - Delete all `bought` items.
    - Reset `claimed` items to `pending`.
- **Dependencies:** P3
- **Covers Requirements:** R12
- **Priority:** Medium

### Deployment & Hosting

#### P11. Production Build & Deploy
- **Description:** Prepare for deployment on a low-cost server.
- **Technical Decisions:**
  - Build React app to static files.
  - Serve static files via Django (Whitenoise) or Nginx.
  - Dockerize the application (optional but recommended).
- **Dependencies:** P1-P10
- **Covers Requirements:** R16
- **Priority:** Low

---

### Shopping Mode Enhancements

#### P13. Rename Pseudo During Shopping Mode
- **Description:** Allow users to change their pseudo while actively in shopping mode, with real-time propagation to all users.
- **Technical Decisions:**
  - **Frontend:**
    - Add a "Rename" button visible only when Shopping Mode is active.
    - Display a modal with validation when button is clicked.
    - Validate that the new pseudo is not already in use by another active user.
    - Update `localStorage` with the new pseudo.
    - Broadcast rename event via WebSocket.
  - **Backend:**
    - Create WebSocket event `PSEUDO_RENAMED` with payload: `{old_pseudo, new_pseudo, user_session_id}`.
    - Validate pseudo uniqueness within the active list session.
    - Update all items currently claimed by the user (orange state) to reflect the new pseudo.
  - **Sync Considerations:**
    - All connected users must see the pseudo change in real-time.
    - Item tags showing "Taken by [old_pseudo]" must update to "Taken by [new_pseudo]".
- **Dependencies:** P9 (Pseudo & Claiming Logic), P4 (WebSocket Infrastructure)
- **Covers Requirements:** R22
- **Priority:** Medium

#### P14. Easter Egg — Christmas Cat Animation (Item-Based Trigger)
- **Description:** Trigger a delightful Christmas-themed animation when a user adds an item named "Chat" to a list that already contains "Un gentil bibou". The animation is client-side only and visible only to the user who adds the item.
- **Technical Decisions:**
  - **Trigger Detection:**
    - Frontend-only detection when list contains an item with `name === "Un gentil bibou"` AND user adds item with `name === "Chat"`.
    - Check existing items in list state before showing animation.
    - Trigger immediately after the user submits "Chat" item.
  - **Frontend:**
    - Create a `ChristmasAnimation` component with:
      - Falling snowflakes effect (CSS animation or canvas).
      - Animated cat popping out of a gift box (SVG/GIF or CSS animation).
      - Text overlay: "Ton bibou t'offre un petit chat pour Noël".
    - Animation is local to the user's client only (no WebSocket broadcast needed).
    - Animation should overlay the UI without blocking interactions (position: fixed, z-index, pointer-events: none for decorative elements).
    - Duration: ~5-10 seconds, then fade out gracefully.
  - **Backend:**
    - No backend logic required for this feature.
  - **Edge Cases:**
    - Case-sensitive match: Only "Chat" (not "chat" or "CHAT") and "Un gentil bibou" (exact match).
    - Item-specific trigger: Only lists containing "Un gentil bibou" item.
    - Non-blocking: Must not interfere with real-time sync or shopping mode.
    - Client-side only: Animation is personal to the user who added the item.
    - Deployment-proof: Works regardless of list ID (no hardcoded list reference).
- **Dependencies:** P7 (List Interaction UI)
- **Covers Requirements:** R23
- **Priority:** Low

