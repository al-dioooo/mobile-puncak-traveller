# Tailwind CSS Setup & Old Project Migration

## I. Executive Summary

**Goal**: Install and configure Tailwind CSS v4 + NativeWind v5 in `mobile-puncak-traveller` (Expo SDK 54), then migrate all pages, logic, and infrastructure from `mobile-puncak-traveller-old`.

**Success Metrics**:
- Zero TypeScript compile errors after migration.
- `expo start` launches without runtime errors on iOS, Android, and web.
- All pages from the old project are accessible and functional in the new project.

---

## II. Skill Matrix

| Component | Skill / Reference | Role |
|---|---|---|
| Tailwind CSS v4 + NativeWind v5 | `expo-tailwind-setup` SKILL.md | CSS-first config, Metro transformer, PostCSS |
| CSS component wrappers | `expo-tailwind-setup` SKILL.md | `useCssElement` wrappers in `src/tw/` |
| Auth + API layer | Migrated from `mobile-puncak-traveller-old/src/lib/` | `api.ts`, `auth-storage.ts`, `types.ts` |
| React Query | `@tanstack/react-query` | Server-state caching via `QueryClientProvider` |
| Secure token storage | `expo-secure-store` | Cross-platform token persistence |

---

## III. Architecture

```
mobile-puncak-traveller/
├── src/
│   ├── app/                   ← Expo Router app dir (configured via routerRoot)
│   │   ├── _layout.tsx        ← Root layout with AppProviders + Stack
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── bookings.tsx
│   │   │   └── profile.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── auth/google/callback.tsx
│   │   ├── runners.tsx
│   │   ├── stays.tsx
│   │   ├── camping.tsx
│   │   ├── events/[slug].tsx
│   │   ├── places/[id].tsx
│   │   ├── bookings/[reference].tsx
│   │   └── account-preferences.tsx
│   ├── components/            ← UI components
│   ├── constants/theme.ts     ← Palette, Colors, Fonts, Spacing, Radius
│   ├── hooks/                 ← use-auth, use-puncak-api, use-color-scheme
│   ├── lib/                   ← api.ts, auth-storage.ts, cn.ts, types.ts
│   ├── providers/             ← auth-provider.tsx (QueryClient + AuthContext)
│   ├── tw/                    ← CSS wrapper components
│   │   ├── index.tsx          ← View, Text, Pressable, ScrollView, TextInput, Link
│   │   ├── image.tsx          ← Image (expo-image + CSS)
│   │   └── animated.tsx       ← Animated.View
│   ├── types/css.d.ts
│   └── global.css             ← Tailwind v4 imports + @theme puncak variables
├── metro.config.js
├── postcss.config.mjs
├── tsconfig.json              ← "@/*": ["./src/*"]
└── app.json                   ← routerRoot: "src", expo-secure-store plugin
```

**Key architecture decisions:**
- `@/*` maps to `./src/*` (matching old project convention).
- Tailwind theme uses CSS `@theme` variables in `global.css` (v4 CSS-first, no `tailwind.config.js`).
- NativeWind v5 with `react-native-css` — no Babel config needed.
- Old project's `app/` root-level boilerplate (index.tsx, explore.tsx, modal.tsx) is deleted since the new `src/app/` takes over.

---

## IV. Phased Roadmap

---

## Stage 1: Tailwind CSS v4 Environment Setup
> **Entry Condition**: `mobile-puncak-traveller` compiles with `npx tsc --noEmit` and `expo start` launches the default boilerplate.
> **Exit Condition**: `metro.config.js`, `postcss.config.mjs`, and `src/global.css` exist; `expo start` launches without Tailwind errors; a test screen renders a colored className correctly.

### Module 1.1: Install Dependencies

- [ ] [P1.1.1] Install Tailwind v4 + NativeWind v5 packages: Run `npx expo install tailwindcss@^4 "nativewind@5.0.0-preview.2" "react-native-css@0.0.0-nightly.5ce6396" @tailwindcss/postcss tailwind-merge clsx`
      depends_on: none
      Verify: All packages appear in `node_modules`; `package.json` dependencies updated.

