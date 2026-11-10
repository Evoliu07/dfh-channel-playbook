const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[ch]));
const signed = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  return `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;
};
const trend = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'flat';
  return Number(value) > 0 ? 'up' : Number(value) < 0 ? 'down' : 'flat';
};
const card = (label, value, delta, cls, sub = '') => `
  <div class="strip-card">
    <span>${esc(label)}</span>
    <b>${esc(value)}</b>
    <small class="${cls}">${esc(delta)}${sub ? ` · ${esc(sub)}` : ''}</small>
  </div>`;

function init() {
  const data = window.PORTAL_DATA;
  if (!data) return;
  const m = data.market;
  const a = m.a || [];
  const us = m.us || [];
  const gold = m.gold || {};
  const fx = m.fx || {};
  const y10 = (m.yields || []).find((x) => x.label.includes('10Y')) || {};

  $('updated').textContent = data.meta.updated_at;
  $('data-date').textContent = data.meta.data_date;

  $('strip').innerHTML = [
    card('上证指数', a[0]?.value || '—', signed(a[0]?.change), trend(a[0]?.change)),
    card('深证成指', a[1]?.value || '—', signed(a[1]?.change), trend(a[1]?.change)),
    card('纳斯达克', us[1]?.value || '—', signed(us[1]?.change), trend(us[1]?.change), '隔夜'),
    card('USD/CNY', fx.value || '—', signed(fx.change), trend(fx.change), fx.date || ''),
    card('COMEX黄金', gold.value || '—', signed(gold.change), trend(gold.change), gold.date || ''),
    card('10Y 国债', y10.value || '—', y10.change || '—', trend(-parseFloat(y10.change || '0')), y10.date || ''),
  ].join('');
}

init();
