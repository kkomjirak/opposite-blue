# Opposite Blue Logo and Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사용자가 제공한 컬러·grayscale 심볼과 전체 favicon 세트를 기존 Opposite Blue UI에 접근성·반응형·static export 무결성을 유지하며 통합한다.

**Architecture:** 입력 `logo/**`는 읽기 전용으로 보존하고 배포용 PNG/manifest만 `public` 및 Next.js App Router의 metadata special-file 위치로 복사한다. Header와 Footer는 기존 텍스트·링크 구조를 유지한 채 명시적 이미지 크기로 심볼을 결합하며, Playwright와 static export read-back으로 UI와 metadata를 함께 검증한다.

**Tech Stack:** Next.js 16.4.3 App Router/static export, React 19.2.8, TypeScript, Tailwind CSS v4, Playwright, Axe.

**Spec:** `docs/superpowers/specs/2026-11-12-logo-favicon-design.md`

## Global Constraints

- 기준 workspace는 `/mnt/hermes/workspace/Opposite Blue`, remote는 `https://github.com/kkomjirak/opposite-blue.git`, branch는 `main`이다.
- 시작 전에 `pwd`, `git remote -v`, `git branch --show-current`, `git status --short`, `git rev-parse --show-toplevel`을 확인한다.
- `logo/**` 원본, `IDEA.md`, `MEMORY.md`, `portfolio/images`, `public/portfolio/images`는 수정·삭제·추가 staging하지 않는다.
- 브랜드 색은 기존 `#F2C949`, `#235888`, `#68A5D4` semantic tokens만 사용하고 raw hex를 추가하지 않는다.
- 구현 카드에서는 push/deploy하지 않는다. 독립 review 승인 후 후속 카드가 담당한다.
- Next.js 16 metadata 구현 전 `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`와 연결된 app-icons 문서를 확인한다.

## Review Focus

- 320px 폭에서 컬러 심볼, 텍스트 워드마크, Seoul 시간, 메뉴 버튼이 겹치거나 가로 overflow를 만들지 않아야 한다.
- Header 홈 링크는 이미지 추가 후에도 `Opposite Blue`로 접근 가능하고 44×44px 이상이어야 한다.
- Footer grayscale 심볼은 중복 accessible name을 만들지 않고 저작권·정책 링크 위계를 방해하지 않아야 한다.
- `next build`의 `out/`에는 favicon, Apple touch icon, 16/32px PNG, Android 192/512px PNG, webmanifest가 모두 존재하고 head/manifest 경로가 200을 반환해야 한다.
- 로고의 명시적 width/height 또는 동등한 intrinsic sizing으로 첫 렌더 layout shift를 유발하지 않아야 한다.

---

### Task 1: Metadata asset pipeline and RED coverage

**Files:**
- Create: `public/brand/oppositeblue-logo.png`
- Create: `public/brand/oppositeblue-logo-grayscale.png`
- Create: `public/favicon/favicon-16x16.png`
- Create: `public/favicon/favicon-32x32.png`
- Create: `public/favicon/android-chrome-192x192.png`
- Create: `public/favicon/android-chrome-512x512.png`
- Create: `public/site.webmanifest`
- Create: `src/app/favicon.ico`
- Create: `src/app/apple-icon.png`
- Modify: `src/app/layout.tsx`
- Test: `tests/site.spec.ts`

**Interfaces:**
- Consumes: read-only files under `logo/`.
- Produces: stable public URLs `/brand/oppositeblue-logo.png`, `/brand/oppositeblue-logo-grayscale.png`, `/favicon/*`, `/site.webmanifest`, plus Next.js-generated favicon/apple metadata.

- [ ] **Step 1: Write failing browser/static-export tests**

Add focused tests that assert the document exposes favicon and manifest links, requests to every declared icon/manifest URL return `200`, and the manifest names Opposite Blue while referencing the 192×192 and 512×512 Android icons.

- [ ] **Step 2: Run the focused test and capture a behavioral RED**

Run: `npm run test:e2e -- --grep "brand assets|favicon|manifest"`

Expected: FAIL because the new logo/manifest/icon URLs or head links do not exist yet; a selector/configuration error does not count as RED.

