# 키즈와플 홈페이지 (Vite + React)

Claude Design 번들의 `project/ui_kits/homepage/index.html`(데스크톱 홈페이지)을 실제 빌드 가능한 사이트로 옮기고, `homepage-mobile` 키트의 모바일 레이아웃을 적용한 것입니다.

## 모바일 (760px 이하)

- 상단: 로고와 카카오톡 상담 버튼이 든 둥근 헤더가 따라 내려오고, 메뉴는 ☰ 버튼을 누르면 펼쳐집니다.
- 커리큘럼 카드, 후기는 옆으로 밀어 보는 띠로 바뀝니다.
- 섹션 제목은 28px, 왼쪽 정렬입니다.
- 화면 하단에 "카카오톡 상담하기" 버튼이 고정됩니다.
- 문구는 데스크톱과 같습니다. 모바일 키트의 옛 문구(촉각·청각 회차, 신청 폼 등)는 쓰지 않았습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 에 배포용 결과물 생성
npm run preview  # 빌드 결과 미리보기
```

## Vercel 배포

Vercel에서 이 저장소를 가져오면 Vite 프로젝트로 자동 인식됩니다(Build: `npm run build`, Output: `dist`). 별도 설정은 필요 없고, `main`에 푸시할 때마다 자동으로 다시 배포됩니다.

## 구조

| 경로 | 내용 |
|---|---|
| `index.html` | SEO 메타, Open Graph, JSON-LD(조직·웹사이트·FAQ) |
| `src/styles/` | 디자인 토큰(색·타이포·간격·폰트) + `site.css`(히어로 키프레임, 스크롤 등장 효과) |
| `src/components/` | 디자인 시스템 컴포넌트 원본 그대로 (`project/components`와 동일) |
| `src/sections/` | 페이지 섹션: Hero → Stats → Brand → Curriculum → Seasons → Reviews → Characters → Videos → Closing(FAQ·상담·푸터) |
| `src/useScrollReveal.js` | 섹션 블록이 화면에 들어올 때 32px 아래에서 올라오며 나타나는 효과 |
| `src/lib.js` | 카카오톡 상담 링크, 유튜브 채널 링크, 섹션 스크롤 이동, 모바일 판별(`useIsMobile`) |
| `src/sections/Mobile.jsx` | 모바일 헤더·메뉴, 하단 고정 버튼, 섹션 제목, 가로 스크롤 띠 |
| `public/` | 파비콘, 공유 이미지(`og-image.jpg`, 1200×630), 로고(`logo.png`) |
| `src/assets/` | 폰트, 캐릭터·시즌 이미지, 파트너 로고 (이미지는 WebP로 최적화) |

## 자주 바꾸는 값

- 카카오톡 상담 링크: `src/lib.js`의 `KAKAO`
- 수치 띠 기준값(누적 체험 유아, 운영 기간): `src/sections/Stats.jsx`의 `STATS_BASE` — 매월 30명, 매년 1년씩 자동 증가
- 영상 목록: `src/sections/Videos.jsx`의 `CLIPS`
- 후기: `src/sections/Reviews.jsx`의 `REVIEWS`
- FAQ: `src/sections/Closing.jsx`의 `FAQ` (바꾸면 `index.html`의 JSON-LD FAQ도 함께 수정)
