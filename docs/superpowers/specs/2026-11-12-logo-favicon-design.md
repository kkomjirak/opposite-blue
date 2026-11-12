# Opposite Blue 로고·파비콘 통합 설계

## 의도
사용자가 제공한 새 심볼을 웹사이트의 브랜드 식별 요소로 사용하되, 현재의 미니멀·에디토리얼 레이아웃과 `Opposite Blue.` 텍스트 워드마크를 유지한다.

## 목표
- Header 홈 링크에 컬러 심볼과 기존 텍스트 워드마크를 결합한다.
- Footer 하단 브랜드/저작권 영역에 grayscale 심볼을 절제된 크기로 배치한다.
- 제공된 ICO, 16/32px, Apple touch, Android 192/512px, webmanifest를 Next.js 16 static export에 연결한다.
- 320–1440px에서 Header/Footer의 가독성, 터치 영역, focus-visible, overflow, CLS를 보존한다.

## 비목표와 금지 범위
- 페이지 콘텐츠, 포트폴리오 데이터, 기존 브랜드 팔레트를 변경하지 않는다.
- `logo/**` 원본, `IDEA.md`, `MEMORY.md`, `portfolio/images`, `public/portfolio/images` 심볼릭 링크를 삭제하거나 덮어쓰지 않는다.
- 새 패키지, 외부 서비스, 비밀값을 추가하지 않는다.

## 선택한 접근
컬러 심볼을 Header의 `Opposite Blue.` 워드마크 왼쪽에 배치하고 grayscale 심볼을 Footer 하단에 배치한다. 두 심볼은 배포용 경로로 복사하되 입력 원본은 읽기 전용으로 보존한다. 기존 워드마크를 유지해 작은 크기의 심볼만으로 브랜드명이 사라지는 문제를 피하고, 이미지의 intrinsic 크기를 명시해 CLS를 방지한다.

## 검토한 대안
- Header에서 grayscale→color hover/focus 전환: 기본 상태에서 브랜드 핵심 색 노출이 약해 제외.
- Footer의 큰 grayscale 워터마크: 기존의 절제된 Footer 위계를 압도할 수 있어 제외.

## 접근성 및 반응형
- Header의 홈 링크 accessible name과 최소 44px 터치 영역을 유지한다.
- 심볼이 장식 요소로 쓰일 때 중복 스크린리더 발화를 만들지 않는다.
- 320, 390, 768, 1440px에서 시간 표시, 모바일 메뉴, Footer 링크와 충돌하지 않아야 한다.
- 기존 semantic color tokens와 focus-visible 규칙을 재사용하며 raw hex를 추가하지 않는다.

## 완료 흐름
`designer`가 테스트 우선으로 구현·로컬 시각 검증·전체 회귀를 완료하고 commit한다. `reviewer`가 read-only 독립 검수한 후, `engineer`가 승인된 commit만 `main`에 push하고 GitHub Actions와 라이브 사이트를 read-back한다.
