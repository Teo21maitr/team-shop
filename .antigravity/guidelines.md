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
