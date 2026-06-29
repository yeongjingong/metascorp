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
