# 📝 할일 관리 앱 (Todo Management App)

Firebase Realtime Database를 활용한 실시간 할일 관리 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🎯 스마트한 상태 관리
- **시작일/종료일 기반 자동 상태 관리**
  - 대기: 시작일 전
  - 진행중: 시작일 ~ 종료일 사이
  - 완료: 종료일 이후
- **D-day 자동 계산 및 실시간 표시**
  - D-5, D-1, D-Day, D+1 등 자동 계산
  - 기한 초과 항목 시각적 강조

### 🎨 직관적인 UI/UX
- **빠른 날짜 선택 버튼**
  - 오늘, 내일, 1주일, 1개월 원클릭 설정
- **필터링 및 정렬**
  - 전체/대기/진행중/완료 필터
  - 마감일순/최신순/상태순 정렬
- **상태별 카운트 표시**
  - 각 필터별 실시간 개수 표시

### 💬 사용자 피드백
- **커스텀 모달**
  - 세련된 디자인의 알림/확인 창
- **토스트 알림**
  - 할일 추가/수정/삭제 시 즉각적인 피드백

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 모두 최적화
- 터치 친화적인 UI

## 🚀 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **인증**: Firebase Authentication
- **호스팅**: Firebase Hosting (선택사항)

## 📦 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/scemo815-source/scemo-todo-.git
cd scemo-todo-
```

### 2. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Realtime Database 활성화
3. `script.js` 파일의 Firebase 설정 정보 업데이트
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Firebase Database 보안 규칙 설정
Firebase Console의 Realtime Database > 규칙에서 다음과 같이 설정:
```json
{
  "rules": {
    "todos": {
      ".read": true,
      ".write": true
    }
  }
}
```
> ⚠️ 프로덕션 환경에서는 인증 기반 보안 규칙을 사용하세요.

### 4. 실행
`index.html` 파일을 웹 브라우저에서 열거나, 로컬 서버를 실행:
```bash
# Python이 설치되어 있는 경우
python -m http.server 8000

# Node.js가 설치되어 있는 경우
npx serve
```

## 📖 사용 방법

1. **할일 추가**
   - 할일 내용 입력
   - 시작일과 종료일 선택 (빠른 날짜 버튼 활용)
   - "할일 추가" 버튼 클릭 또는 Enter 키 입력

2. **할일 관리**
   - **수정**: 수정 버튼 클릭 → 내용 변경 → 저장
   - **삭제**: 삭제 버튼 클릭 → 확인
   - **필터링**: 상단 필터 버튼으로 상태별 조회
   - **정렬**: 정렬 드롭다운으로 순서 변경

3. **상태 확인**
   - 각 할일의 상태 뱃지 확인
   - D-day 표시로 남은 기한 확인
   - 기한 초과 항목은 빨간색으로 강조

## 🎯 데이터 구조

```javascript
{
  "todos": {
    "uniqueId1": {
      "text": "프로젝트 완료하기",
      "startDate": "2026-05-07",
      "endDate": "2026-05-15",
      "createdAt": 1715068800000
    },
    "uniqueId2": {
      ...
    }
  }
}
```

## 🎨 주요 특징

- ✅ 실시간 동기화 (여러 기기에서 동시 사용 가능)
- ✅ 자동 상태 관리 (날짜 기반)
- ✅ D-day 자동 계산
- ✅ 직관적인 UI/UX
- ✅ 반응형 디자인
- ✅ 커스텀 모달 및 토스트
- ✅ 정렬 및 필터링
- ✅ 키보드 단축키 지원

## 🔜 향후 개발 계획

- [ ] 사용자 인증 (로그인/회원가입)
- [ ] 할일 카테고리 기능
- [ ] 우선순위 설정
- [ ] 할일 검색 기능
- [ ] 완료된 할일 통계
- [ ] 다크 모드
- [ ] 알림 기능 (브라우저 알림)
- [ ] 할일 공유 기능

## 📄 라이선스

MIT License

## 👤 작성자

- GitHub: [@scemo815-source](https://github.com/scemo815-source)

## 🙏 기여하기

이슈나 풀 리퀘스트는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
