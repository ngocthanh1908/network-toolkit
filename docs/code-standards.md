# Code Standards

## File Naming
- **Components**: PascalCase (`HeroSection.tsx`, `Layout.tsx`)
- **Hooks**: camelCase with `use` prefix (`useIpLookup.ts`)
- **Utils**: kebab-case (`history.ts`, `subnet.ts`)
- **Tests**: co-located with source, `.test.ts` suffix (`subnet.test.ts`)

## TypeScript
- No `any` type — use specific types or `unknown`
- Define types inline in the file that uses them (no shared type files)
- Use `type` over `interface` for consistency
- Use `as const` for readonly objects

## React Patterns
- Functional components only, no class components
- Custom hooks for API calls (encapsulate fetch + loading + error state)
- `useState` for local state, React Context for shared UI state only
- Lazy load pages via `React.lazy()` for code splitting
- Always handle loading + error states in UI

## Styling
- MUI components + `sx` prop — no custom CSS
- No inline `style` attributes
- Theme colors via MUI palette (dark/light mode aware)

## API Calls
- `fetch` with `async/await` (no axios)
- Always wrap in try/catch
- Show `CircularProgress` while loading
- Show `Alert` on error

## Testing
- Vitest + Testing Library
- Test files co-located: `foo.test.ts` next to `foo.ts`
- Test pure utils first (no DOM needed), then components
- No mocks for localStorage (jsdom provides it)

## Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Lint before commit
- Test before push
