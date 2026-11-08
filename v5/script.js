/* 美容室 Ray — ナビの開閉・ヘッダーの影・定休日カレンダー。無くても内容は読める。 */
(function () {
  'use strict';
  var d = document;

  // ---- ナビ(スマホ) ----
  var toggle = d.querySelector('[data-nav-toggle]');
  var panel = d.querySelector('[data-nav-panel]');
  function setNav(open) {
    if (!toggle || !panel) return;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () { setNav(!panel.classList.contains('is-open')); });
    Array.prototype.forEach.call(panel.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { setNav(false); toggle.focus(); }
    });
    d.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') && !panel.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
  }

  // ---- ヘッダーの影 ----
  var header = d.getElementById('header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- 定休日カレンダー(毎週月曜・第3日曜) ----
  var cal = d.querySelector('[data-calendar]');
  var title = cal && cal.querySelector('[data-cal-title]');
  var table = cal && cal.querySelector('table');
  var prev = cal && cal.querySelector('[data-cal-prev]');
  var next = cal && cal.querySelector('[data-cal-next]');
  var todayBtn = cal && cal.querySelector('[data-cal-today]');
  if (cal && title && table && prev && next) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var base = new Date(today.getFullYear(), today.getMonth(), 1);
    var q = /[?&]cal=(\d{4})-(\d{1,2})/.exec(window.location.search);  // 確かめる時だけ使う
    if (q && +q[2] >= 1 && +q[2] <= 12) base = new Date(+q[1], +q[2] - 1, 1);
    var view = new Date(base.getTime());
    var MIN = new Date(base.getFullYear(), base.getMonth() - 12, 1);
    var MAX = new Date(base.getFullYear(), base.getMonth() + 12, 1);
    var WEEK = ['日', '月', '火', '水', '木', '金', '土'];

    function isClosed(date) {
      if (date.getDay() === 1) return true;                       // 毎週月曜
      if (date.getDay() === 0) return Math.ceil(date.getDate() / 7) === 3;  // 第3日曜
      return false;
    }
    function render() {
      var y = view.getFullYear(), m = view.getMonth();
      title.textContent = y + '年' + (m + 1) + '月';
      var first = new Date(y, m, 1).getDay();
      var days = new Date(y, m + 1, 0).getDate();
      var html = '<thead><tr>';
      for (var w = 0; w < 7; w++) html += '<th scope="col"' + (w === 0 ? ' class="is-sun"' : '') + '>' + WEEK[w] + '</th>';
      html += '</tr></thead><tbody><tr>';
      for (var i = 0; i < first; i++) html += '<td class="is-empty"></td>';
      for (var day = 1; day <= days; day++) {
        var date = new Date(y, m, day);
        var closed = isClosed(date);
        var isToday = date.getTime() === today.getTime();
        var sunBeauty = !closed && date.getDay() === 0;  // 第3以外の日曜:脱毛・エステ・まつ毛は休み
        html += '<td' + (closed ? ' data-closed="1" aria-label="' + day + '日 定休日"' : '') + (sunBeauty ? ' data-sun-beauty="1" aria-label="' + day + '日 脱毛・エステ・まつ毛エクステはお休み"' : '') + (isToday ? ' data-today="1" aria-current="date"' : '') + '>' +
                '<span class="calendar__day">' + day + '</span></td>';
        if (date.getDay() === 6 && day < days) html += '</tr><tr>';
      }
      var last = new Date(y, m, days).getDay();
      for (var j = last; j < 6; j++) html += '<td class="is-empty"></td>';
      html += '</tr></tbody>';
      table.innerHTML = html;
      prev.disabled = view <= MIN;
      next.disabled = view >= MAX;
      if (todayBtn) todayBtn.hidden = (view.getFullYear() === base.getFullYear() && view.getMonth() === base.getMonth());
    }
    prev.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
    next.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
    var backToThisMonth = function () { view = new Date(base.getTime()); render(); };
    if (todayBtn) todayBtn.addEventListener('click', backToThisMonth);
    Array.prototype.forEach.call(d.querySelectorAll('a[href="#holiday"]'), function (a) { a.addEventListener('click', backToThisMonth); });
    render();
    cal.hidden = false;
  }
})();
