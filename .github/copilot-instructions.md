# GitHub Copilot Instructions

## Project Overview
- **Name**: In-Pages Landing Page Software
- **Description**: A web-based solution for creating, managing, and publishing landing pages with a built-in builder, user authentication, and media management.
- **Stack**: Node.js (Express) backend, Vanilla JavaScript frontend, Neon Serverless Postgres database.
- **Type**: Module-based project (`"type": "module"` in `package.json`).
- **Entry Point**: `backend/index.js`.

## Tech Stack Details
- **Backend**: Express.js, PostgreSQL (Neon), Ably (Realtime), Multer (Uploads), Sharp (Image Processing).
- **Frontend**: Vanilla JS, Bootstrap, Chart.js, FullCalendar, DataTables, SweetAlert2, Feather Icons.
- **Auth**: JWT in HTTP-only cookies.

## Architecture

### Backend (`backend/`)
- **Framework**: Express.js.
- **Database**: Uses `@neondatabase/serverless` for direct SQL execution.
  - **Connection**: `backend/db/connection.js` exports the `sql` tagged template literal.
  - **Pattern**: Raw SQL queries. **Do not use an ORM.**
- **Realtime**: Ably integration in `backend/lib/ably.js`.
- **Services**: Business logic resides in `backend/services/`.
  - Example: `authService.js`, `landingsService.js`.
- **Routes**: API endpoints in `backend/routes/`.
- **Auth**: JWT-based authentication.
  - Middleware: `requireAuth` protects routes.
  - Public routes are explicitly whitelisted.

### Frontend (`frontend/`)
- **Routing**: Custom SPA-like routing mechanism (`frontend/js/router.js`).
  - **Navigation**: Elements with `data-page="viewName"` trigger navigation.
  - **Loading**: Fetches `views/viewName.html` and injects it into `.page-content`.
  - **Scripting**: Dynamically loads `js/viewName.js` if it exists.
- **Components**: HTML fragments loaded via `frontend/js/include-html.js`.
  - Usage: `<div data-include="components/header.html"></div>`.
- **Assets**: Served statically. `frontend/` is the static root.
- **Libraries**: Located in `frontend/assets/vendors/` or loaded via CDN/local scripts.

## Key Conventions & Patterns

### Database Access
- Always use the `sql` tag for queries to ensure parameterization.
  ```javascript
  import { sql } from "../db/connection.js";
  const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
  ```

### Frontend Development
- **New Pages**:
  1. Create `frontend/views/pageName.html` (content only, no `<html>`/`<body>`).
  2. Create `frontend/js/pageName.js` (logic).
  3. Add navigation link: `<a href="#" data-page="pageName">Link</a>`.
- **Components**: Place reusable HTML in `frontend/components/`.
- **Icons**: Uses Feather Icons (`feather.replace()` is called after navigation/inclusion).

### Authentication
- **Validation**: `authService.js` enforces specific rules.
- **Protection**: Ensure sensitive backend routes use the `requireAuth` middleware.

## Development Workflow
- **Start Server**: `npm run dev` (uses `nodemon`).
- **Frontend Build**: `npm run build:frontend` (obfuscates JS).
- **Static Files**: The backend serves `frontend/` at `/` and `uploads/` at `/uploads`.

## File Structure
- `backend/index.js`: Server setup and global middleware.
- `backend/db/`: Database connection and migrations.
- `backend/lib/`: External integrations (Ably).
- `frontend/views/`: HTML content for pages.
- `frontend/js/`: Client-side logic (router, page scripts).
- `frontend/components/`: Reusable HTML fragments.
- `uploads/`: User uploaded content (images, videos).

## AI Behavior & Code Modification Guidelines
- **Preserve Existing Code**: When modifying files, do not remove existing functionality unless explicitly requested. Ensure that code outside the scope of the specific task remains unchanged.
- **Incremental Changes**: Make targeted edits rather than rewriting entire files when possible.
- **Safety**: Do not delete code that appears to be working just to "clean up" unless asked.
