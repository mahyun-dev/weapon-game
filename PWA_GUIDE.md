# PWA (Progressive Web App) 설정 완료

## ✅ 추가된 파일

1. **manifest.json** - PWA 메타데이터
2. **service-worker.js** - 오프라인 지원 및 캐싱
3. **icons/** - 앱 아이콘 폴더

## 📱 PWA 기능

### 설치 가능
- 홈 화면에 추가 가능
- 독립 실행형 앱처럼 작동
- 브라우저 UI 없이 실행

### 오프라인 지원
- 캐시된 리소스로 오프라인 플레이 가능
- 자동 리소스 캐싱
- 빠른 로딩 속도

### 앱과 유사한 경험
- 전체 화면 모드
- 스플래시 스크린
- 세로 방향 고정

## 🔧 추가 설정 필요

### 1. 아이콘 생성
`icons/` 폴더에 다음 크기의 PNG 이미지 추가:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

**빠른 생성 방법:**
- https://realfavicongenerator.net/ 방문
- 원본 이미지(512x512 이상) 업로드
- 모든 크기 자동 생성 및 다운로드

### 2. HTTPS 필요
PWA는 HTTPS에서만 작동 (localhost 제외):
- GitHub Pages (자동 HTTPS 지원) ✅
- Netlify, Vercel (자동 HTTPS 지원) ✅
- 일반 호스팅 - Let's Encrypt 무료 인증서 사용

### 3. 배포 후 테스트
1. Chrome 개발자 도구 열기 (F12)
2. Application 탭 → Manifest 확인
3. Service Workers 등록 확인
4. Lighthouse 탭 → PWA 점수 확인

## 📲 사용자 설치 방법

### Android (Chrome)
1. 게임 접속
2. 주소창 옆 "설치" 버튼 클릭
3. 홈 화면에 자동 추가

### iOS (Safari)
1. 게임 접속
2. 공유 버튼 → "홈 화면에 추가"
3. 추가 클릭

### 데스크톱 (Chrome)
1. 게임 접속
2. 주소창 오른쪽 설치 아이콘 클릭
3. "설치" 버튼 클릭

## 🚀 다음 단계

1. **아이콘 생성** (필수)
   - icons/ 폴더에 모든 크기 추가

2. **manifest.json 커스터마이징**
   - start_url 경로 확인
   - 색상 조정

3. **service-worker.js 최적화**
   - 캐시할 리소스 추가/제거
   - 캐시 전략 선택

4. **배포 및 테스트**
   - GitHub Pages에 배포
   - 실제 기기에서 설치 테스트

## 📊 PWA 체크리스트

- ✅ manifest.json 생성
- ✅ service-worker.js 생성
- ✅ HTTPS 지원 (GitHub Pages)
- ✅ 반응형 디자인
- ⏳ 앱 아이콘 추가 필요
- ✅ meta 태그 설정

## 🔍 검증 도구

Chrome DevTools Lighthouse로 PWA 점수 확인:
1. F12 → Lighthouse 탭
2. Progressive Web App 체크
3. Generate report
4. 90점 이상 목표
