# Opposite Blue 스레드 인수인계 문서

> 작성 목적: 이 문서를 새 Discord 스레드의 오케스트레이터와 각 작업 bot이 먼저 읽고, 현재 프로젝트의 기준·작업 방식·완료 내역을 동일하게 이해하도록 한다.

## 1. 프로젝트 정체성 — 반드시 혼동하지 말 것

- **기준 작업 디렉터리:** `/mnt/hermes/workspace/Opposite Blue`
- **사용하지 않는 작업 디렉터리:** `/mnt/orca/workspace/opposite-blue`
- **GitHub 저장소:** `https://github.com/kkomjirak/opposite-blue.git`
- **원격 이름:** `origin`
- **기준 브랜치:** `main`
- **실서비스:** `https://oppositeblue.co.kr`
- **배포 방식:** GitHub Pages + GitHub Actions
- **코드 기준 커밋(인수인계 문서 작성 전):** `6d92d29` — `feat: show technology stack on website cards`
- **현재 원격 상태:** `HEAD`와 `origin/main` 동기화됨

새 스레드에서 작업을 시작할 때 반드시 다음을 먼저 확인한다.

```bash
cd "/mnt/hermes/workspace/Opposite Blue"
pwd
git remote -v
git branch --show-current
git status --short
git rev-parse --show-toplevel
```

`origin`이 `kkomjirak/opposite-blue`가 아니거나 작업 경로가 위 경로가 아니면 수정·commit·push를 진행하지 않는다.

## 2. 새 스레드의 협업 방식

사용자는 새 스레드에서 다음 오케스트레이터에게 지시한다.

- 오케스트레이터: `<@1550565125017313461>`
- 모든 실제 작업은 오케스트레이터가 칸반을 통해 각 bot에게 분배한다.
- 사용자가 직접 요청하지 않은 작업을 임의로 확장하지 않는다.
- 한 작업 카드는 한 bot이 파일 소유권을 갖고 진행하며, 같은 파일을 여러 bot이 동시에 수정하지 않는다.
- 오케스트레이터는 각 카드의 의존성·담당 bot·검수 bot·검증 결과를 관리한다.

### 권장 칸반 컬럼

1. `Backlog` — 사용자 요청을 원자적인 작업으로 분해
2. `Ready` — 선행 조건이 충족되어 bot에 배정 가능
3. `In Progress` — 담당 bot 작업 중
4. `Review` — diff·보안·요구사항 검토
5. `Verify` — lint/build/unit/E2E/live 확인
6. `Done` — 검증과 배포까지 완료
7. `Blocked` — 원인·필요한 사용자 결정·해결 조건 기록

### 카드 운영 규칙

- 카드에는 목표, 담당 파일, 금지 범위, 완료 조건, 검증 명령을 명시한다.
- bot은 작업 시작 전에 관련 파일·현재 diff·package/config를 확인한다.
- bot은 다른 bot의 파일을 덮어쓰지 않는다.
- 완료 보고에는 실제 변경 경로, 테스트 명령과 결과, 남은 위험 또는 blocker를 포함한다.
- 외부 상태를 변경하는 작업(GitHub push, 배포 등)은 결과를 읽어 확인한 뒤 완료로 표시한다.
- 사용자 요청이 새로 들어오면 오래된 카드보다 최신 요청을 우선하고, 더 이상 필요 없는 작업은 중단한다.
- destructive operation, 파일 삭제, 기존 파일 전체 교체가 필요하면 먼저 사용자 확인을 받는다.

## 3. 사용자 선호와 고정 제약

- 수정이 완료되고 검증되면 별도 재확인 없이 GitHub `main` push 및 GitHub Pages 배포까지 진행한다.
- 단, 기존 파일 덮어쓰기·삭제·파괴적 변경은 사용자 확인이 우선이다.
- 기존 의미·콘텐츠·이미지를 불필요하게 바꾸지 않는다.
- `IDEA.md`, `MEMORY.md`는 기존 로컬 문서이므로 보존한다. 현재 두 파일은 의도적으로 untracked 상태다.
- `public/portfolio/images`는 `../../portfolio/images` 상대 심볼릭 링크로 유지한다.
- `portfolio/images` 원본은 삭제·덮어쓰기하지 않는다. 새 이미지는 새 경로에 추가한다.
- API 키·토큰·인증 정보·FormSubmit 비밀값은 저장소와 문서에 기록하지 않는다.
- 사용자 지정 브랜드 팔레트:
  - 핵심 노랑: `#F2C949`
  - AI/딥 블루: `#235888`
  - 크리에이티브/아이스버그 블루: `#68A5D4`
