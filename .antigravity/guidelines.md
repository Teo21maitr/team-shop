# Antigravity Guidelines

This file defines how developers and Gemini inside Antigravity must maintain the specification for TeamShop.

## Modifying Tasks

- **Marking Progress:** Mark tasks as done by changing `[ ]` to `[x]`.
- **New Tasks:** Any new task added must reference both a **Requirement (R#)** and a **Plan Item (P#)**.
  - Example: `- [ ] Implement new feature (P5 — R8)`
- **Placement:** Insert new tasks into the correct **Phase** section.

## Modifying Requirements or Plan

Modifications to `docs/requirements.md` or `docs/plan.md` are only allowed when:
1.  **Scope Changes:** The user explicitly requests a change in scope.
2.  **New Features:** A new feature is requested.
3.  **Updates/Removals:** A requirement is no longer valid or needs adjustment.

**Procedure:**
1.  Update `docs/requirements.md` (add/edit R#).
2.  Update `docs/plan.md` (add/edit P# to cover the new R#).
3.  Update `docs/tasks.md` (add tasks referencing the new P# and R#).

## Formatting Rules

- **IDs:** Never change the ID formats (R#, P#). They are the keys for traceability.
- **Consistency:** Always regenerate or update the full file content to ensure consistency.
- **Hierarchy:** Keep the Markdown hierarchy (headers, lists) stable.

## Using Gemini inside Antigravity

When working on this project, Gemini should:
- **Expand Requirements:** Proactively suggest new requirements (R#) if user needs are ambiguous or expand.
- **Evolve Plan:** Update the technical plan (P#) if the architecture needs to change (e.g., switching database, adding new libraries).
- **Add Tasks:** Add granular tasks for edge cases, UX improvements, or testing steps that might have been missed.
- **Preserve Content:** Never silently delete content. Always ask or mark as deprecated if necessary.

## Example: Adding New Features (like Rename & Easter Egg)

When new features are requested (e.g., rename in shopping mode, Easter egg animation):

1. **Update `docs/requirements.md`:**
   - Add new requirement IDs (e.g., R22, R23) in the appropriate section.
   - Include complete user stories and acceptance criteria.
   - Update the introduction if features fundamentally change the app's value proposition.

2. **Update `docs/plan.md`:**
   - Add new plan items (e.g., P13, P14) with technical decisions, dependencies, and priorities.
   - Link plan items to the corresponding requirements.
   - Consider frontend, backend, WebSocket, and sync implications.

3. **Update `docs/tasks.md`:**
   - Create new phases or add to existing phases.
   - Each task must reference both R# and P# IDs.
   - Include tasks for implementation, edge cases, and testing.

4. **Maintain Consistency:**
   - Never reuse or skip R#, P#, or task numbers.
   - Ensure all cross-references are accurate.
   - Keep formatting and hierarchy consistent across all files.

This workflow ensures that all specification documents remain synchronized and traceable, enabling deterministic development and clear communication between developers, AI assistants, and stakeholders.
