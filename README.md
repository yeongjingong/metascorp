# METAS CORPORATION 업무문의 페이지

케이브릿지 해외특송 페이지(example.zip)와 동일한 구조로 만든
메타스코퍼레이션 고객 유치용 웹페이지입니다.

## 포함 파일
- `index.html` : GitHub Pages용 메인 페이지 (업무문의 폼 + 사업분야 + 블로그)
- `Code.gs` : Google Apps Script 메일 접수용 코드
- `blog/index.html` : 블로그 목록 페이지
- `blog/global-sourcing-checklist.html` : 샘플 게시글 1개
- `blog/posts.json` : 블로그 글 목록 데이터
- `_config.yml`

## Google Apps Script 연결 방법
1. Google Apps Script(script.google.com)에서 새 프로젝트를 만듭니다.
2. `Code.gs` 내용을 전체 복사해 붙여넣습니다.
3. 상단 메뉴에서 `배포 > 새 배포 > 웹 앱`을 선택합니다.
4. 실행 사용자: `나`
5. 액세스 권한: `모든 사용자`
6. 배포 후 생성된 웹 앱 URL을 복사합니다.
7. `index.html` 안의 아래 부분을 찾아 교체합니다.

```js
const GOOGLE_SCRIPT_URL = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

8. 수정한 파일을 GitHub Pages에 업로드합니다.

※ URL을 교체하기 전에는 메일 작성 창으로 이동하지 않고 관리자 설정 안내가 표시됩니다.
   URL 교체 후에는 Apps Script로 전송되고 `업무문의가 접수되었습니다` 팝업이 표시되며, 입력값과 첨부파일 선택 내용이 자동으로 초기화됩니다.

## 수신 메일
기본 수신 메일은 `business@metas-corp.com`입니다.
변경하려면 `Code.gs`의 `RECEIVER_EMAIL` 값을 바꾸면 됩니다.

## 게시 전 반드시 교체해야 할 항목
- Footer의 대표이사명: `[대표자명]`
- Footer의 사업자등록번호: `[000-00-00000]`
- Footer의 본사 주소: `[회사 주소를 입력해 주세요]`
- Footer의 개인정보처리방침 링크: 현재 `#` → 실제 페이지 URL로 교체
- 카카오톡 채널이 있다면 문의 CTA에 채널 링크 추가 가능

## 블로그 글 추가 방법
1. `blog/새글파일.html` 추가 (샘플 글을 복사해 내용만 교체하면 됩니다)
2. `blog/posts.json` 맨 앞에 글 정보 추가
   - `thumbnail`은 비워두면 기본 색상 패널이 표시됩니다.
   - 썸네일을 쓰려면 1000 x 1000 px 정사각형 WEBP 이미지를 `blog/images/`에 넣고 경로를 적습니다.
3. 메인 `index.html`은 posts.json의 최신 3개 글을 자동으로 불러옵니다.
4. `blog/index.html`은 posts.json의 전체 글을 자동으로 불러옵니다.

※ posts.json 자동 로드는 GitHub Pages 등 웹서버에 올렸을 때 동작합니다.
   로컬에서 파일을 직접 열면(file://) 보안 정책 때문에 fallback 글이 표시됩니다.


## 2026 모바일 최적화
- 문의 입력창 높이 축소 및 모바일 16px 입력 폰트 적용
- 전 페이지 모바일 메뉴/단일 열/표 가로 스크롤 적용
- 중복 메인 오버라이드 CSS 정리


## 홈페이지 업무문의 접수 방식

- 현재 문의 폼은 메일 프로그램을 열지 않고 홈페이지에서 바로 접수하도록 구성되어 있습니다.
- `Code.gs`를 Google Apps Script 웹 앱으로 배포한 뒤, 발급된 `/exec` 주소를 `index.html`의 `GOOGLE_SCRIPT_URL`에 입력해야 합니다.
- 연결이 완료되면 접수 성공 팝업이 표시되고 입력값과 첨부파일 선택 내용이 자동으로 초기화됩니다.
- 웹 앱 URL이 입력되지 않은 상태에서는 메일 작성 창으로 이동하지 않고 관리자 설정 안내만 표시됩니다.

## 2026-11-22 업데이트: 기업 브랜딩 및 줄바꿈 정비

- `assets/favicon.png`, `favicon.ico`, `assets/icon-192.png`, `assets/icon-512.png`, `assets/apple-touch-icon.png`: 기존 METAS 공식 심벌에 기반한 파비콘 패키지
- `assets/og-metas-corporation.jpg`: 1200×630px 기업 소개용 OG 이미지. 홈페이지와 서비스/수수료/블로그 페이지의 `og:image` 및 Twitter Card에 연결
- 전 페이지의 `canonical`, 페이지별 메타 설명, OG 정보, 웹 앱 아이콘 참조를 통일. 배포 주소는 CNAME `www.metas-corp.co.kr` 기준
- `assets/site.css`와 블로그 페이지의 스타일에서 한글 단어 경계 중심의 줄바꿈 및 소형 화면 가독성 정비
- 메인/사업분야/수수료 페이지 하단의 `대표이사 공영진 외 1인` 삭제
- 기존 페이지에 중복 내장돼 있던 회사 로고 이미지를 `assets/metas-logo.png` 파일 참조로 최적화
- 기존 폼 제출/메뉴/블로그 자바스크립트 코드는 변경하지 않음

**배포 시 주의:** `metascorp-main/` 폴더 내부의 파일을 기존 웹사이트 루트에 *함께* 업로드해야 합니다. 새 아이콘 및 OG 이미지가 포함된 `assets/` 폴더와 루트의 `favicon.ico`를 누락하지 마세요. SNS 공유 미리보기는 각 플랫폼의 캐시 때문에 변경이 즉시 반영되지 않을 수 있습니다.

## 2026-11-22 최종 배포 패키지: 사용자 확정 이미지 적용

- 파비콘: 사용자가 최종 첨부한 METAS 심벌 이미지에서 PNG(64/180/192/512) 및 루트 `favicon.ico` 생성.
- OG 이미지: 사용자가 최종 첨부한 **철강 코일·수지 펠릿·산업용 파우더** 시안을 그대로 사용, 1200×630px JPG로 변환.
- 메인/사업분야/수수료/블로그 목록/블로그 게시물의 OG 및 Twitter 이미지 참조 갱신.
- 파비콘/OG 리소스에 새 버전 쿼리 적용하여 브라우저와 SNS의 이전 캐시 구분 지원.
- 이전 수정본의 줄바꿈 정비, 대표이사 문구 삭제, 기존 페이지 기능과 사이트 구조는 유지.
- 배포: 이 ZIP을 해제하고 `metascorp-main/` **안의 파일/폴더**를 사이트 루트에 업로드.
- 배포 후 실제 도메인에서 페이지 소스/파비콘/OG URL 접근 및 SNS 미리보기 캐시 갱신 여부 확인 필요.