- 디자인 변경은 기존 미니멀·에디토리얼 정체성을 유지하면서 접근성·반응형·가독성을 우선한다.

## 4. 기술 스택과 실행 명령

### 애플리케이션

- Next.js `16.4.3`, App Router, Turbopack
- React `19.2.8`, TypeScript
- Tailwind CSS v4
- Lucide React
- Geist / Geist Mono
- CSS transitions/animations, `prefers-reduced-motion` 지원
- Next static export: `output: 'export'`
- 이미지: `sharp` 기반 content-hashed WebP 파생 이미지
- 문의: FormSubmit AJAX → `contact@oppositeblue.co.kr`
- 호스팅: GitHub Pages

### 주요 명령

```bash
npm run lint
npm run build                 # prebuild에서 이미지 파생/manifest 생성
npm run test:unit             # Node 이미지 파이프라인 테스트 3개
npm run test:e2e              # Playwright 전체 테스트
npm start                     # out/ 정적 export 로컬 미리보기, next start 사용 금지
```

### CI

`.github/workflows/deploy.yml`은 `main` push 시 다음을 실행한다.

1. Ubuntu 24.04 / Node 24
2. `npm ci`
3. `npm run lint`
4. `npm run build`
5. Chromium 설치
6. `npm run test:unit && npm run test:e2e`
7. `out/`을 GitHub Pages에 배포

## 5. 포트폴리오 데이터 규칙

- **Runtime 데이터:** `src/data/portfolio_data.json`
- **Archive 데이터:** `portfolio/data/portfolio_data.json`
- 두 JSON은 항상 byte-for-byte로 동일하게 유지한다.
- 타입: `src/types/portfolio.ts`
- 이미지 manifest: `src/data/portfolio_images.json`
- 이미지 원본: `portfolio/images/...`
- 정적 파생 이미지: `public/portfolio-optimized/...`

현재 데이터는 32개 프로젝트이며 웹사이트 카테고리는 10개다.

### 현재 주요 항목

#### ID 33 — 디자인회사

- 카테고리: `웹사이트`
- 제작 연월: `2026년 10월`
- 기술 스택 표시값: `Next.js 기반 3D 인터랙티브 웹`
- 라이브 사이트: `https://jid.kr/`
- 이미지 원본: `portfolio/images/websites/33_design-company/01_design-company.jpeg`
- 최적화 WebP 400/800/1200px 생성 완료
- 프로젝트 설명의 기술 스택 8개 항목은 `text_lines`에 보존

#### ID 32 — 브랜드 의류 쇼핑몰

- 카테고리: `웹사이트`
- 상태: `운영 중단`
- `https://cheiser.kr/` 외부 방문 링크는 비활성화
- 설명·이미지는 유지
- 기술 스택 설명값: `SaaS 기반 이커머스 솔루션(카페24)`

### 정렬 규칙 — 사용자의 명시적 기준

- **프로젝트 ID 순이 아니다.**
- 웹사이트 목록은 `production_date`의 제작 연월을 파싱하여 최신순(내림차순)으로 표시한다.
- 현재 최상단은 `디자인회사(2026년 10월)`이다.
- 제작 연월이 같으면 ID 내림차순을 보조 정렬 기준으로 사용한다.
- 현재 디자인 카테고리 항목은 대부분 제작 연월 데이터가 없으므로 기존 ID 내림차순을 유지한다. 새 제작 연월 정보가 들어오면 해당 카테고리도 사용자 기준에 맞게 검토한다.
- 정렬 로직은 `src/app/projects/page.tsx`의 `parseProductionMonth()`와 `websiteProjects`에서 관리한다.

### 기술 스택 문구 규칙

프로젝트 상세 모달의 메타 라벨은 다음으로 고정한다.

- 기존: `사용 솔루션 (CMS)`
- 현재: `기술 스택`

