/* MoniTabs cookie consent (Google Consent Mode v2).
 * Defaults are set inline in each page <head> (denied for EEA/UK/CH, granted elsewhere).
 * This file shows a small banner to visitors in European time zones who have not chosen yet,
 * saves the choice, and updates consent. window.mtConsentOpen() reopens it. */
(function () {
  var KEY = 'mt_consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function inEurope() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return /^Europe\//.test(tz) || /^Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)$/.test(tz);
    } catch (e) { return false; }
  }

  var ko = (document.documentElement.lang || '').indexOf('ko') === 0;
  var T = ko ? {
    msg: '이 사이트는 방문 통계를 위해 Google Analytics 쿠키를 사용합니다. 앱 데이터와는 관련이 없습니다.',
    yes: '동의', no: '거부', more: '개인정보 처리방침'
  } : {
    msg: 'We use Google Analytics cookies to count visits to this website. Your app data is not involved.',
    yes: 'Accept', no: 'Decline', more: 'Privacy policy'
  };

  function apply(v) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: v === 'granted' ? 'granted' : 'denied' });
    }
  }

  function show() {
    if (document.getElementById('mt-consent')) return;
    var box = document.createElement('div');
    box.id = 'mt-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie consent');
    box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#1E1E1E;color:#fff;border:1px solid rgba(94,92,230,.6);border-radius:16px;padding:16px;' +
      'font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5)';
    var privacy = ko ? '/privacy.html' : '/privacy.html#website';
    box.innerHTML =
      '<p style="margin:0 0 12px">' + T.msg + ' <a href="' + privacy + '" style="color:#A5A4FF">' + T.more + '</a></p>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">' +
      '<button type="button" data-v="denied" style="cursor:pointer;padding:10px 18px;border-radius:24px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;font:inherit">' + T.no + '</button>' +
      '<button type="button" data-v="granted" style="cursor:pointer;padding:10px 18px;border-radius:24px;border:0;background:#5E5CE6;color:#fff;font:inherit;font-weight:600">' + T.yes + '</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute('data-v');
      if (!v) return;
      setChoice(v);
      apply(v);
      box.parentNode && box.parentNode.removeChild(box);
    });
    document.body.appendChild(box);
  }

  window.mtConsentOpen = show;

  function init() {
    var c = getChoice();
    if (c) { apply(c); return; }
    if (inEurope()) show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
