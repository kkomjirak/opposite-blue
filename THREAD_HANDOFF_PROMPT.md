# 새 스레드 전달용 프롬프트

아래 내용을 그대로 새 Discord 스레드에서 `<@1550565125017313461>`에게 전달한다.

---

<@1550565125017313461> 다음 인수인계 문서를 먼저 읽고, 이후 모든 작업을 이 기준으로 오케스트레이션해줘.

파일:
`/mnt/hermes/workspace/Opposite Blue/THREAD_HANDOFF.md`

## 오케스트레이션 지시

1. 모든 작업은 칸반으로 관리해줘.
   - `Backlog → Ready → In Progress → Review → Verify → Done`
   - 막히면 `Blocked`로 이동하고 blocker와 사용자에게 필요한 결정을 명시
   - 각 칸반 카드에 목표, 담당 bot, 담당 파일, 금지 범위, 완료 조건, 검증 명령을 기록
   - 파일을 동시에 수정하지 않도록 bot별 파일 소유권과 의존성을 분리
   - 한 bot의 완료 보고를 그대로 믿지 말고 diff·테스트·외부 상태 read-back으로 검증

2. 반드시 아래 저장소만 사용해줘.
   - 기준 workspace: `/mnt/hermes/workspace/Opposite Blue`
   - GitHub repository: `https://github.com/kkomjirak/opposite-blue.git`
   - remote: `origin`
   - branch: `main`
   - live site: `https://oppositeblue.co.kr`
   - `/mnt/orca/workspace/opposite-blue`는 사용하지 말 것

3. 작업 시작 전 모든 bot이 다음을 확인하게 해줘.

```bash
cd "/mnt/hermes/workspace/Opposite Blue"
pwd
git remote -v
git branch --show-current
git status --short
git rev-parse --show-toplevel
```

`origin`이 `kkomjirak/opposite-blue`가 아니거나 workspace가 다르면 작업을 중단하고 보고해줘.

4. 사용자의 기본 배포 선호를 적용해줘.
   - 수정·검증이 끝나면 별도 확인을 묻지 말고 `main`에 push하고 GitHub Pages까지 배포
   - 단, 파일 삭제·기존 파일 전체 교체·파괴적 변경은 먼저 사용자에게 확인
   - 배포 후 GitHub Actions 성공 여부와 실제 live URL을 read-back으로 확인

5. 기존 로컬 문서를 보존해줘.
   - `IDEA.md`, `MEMORY.md`는 삭제·덮어쓰기·정리하지 말 것
   - 현재 두 문서는 의도적으로 untracked 상태일 수 있음
   - `public/portfolio/images`의 상대 심볼릭 링크와 `portfolio/images` 원본도 보존

## 현재 프로젝트 핵심 기준

- Next.js 16.4.3 + React 19.2.8 + TypeScript
- Tailwind CSS v4, Lucide React, Geist
- static export (`output: 'export'`)
- GitHub Pages + Actions
- FormSubmit AJAX (`contact@oppositeblue.co.kr`)
- 이미지 pipeline: Sharp + content-hashed WebP manifest
- 브랜드 팔레트:
  - `#F2C949`
  - `#235888`
  - `#68A5D4`

## 포트폴리오 데이터 규칙

- runtime: `src/data/portfolio_data.json`
- archive: `portfolio/data/portfolio_data.json`
- 두 JSON은 항상 byte-for-byte 동일하게 유지
- 이미지 원본을 삭제·덮어쓰지 않고 새 이미지는 새 경로에 추가

### 정렬

포트폴리오 정렬 기준은 **프로젝트 ID가 아니라 제작 연월**이다.

- 웹사이트 목록은 `production_date` 최신순 내림차순
- 제작 연월이 같은 경우에만 ID 내림차순을 보조 기준으로 사용
- 현재 최상단 항목은 `디자인회사`, 제작 연월 `2026년 10월`
- `src/app/projects/page.tsx`의 `parseProductionMonth()`와 `websiteProjects` 정렬 로직을 기준으로 유지

### 명칭 및 문구

상세 모달의 메타 라벨은 반드시 `기술 스택`으로 표시한다.

기존 설명 문구는 다음으로 교체한다.

- `CMS : 카페24` → `SaaS 기반 이커머스 솔루션(카페24)`
- `CMS : 고도몰` → `SaaS 기반 이커머스 솔루션(고도몰)`
- `CMS : 그누보드` → `설치형 오픈소스 CMS(그누보드)`

웹사이트 카드의 썸네일 아래 두 번째 줄에는 `project.cms`를 우선 표시한다. 기술 스택이 없는 경우에만 기존 `text_lines[0]`을 fallback으로 사용한다.

현재 `디자인회사`의 기술 스택 표시값은 다음과 같다.

`Next.js 기반 3D 인터랙티브 웹`

## 검증 명령

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

`npm run build`가 이미지 manifest를 갱신하므로 데이터나 이미지 경로를 바꾼 뒤에는 반드시 build 후 Playwright를 실행한다.

## 완료 조건

다음 조건을 모두 만족해야 칸반 카드를 `Done`으로 옮긴다.

- 요구사항별 테스트 또는 기존 테스트 검증
- runtime/archive JSON 일치
- `git diff --check` 통과
- lint/build/unit/E2E 통과
- 의도한 파일만 commit
- `git push origin main` 완료
- GitHub Actions 성공
- live site read-back 확인
- 최종 보고에 변경 파일, commit, Actions run, 테스트 결과, blocker를 명시

이 문서와 프롬프트의 목적은 새 스레드에서 저장소를 잘못 선택하거나, 칸반 없이 bot들이 충돌하거나, 검증 없이 배포하는 일을 방지하는 것이다. 모든 신규 작업은 사용자의 최신 지시를 우선하고, 이 인수인계 문서의 고정 제약을 따른다.

---
