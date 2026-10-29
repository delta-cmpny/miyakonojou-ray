"use strict";

// お店のある日本時間で、定休日の目安を表示する。
(() => {
  const status = document.getElementById("business-status");
  if (!status) return;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(new Date());
  const value = (type) => Number(parts.find((part) => part.type === type).value);
  const today = new Date(Date.UTC(value("year"), value("month") - 1, value("day")));
  const weekday = today.getUTCDay();
  const day = today.getUTCDate();
  const isClosed = weekday === 1 || (weekday === 0 && day >= 15 && day <= 21);

  status.textContent = isClosed
    ? "本日は定休日です"
    : "本日は営業日です（9:00〜19:00）";
})();
