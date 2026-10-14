# 키즈와플 인트로 영상 (Remotion)

홈페이지 첫 화면 모션과 같은 장면을 영상으로 뽑는 폴더입니다. 시간 값은 사이트와 같은
`../src/hero-motion/timeline.js`(`HERO_VIDEO`)를 씁니다. 사이트 빌드에는 포함되지 않습니다.

| 파일 | 크기 | 용도 |
|---|---|---|
| `out/herointro-16x9.mp4` | 1920×1080, 7초 | 유튜브 인트로, 카카오 채널 |
| `out/herointro-9x16.mp4` | 1080×1920, 7초 | 인스타 릴스, 유튜브 쇼츠 |
| `out/herointro-1x1.mp4` | 1080×1080, 7초 | 인스타 피드 |

## 만들기

```bash
cd motion-video
npm install
npm run render            # 세 가지 모두 out/ 에 생성
npm run render HeroIntro-9x16   # 하나만
npm run studio            # 브라우저에서 장면을 보며 수정
```

이미지와 글꼴은 `npm run assets`가 사이트(`../src/assets`)에서 `public/`으로 복사합니다.
영상에는 소리가 없습니다. 홍보용으로 음악을 넣을 때는 편집 프로그램에서 입혀 주세요.

## 라이선스 주의

Remotion은 개인과 직원 3명 이하 회사는 무료이고, 직원 4명 이상인 회사는 회사 라이선스가 필요합니다.
상업적으로 쓰기 전에 https://www.remotion.dev/license 에서 확인하세요.
