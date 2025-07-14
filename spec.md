# PhenoFACT 개화 예보 웹앱 기획서 (꽃피다)

## 1. 프로젝트 비전
- 시민과 연구자가 함께 만드는 전국 봄꽃 개화 예측 플랫폼  
- PhenoFACT 패키지 결과를 한눈에, 사용자 제보로 정밀도 향상  
- 따뜻하고 즐거운 경험을 통해 과학적 데이터 수집에 자발적 참여 유도  

## 2. 사이트맵
(각 항목은 독립 URL을 가짐)

- `/` 홈(2025 Bloom Map)  
- `/login` 로그인 / 회원가입  
- `/about` Who We Are? (개발자 & 연구실)  
- `/model` What is Chill‑Day Model?  
- `/board` 지역 개화 게시판  
  - `/board/new` 새 글 작성  
  - `/board/:id` 게시글 상세  
- `/hall-of-fame` 명예의 전당  

## 3. 주요 사용자 흐름
1. 방문자가 홈에 접속해 기본 벚꽃 개화 지도를 탐색  
2. 종(벚꽃↔개나리↔진달래) 탭을 전환하며 비교  
3. 관심 지역 핀 클릭 → 팝오버에서 세부 예측·과거 관측치 확인  
4. 로그인 후 '지역 개화 게시판'에서 자신의 관측 사진과 정보 업로드  
5. 게시글 누적 → 포인트 적립 → 명예의 전당 랭킹 반영  

## 4. 페이지별 핵심 기능 & UI 구성

### 4‑1. 홈 / Bloom Map
- 상단 년도 선택 드롭다운(기본 2025)  
- 지도: 행정동 경계 위에 컬러 그라데이션으로 개화 예상일 시각화  
- 종 선택 칩: 벚꽃 • 개나리 • 진달래  
- 지도 핀 클릭 시 오른쪽 사이드패널에  
  - 예측일, 95 % 신뢰구간  
  - 최근 3년 실제 개화일 스파크라인  
  - "제보하기" 버튼  

### 4‑2. 로그인
- 이메일‑비밀번호 및 소셜(OAuth) 간편 로그인  
- 프로필: 닉네임·포인트·제보 내역  

### 4‑3. Who We Are?
- 연구실·개발자 사진 및 간단 프로필  
- 프로젝트 목표·연혁 타임라인  

### 4‑4. What is Chill‑Day Model?
- 인포그래픽: Chill accumulation → Heat accumulation → Bloom  
- 논문·패키지 깃허브 링크  

### 4‑5. 지역 개화 게시판
- 글 목록: 썸네일·꽃종·위치·단계·날짜·작성자  
- 필터: 종·단계·지역·기간  
- 작성 폼  
  1. 꽃종 선택 → 단계(발아/개화) 토글  
  2. 위치 입력(읍면동 자동완성) + 지도 핀  
  3. 날짜 캘린더  
  4. 사진 업로드 + 간단 메모  
  5. 등록 → 성공 토스트 + 10 포인트  

### 4‑6. 명예의 전당
- 실시간 랭킹: 닉네임·포인트·제보 수  
- 트로피·뱃지 일러스트로 시각적 동기부여  

## 5. 데이터 명세

### 5‑1. 예측 데이터 (`predictions.csv`)
```
region_code,string  // 행정동 코드
region_name,string  // 예: 경상북도 경산시 진량읍
species,string      // cherry, forsythia, azalea
predicted_date,date // YYYY‑MM‑DD
confidence_low,date
confidence_high,date
model_version,string // ex) v0.9.3
updated_at,datetime
```

### 5‑2. 사용자 제보 (`sightings.csv`)
```
id,uuid
user_id,uuid
nickname,string
region_name,string
lat,float
lon,float
species,string      // cherry, forsythia, azalea
stage,string        // bud, bloom
date,date           // 촬영일
photo_url,string
created_at,datetime
```

### 5‑3. 포인트·랭킹 (`scores.json`)
```json
{
  "user_id": "uuid",
  "nickname": "꽃사랑",
  "points": 120,
  "reports": 12,
  "last_report": "2025-04-05T11:21:00+09:00"
}
```

## 6. 디자인 가이드
- **톤 & 매너**: 따뜻한 파스텔(벚꽃 #FFC7DE, 개나리 #FFE76A, 진달래 #FFACC4) + 산뜻한 민트 포인트  
- **폰트**: Noto Sans KR (본문, 400/700), Abril Fatface (로고)  
- **버튼**: 8 px 라운드, 호버 시 살짝 상승(Shadow + translateY(-2px))  
- **아이콘**: 흰색 선(line) 스타일 일러스트  
- **이미지**: 사용자 업로드 사진은 4:3 비율, 1 MB 이하로 자동 리사이즈  
- **반응형**: 모바일 우선, 지도는 1:1 비율 → 데스크톱에서 좌우 확장  

## 7. 개발 스테이지

### Stage 1 — 프론트 프로토타입
- 정적 `predictions.json` 로컬 포함, 지도와 인터랙션 구현  
- 게시판은 브라우저 LocalStorage 에 임시 저장  
- 로그인 모달은 UI만 (실제 인증 없음)  

### Stage 2 — REST API 백엔드 통합
- 엔드포인트  
  - `GET /api/predictions`  
  - `POST /api/sightings`  
  - `GET /api/leaderboard`  
- JWT 기반 인증, S3 이미지 스토리지 연동  
- 프론트 데이터를 API와 동기화  

### Stage 3 — 실시간 기능 & 자동 학습 파이프라인
- WebSocket 으로 게시판·랭킹 실시간 갱신  
- 주 1회 PhenoFACT batch 예측 → 데이터베이스 자동 업데이트  
- 관리자 대시보드: 제보 승인·품질 검수, 모델 버전 관리  

## 8. 참여 유도 전략
- **포인트 + 랭킹**으로 경쟁심 자극  
- 특정 포인트 달성 시 뱃지("개화 탐험가", "Chill‑Day 과학자" 등)  
- 공유용 SNS 카드(예: "나는 4월 3일 서울 벚꽃을 발견했어요!") 자동 생성  

## 9. 앱 이름 제안 (한국어)
**꽃피다**  
- 직관적이고 따뜻한 어감  
- "꽃이 피다" + "데이터가 피다"의 중의적 의미  
- 짧고 기억하기 쉽다  

---

© 2025 PhenoFACT Project. All rights reserved.