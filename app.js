/* MoneyMate — AI-assisted, framework-free personal finance dashboard.
   No remote data storage, account registration, paid service, or API required. */
(() => {
  'use strict';

  const STORE_KEY = 'moneymate-data-v1';
  const root = document.getElementById('app');
  const nf = new Intl.NumberFormat('fa-IR');
  const monthFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-gregory', { month: 'long', year: 'numeric' });
  const shortFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-gregory', { day: 'numeric', month: 'short' });
  const colors = ['#20c69a', '#528ef0', '#f3aa68', '#9d83e8', '#ee7f90', '#49c3d6', '#6b8ea2', '#b0bdcb'];
  const categories = {
    expense: [
      { id: 'food', name: 'خوراک و رستوران', short: 'خوراک', emoji: '🍔', color: '#f3aa68', bg: '#fff3e7' },
      { id: 'shopping', name: 'خرید', short: 'خرید', emoji: '🛍️', color: '#a58bef', bg: '#f2efff' },
      { id: 'transport', name: 'حمل‌ونقل', short: 'رفت‌وآمد', emoji: '🚗', color: '#5b9def', bg: '#ebf4ff' },
      { id: 'bills', name: 'قبوض و خانه', short: 'خانه و قبوض', emoji: '🏠', color: '#3dc7ad', bg: '#e6faf4' },
      { id: 'health', name: 'سلامت', short: 'سلامت', emoji: '💊', color: '#ef8496', bg: '#ffedf1' },
      { id: 'entertainment', name: 'تفریح', short: 'تفریح', emoji: '🎬', color: '#eebc57', bg: '#fff7e5' },
      { id: 'education', name: 'آموزش', short: 'آموزش', emoji: '📚', color: '#7e9ae8', bg: '#edf2ff' },
      { id: 'other-expense', name: 'سایر هزینه‌ها', short: 'سایر', emoji: '🧾', color: '#a7b6c8', bg: '#f0f3f8' }
    ],
    income: [
      { id: 'salary', name: 'حقوق و دستمزد', short: 'حقوق', emoji: '💼', color: '#3ac39e', bg: '#e5faf2' },
      { id: 'freelance', name: 'کار آزاد', short: 'کار آزاد', emoji: '💻', color: '#6b9dea', bg: '#ebf3ff' },
      { id: 'investment', name: 'سرمایه‌گذاری', short: 'سرمایه‌گذاری', emoji: '📈', color: '#a187e8', bg: '#f1edfd' },
      { id: 'gift', name: 'هدیه', short: 'هدیه', emoji: '🎁', color: '#ee9caa', bg: '#fff0f2' },
      { id: 'other-income', name: 'سایر درآمدها', short: 'سایر', emoji: '💰', color: '#e6b75e', bg: '#fff6e7' }
    ]
  };
  const paths = {
    wallet: '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 10h18"/><path d="M7 6V4a2 2 0 0 1 2-2h9"/><path d="M16 15h2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    arrows: '<path d="M7 7h14l-4-4m4 4-4 4M17 17H3l4-4m-4 4 4 4"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 4 3 5-7"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon: '<path d="M20.5 14.3A9 9 0 0 1 9.7 3.5 9 9 0 1 0 20.5 14.3Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    right: '<path d="m15 18-6-6 6-6"/>',
    left: '<path d="m9 18 6-6-6-6"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    trending: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    trendingdown: '<path d="m3 7 6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    pencil: '<path d="m4 20 4-.8L20 7.2 16.8 4 4.8 16Z"/><path d="m14.5 6.3 3.2 3.2"/>',
    trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    download: '<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
    shield: '<path d="m12 2 8 4v6c0 6-4 9-8 10-4-1-8-4-8-10V6Z"/><path d="m9 12 2 2 4-4"/>',
    pie: '<path d="M11 3a9 9 0 1 0 10 10H11Z"/><path d="M13 3a9 9 0 0 1 8 8h-8Z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M7 3v6h10V4M7 21v-8h10v8"/>',
    spark: '<path d="m12 2 1.7 7.3L21 11l-7.3 1.7L12 20l-1.7-7.3L3 11l7.3-1.7Z"/><path d="m19 17 .5 1.5L21 19l-1.5.5L19 21l-.5-1.5L17 19l1.5-.5Z"/>',
    alert: '<path d="m12 3 10 18H2Z"/><path d="M12 9v4m0 4h.01"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  };
  const icon = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const digits = v => nf.format(v || 0);
  const amount = value => `${digits(Math.abs(value))} تومان`;
  const moneySign = value => `${value < 0 ? '−' : ''}${amount(value)}`;
  const monthOf = iso => String(iso || '').slice(0, 7);
  const getMonth = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const getDate = (date = new Date()) => `${getMonth(date)}-${String(date.getDate()).padStart(2, '0')}`;
  const parseDate = iso => new Date(`${iso}T12:00:00`);
  const monthName = m => monthFormatter.format(new Date(`${m}-15T12:00:00`));
  const shortDate = iso => shortFormatter.format(parseDate(iso));
  const toMonth = (month, delta) => { const [y, m] = month.split('-').map(Number); return getMonth(new Date(y, m - 1 + delta, 15)); };
  const getCat = (type, id) => categories[type]?.find(c => c.id === id) || categories[type]?.at(-1) || categories.expense.at(-1);
  const num = value => Math.max(0, Math.trunc(Number(value) || 0));
  const initialData = () => ({ transactions: [], budget: 15000000, theme: 'light', demoMode: false });
  const isValidTransaction = tx => tx && typeof tx.id === 'string' && typeof tx.title === 'string' && tx.title.length <= 500 && (tx.type === 'expense' || tx.type === 'income') && Number.isSafeInteger(tx.amount) && tx.amount > 0 && typeof tx.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(tx.date) && !isNaN(parseDate(tx.date).getTime());

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return initialData();
      const value = JSON.parse(raw);
      if (!value || !Array.isArray(value.transactions)) return initialData();
      return {
        transactions: value.transactions.filter(isValidTransaction).map(t => ({ ...t, category: String(t.category || ''), notes: String(t.notes || '').slice(0, 1000) })),
        budget: Number.isSafeInteger(value.budget) && value.budget >= 0 ? value.budget : 15000000,
        theme: value.theme === 'dark' ? 'dark' : 'light',
        demoMode: Boolean(value.demoMode)
      };
    } catch { return initialData(); }
  }
  let data = load();
  let ui = { page: 'dashboard', month: getMonth(), query: '', type: 'all', category: 'all', sort: 'newest', modal: null, sidebar: false };
  let toastTimeout;
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); return true; } catch { toast('ذخیره‌سازی مرورگر در دسترس نیست؛ اطلاعات ممکن است باقی نمانند.'); return false; } };
  const transactions = (month = ui.month) => data.transactions.filter(t => monthOf(t.date) === month);
  const totals = items => items.reduce((r, t) => { r[t.type] += t.amount; return r; }, { income: 0, expense: 0 });
  const monthTotals = () => totals(transactions());
  const totalBalance = () => { const t = totals(data.transactions); return t.income - t.expense; };
  const savingsRate = t => t.income > 0 ? Math.round(100 * (t.income - t.expense) / t.income) : 0;
  const sortByDate = rows => [...rows].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const lastMonths = count => Array.from({ length: count }, (_, i) => toMonth(ui.month, i - (count - 1)));
  const categoryBreakdown = (items = transactions()) => {
    const sums = {};
    for (const t of items) if (t.type === 'expense') sums[t.category] = (sums[t.category] || 0) + t.amount;
    return Object.entries(sums).map(([id, value]) => ({ ...getCat('expense', id), id, value })).sort((a, b) => b.value - a.value);
  };
  const percent = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

  function navButton(id, label, glyph) { return `<button class="nav-button ${ui.page === id ? 'active' : ''}" data-page="${id}">${icon(glyph)}<span>${label}</span></button>`; }
  function mobileNav(id, label, glyph) { return `<button class="${ui.page === id ? 'active' : ''}" data-page="${id}">${icon(glyph)}${label}</button>`; }
  function header() {
    const title = { dashboard: 'نمای کلی حساب', transactions: 'تراکنش‌های من', budget: 'بودجه‌بندی ماهانه', reports: 'گزارش‌های مالی' }[ui.page];
    const desc = { dashboard: 'امروز هم یک قدم به مدیریت بهتر پولت نزدیک‌تر شو ✨', transactions: 'همه دریافت‌ها و پرداخت‌هات یک‌جا', budget: 'برای پولت برنامه داشته باش', reports: 'پول‌هات کجا می‌رن؟ اینجا ببین' }[ui.page];
    return `<header class="topbar">
      <div><div class="eyebrow">${desc}</div><h1 class="page-title">${title}</h1></div>
      <div class="top-actions">
        <button class="round-btn menu-toggle" data-action="menu" aria-label="باز کردن منو">${icon('menu')}</button>
        <button class="round-btn" data-action="theme" title="تغییر حالت نمایش" aria-label="تغییر تم">${icon(data.theme === 'dark' ? 'sun' : 'moon')}</button>
        <button class="btn btn-primary" data-action="add">${icon('plus')} ثبت تراکنش</button>
        <div class="avatar" title="حساب شخصی">م</div>
      </div>
      <div class="month-controls"><div class="month-picker"><button data-action="next-month" title="ماه بعد" aria-label="ماه بعد">${icon('right','small')}</button>${icon('calendar','small')}<span>${esc(monthName(ui.month))}</span><button data-action="prev-month" title="ماه قبل" aria-label="ماه قبل">${icon('left','small')}</button></div></div>
    </header>`;
  }
  function demoBanner() {
    if (data.demoMode) return `<div class="welcome-band"><div><strong>✨ در حال نمایش اطلاعات نمونه هستی</strong><small>این تراکنش‌ها واقعی نیستند و فقط برای آزمایش اپ ساخته شده‌اند.</small></div><button class="btn btn-small" data-action="clear-demo">شروع با حساب خودم</button></div>`;
    if (!data.transactions.length) return `<div class="welcome-band"><div><strong>🌱 خوش اومدی به مانی‌میت!</strong><small>برای دیدن امکانات می‌تونی اطلاعات آزمایشی بارگذاری کنی.</small></div><button class="btn btn-small" data-action="load-demo">${icon('spark','small')} نمایش نمونه</button></div>`;
    return '';
  }
  function metric(label, value, glyph, tone, foot) {
    return `<article class="metric-card ${tone}"><div class="metric-header"><span>${label}</span><span class="metric-icon">${icon(glyph,'large')}</span></div><div class="metric-number" dir="ltr">${value < 0 ? '−' : ''}${digits(Math.abs(value))}</div><div class="currency-label">تومان</div><div class="metric-foot">${foot}</div></article>`;
  }
  function metrics() {
    const t = monthTotals(); const rate = savingsRate(t);
    return `<section class="metrics-grid" aria-label="خلاصه مالی">
      ${metric('موجودی کل', totalBalance(), 'wallet', 'balance', 'درآمد منهای هزینه در تمام ماه‌ها')}
      ${metric('درآمد این ماه', t.income, 'trending', 'income', 'مجموع دریافتی‌های ماه انتخاب‌شده')}
      ${metric('هزینه این ماه', t.expense, 'trendingdown', 'expense', 'مجموع پرداخت‌های ماه انتخاب‌شده')}
      ${metric('پس‌انداز این ماه', t.income - t.expense, 'target', 'savings', `نرخ پس‌انداز: <span class="${rate >= 0 ? 'positive' : 'negative'}">${digits(rate)}٪</span>`) }
    </section>`;
  }
  function monthlyChart() {
    const months = lastMonths(6).map(m => ({ month: m, ...totals(transactions(m)) }));
    if (!months.some(m => m.income || m.expense)) return `<div class="chart-empty">${icon('chart','large')}<div>هنوز داده‌ای برای نمودار وجود نداره.</div></div>`;
    const maxValue = Math.max(1, ...months.flatMap(m => [m.income, m.expense]));
    return `<div class="bar-chart" role="img" aria-label="مقایسه درآمد و هزینه شش ماه اخیر"><div class="grid-lines"><div></div><div></div><div></div><div></div></div><div class="bar-groups">${months.map(m => `<div class="bar-group"><div class="bar-pair"><div class="bar income" style="height:${Math.max(2, Math.round(m.income / maxValue * 202))}px" title="درآمد ${esc(monthName(m.month))}: ${amount(m.income)}"></div><div class="bar expense" style="height:${Math.max(2, Math.round(m.expense / maxValue * 202))}px" title="هزینه ${esc(monthName(m.month))}: ${amount(m.expense)}"></div></div><div class="bar-group-label">${esc(monthName(m.month).split(' ')[0])}</div></div>`).join('')}</div></div>`;
  }
  function incomeChartPanel() { return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">درآمد و هزینه در گذر زمان</h2><div class="panel-sub">مقایسه مالی در ۶ ماه اخیر تا ماه انتخاب‌شده</div></div><div class="chart-legend"><span><i class="legend-dot green-dot"></i>درآمد</span><span><i class="legend-dot red-dot"></i>هزینه</span></div></div>${monthlyChart()}</section>`; }
  function donutPanel() {
    const cats = categoryBreakdown(); const total = cats.reduce((r, c) => r + c.value, 0);
    if (!total) return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">هزینه‌ها به تفکیک دسته</h2><div class="panel-sub">سهم هر دسته از هزینه‌های این ماه</div></div>${icon('pie')}</div><div class="chart-empty">هنوز هزینه‌ای برای تحلیل ثبت نشده.</div></section>`;
    let angle = 0; const parts = cats.map((c, i) => { const start = angle; angle += c.value / total * 100; return `${c.color || colors[i % colors.length]} ${start.toFixed(2)}% ${angle.toFixed(2)}%`; });
    return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">هزینه‌ها به تفکیک دسته</h2><div class="panel-sub">پول شما بیشتر کجا خرج شده؟</div></div>${icon('pie')}</div>
      <div class="donut-flex"><div class="donut-chart" role="img" aria-label="نمودار دسته‌بندی هزینه‌ها" style="background:conic-gradient(${parts.join(',')})"><div class="donut-inner"><small>کل هزینه</small><strong>${digits(total / 1000000 > 1 ? (total / 1000000).toFixed(1) : (total / 1000).toFixed(0))}</strong><span>${total >= 1000000 ? 'میلیون تومان' : 'هزار تومان'}</span></div></div>
      <div class="donut-legend">${cats.slice(0, 6).map(c => `<div class="donut-legend-row"><div class="catname"><i class="color-key" style="background:${c.color}"></i><span>${esc(c.short)}</span></div><strong>${digits(percent(c.value, total))}٪</strong></div>`).join('')}</div></div></section>`;
  }
  function txRow(tx) {
    const cat = getCat(tx.type, tx.category);
    return `<div class="txn-row"><div class="tx-cat-icon" style="background:${cat.bg}">${cat.emoji}</div><div class="txn-info"><div class="txn-title">${esc(tx.title)}</div><div class="txn-meta">${esc(cat.name)} · ${esc(shortDate(tx.date))}</div></div><div class="txn-amount ${tx.type}" dir="ltr">${tx.type === 'income' ? '+' : '−'} ${amount(tx.amount)}</div><div class="txn-actions"><button title="ویرایش" aria-label="ویرایش ${esc(tx.title)}" data-action="edit" data-id="${esc(tx.id)}">${icon('pencil','small')}</button><button title="حذف" aria-label="حذف ${esc(tx.title)}" data-action="delete" data-id="${esc(tx.id)}">${icon('trash','small')}</button></div></div>`;
  }
  function emptyState(title, help, btnText = '', action = 'add') {
    return `<div class="empty-state"><div class="empty-icon">${icon('wallet','large')}</div><strong>${title}</strong><span>${help}</span>${btnText ? `<button class="btn btn-primary btn-small" data-action="${action}">${icon('plus','small')}${btnText}</button>` : ''}</div>`;
  }
  function recentPanel() {
    const rows = sortByDate(transactions()).slice(0, 5);
    return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">آخرین تراکنش‌ها</h2><div class="panel-sub">فعالیت‌های ثبت‌شده در این ماه</div></div><button class="text-link" data-page="transactions">مشاهده همه ←</button></div>${rows.length ? `<div class="txn-list">${rows.map(txRow).join('')}</div>` : emptyState('هنوز تراکنشی ثبت نشده', 'با ثبت اولین درآمد یا هزینه، اینجا تراکنش‌هات رو می‌بینی.', 'ثبت اولین تراکنش')}</section>`;
  }
  function budgetComponent() {
    const t = monthTotals(); const spent = t.expense; const budget = data.budget; const isOver = budget > 0 && spent > budget; const ratio = budget > 0 ? percent(spent, budget) : 0;
    return `<div><div class="budget-amount" dir="auto">${amount(budget)}</div><div class="budget-summary"><span>هزینه شده: <strong>${amount(spent)}</strong></span><span>${digits(ratio)}٪ مصرف‌شده</span></div><div class="budget-progress ${isOver ? 'over' : ''}"><div style="width:${Math.min(100, ratio)}%"></div></div><div class="budget-status ${isOver ? 'warning' : ''}">${icon(isOver ? 'alert' : 'check','small')} ${budget === 0 ? 'بودجه ماهانه هنوز تنظیم نشده است.' : isOver ? `از بودجه تعیین‌شده ${amount(spent - budget)} بیشتر خرج شده.` : `تا سقف بودجه ${amount(budget - spent)} باقی مانده.`}</div></div>`;
  }
  function budgetPanel() { return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">بودجه ماهانه</h2><div class="panel-sub">روی هزینه‌هات کنترل داشته باش</div></div><button class="text-link" data-action="edit-budget">${icon('pencil','small')} ویرایش</button></div>${budgetComponent()}<div class="budget-illustration"><div><strong>خرج هوشمندانه،<br>آینده روشن‌تر!</strong><span>قدم‌های کوچیک، نتیجه‌های بزرگ.</span></div><div class="illustration-icon">${icon('target','large')}</div></div></section>`; }
  function dashboard() { return `${demoBanner()}${metrics()}<div class="panels">${incomeChartPanel()}${donutPanel()}</div><div class="lower-panels">${recentPanel()}${budgetPanel()}</div>`; }
  function filters() {
    return `<div class="toolbar"><div class="search-field">${icon('search')}<input id="tx-search" type="search" placeholder="جست‌وجوی عنوان یا توضیحات..." value="${esc(ui.query)}" autocomplete="off" /></div>
      <select class="field" id="tx-type" aria-label="فیلتر نوع تراکنش"><option value="all" ${ui.type === 'all' ? 'selected' : ''}>همه تراکنش‌ها</option><option value="expense" ${ui.type === 'expense' ? 'selected' : ''}>فقط هزینه‌ها</option><option value="income" ${ui.type === 'income' ? 'selected' : ''}>فقط درآمدها</option></select>
      <select class="field" id="tx-category" aria-label="فیلتر دسته‌بندی"><option value="all">همه دسته‌ها</option>${[...categories.expense, ...categories.income].map(c => `<option value="${c.id}" ${ui.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
      <select class="field" id="tx-sort" aria-label="ترتیب نمایش"><option value="newest" ${ui.sort === 'newest' ? 'selected' : ''}>جدیدترین</option><option value="oldest" ${ui.sort === 'oldest' ? 'selected' : ''}>قدیمی‌ترین</option><option value="largest" ${ui.sort === 'largest' ? 'selected' : ''}>بیشترین مبلغ</option><option value="smallest" ${ui.sort === 'smallest' ? 'selected' : ''}>کمترین مبلغ</option></select></div>`;
  }
  function filteredTx() {
    let rows = transactions().filter(t => (ui.type === 'all' || t.type === ui.type) && (ui.category === 'all' || t.category === ui.category) && (`${t.title} ${t.notes || ''} ${getCat(t.type, t.category).name}`).toLocaleLowerCase('fa-IR').includes(ui.query.toLocaleLowerCase('fa-IR').trim()));
    if (ui.sort === 'oldest') rows.sort((a, b) => a.date.localeCompare(b.date));
    else if (ui.sort === 'largest') rows.sort((a, b) => b.amount - a.amount);
    else if (ui.sort === 'smallest') rows.sort((a, b) => a.amount - b.amount);
    else rows = sortByDate(rows);
    return rows;
  }
  function transactionPage() {
    const rows = filteredTx();
    return `${demoBanner()}<div class="panel"><div class="panel-head"><div><h2 class="panel-title">لیست تراکنش‌ها <span class="currency-label">(${digits(rows.length)} مورد)</span></h2><div class="panel-sub">تراکنش‌های ${esc(monthName(ui.month))} را مدیریت کن</div></div><button class="btn btn-outline btn-small" data-action="export">${icon('download','small')} خروجی CSV</button></div>${filters()}${rows.length ? `<div class="table-wrap"><table class="tx-table"><thead><tr><th>تراکنش</th><th>دسته‌بندی</th><th>تاریخ</th><th>نوع</th><th>مبلغ (تومان)</th><th>عملیات</th></tr></thead><tbody>${rows.map(t => { const cat = getCat(t.type,t.category); return `<tr><td><div class="table-title">${esc(t.title)}</div>${t.notes ? `<div class="txn-meta">${esc(t.notes).slice(0, 75)}</div>` : ''}</td><td>${cat.emoji} ${esc(cat.name)}</td><td>${esc(shortDate(t.date))}</td><td><span class="pill ${t.type}">${t.type === 'income' ? 'درآمد' : 'هزینه'}</span></td><td class="txn-amount ${t.type}" dir="ltr">${digits(t.amount)}</td><td><div class="txn-actions"><button data-action="edit" data-id="${esc(t.id)}" aria-label="ویرایش ${esc(t.title)}">${icon('pencil','small')}</button><button data-action="delete" data-id="${esc(t.id)}" aria-label="حذف ${esc(t.title)}">${icon('trash','small')}</button></div></td></tr>`; }).join('')}</tbody></table></div>` : emptyState('تراکنشی پیدا نشد', 'ماه یا فیلتر جست‌وجو رو تغییر بده؛ یا تراکنش جدید ثبت کن.', 'ثبت تراکنش')}</div><p class="footnote">توجه: تاریخ‌های برنامه بر اساس تقویم میلادی نمایش داده می‌شوند و تمام مبالغ به تومان هستند.</p>`;
  }
  function budgetPage() {
    const t = monthTotals(); const remaining = data.budget - t.expense;
    return `${demoBanner()}<div class="budget-hero"><div><div class="eyebrow" style="color:#b0dacc">بودجه‌بندی شخصی</div><h2>برای هر تومان یک هدف داشته باش!</h2><p>با تعیین سقف هزینه، می‌تونی خرج‌های ماهانه رو هوشمندانه مدیریت کنی.</p><button class="btn btn-small" data-action="edit-budget">${icon('pencil','small')} تنظیم بودجه</button></div><div><div class="budget-big-label">مبلغ باقی‌مانده</div><div class="budget-big-stat" dir="auto">${moneySign(remaining)}</div></div></div>
      <div class="report-grid"><div class="report-small"><div class="report-small-label">بودجه تعیین‌شده</div><div class="report-small-value" dir="auto">${amount(data.budget)}</div></div><div class="report-small"><div class="report-small-label">کل هزینه این ماه</div><div class="report-small-value" dir="auto">${amount(t.expense)}</div></div><div class="report-small"><div class="report-small-label">درصد مصرف بودجه</div><div class="report-small-value">${digits(percent(t.expense, data.budget))}٪</div></div></div>
      <div class="split-report"><section class="panel"><div class="panel-head"><div><h2 class="panel-title">وضعیت بودجه</h2><div class="panel-sub">در ماه ${esc(monthName(ui.month))}</div></div></div>${budgetComponent()}</section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">سهم دسته‌های هزینه</h2><div class="panel-sub">مهم‌ترین بخش‌های خرج شما</div></div></div>${categoryBars()}</section></div>`;
  }
  function categoryBars() {
    const cats = categoryBreakdown(); const total = cats.reduce((s,c) => s + c.value, 0);
    if (!cats.length) return emptyState('اطلاعات کافی نیست', 'یک هزینه ثبت کن تا سهم هر دسته نمایش داده بشه.');
    return cats.map(c => `<div class="breakdown-row"><div class="breakdown-top"><span>${c.emoji} ${esc(c.name)}</span><strong>${amount(c.value)}</strong></div><div class="breakdown-track"><div class="breakdown-fill" style="width:${percent(c.value,total)}%;background:${c.color}"></div></div></div>`).join('');
  }
  function reportsPage() {
    const t = monthTotals(); const count = transactions().length; const all = data.transactions;
    const avg = t.expense && transactions().filter(x => x.type === 'expense').length ? Math.round(t.expense / transactions().filter(x => x.type === 'expense').length) : 0;
    return `${demoBanner()}<p class="page-intro">این گزارش‌ها به‌صورت لحظه‌ای از تراکنش‌هایی که ثبت کردی محاسبه می‌شن.</p><div class="report-grid"><div class="report-small"><div class="report-small-label">تعداد تراکنش این ماه</div><div class="report-small-value">${digits(count)} مورد</div></div><div class="report-small"><div class="report-small-label">میانگین مبلغ هر هزینه</div><div class="report-small-value" dir="auto">${amount(avg)}</div></div><div class="report-small"><div class="report-small-label">نرخ پس‌انداز ماهانه</div><div class="report-small-value">${digits(savingsRate(t))}٪</div></div></div>
    <div class="panels">${incomeChartPanel()}${donutPanel()}</div><div class="split-report"><section class="panel"><div class="panel-head"><div><h2 class="panel-title">دسته‌های پرهزینه</h2><div class="panel-sub">مقایسه جزئی هزینه‌های ماه</div></div></div>${categoryBars()}</section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">دریافت گزارش</h2><div class="panel-sub">اطلاعاتت رو برای بررسی بیشتر ذخیره کن</div></div></div><div class="empty-state" style="padding:20px 10px"><div class="empty-icon">${icon('download','large')}</div><strong>خروجی CSV قابل استفاده در Excel</strong><span>تمام ${digits(all.length)} تراکنش در فایل خروجی قرار می‌گیرند، نه فقط ماه انتخاب‌شده.</span><button class="btn btn-primary" data-action="export">${icon('download')} دریافت فایل CSV</button></div></section></div>`;
  }
  function transactionModal() {
    const id = ui.modal?.id;
    const tx = id ? data.transactions.find(t => t.id === id) : null;
    const type = tx?.type || 'expense'; const opts = categories[type];
    const date = tx?.date || (ui.month === getMonth() ? getDate() : `${ui.month}-15`);
    return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-label"><div class="modal-head"><h2 id="modal-label">${tx ? 'ویرایش تراکنش' : 'ثبت تراکنش جدید'}</h2><button class="modal-x" data-action="close" aria-label="بستن">${icon('x','small')}</button></div><form id="transaction-form">
      <div class="type-tabs"><label><input type="radio" name="type" value="expense" ${type === 'expense' ? 'checked' : ''} /><span>${icon('trendingdown','small')}</span> هزینه</label><label><input type="radio" name="type" value="income" ${type === 'income' ? 'checked' : ''} /><span>${icon('trending','small')}</span> درآمد</label></div>
      <div class="form-group"><label for="tx-title">عنوان تراکنش *</label><input id="tx-title" name="title" maxlength="80" value="${esc(tx?.title || '')}" placeholder="مثلاً خرید از سوپرمارکت" required /></div>
      <div class="form-row"><div class="form-group"><label for="tx-amount">مبلغ به تومان *</label><input id="tx-amount" name="amount" type="number" min="1" step="1" max="9007199254740991" value="${tx?.amount || ''}" placeholder="مثلاً ۳۵۰۰۰۰" required /></div><div class="form-group"><label for="tx-date">تاریخ (میلادی) *</label><input id="tx-date" name="date" type="date" value="${date}" required /></div></div>
      <div class="form-group"><label for="tx-category-select">دسته‌بندی *</label><select id="tx-category-select" name="category">${opts.map(c => `<option value="${c.id}" ${c.id === tx?.category ? 'selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
      <div class="form-group"><label for="tx-notes">یادداشت (اختیاری)</label><textarea id="tx-notes" name="notes" maxlength="500" placeholder="توضیح کوتاه درباره تراکنش...">${esc(tx?.notes || '')}</textarea></div>
      <div class="modal-actions"><button type="button" class="btn btn-outline" data-action="close">انصراف</button><button class="btn btn-primary" type="submit">${icon('save','small')}${tx ? 'ذخیره تغییرات' : 'ثبت تراکنش'}</button></div></form></section></div>`;
  }
  function budgetModal() { return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-label"><div class="modal-head"><h2 id="modal-label">تنظیم سقف بودجه ماهانه</h2><button class="modal-x" data-action="close" aria-label="بستن">${icon('x','small')}</button></div><p class="modal-description">این مبلغ برای کنترل هزینه ماه انتخاب‌شده استفاده می‌شه. سقف بودجه برای همه ماه‌ها یکسان خواهد بود.</p><form id="budget-form"><div class="form-group"><label for="budget-input">بودجه ماهانه (تومان)</label><input id="budget-input" name="budget" type="number" min="0" step="1" max="9007199254740991" value="${data.budget}" required /></div><div class="modal-actions"><button type="button" class="btn btn-outline" data-action="close">انصراف</button><button type="submit" class="btn btn-primary">${icon('check','small')} ذخیره بودجه</button></div></form></section></div>`; }
  function confirmModal() {
    const info = ui.modal;
    let title = 'آیا مطمئنی؟', message = '', button = 'تأیید';
    if (info.kind === 'delete') { const t = data.transactions.find(x => x.id === info.id); title = 'حذف تراکنش'; message = `تراکنش «${esc(t?.title || '')}» برای همیشه حذف می‌شه. این کار قابل بازگشت نیست.`; button = 'بله، حذف کن'; }
    if (info.kind === 'clear-demo') { title = 'حذف اطلاعات آزمایشی'; message = 'تمام تراکنش‌های نمونه پاک می‌شن و می‌تونی اطلاعات واقعی خودت رو از صفر ثبت کنی.'; button = 'پاک‌کردن نمونه‌ها'; }
    if (info.kind === 'replace-demo') { title = 'جایگزینی اطلاعات با نمونه'; message = 'تراکنش‌های فعلی پاک شده و اطلاعات نمایشی جای آن‌ها قرار می‌گیرند. اول از اطلاعات واقعی خروجی CSV بگیر.'; button = 'جایگزینی'; }
    return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-label"><div class="modal-head"><h2 id="modal-label">${title}</h2><button class="modal-x" data-action="close" aria-label="بستن">${icon('x','small')}</button></div><p class="modal-description">${message}</p><div class="modal-actions"><button class="btn btn-outline" data-action="close">انصراف</button><button class="btn btn-danger" data-action="confirm">${icon('trash','small')}${button}</button></div></section></div>`;
  }
  function modalHTML() {
    if (!ui.modal) return '';
    if (ui.modal.kind === 'transaction') return transactionModal();
    if (ui.modal.kind === 'budget') return budgetModal();
    return confirmModal();
  }
  function render() {
    document.documentElement.dataset.theme = data.theme;
    document.documentElement.lang = 'fa';
    const content = { dashboard, transactions: transactionPage, budget: budgetPage, reports: reportsPage }[ui.page]();
    root.innerHTML = `<div class="app-shell"><div class="overlay ${ui.sidebar ? 'show' : ''}" data-action="menu-close"></div><aside class="sidebar ${ui.sidebar ? 'open' : ''}">
        <div class="brand"><div class="brand-mark">${icon('wallet')}</div><div><div class="brand-name">MoneyMate</div><div class="brand-sub">همراه مالی شخصی تو</div></div></div>
        <div class="sidebar-label">منوی اصلی</div><nav class="nav" aria-label="بخش‌های اپلیکیشن">${navButton('dashboard','داشبورد','grid')}${navButton('transactions','تراکنش‌ها','arrows')}${navButton('budget','بودجه‌بندی','target')}${navButton('reports','گزارش‌ها','chart')}</nav>
        <div class="sidebar-bottom"><div class="tip-panel"><div class="tip-kicker">${icon('spark','small')} یک قدم جلوتر</div><div class="tip-body">با ثبت هزینه‌های کوچیک روزانه، آخر ماه تصویر واضح‌تری از پولت داری.</div></div><div class="storage-note">${icon('lock','small')} اطلاعات فقط در همین مرورگر ذخیره می‌شود</div></div>
      </aside><main class="main">${header()}${content}<p class="footnote">MoneyMate · نسخه ۱.۰ — ابزار مدیریت مالی شخصی، بدون اتصال بانکی · ساخته‌شده با کمک AI</p></main>
      <nav class="mobile-nav" aria-label="پیمایش تلفن همراه">${mobileNav('dashboard','داشبورد','grid')}${mobileNav('transactions','تراکنش‌ها','arrows')}${mobileNav('budget','بودجه','target')}${mobileNav('reports','گزارش','chart')}</nav></div>${modalHTML()}`;
    if (ui.modal) { const el = document.querySelector('.modal input:not([type=radio]), .modal button'); if (el) el.focus({ preventScroll: true }); }
  }
  function toast(message) {
    const old = document.querySelector('.toast'); if (old) old.remove();
    clearTimeout(toastTimeout);
    const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.innerHTML = `${icon('check','small')}<span>${esc(message)}</span>`;
    document.body.appendChild(el); toastTimeout = setTimeout(() => el.remove(), 3500);
  }
  function sampleTransactions() {
    const now = new Date(); let serial = 0;
    const add = (offset, day, title, amount, category, type = 'expense') => {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, Math.min(day, 27));
      return { id: `sample-${offset}-${++serial}`, date: getDate(d), title, amount, type, category, notes: '' };
    };
    const result = [];
    for (let i = -5; i <= 0; i++) {
      const k = i + 6;
      result.push(add(i, 4, 'حقوق ماهانه', 47000000 + k * 750000, 'salary', 'income'));
      result.push(add(i, 9, 'پروژه فریلنسری', 4600000 + k * 270000, 'freelance', 'income'));
      result.push(add(i, 2, 'اجاره و هزینه خانه', 14500000 + k * 120000, 'bills'));
      result.push(add(i, 5, 'خرید هفتگی سوپرمارکت', 2350000 + k * 180000, 'food'));
      result.push(add(i, 8, 'رفت‌وآمد روزانه', 950000 + k * 100000, 'transport'));
      result.push(add(i, 12, 'کافه و رستوران', 1190000 + k * 150000, 'food'));
      result.push(add(i, 14, 'خرید پوشاک', 2250000 + k * 130000, 'shopping'));
      result.push(add(i, 17, 'قبض اینترنت', 550000 + k * 25000, 'bills'));
      result.push(add(i, 20, 'سینما و تفریح', 690000 + k * 70000, 'entertainment'));
      result.push(add(i, 23, 'کتاب و دوره آموزشی', 1290000 + k * 90000, 'education'));
      result.push(add(i, 25, 'خدمات درمانی', 780000 + k * 40000, 'health'));
    }
    return result;
  }
  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  function acceptDemo() { data.transactions = sampleTransactions(); data.demoMode = true; data.budget = 29000000; ui.month = getMonth(); save(); ui.modal = null; render(); toast('اطلاعات نمایشی بارگذاری شد.'); }
  function clearDemo() { data.transactions = []; data.demoMode = false; data.budget = 15000000; save(); ui.modal = null; render(); toast('حساب آماده ثبت اطلاعات خودته.'); }
  function exportCSV() {
    if (!data.transactions.length) { toast('برای دریافت فایل ابتدا تراکنش ثبت کن.'); return; }
    const quote = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [['شناسه', 'تاریخ میلادی', 'نوع', 'عنوان', 'دسته‌بندی', 'مبلغ (تومان)', 'یادداشت'], ...sortByDate(data.transactions).map(t => [t.id, t.date, t.type === 'income' ? 'درآمد' : 'هزینه', t.title, getCat(t.type, t.category).name, t.amount, t.notes])];
    const csv = '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = `moneymate-transactions-${getDate()}.csv`; link.style.display = 'none'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); toast('فایل تراکنش‌ها دریافت شد.');
  }
  function navigate(page) { if (!['dashboard','transactions','budget','reports'].includes(page)) return; ui.page = page; ui.sidebar = false; window.scrollTo({ top: 0, behavior: 'instant' }); render(); }

  root.addEventListener('click', event => {
    const pageEl = event.target.closest('[data-page]');
    if (pageEl) { navigate(pageEl.dataset.page); return; }
    const el = event.target.closest('[data-action]'); if (!el) return;
    const action = el.dataset.action; const id = el.dataset.id;
    if (action === 'backdrop') { if (event.target === el) { ui.modal = null; render(); } return; }
    if (action === 'close') { ui.modal = null; render(); return; }
    if (action === 'add') { ui.modal = { kind: 'transaction' }; render(); return; }
    if (action === 'edit') { ui.modal = { kind: 'transaction', id }; render(); return; }
    if (action === 'delete') { ui.modal = { kind: 'delete', id }; render(); return; }
    if (action === 'edit-budget') { ui.modal = { kind: 'budget' }; render(); return; }
    if (action === 'theme') { data.theme = data.theme === 'light' ? 'dark' : 'light'; save(); render(); return; }
    if (action === 'prev-month' || action === 'next-month') { ui.month = toMonth(ui.month, action === 'prev-month' ? -1 : 1); render(); return; }
    if (action === 'menu') { ui.sidebar = !ui.sidebar; render(); return; }
    if (action === 'menu-close') { ui.sidebar = false; render(); return; }
    if (action === 'load-demo') { if (data.transactions.length) { ui.modal = { kind: 'replace-demo' }; render(); } else acceptDemo(); return; }
    if (action === 'clear-demo') { ui.modal = { kind: 'clear-demo' }; render(); return; }
    if (action === 'export') { exportCSV(); return; }
    if (action === 'confirm') {
      if (ui.modal?.kind === 'delete') { data.transactions = data.transactions.filter(t => t.id !== ui.modal.id); if (!data.transactions.length) data.demoMode = false; ui.modal = null; save(); render(); toast('تراکنش حذف شد.'); }
      else if (ui.modal?.kind === 'clear-demo') clearDemo();
      else if (ui.modal?.kind === 'replace-demo') acceptDemo();
    }
  });
  root.addEventListener('change', event => {
    const el = event.target;
    if (el.name === 'type' && el.closest('#transaction-form')) {
      const select = root.querySelector('#tx-category-select');
      if (select) select.innerHTML = categories[el.value].map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('');
    }
    if (el.id === 'tx-type') { ui.type = el.value; render(); }
    if (el.id === 'tx-category') { ui.category = el.value; render(); }
    if (el.id === 'tx-sort') { ui.sort = el.value; render(); }
  });
  root.addEventListener('input', event => {
    if (event.target.id === 'tx-search') {
      const selection = event.target.selectionStart;
      ui.query = event.target.value; render();
      const input = root.querySelector('#tx-search'); if (input) { input.focus(); try { input.setSelectionRange(selection, selection); } catch { /* search input may not support selection */ } }
    }
  });
  root.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target.id === 'transaction-form') {
      const form = new FormData(event.target);
      const type = form.get('type'); const title = String(form.get('title') || '').trim(); const price = Number(form.get('amount'));
      const date = String(form.get('date') || ''); const category = String(form.get('category') || ''); const notes = String(form.get('notes') || '').trim();
      const parsed = parseDate(date);
      if (!title || title.length > 80 || !Number.isSafeInteger(price) || price <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || getDate(parsed) !== date || !categories[type]?.some(c => c.id === category)) { toast('لطفاً اطلاعات تراکنش را درست وارد کن.'); return; }
      const existing = ui.modal?.id; const tx = { id: existing || generateId(), type, title, amount: price, date, category, notes };
      if (existing) data.transactions = data.transactions.map(t => t.id === existing ? tx : t);
      else data.transactions.push(tx);
      // Keep demo mode visibly labelled until the user explicitly clears sample records.
      ui.month = monthOf(date); ui.modal = null; save(); render(); toast(existing ? 'تراکنش با موفقیت ویرایش شد.' : 'تراکنش با موفقیت ثبت شد.');
    }
    if (event.target.id === 'budget-form') {
      const budget = Number(new FormData(event.target).get('budget'));
      if (!Number.isSafeInteger(budget) || budget < 0) { toast('لطفاً بودجه معتبر وارد کن.'); return; }
      data.budget = budget; ui.modal = null; save(); render(); toast('بودجه ماهانه ذخیره شد.');
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && ui.modal) { ui.modal = null; render(); } });
  render();
})();
