# Patch Notes

This file tracks notable product, UX, and engineering changes in the project.

It is intentionally short and focused on changes that matter when you run, test, or continue development.

## 2026-04-11

### AI Assistant

- Added an in-product AI assistant for authenticated product routes.
- Added a server-side AI chat endpoint in Next.js with validation, auth checks, and rate limiting.
- Added provider integration for Gemini with clearer provider and quota error handling.
- Added product-context prompt files:
  - `AI_PRODUCT_CONTEXT.md`
  - `AI_GUIDANCE_RULES.md`
  - `AI_LIMITATIONS.md`

### Dashboard-Aware AI Context

- Added board-aware runtime context for the assistant on dashboard routes.
- Added section-aware context for:
  - board
  - users
  - settings
- Added visible-ticket context so the assistant can use ticket titles and descriptions only when those tickets are actually accessible to the current user.
- Added active-ticket context when a ticket modal is open.
- Added permission-aware ticket guidance so the assistant can tailor recommendations to actions the current user can actually perform on that ticket.

### AI Assistant UX

- Added a floating assistant launcher and chat panel UI.
- Moved the assistant launcher from the left side to the right side.
- Fixed assistant visibility and layering when ticket modals are open.
- Fixed focus handling so text can be entered into the assistant while a ticket modal is open.

### Board and Invite Settings

- Extended board schema and API usage around invite settings:
  - `allowPersonalInvites`
  - `allowSharedInvites`
  - `defaultSharedInvitationMode`
  - `inviteExpiresHours`
  - `sharedInviteMaxUses`

### Local Database and Prisma

- Synced the local development database to the current baseline migration after schema drift caused missing-column errors.
- Confirmed current Prisma migration status against the repository schema.

### Tooling and CI Stability

- Fixed `npm ci` issues caused by local cache and lockfile mismatch.
- Added explicit `@swc/helpers` dependency to keep install state aligned with the lockfile and CI.
- Fixed frontend lint issues and cleaned a few unused imports and props.

### Documentation

- Translated `DEV_NOTES.md` into Ukrainian.
- Added AI product guidance and limitation docs.
- Added this patch notes file and linked it from the main README.

## Notes

- This file is not a full changelog for every commit.
- Use it for high-signal updates that affect product behavior, developer workflow, or debugging context.