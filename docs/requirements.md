# TeamShop — Requirements Document

## Introduction
TeamShop is a **mobile-first web application** designed to streamline the grocery shopping experience for groups, families, or roommates. It allows anonymous users to create, share, and collaboratively manage shopping lists in real-time without the friction of account creation or authentication.

**Key Features:**
- **Instant Access:** No login required; users are identified by device/session.
- **Collaborative Lists:** Create a list and share a unique code to invite others.
- **Real-Time Sync:** Changes made by one user appear instantly for everyone else.
- **Shopping Mode:** A dedicated mode for the active shopping trip where items can be "claimed" (orange) to prevent duplicate purchases and "validated" (green) when in the cart.
- **Smart Reset:** An end-of-shopping flow that clears purchased items and resets the list for the next trip.

---

## Requirements

### R. Creation Flow

#### R1. Anonymous List Creation
> **User Story:** As a user, I want to create a new shopping list immediately upon visiting the site so that I can start adding items without signing up.
> **Acceptance Criteria:**
> - WHEN a user visits the landing page AND clicks "Create List"
> - THEN the system SHALL generate a unique, shareable List ID (e.g., 6-character alphanumeric).
> - THEN the user SHALL be redirected to the list view as the "Owner" (implicitly).

#### R2. Unique List Identity
> **User Story:** As a user, I want my list to have a unique identifier so that it doesn't conflict with other lists.
> **Acceptance Criteria:**
> - WHEN a list is created
> - THEN the system SHALL ensure the List ID is unique across the database.

### R. Joining Flow

#### R3. Join via Code
> **User Story:** As a user, I want to join an existing list using a code so that I can collaborate with my partner/roommate.
> **Acceptance Criteria:**
> - WHEN a user enters a valid List ID on the landing page
> - THEN the system SHALL add the user to the list session.
> - THEN the user SHALL see the current state of the list.

#### R4. Invalid Code Handling
> **User Story:** As a user, I want to know if I entered a wrong code so that I can try again.
> **Acceptance Criteria:**
> - WHEN a user enters an invalid List ID
> - THEN the system SHALL display a clear error message ("List not found").

### R. Editing Items

#### R5. Add Items
> **User Story:** As a user, I want to add items to the list so that we know what to buy.
> **Acceptance Criteria:**
> - WHEN a user types an item name and submits
> - THEN the item SHALL be added to the "To Buy" section of the list.
> - THEN the item SHALL be visible to all connected users immediately.

#### R6. Edit/Delete Items
> **User Story:** As a user, I want to correct mistakes or remove items we no longer need.
> **Acceptance Criteria:**
> - WHEN a user edits an item's name or deletes it
> - THEN the change SHALL be reflected for all users.
> - THEN the system SHALL prevent editing/deleting if the item is currently "locked" by another user in Shopping Mode (see R11).

### R. Real-Time Sync

#### R7. Instant Updates
> **User Story:** As a user, I want to see changes happen in real-time so that I don't buy something that was just removed.
> **Acceptance Criteria:**
> - WHEN any user makes a change (add, edit, delete, claim, validate)
> - THEN the interface SHALL update for all other connected users within < 1 second without a page refresh.

### R. Shopping Mode & Pseudo System

#### R8. Enter Shopping Mode
> **User Story:** As a user, I want to enter "Shopping Mode" when I am at the store so that I can coordinate with others.
> **Acceptance Criteria:**
> - WHEN a user toggles "Shopping Mode"
> - THEN the UI SHALL switch to a shopping-optimized view (larger buttons, focus on claiming/checking off).
> - THEN the user SHALL be prompted to enter a "Pseudo" (nickname) if not already set.

#### R9. Product Claiming (Orange Mode)
> **User Story:** As a user, I want to "claim" an item I am going to pick up so that my partner doesn't go to the same aisle.
> **Acceptance Criteria:**
> - WHEN a user taps an item in Shopping Mode
> - THEN the item SHALL turn Orange.
> - THEN the item SHALL display the user's Pseudo (e.g., "Taken by Alex").
> - THEN the item SHALL be locked for others (they cannot claim or delete it).

#### R10. Validation (Green Mode)
> **User Story:** As a user, I want to mark an item as "in the cart" so that we know it is secured.
> **Acceptance Criteria:**
> - WHEN a user taps their own "claimed" (orange) item again
> - THEN the item SHALL turn Green.
> - THEN the item SHALL move to the "Done" / "In Cart" section.

### R. Permissions During Shopping Mode

#### R11. Ownership Locks
> **User Story:** As a user, I want to prevent others from interfering with the items I am currently picking up.
> **Acceptance Criteria:**
> - WHEN an item is claimed (Orange) by User A
> - THEN User B SHALL NOT be able to unclaim, edit, or delete it.
> - THEN User B SHALL see who has claimed it.

### R. End-of-Shopping Reset

#### R12. Finish Shopping
> **User Story:** As a user, I want to clear the bought items after the trip so the list is fresh for next time.
> **Acceptance Criteria:**
> - WHEN a user clicks "Finish Shopping"
> - THEN the system SHALL delete all items in the "Done" (Green) section.
> - THEN the system SHALL unclaim any items left in "Orange" state (reset to normal).
> - THEN the list SHALL be ready for new items.

### R. UI/UX Mobile First

#### R13. Mobile-First Design
> **User Story:** As a user, I want an interface that works perfectly on my phone with one hand.
> **Acceptance Criteria:**
> - WHEN accessed on a mobile device
> - THEN the UI SHALL use large touch targets (min 44px).
> - THEN the layout SHALL avoid horizontal scrolling.
> - THEN the most common actions (add, claim) SHALL be easily accessible at the bottom of the screen.

### R. Tech Constraints

#### R14. Frontend Stack
> **User Story:** As a developer, I want to use React and Tailwind.
> **Acceptance Criteria:**
> - The frontend SHALL be built with React.
> - The styling SHALL use Tailwind CSS.

#### R15. Backend Stack
> **User Story:** As a developer, I want to use Django.
> **Acceptance Criteria:**
> - The backend SHALL be built with Django (Python).
> - The backend SHALL expose an API for the frontend.

### R. Hosting Constraints

#### R16. Low-Cost Hosting
> **User Story:** As a project owner, I want to minimize hosting costs.
> **Acceptance Criteria:**
> - The architecture SHALL be deployable on low-cost VPS or free-tier PaaS options.
> - The database SHALL be lightweight (e.g., SQLite for MVP or small PostgreSQL).