- [ ] [P1.1.2] Add lightningcss resolution: Add `"resolutions": { "lightningcss": "1.30.1" }` to `package.json`
      depends_on: P1.1.1
      Verify: `package.json` contains the resolutions field.

- [ ] [P1.1.3] Install additional runtime dependencies: Run `npx expo install @tanstack/react-query expo-secure-store`
      depends_on: P1.1.1
      Verify: Both packages appear in `package.json` dependencies.

### Module 1.2: Config Files

- [ ] [P1.2.1] Create `metro.config.js`: Use `withNativewind` with `inlineVariables: false, globalClassNamePolyfill: false` as specified in the `expo-tailwind-setup` skill.
      depends_on: P1.1.1
      Verify: File exists at project root; references `nativewind/metro`.

- [ ] [P1.2.2] Create `postcss.config.mjs`: Export `{ plugins: { "@tailwindcss/postcss": {} } }`.
      depends_on: P1.1.1
      Verify: File exists at project root.

### Module 1.3: TypeScript & Expo Router Directory Config

- [ ] [P1.3.1] Update `tsconfig.json`: Change `"@/*"` paths from `["./*"]` to `["./src/*"]`; add `"@/assets/*": ["./assets/*"]`; add `nativewind-env.d.ts` to include array.
      depends_on: none
      Verify: `tsconfig.json` paths section shows `./src/*`.

- [ ] [P1.3.2] Update `app.json` to configure Expo Router source root: Add `"expo-secure-store"` to plugins array; add `"routerRoot": "src"` under `expo.experiments`.
      depends_on: none
      Verify: `app.json` experiments block contains `"routerRoot": "src"`.

- [ ] [P1.3.3] Create `nativewind-env.d.ts` at project root: Add `/// <reference types="nativewind/types" />`.
      depends_on: P1.1.1
      Verify: File exists at project root.

### Module 1.4: Global CSS

- [ ] [P1.4.1] Create `src/` directory and `src/global.css`: Add Tailwind v4 imports plus `@theme` block with all puncak brand variables (colors, borderRadius, fontFamily) translated from old `tailwind.config.js` to CSS custom properties.
      depends_on: P1.3.1
      Verify: File exists at `src/global.css`; contains `@import "tailwindcss/theme.css" layer(theme)` and `--color-puncak-orange: #F37820`.

### 🧪 Stage 1 Test Procedures

#### Test 1.1: Metro Start Without Errors
- **Type**: Manual
- **Preconditions**: All config files exist; `node_modules` installed.
- **Steps**:
  1. Run `npx expo start` from the `mobile-puncak-traveller` directory.
  2. Open on iOS simulator or Expo Go.
- **Expected Result**: App launches; Metro bundler logs show no PostCSS or NativeWind errors.
- **Fail Indicators**: `Cannot find module 'nativewind/metro'`, PostCSS plugin errors, Metro bundler crash.

> Stage 1 is partially testable — the app will still show old boilerplate content, but the toolchain must be error-free.

---

## Stage 2: Core Infrastructure Migration
> **Entry Condition**: Stage 1 complete; `src/` directory exists; Metro starts without Tailwind errors.
> **Exit Condition**: All library files, hooks, constants, providers, and CSS wrappers exist in `src/`; TypeScript resolves all `@/` imports with zero errors.

### Module 2.1: Library Layer

- [ ] [P2.1.1] Create `src/lib/types.ts`: Copy from `mobile-puncak-traveller-old/src/lib/types.ts` verbatim.
      depends_on: none
      Verify: File exists; exports `ApiCollection`, `ApiResource`, `AuthUser`, `Event`, `Place`, `BookingDetail`, etc.

- [ ] [P2.1.2] Create `src/lib/api.ts`: Copy from `mobile-puncak-traveller-old/src/lib/api.ts`; verify `API_BASE_URL` uses `EXPO_PUBLIC_API_URL`.
      depends_on: P2.1.1
      Verify: File exists; exports `api`, `apiRequest`, `assetUrl`, `ApiError`.