프로젝트 설명(`text_lines`)의 기존 CMS 문구는 다음으로 바꾼다.

- `CMS : 카페24` → `SaaS 기반 이커머스 솔루션(카페24)`
- `CMS : 고도몰` → `SaaS 기반 이커머스 솔루션(고도몰)`
- `CMS : 그누보드` → `설치형 오픈소스 CMS(그누보드)`

웹사이트 목록 카드의 썸네일 아래 두 번째 줄은 `project.cms`를 우선 표시하고, 기술 스택이 없는 항목만 `text_lines[0]`을 fallback으로 사용한다.

## 6. UI 구현 규칙

- `/projects?cat=websites|design&project=ID`는 공유 가능한 상세 상태 URL이다.
- 프로젝트 카드는 native anchor, 상세는 native `<dialog>`를 사용한다.
- Escape, backdrop, Back/Forward, focus restore, scroll restore를 유지한다.
- 링크와 버튼은 44px 이상 터치 영역을 유지한다.
- 썸네일 태그는 `inline-flex items-center leading-none`으로 세로 중앙 정렬한다.
- 브랜드 token 외 임의의 raw hex를 추가하지 않는다.
- reduced-motion에서도 콘텐츠가 첫 화면에 보이도록 한다.
- 이미지가 없으면 임의의 이미지를 만들지 말고 `이미지 없음` fallback을 사용한다.

## 7. 완료된 주요 작업 이력

- 기준 workspace를 `/mnt/hermes/workspace/Opposite Blue`로 확정하고 Orca 사본 제외
- `public/portfolio/images` 상대 심볼릭 링크 복구
- Linux용 의존성 재설치 및 Next/ESLint 실행 파일 복구
- FormSubmit AJAX 문의 폼 연결·활성화·오류 복구 개선
- 브랜드 팔레트 `#F2C949`, `#68A5D4`, `#235888` 적용
- Header, Footer, About, Privacy, Terms 접근성·UX 개선
- `/projects` native 링크/dialog/deep-link/history/focus/scroll 구조 개선
- 포트폴리오 이미지 WebP pipeline 및 manifest 추가
- Playwright/Node 이미지 테스트와 GitHub Actions 검증 강화
- `브랜드 의류 쇼핑몰` 운영 중단 표시 및 외부 링크 비활성화
- `디자인회사` 프로젝트 추가, 첨부 이미지 등록, 제작 연월·기술 스택 반영
- 웹사이트 제작 연월 정렬, CMS 설명 문구 정리, 썸네일 태그 중앙 정렬
- 웹사이트 카드의 설명 줄을 기술 스택 표시로 변경

### 최근 커밋

```text
6d92d29 feat: show technology stack on website cards
bb04f2a content: refine design company technology stack
1aeca0d refactor: sort projects by production date and clarify stack labels
705162e chore: update design company project metadata
bd28b82 feat: add design company portfolio image
f523759 feat: add design company portfolio project
```

## 8. 마지막 검증 상태

현재 마지막 변경 기준으로 다음을 통과했다.

- `npm run lint` 통과
- `npm run build` 통과
- `npm run test:unit` — 3개 통과
- `npm run test:e2e` — 63개 통과
- 실제 `https://oppositeblue.co.kr/projects?cat=websites`에서 디자인회사 카드의 기술 스택 표시 확인
- 실제 상세 모달에서 `Next.js 기반 3D 인터랙티브 웹` 표시 확인
- 마지막 GitHub Actions 배포 성공
- 마지막 배포 확인 커밋: `6d92d29`

## 9. 새 작업의 표준 종료 조건

작업은 파일을 수정한 시점이 아니라 다음을 모두 충족했을 때 `Done`으로 표시한다.

- 요구사항별 acceptance test가 존재하거나 기존 테스트로 검증됨
- runtime/archive 데이터가 일치함
- `git diff --check` 통과
- lint/build/unit/E2E 통과
- 변경이 외부 상태라면 실제 read-back 확인
- 의도한 파일만 commit됨
- `git push origin main` 완료
- GitHub Actions run 성공
- 라이브 URL에서 핵심 결과 확인
- 최종 보고에 커밋·Actions run·검증 결과·남은 blocker를 기록
