# Changes

## Shared API Layer & Utilities
- Reworked `src/lib/api.ts` into a single, typed request helper with optional query params, consistent error surfacing (including backend `error` keys), and safer token access.
- Added `src/hooks/use-require-auth.ts` to centralize protected-route redirects and expose auth readiness.
- Introduced `src/components/loading-state.tsx` for an accessible, reusable spinner state.

## Authenticated Module Flows
- Updated modules list, module detail, and favorites pages to rely on the new API helper and auth hook, eliminating repeated `fetch`/`localStorage` logic.
- Added abort-safe data fetching, shared loading UI, and streamlined favorite toggling without altering existing behavior.
- Simplified the module detail route by removing unnecessary `React.use()` promise unwrapping.

## Authentication Forms
- Swapped ad-hoc fetch logic in login and register workflows for the shared API client while keeping auto-login and messaging intact.
- Tidied JWT error handling to satisfy linting and keep decoding errors actionable.

## Verification
- Ran `npm run lint` to ensure the refactor remains warning-free (`eslint` passes).