- [ ] [P2.1.3] Create `src/lib/auth-storage.ts`: Copy from `mobile-puncak-traveller-old/src/lib/auth-storage.ts`; uses `expo-secure-store` for native, `localStorage` for web.
      depends_on: P1.1.3
      Verify: File exists; exports `getStoredToken`, `setStoredToken`, `clearStoredToken`.

- [ ] [P2.1.4] Create `src/lib/cn.ts`: Create utility that combines `clsx` + `tailwind-merge` — `export function cn(...inputs) { return twMerge(clsx(inputs)); }`.
      depends_on: P1.1.1
      Verify: File exists; exports `cn` function.

### Module 2.2: Constants

- [ ] [P2.2.1] Create `src/constants/theme.ts`: Copy from `mobile-puncak-traveller-old/src/constants/theme.ts`; exports `Palette`, `Colors`, `Fonts`, `Spacing`, `Radius`, `Shadow`, `MaxContentWidth`.
      depends_on: none
      Verify: File exists; `Colors.light.primary` equals `'#F37820'`.

### Module 2.3: Providers

- [ ] [P2.3.1] Create `src/providers/auth-provider.tsx`: Copy from `mobile-puncak-traveller-old/src/providers/auth-provider.tsx`; exports `AuthContext`, `AppProviders`.
      depends_on: P2.1.2, P2.1.3, P1.1.3
      Verify: File exists; `AppProviders` wraps `QueryClientProvider` + `AuthProviderInner`.

### Module 2.4: Hooks

- [ ] [P2.4.1] Create `src/hooks/use-auth.ts`: Copy from `mobile-puncak-traveller-old/src/hooks/use-auth.ts`; reads from `AuthContext`.
      depends_on: P2.3.1
      Verify: File exists; exports `useAuth`.

- [ ] [P2.4.2] Create `src/hooks/use-puncak-api.ts`: Copy from `mobile-puncak-traveller-old/src/hooks/use-puncak-api.ts`; exports all React Query hooks.
      depends_on: P2.4.1, P2.1.2
      Verify: File exists; exports `useLanding`, `useEvents`, `useEvent`, `usePlace`, `useBookings`, `useBooking`, etc.

- [ ] [P2.4.3] Create `src/hooks/use-color-scheme.ts`: Adapt from `mobile-puncak-traveller-old/src/hooks/use-color-scheme.ts`; returns `'light' | 'dark'`.
      depends_on: none
      Verify: File exists; exports `useColorScheme`.

### Module 2.5: CSS Component Wrappers (`src/tw/`)

