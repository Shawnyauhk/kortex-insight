import { renderEnglishPage } from './en.js';

const app = document.querySelector('#app');
const englishTitles = {
  home: 'Kortex Insight | Hong Kong Legal Intelligence',
  insights: 'Legal Insights | Kortex Insight',
  briefings: 'Legal Briefings | Kortex Insight',
  research: 'Hong Kong Legislation & Case Law | Kortex Insight',
  assistant: 'AI-Assisted Research | Kortex Insight',
  solutions: 'Solutions for Law Firms | Kortex Insight'
};
const routeSlugs = {
  '/en': 'home',
  '/en/insights': 'insights',
  '/en/briefings': 'briefings',
  '/en/research': 'research',
  '/en/assistant': 'assistant',
  '/en/solutions': 'solutions'
};
const navCopy = {
  '/insights': ['Insights', '法律資訊'],
  '/briefings': ['Briefings', '簡報與往期'],
  '/research': ['Legal Research', '法律研究'],
  '/assistant': ['AI Research', 'AI 輔助研究'],
  '/solutions': ['Solutions for Law Firms', '律所工作方案']
};
const insightCategories = ['All', 'Litigation & Disputes', 'Financial Regulation & Listing', 'Employment & Labour', 'Corporate & Commercial'];
let currentIssue = 0;
let activeFilter = 'All';
let resultFilter = 'All';
let toastTimer;

const isEnglish = (path = location.pathname) => path === '/en' || path.startsWith('/en/');
const basePath = (path) => path.replace(/^\/en(?=\/|$)/, '') || '/';
const localizedPath = (path, english) => {
  const base = basePath(path);
  return english ? `/en${base === '/' ? '' : base}` : base;
};
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function updateShell(path, english) {
  document.documentElement.lang = english ? 'en' : 'zh-Hant-HK';
  setText('proto-label', english ? 'Prototype' : '互動原型');
  setText('proto-copy', english
    ? 'Sample content and interactions only. Legal search and AI services are not connected.'
    : '內容與操作為示例，尚未接入真實法律檢索或 AI 服務');

  Object.entries(navCopy).forEach(([route, [en, zh]]) => {
    const link = document.querySelector(`[data-route="${route}"]`);
    if (!link) return;
    if (route === '/assistant') link.innerHTML = `${english ? en : 'AI 研究'} <span class="nav-lab">BETA</span>`;
    else if (route === '/solutions') setText('header-solution-label', english ? 'For Firms' : '律所方案');
    else if (link.id) setText(link.id, english ? en : zh);
  });

  setText('mobile-insights', english ? 'Insights' : '法律資訊');
  setText('mobile-briefings', english ? 'Briefings' : '簡報與往期');
  setText('mobile-research', english ? 'Legal Research' : '法律研究');
  setText('mobile-assistant', english ? 'AI Research' : 'AI 輔助研究');
  setText('mobile-solutions', english ? 'Solutions for Law Firms' : '律所工作方案');
  const tagline = document.getElementById('footer-tagline');
  if (tagline) tagline.innerHTML = english
    ? 'Navigate change. Find the source.<br />Built for legal work.'
    : '掌握變化，查找依據。<br />接續你的專業工作。';
  setText('footer-insights', english ? 'Insights' : '法律資訊');
  setText('footer-briefings', english ? 'Briefings' : '法律簡報');
  setText('footer-research', english ? 'Research' : '法律研究');
  setText('footer-assistant', english ? 'AI Research' : 'AI 研究');
  setText('footer-solutions', english ? 'Solutions' : '專業服務');
  setText('footer-prototype', english ? 'Hong Kong legal intelligence · Front-end prototype' : '香港法律情報介面・前端展示原型');
  setText('footer-disclaimer', english ? 'Sample content is not legal advice. Verify against original sources.' : '示例內容不構成法律意見，使用前請回到來源核查。');
  setText('back-top', english ? 'Back to top ↑' : '返回頁首 ↑');
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) mainNav.setAttribute('aria-label', english ? 'Primary navigation' : '主要導覽');
  const backTop = document.querySelector('.back-top');
  if (backTop) backTop.setAttribute('aria-label', english ? 'Back to top' : '返回頁首');

  document.querySelectorAll('[data-route]').forEach(link => {
    link.setAttribute('href', localizedPath(link.dataset.route, english));
  });
  document.querySelectorAll('[data-nav]').forEach(link => {
    const base = link.dataset.route;
    link.dataset.nav = localizedPath(base, english);
    link.classList.toggle('is-active', basePath(path) === base);
  });
  const languageLink = document.getElementById('lang-toggle');
  if (languageLink) {
    languageLink.href = localizedPath(path, !english);
    languageLink.textContent = english ? '繁體中文' : 'EN';
    languageLink.lang = english ? 'zh-Hant' : 'en';
    languageLink.setAttribute('aria-label', english ? 'Switch to Traditional Chinese' : 'Switch to English');
  }
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) mobileNav.setAttribute('aria-label', english ? 'Mobile navigation' : '手機導覽');
  const menu = document.querySelector('.menu-toggle');
  if (menu) menu.setAttribute('aria-label', english ? 'Open navigation menu' : '打開導覽選單');
  const dismiss = document.querySelector('.note-dismiss');
  if (dismiss) {
    dismiss.setAttribute('aria-label', english ? 'Dismiss prototype notice' : '關閉原型提示');
    dismiss.title = english ? 'Dismiss notice' : '關閉提示';
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3400);
}

