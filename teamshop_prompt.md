# Spec-Driven Development Prompt — TeamShop Edition (React + Tailwind + Django)

This document defines how the AI must transform high-level requirements into a complete, multi-file specification for the TeamShop web application.

TeamShop is a **mobile-first web application** allowing users to create, share, and collaboratively manage shopping lists in real time — without authentication.

The AI must generate or update the following specification files:

- `docs/requirements.md`
- `docs/plan.md`
- `docs/tasks.md`
- `.antigravity/guidelines.md`

These files form the **single source of truth** for the entire TeamShop project and must remain consistent at all times.

---

## 🌌 General Workflow

Whenever the user provides high-level requirements (for TeamShop or future updates), the AI must:

1. **Create or update ALL four files** listed above.
2. Respect the structure and rules in this prompt.
3. Maintain consistent IDs:
   - Requirements → **R1, R2, R3…**
   - Plan items → **P1, P2, P3…**
   - Tasks reference both Plan and Requirements.
4. Produce complete, self-contained Markdown files.
5. Ensure full cross-referencing across **requirements → plan → tasks**.
6. Adapt all content to **TeamShop’s stack: React + Tailwind (Frontend), Django (Backend)**.

---

# 📄 Step 1 — Create `docs/requirements.md`

## Required Structure

### Title  
**TeamShop — Requirements Document**

### Introduction  
Summarize:
- What TeamShop is  
- Who uses it (anonymous mobile-first users)  
- Key features (list creation, joining lists, editing items, real-time collaboration, shopping mode)

### Requirements (R#)  
List functional and non-functional requirements, each with:

#### ▸ User Story  
> As a user, I want **[goal]** so that **[benefit]**.

#### ▸ Acceptance Criteria  
Use WHEN/THEN format:
> WHEN **[condition]**  
> THEN the system SHALL **[expected behavior]**.

### Requirements Sections

Group requirements logically. At minimum:

- **R. Creation Flow**  
- **R. Joining Flow**  
- **R. Editing Items**  
- **R. Real-Time Sync**  
- **R. Shopping Mode**  
- **R. Pseudo System**  
- **R. Permissions During Shopping Mode**  
- **R. End-of-Shopping Reset**  
- **R. UI/UX Mobile First**  
- **R. Tech Constraints (React, Tailwind, Django)**  
- **R. Hosting Constraints (Low-cost Server)**  

Requirements must reflect the full workflow:

- Anonymous users  
- Unique list IDs  
- Adding/editing/deleting items  
- Real-time updates  
- Product claiming (orange mode)  
- Ownership lock rules  
- Validation (green)  
- Post-shopping item cleanup  
- Minimalist mobile UI  

---

# 📄 Step 2 — Create `docs/plan.md`

Convert each requirement R# into a concrete technical plan.

## Plan Item Format (P#)

Each item must include:

- **ID**: P1, P2, P3…
- **Title**
- **Description** explaining *how* to implement it  
- **Technical decisions** (React structure, Tailwind layout, Django models & endpoints, WebSockets for real-time sync)
- **Dependencies** on other plan items
- **Links to requirements** covered (ex: R2, R3)
- **Priority** (High / Medium / Low)

### Plan Sections (suggested)

- **Setup & Architecture**
- **Backend (Django)**  
  - Models: ShoppingList, Item, Pseudo  
  - REST API + WebSockets  
- **Frontend (React + Tailwind)**  
  - Components, pages, routing  
  - Mobile-first UI  
  - Real-time updates
- **Real-Time Collaboration**  
  - Product claiming  
  - Ownership locks  
  - Sync rules  
- **Shopping Mode Logic**
- **Deployment & Hosting**  
  - Low-cost hosting  
  - Python + Node  
- **Security (basic constraints)**

---

# 📄 Step 3 — Create `docs/tasks.md`

Break the implementation plan into **actionable engineering tasks**.

Each task MUST:

- Start with a checkbox `[ ]`
- Be small, concrete, and developer-friendly
- Reference:
  - Plan item(s) `(P-ID)`  
  - Requirements `(R-ID…)`

Example:

> 2.3. [ ] Implement POST `/api/lists/create` endpoint (P4 — R3, R4)

### Task Grouping

Organize tasks by phases:

- **Phase 1 — Project Setup**  
- **Phase 2 — Backend Core (Django)**  
- **Phase 3 — Frontend Core (React + Tailwind)**  
- **Phase 4 — Real-Time Sync**  
- **Phase 5 — Shopping Mode**  
- **Phase 6 — End-of-Shopping Flow**  
- **Phase 7 — Design & UX Pass**  
- **Phase 8 — Deployment & Hosting**  
- **Phase 9 — Testing & QA**  

Each task must be traceable to its requirements+plan items.

---

# 📄 Step 4 — Create `.antigravity/guidelines.md`

This file defines how developers and Gemini inside Antigravity must maintain the specification.

### The Guidelines Must Include:

#### **Modifying tasks**
- Mark tasks done with `[x]`
- New tasks must reference both a requirement and a plan item
- Insert tasks into the correct phase

#### **Modifying requirements or plan**
Only allowed when:
- Scope changes  
- New feature requested  
- Requirement removed or updated  

Then update:
- Requirements (R#)  
- Plan (P#)  
- Tasks referencing them  

#### **Formatting rules**
- Never change the ID formats (R#, P#)
- Always regenerate full files
- Keep Markdown hierarchy stable

#### **Using Gemini inside Antigravity**
Gemini should:
- Expand requirements when new user needs appear  
- Update plan when architecture evolves  
- Add tasks for edge cases, UX, testing  
- Never silently delete content  

---

# 📥 Expected User Input

The user will provide high-level requirements, such as:

```
TeamShop user workflow:
- Anonymous onboarding
- Create list → unique ID
- Join list with ID
- Add/edit/delete items
- Real-time updates for all users
- Shopping mode with pseudo & claiming system
- Validation producing a green "done" section
- End-of-shopping cleanup and list reset
- Mobile-first minimalist UI
```

---

# 📤 Expected AI Output

Gemini must output **four code blocks**, one per file:

````markdown
```docs/requirements.md
# Requirements Document
...
```

```docs/plan.md
# Implementation Plan
...
```

```docs/tasks.md
# Development Tasks
...
```

```.antigravity/guidelines.md
# Antigravity Guidelines
...
```
````

Each file must be complete, self-contained, consistent, and aligned with all TeamShop constraints.

---

# End of TeamShop Spec-Driven Development Prompt