- [ ] [P2.5.1] Create `src/tw/index.tsx`: Copy from `mobile-puncak-traveller-old/src/tw/index.tsx`; uses `useCssElement` from `react-native-css`; exports `View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, `TouchableHighlight`, `Link`, `useCSSVariable`.
      depends_on: P1.1.1
      Verify: File exists; imports `react-native-css`; exports all listed components.

- [ ] [P2.5.2] Create `src/tw/image.tsx`: Copy from `mobile-puncak-traveller-old/src/tw/image.tsx`; wraps `expo-image` with CSS support.
      depends_on: P2.5.1
      Verify: File exists; exports `Image` and `ImageProps`.

- [ ] [P2.5.3] Create `src/tw/animated.tsx`: Copy from `mobile-puncak-traveller-old/src/tw/animated.tsx`; exports `Animated.View` wrapping `TW.View`.
      depends_on: P2.5.1
      Verify: File exists; exports `Animated` with `View` property.

### Module 2.6: Type Declarations

- [ ] [P2.6.1] Create `src/types/css.d.ts`: Copy from `mobile-puncak-traveller-old/src/types/css.d.ts`; adds CSS module declarations.
      depends_on: none
      Verify: File exists.

### 🧪 Stage 2 Test Procedures

#### Test 2.1: TypeScript Compile Check
- **Type**: Automated
- **Preconditions**: All `src/lib/`, `src/hooks/`, `src/constants/`, `src/providers/`, `src/tw/` files created.
- **Steps**:
  1. Run `npx tsc --noEmit` from `mobile-puncak-traveller/`.
- **Expected Result**: Zero TypeScript errors across all migrated files.
- **Pass Command**: `npx tsc --noEmit`
- **Fail Indicators**: `Cannot find module '@/...'`, type mismatch errors in migrated files.

#### Test 2.2: Import Resolution
- **Type**: Manual
- **Preconditions**: `tsconfig.json` paths updated to `./src/*`.
- **Steps**:
  1. Open `src/providers/auth-provider.tsx` in VS Code.
  2. Hover over `@/lib/api` import — confirm IntelliSense resolves to `src/lib/api.ts`.
  3. Hover over `@/lib/auth-storage` — confirm it resolves to `src/lib/auth-storage.ts`.
- **Expected Result**: All `@/` imports resolve to files under `src/`.
- **Fail Indicators**: Red underlines on `@/` imports; "Cannot find module" hover errors.

---

## Stage 3: App Directory Migration
> **Entry Condition**: Stage 2 complete; zero TypeScript errors in infrastructure files.
> **Exit Condition**: `src/app/` fully populated; old root-level `app/` boilerplate removed; root layout imports `AppProviders` and all screen routes are declared.

### Module 3.1: Root Layout

- [ ] [P3.1.1] Create `src/app/_layout.tsx`: Adapt from `mobile-puncak-traveller-old/src/app/_layout.tsx`; import `@/global.css`; wrap with `AppProviders`; declare all Stack screens (tabs, login, register, auth/google/callback, runners, stays, camping, events/[slug], places/[id], bookings/[reference], account-preferences).
      depends_on: P2.3.1, P1.4.1
      Verify: File exists; imports `'@/global.css'`; imports `AppProviders`; all routes listed as `Stack.Screen`.

- [ ] [P3.1.2] Remove old root-level `app/` boilerplate: Delete `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx`, `app/(tabs)/_layout.tsx`, `app/_layout.tsx`, `app/modal.tsx`. These are now replaced by `src/app/`.
      depends_on: P3.1.1
      Verify: `app/` directory is empty or removed.

### Module 3.2: Tabs Layout & Tab Screens

- [ ] [P3.2.1] Create `src/app/(tabs)/_layout.tsx`: Copy from `mobile-puncak-traveller-old/src/app/(tabs)/_layout.tsx`; uses `expo-symbols` + `Colors.light` for tab styling; 4 tabs (Home, Explore, Bookings, Profile).
      depends_on: P2.2.1
      Verify: File exists; defines Tabs with home, explore, bookings, profile screens.

- [ ] [P3.2.2] Create `src/app/(tabs)/index.tsx`: Copy from `mobile-puncak-traveller-old/src/app/(tabs)/index.tsx`; migrate imports to `@/tw`, `@/lib`, `@/hooks`.
      depends_on: P3.2.1, P2.5.1, P2.5.2
      Verify: File exists; imports from `@/tw` not from `react-native` directly.

- [ ] [P3.2.3] Create `src/app/(tabs)/explore.tsx`: Copy from `mobile-puncak-traveller-old/src/app/(tabs)/explore.tsx`; migrate imports.
      depends_on: P3.2.1, P2.5.1
      Verify: File exists; no broken imports.

- [ ] [P3.2.4] Create `src/app/(tabs)/bookings.tsx`: Copy from `mobile-puncak-traveller-old/src/app/(tabs)/bookings.tsx`; migrate imports.
      depends_on: P3.2.1, P2.5.1, P2.4.2
      Verify: File exists; uses `useBookings` from `@/hooks/use-puncak-api`.

- [ ] [P3.2.5] Create `src/app/(tabs)/profile.tsx`: Copy from `mobile-puncak-traveller-old/src/app/(tabs)/profile.tsx`; migrate imports.
      depends_on: P3.2.1, P2.5.1, P2.4.1
      Verify: File exists; uses `useAuth` from `@/hooks/use-auth`.

### Module 3.3: Auth Screens

- [ ] [P3.3.1] Create `src/app/login.tsx`: Copy from `mobile-puncak-traveller-old/src/app/login.tsx`; migrate imports to `@/tw` and `@/hooks`.
      depends_on: P3.1.1, P2.5.1, P2.4.1
      Verify: File exists; uses `useAuth` for login/register navigation.

- [ ] [P3.3.2] Create `src/app/register.tsx`: Copy from `mobile-puncak-traveller-old/src/app/register.tsx`; migrate imports.
      depends_on: P3.3.1
      Verify: File exists; no broken imports.

- [ ] [P3.3.3] Create `src/app/auth/google/callback.tsx`: Copy from `mobile-puncak-traveller-old/src/app/auth/google/callback.tsx`; handles `exchangeGoogleCode` redirect.
      depends_on: P2.4.1
      Verify: File exists; reads URL params; calls `exchangeGoogleCode`.

### Module 3.4: Feature Screens

- [ ] [P3.4.1] Create `src/app/runners.tsx`: Copy from `mobile-puncak-traveller-old/src/app/runners.tsx`; migrate imports.
      depends_on: P3.1.1, P2.5.1
      Verify: File exists.

- [ ] [P3.4.2] Create `src/app/stays.tsx`: Copy from `mobile-puncak-traveller-old/src/app/stays.tsx`; migrate imports.
      depends_on: P3.1.1, P2.5.1
      Verify: File exists.

- [ ] [P3.4.3] Create `src/app/camping.tsx`: Copy from `mobile-puncak-traveller-old/src/app/camping.tsx`; migrate imports.
      depends_on: P3.1.1, P2.5.1
      Verify: File exists.

- [ ] [P3.4.4] Create `src/app/events/[slug].tsx`: Copy from `mobile-puncak-traveller-old/src/app/events/[slug].tsx`; migrate imports; uses `useEvent` hook.
      depends_on: P2.4.2, P2.5.1
      Verify: File exists; uses `useLocalSearchParams` and `useEvent`.

- [ ] [P3.4.5] Create `src/app/places/[id].tsx`: Copy from `mobile-puncak-traveller-old/src/app/places/[id].tsx`; migrate imports; uses `usePlace` hook.
      depends_on: P2.4.2, P2.5.1
      Verify: File exists; uses `useLocalSearchParams` and `usePlace`.

- [ ] [P3.4.6] Create `src/app/bookings/[reference].tsx`: Copy from `mobile-puncak-traveller-old/src/app/bookings/[reference].tsx`; migrate imports; uses `useBooking` and `useCancelBooking`.
      depends_on: P2.4.1, P2.4.2, P2.5.1
      Verify: File exists; uses auth guard and booking hooks.

- [ ] [P3.4.7] Create `src/app/account-preferences.tsx`: Copy from `mobile-puncak-traveller-old/src/app/account-preferences.tsx`; migrate imports; uses `useUpdateMe` mutation.
      depends_on: P2.4.1, P2.4.2, P2.5.1
      Verify: File exists; uses `useUpdateMe` from `@/hooks/use-puncak-api`.

### Module 3.5: Shared Components

- [ ] [P3.5.1] Migrate `src/components/` from old project: Copy `puncak/cards.tsx`, `puncak/ui.tsx`, `external-link.tsx`, `themed-text.tsx`, `themed-view.tsx`, `ui/collapsible.tsx`, `hint-row.tsx`, `web-badge.tsx`; update imports to use `@/tw` instead of `react-native`.
      depends_on: P2.5.1, P2.5.2, P2.2.1
      Verify: All files exist under `src/components/`; no bare `react-native` View/Text/Pressable imports (should use `@/tw` wrappers).

### 🧪 Stage 3 Test Procedures

#### Test 3.1: TypeScript Full Compile
- **Type**: Automated
- **Preconditions**: All `src/app/` files created.
- **Steps**:
  1. Run `npx tsc --noEmit` from `mobile-puncak-traveller/`.
- **Expected Result**: Zero TypeScript errors.
- **Pass Command**: `npx tsc --noEmit`
- **Fail Indicators**: Type errors in any `src/app/` file; unresolved `@/` imports.

#### Test 3.2: App Launches to Home Tab
- **Type**: Manual
- **Preconditions**: Metro config correct; `src/global.css` imported in root layout; `AppProviders` wraps tree.
- **Steps**:
  1. Run `npx expo start --ios` (or `--android`).
  2. Open the app in simulator.
  3. Observe: app renders the Home tab without crashing.
  4. Tap the Explore, Bookings, and Profile tabs.
- **Expected Result**: All 4 tabs are accessible; no white screen or red error screen.
- **Fail Indicators**: "Unmatched route" error, `useAuth must be used inside AppProviders` error, white screen.

#### Test 3.3: Auth Flow Navigation
- **Type**: Manual
- **Preconditions**: App launched; Bookings or Profile tab accessible.
- **Steps**:
  1. Tap Profile tab while unauthenticated.
  2. Confirm app navigates to `/login` screen.
  3. Confirm login screen renders with email and password fields.
- **Expected Result**: Login screen renders; no crash.
- **Fail Indicators**: Crash on navigation; `Cannot read properties of null` errors.

---

## Stage 4: Tailwind Theme Migration
> **Entry Condition**: Stage 3 complete; app launches and all pages are reachable.
> **Exit Condition**: All puncak brand colors, font families, and spacing are defined as Tailwind v4 CSS variables in `src/global.css`; existing className usages resolve to correct visual output.

### Module 4.1: CSS Theme Variables

- [ ] [P4.1.1] Expand `src/global.css` with full `@theme` block: Translate all entries from old `tailwind.config.js` `theme.extend` (colors, borderRadius, fontSize, fontFamily) into CSS `@theme` custom property syntax (e.g., `--color-puncak-orange: #F37820`, `--radius-puncak-card: 20px`, `--font-sans: Inter, ...`).
      depends_on: P1.4.1
      Verify: `global.css` contains `--color-puncak-orange`, `--color-puncak-teal`, `--color-puncak-ink`, `--radius-puncak-card`, `--font-sans`, `--text-2xs`.

- [ ] [P4.1.2] Add platform-specific font CSS variables: Add `@media ios` and `@media android` blocks with native font family overrides as shown in the `expo-tailwind-setup` skill.
      depends_on: P4.1.1
      Verify: `global.css` contains `@media ios { :root { --font-sans: system-ui; } }`.

### 🧪 Stage 4 Test Procedures

#### Test 4.1: Brand Color Rendering
- **Type**: Manual
- **Preconditions**: App launched; Home screen visible.
- **Steps**:
  1. Inspect a component using `className="bg-puncak-orange"` in the Home screen.
  2. Confirm the background renders as `#F37820` (orange).
- **Expected Result**: Puncak orange color renders correctly on screen.
- **Fail Indicators**: Color shows as default black/white; `unknown utility class` warning in Metro logs.

#### Test 4.2: CSS Variable Resolution
- **Type**: Manual
- **Preconditions**: App launched on iOS simulator.
- **Steps**:
  1. Navigate to any screen using `font-sans` className.
  2. Observe text renders using the system sans-serif font.
- **Expected Result**: Text renders in system font on iOS (not a fallback monospace).
- **Fail Indicators**: Text renders in wrong font; font-related Metro warnings.

---

## V. Final Verification Checklist

- [ ] `npx tsc --noEmit` passes with zero errors.
- [ ] `npx expo start` launches without Metro bundler errors.
- [ ] App renders Home tab with puncak brand colors.
- [ ] Navigating to Login, Register works; Google OAuth redirect is configured.
- [ ] Bookings tab shows correct auth-gated content.
- [ ] `useBookings`, `useEvent`, `usePlace` hooks resolve data from API without type errors.
- [ ] `className="bg-puncak-orange text-puncak-ink"` produces correct visual output on device.
- [ ] No `react-native` View/Text used directly in pages — all go through `@/tw` wrappers.
- [ ] `expo-secure-store` plugin present in `app.json`; `getStoredToken` / `setStoredToken` works on native.
- [ ] Old root-level `app/` directory is cleaned up (no conflicting routes).