- [ ] **Step 3: Copy assets and wire metadata minimally**

Copy only the PNG/ICO files required above, preserving source bytes where no manifest edit is needed. Write `public/site.webmanifest` with explicit `name` and `short_name` set to `Opposite Blue`, white theme/background, standalone display, and `/favicon/android-chrome-192x192.png` plus `/favicon/android-chrome-512x512.png`. Update `metadata` in `src/app/layout.tsx` only as needed to link `/site.webmanifest` and the supplied 16/32px icons without conflicting with Next.js special files.

- [ ] **Step 4: Run the focused tests GREEN**

Run: `npm run build && npm run test:e2e -- --grep "brand assets|favicon|manifest"`

Expected: build succeeds and every focused assertion passes against the static export.

- [ ] **Step 5: Commit the metadata slice**

Stage only Task 1 paths and commit with `feat: add Opposite Blue favicon assets`.

### Task 2: Header/Footer logo placement and responsive proof

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `tests/site.spec.ts`
- Modify only if needed: `src/app/globals.css`

**Interfaces:**
- Consumes: `/brand/oppositeblue-logo.png` and `/brand/oppositeblue-logo-grayscale.png` from Task 1.
- Produces: Header home link containing the color symbol plus existing `Opposite Blue.` text; Footer brand/rights area containing the grayscale symbol.

- [ ] **Step 1: Load the UI craft floor before editing**

Run Impeccable context only if not already loaded, then read the skill’s `reference/craft-floor.md`. Preserve the incumbent visual system; this is a narrow refinement, not a redesign.

- [ ] **Step 2: Extend tests and verify RED**

Add assertions for the exact Header color-logo URL, Footer grayscale-logo URL, Header link accessible name, explicit rendered dimensions, minimum 44px home-link target, and no horizontal overflow at 320/390/768/1440px. Run the focused test and confirm it fails because the images are absent.

- [ ] **Step 3: Implement minimal logo placement**

Use the project’s established image approach. Give both symbols explicit width/height or equivalent intrinsic sizing; keep the Header text wordmark and yellow dot; make redundant image alt text empty/hidden from accessibility; use existing spacing/color utilities and no raw hex. Keep Header compact enough that the time label and mobile menu remain stable at 320px. Place the grayscale symbol in the Footer’s lower brand/rights region without creating a second card or decorative background.

- [ ] **Step 4: Run focused visual/accessibility checks**

Run the focused Playwright tests at 320, 390, 768, and 1440 widths. Capture at least mobile and desktop Header/Footer screenshots from the built static export and record their paths in the Kanban handoff.

- [ ] **Step 5: Run the mechanical design detector once**

Run: `/home/kkomjirak/.hermes/skills/impeccable/scripts/impeccable detect --json src/components/Header.tsx src/components/Footer.tsx src/app/layout.tsx`

Expected: no unresolved FAIL findings. Fix findings without expanding scope.

- [ ] **Step 6: Run full regression and integrity gates**

Run in order: `git diff --check`; `npm run lint`; `npm run build`; `npm run test:unit`; `npm run test:e2e`. Also verify `cmp -s src/data/portfolio_data.json portfolio/data/portfolio_data.json`, `readlink public/portfolio/images`, and that `git status --short` leaves `IDEA.md`, `MEMORY.md`, and input `logo/` unstaged/unmodified.

- [ ] **Step 7: Commit the UI slice and complete the card**

Stage only the approved UI/test paths and commit with `feat: integrate Opposite Blue brand marks`. Record both commit SHAs, changed files, test totals, screenshot paths, detector result, and remaining blockers in `kanban_complete`. Do not push.

## Self-Review

- Spec coverage: Header color mark, Footer grayscale mark, favicon family, source preservation, responsiveness, accessibility, static export, review/deploy separation are all mapped to Tasks 1–2.
- Step granularity: RED, minimal GREEN, focused proof, full regression, and commits are separate checkable actions.
- Type consistency: both UI components consume the public URLs produced by Task 1; no new runtime API is introduced.
- Review Focus: each listed failure mode has an explicit test or export read-back in Tasks 1–2.
- Proportion: the plan decides paths, behavior, evidence, and boundaries without prescribing component bodies.
