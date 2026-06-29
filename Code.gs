/**
 * METAS CORPORATION 업무문의 접수용 Google Apps Script
 * 1) Apps Script 새 프로젝트 생성 (script.google.com)
 * 2) 이 Code.gs 전체 붙여넣기
 * 3) 배포 > 새 배포 > 웹 앱
 * 4) 실행 사용자: 나
 * 5) 액세스 권한: 모든 사용자
 * 6) 배포 URL을 index.html의 GOOGLE_SCRIPT_URL에 입력
 */

const RECEIVER_EMAIL = 'business@metas-corp.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    const subject = data.subject || '메타스코퍼레이션 업무문의';
    const body = data.body || makeBodyFromData_(data);

    const options = {
      replyTo: data.email && data.email !== '-' ? data.email : ''
    };

    // 첨부 파일 (제품 사진 / 사양서 / 태그 사진)
    if (Array.isArray(data.files) && data.files.length) {
      options.attachments = data.files
        .filter(function (f) { return f && f.dataBase64; })
        .map(function (f) {
          return Utilities.newBlob(
            Utilities.base64Decode(f.dataBase64),
            f.mimeType || 'application/octet-stream',
            f.name || 'attachment'
          );
        });
    }

    MailApp.sendEmail(RECEIVER_EMAIL, subject, body, options);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: 'sent' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function makeBodyFromData_(data) {
  return `[메타스코퍼레이션 업무문의]\n\n` +
    `■ 기본 정보\n` +
    `회사명: ${data.company || '-'}\n` +
    `담당자명: ${data.name || '-'}\n` +
    `연락처: ${data.phone || '-'}\n` +
    `회신 이메일: ${data.email || '-'}\n\n` +
    `■ 거래 정보\n` +
    `거래 유형: ${data.tradeType || '-'}\n` +
    `관심 사업분야: ${data.bizField || '-'}\n` +
    `품명: ${data.itemName || '-'}\n` +
    `예상 수량·규모: ${data.quantity || '-'}\n` +
    `거래 국가/지역: ${data.country || '-'}\n` +
    `희망 일정: ${data.targetDate || '-'}\n\n` +
    `■ 상세 문의 내용\n${data.memo || '-'}\n\n` +
    `접수 시간: ${data.submittedAt || '-'}`;
}