function render(path = location.pathname, animate = true) {
  if (!isEnglish(path)) {
    updateShell(path, false);
    return;
  }
  const slug = routeSlugs[path] || 'home';
  app.classList.remove('page-enter');
  app.innerHTML = renderEnglishPage(slug, currentIssue, activeFilter);
  updateShell(path, true);
  document.title = englishTitles[slug];
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = 'Kortex Insight — legal insights, briefings and research for Hong Kong. Start with a question; verify against the source.';
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = document.title;
  document.querySelector('.mobile-nav')?.classList.remove('is-open');
  document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
  if (animate) {
    app.classList.add('page-enter');
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}

function showSearchResult(query, target) {
  const clean = query.trim();
  if (!clean) {
    showToast('Enter a question, legislation title or case number to see a demo search.');
    return;
  }
  const escaped = escapeHtml(clean);
  if (target === 'research') {
    const results = document.querySelector('#research-results');
    if (!results) return;
    let feedback = document.querySelector('#research-search-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'research-search-feedback';
      feedback.className = 'search-match';
      results.before(feedback);
    }
    feedback.innerHTML = `<div><span class="eyebrow">DEMO SEARCH · SAMPLE ONLY</span><h3>“${escaped}”</h3><p>This interface is not connected to a live legal database. The records below are fixed examples.</p></div>`;
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    const panel = document.querySelector('#search-result');
    if (!panel) return;
    panel.innerHTML = `<div class="search-match"><div><span class="eyebrow">DEMO SEARCH · SAMPLE ONLY</span><h3>“${escaped}”</h3><p>This is a visual demo, not a live search result. Browse the sample research records instead.</p></div><a href="/en/research" data-link class="text-link">Browse research ↗</a></div>`;
    panel.classList.add('is-open');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  showToast('Demo only · live legal search is not connected.');
}

function filterInsights() {
  const query = document.querySelector('#insight-search')?.value.toLowerCase().trim() || '';
  let count = 0;
  document.querySelectorAll('#story-list .story-row').forEach(row => {
    const category = row.querySelector('.eyebrow-line span')?.textContent.trim() || '';
    const visible = (activeFilter === 'All' || category === activeFilter) && (!query || row.textContent.toLowerCase().includes(query));
    row.hidden = !visible;
    if (visible) count++;
  });
  setText('story-count', `${count} sample items`);
}

function filterResearch(type) {
  resultFilter = type;
  document.querySelectorAll('.research-tab').forEach(button => button.classList.toggle('is-active', button.dataset.rfilter === type));
  document.querySelectorAll('#research-results .result-card').forEach(row => { row.hidden = type !== 'All' && row.dataset.resultType !== type; });
}

function addChatMessage(prompt) {
  const messages = document.querySelector('#chat-messages');
  if (!messages) return;
  const user = document.createElement('div');
  user.className = 'message user-message';
  user.innerHTML = `<div class="message-bubble"><p>${escapeHtml(prompt)}</p></div>`;
  messages.append(user);
  const answer = document.createElement('div');
  answer.className = 'message assistant-message';
  answer.innerHTML = '<span class="message-avatar">K</span><div class="message-bubble"><p>As a starting point, identify the relevant facts and contract terms, then look for applicable legislation and judgments. Verify the wording, version and context in the original sources.</p><div class="answer-source"><span class="source-placeholder">Sample source</span><span>Live Hong Kong legal data is not connected</span></div><span class="message-source">Fixed demo response · Not legal advice</span></div>';
  setTimeout(() => { messages.append(answer); messages.scrollTop = messages.scrollHeight; }, 180);
  messages.scrollTop = messages.scrollHeight;
}

function runAction(action) {
  const path = location.pathname;
  if (action === 'demo-source') showToast('Sample source link · external sources are not connected.');
  if (action === 'demo-solution') showToast('Demo entry only · enquiry and purchase services are not connected.');
  if (action === 'issue-prev') { currentIssue = Math.min(2, currentIssue + 1); render(path, false); }
  if (action === 'issue-next') { currentIssue = Math.max(0, currentIssue - 1); render(path, false); }
  if (action === 'reset-chat') render(path, false);
  if (action === 'clear-filters') {
    activeFilter = 'All';
    document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('is-active', button.dataset.filter === 'All'));
    const input = document.querySelector('#insight-search');
    if (input) input.value = '';
    filterInsights();
  }
}

function navigateEnglish(path) {
  if (!routeSlugs[path]) return;
  history.pushState({}, '', path);
  render(path);
}

document.addEventListener('click', event => {
  const anchor = event.target.closest('a[data-link]');
  if (anchor?.id === 'lang-toggle') {
    event.preventDefault();
    event.stopImmediatePropagation();
    const next = new URL(anchor.href).pathname;
    history.pushState({}, '', next);
    if (isEnglish(next)) render(next);
    else {
      window.dispatchEvent(new PopStateEvent('popstate'));
      updateShell(next, false);
    }
    return;
  }
  if (anchor && isEnglish() && routeSlugs[anchor.getAttribute('href')]) {
    event.preventDefault();
    event.stopImmediatePropagation();
    navigateEnglish(anchor.getAttribute('href'));
    return;
  }
  if (isEnglish()) {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action) { event.preventDefault(); event.stopImmediatePropagation(); runAction(action); return; }
    const chip = event.target.closest('[data-query]');
    if (chip) {
      event.preventDefault(); event.stopImmediatePropagation();
      const input = document.querySelector('#main-search-input');
      if (input) { input.value = chip.dataset.query; showSearchResult(input.value, 'home'); }
      return;
    }
    const category = event.target.closest('[data-filter]');
    if (category) {
      event.preventDefault(); event.stopImmediatePropagation();
      activeFilter = category.dataset.filter;
      document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('is-active', button === category));
      filterInsights();
      return;
    }
    const researchFilter = event.target.closest('[data-rfilter]');
    if (researchFilter) { event.preventDefault(); event.stopImmediatePropagation(); filterResearch(researchFilter.dataset.rfilter); return; }
    const issue = event.target.closest('[data-issue]');
    if (issue) { event.preventDefault(); event.stopImmediatePropagation(); currentIssue = Number(issue.dataset.issue); render(location.pathname, false); return; }
    const prompt = event.target.closest('[data-prompt]');
    if (prompt) { event.preventDefault(); event.stopImmediatePropagation(); addChatMessage(prompt.dataset.prompt); }
  }
}, true);

document.addEventListener('submit', event => {
  if (!isEnglish()) return;
  if (event.target.matches('.search-form')) {
    event.preventDefault(); event.stopImmediatePropagation();
    const query = new FormData(event.target).get('q')?.toString() || '';
    showSearchResult(query, event.target.id === 'research-search' ? 'research' : 'home');
  }
  if (event.target.id === 'chat-form') {
    event.preventDefault(); event.stopImmediatePropagation();
    const input = event.target.querySelector('textarea');
    if (input.value.trim()) { addChatMessage(input.value); input.value = ''; }
  }
}, true);

document.addEventListener('input', event => {
  if (isEnglish() && event.target.id === 'insight-search') filterInsights();
}, true);

window.addEventListener('popstate', () => {
  const path = location.pathname;
  if (isEnglish(path)) render(path, false);
  else updateShell(path, false);
});

updateShell(location.pathname, isEnglish());
if (isEnglish()) render(location.pathname, false);
