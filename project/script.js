/* ═══════════════════════════════════════════════════════
   STUDYBOARD — Main Script
   ═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. NAVIGATION
───────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');
const pages    = document.querySelectorAll('.page');

function navigateTo(pageId) {
  pages.forEach(p => {
    p.classList.remove('active');
  });
  navLinks.forEach(l => l.classList.remove('active'));

  const targetPage = document.getElementById('page-' + pageId);
  const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);

  if (targetPage) targetPage.classList.add('active');
  if (targetLink) targetLink.classList.add('active');

  localStorage.setItem('activePage', pageId);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.page));
});

// Restore last page
const savedPage = localStorage.getItem('activePage') || 'idea-board';
navigateTo(savedPage);


/* ─────────────────────────────────────────────
   2. THEME TOGGLE
───────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const sun  = document.getElementById('iconSun');
  const moon = document.getElementById('iconMoon');
  if (sun && moon) {
    sun.style.display  = theme === 'dark' ? 'block' : 'none';
    moon.style.display = theme === 'dark' ? 'none'  : 'block';
  }
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();


/* ─────────────────────────────────────────────
   3. IDEA BOARD
───────────────────────────────────────────── */
const ideaInput   = document.getElementById('ideaInput');
const authorSelect= document.getElementById('authorSelect');
const postBtn     = document.getElementById('postBtn');
const ideaBoard   = document.getElementById('ideaBoard');
const emptyState  = document.getElementById('emptyState');

let ideas = [];

function loadIdeas() {
  const saved = localStorage.getItem('groupIdeas');
  ideas = saved ? JSON.parse(saved) : [];
}

function saveIdeas() {
  localStorage.setItem('groupIdeas', JSON.stringify(ideas));
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function parseMarkdown(text) {
  // Escape HTML first
  let html = escapeHtml(text);
  
  // Convert markdown syntax to HTML
  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic: *text* or _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Underline: ++text++
  html = html.replace(/\+\+(.+?)\+\+/g, '<u>$1</u>');
  
  // Strikethrough: ~~text~~
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
  
  // Code: `text`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Links: [text](url)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Preserve line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function wrapHtmlTagsAsCode(text) {
  // Wrap "<tag>" patterns in backticks so they render as code rather than being treated as HTML.
  // We avoid modifying content already inside backticks.
  let output = '';
  let i = 0;

  while (i < text.length) {
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end === -1) {
        output += text.slice(i);
        break;
      }
      // Preserve existing code spans as-is
      output += text.slice(i, end + 1);
      i = end + 1;
      continue;
    }

    if (text[i] === '<') {
      const end = text.indexOf('>', i + 1);
      if (end !== -1) {
        const tag = text.slice(i, end + 1);
        // Only wrap likely HTML tags (simple check)
        if (/^<\/?[a-zA-Z][^>]*>$/.test(tag)) {
          output += '`' + tag + '`';
          i = end + 1;
          continue;
        }
      }
    }

    output += text[i];
    i += 1;
  }

  return output;
}

function renderIdeas() {
  ideaBoard.innerHTML = '';

  if (ideas.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  [...ideas]
    .sort((a, b) => b.id - a.id)
    .forEach(idea => {
      const card = createIdeaCard(idea);
      ideaBoard.appendChild(card);
    });
}

function createIdeaCard(idea) {
  const card = document.createElement('div');
  card.className = 'idea-card';
  card.id = `idea-${idea.id}`;

  const initial = idea.author.charAt(0).toUpperCase();
  const parsedContent = parseMarkdown(idea.text);

  card.innerHTML = `
    <button class="delete-btn" title="Delete" onclick="deleteIdea(${idea.id}); event.stopPropagation();">✕</button>
    <div class="content-wrapper">
      <div class="content">${parsedContent}</div>
      <button class="read-more-btn" onclick="openIdeaModal({id: ${idea.id}, text: \`${idea.text.replace(/`/g, '\\`')}\`, author: '${idea.author}', timestamp: '${idea.timestamp}'}); event.stopPropagation();">Read More</button>
    </div>
    <div class="card-footer">
      <div class="author-tag">
        <div class="avatar">${initial}</div>
        <span class="author-name">${escapeHtml(idea.author)}</span>
      </div>
      <span class="timestamp">${idea.timestamp}</span>
    </div>
  `;

  // Add click handler to open modal (only if not clicking read-more, which has its own handler)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.delete-btn') && !e.target.closest('.read-more-btn')) {
      openIdeaModal(idea);
    }
  });

  // Detect if content is truncated and show read-more button
  requestAnimationFrame(() => {
    setTimeout(() => {
      const content = card.querySelector('.content');
      const readMoreBtn = card.querySelector('.read-more-btn');
      
      if (!content || !readMoreBtn) return;
      
      // Check if content is overflowing
      if (content.scrollHeight > content.clientHeight + 2) {
        readMoreBtn.style.display = 'block';
      } else {
        readMoreBtn.style.display = 'none';
      }
    }, 50);
  });

  return card;
}

function openIdeaModal(idea) {
  const modal = document.getElementById('ideaModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const avatar = document.getElementById('modalAvatar');
  const authorName = document.getElementById('modalAuthorName');
  const timestamp = document.getElementById('modalTimestamp');
  const content = document.getElementById('modalIdeaContent');

  const initial = idea.author.charAt(0).toUpperCase();
  const parsedContent = parseMarkdown(idea.text);

  avatar.textContent = initial;
  authorName.textContent = idea.author;
  timestamp.textContent = idea.timestamp;
  content.innerHTML = parsedContent;

  modal.classList.remove('hidden');

  // Close handlers
  const closeModal = () => modal.classList.add('hidden');
  closeBtn.onclick = closeModal;
  overlay.onclick = closeModal;

  // ESC key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function showDuplicateWarning(author) {
  let warning = document.getElementById('duplicateWarning');
  if (!warning) {
    warning = document.createElement('div');
    warning.id = 'duplicateWarning';
    warning.className = 'duplicate-warning';
    const inputCard = document.querySelector('.input-card');
    inputCard.insertAdjacentElement('afterend', warning);
  }

  warning.innerHTML = `
    <span>⚠ <strong>${escapeHtml(author)}</strong> has already posted this exact idea.</span>
    <button class="warning-close" onclick="closeDuplicateWarning()">✕</button>
  `;
  warning.classList.add('visible');

  clearTimeout(warning._dismissTimer);
  warning._dismissTimer = setTimeout(closeDuplicateWarning, 5000);
}

function closeDuplicateWarning() {
  const warning = document.getElementById('duplicateWarning');
  if (warning) warning.classList.remove('visible');
}

function showHtmlCodeNotice() {
  let notice = document.getElementById('codeWrapNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'codeWrapNotice';
    notice.className = 'duplicate-warning';
    const inputCard = document.querySelector('.input-card');
    inputCard.insertAdjacentElement('afterend', notice);
  }

  notice.innerHTML = `
    <span>⚠ Detected HTML-like syntax (e.g. <code>&lt;script&gt;</code>); it has been wrapped as code for safety.</span>
    <button class="warning-close" onclick="closeHtmlCodeNotice()">✕</button>
  `;
  notice.classList.add('visible');

  clearTimeout(notice._dismissTimer);
  notice._dismissTimer = setTimeout(closeHtmlCodeNotice, 5000);
}

function closeHtmlCodeNotice() {
  const notice = document.getElementById('codeWrapNotice');
  if (notice) notice.classList.remove('visible');
}

function postIdea() {
  const rawText = ideaInput.value;
  const wrappedText = wrapHtmlTagsAsCode(rawText);
  if (wrappedText !== rawText) showHtmlCodeNotice();

  const text   = wrappedText.trim();
  const author = authorSelect.value;

  if (!text)   { shakeField(ideaInput); return; }
  if (!author) { shakeField(authorSelect); return; }

  // Warn (but don't block) if same contributor already posted identical text
  const normalised = text.toLowerCase().replace(/\s+/g, ' ');
  const isDuplicate = ideas.some(
    idea => idea.author === author &&
            idea.text.trim().toLowerCase().replace(/\s+/g, ' ') === normalised
  );
  if (isDuplicate) showDuplicateWarning(author);

  ideas.push({
    id: Date.now(),
    text,
    author,
    timestamp: new Date().toLocaleString([], {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  });

  saveIdeas();
  renderIdeas();
  ideaInput.value = '';
  ideaInput.focus();
}

function deleteIdea(id) {
  if (!confirm('Delete this idea?')) return;
  ideas = ideas.filter(i => i.id !== id);
  saveIdeas();
  renderIdeas();
}

function shakeField(el) {
  el.style.animation = 'none';
  el.getBoundingClientRect();
  el.style.animation = 'shake 0.35s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// Add shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0); }
    20%    { transform:translateX(-6px); }
    40%    { transform:translateX(6px); }
    60%    { transform:translateX(-4px); }
    80%    { transform:translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

postBtn.addEventListener('click', postIdea);
ideaInput.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') postIdea();
});

// ─────────────────────────────────────────────
// FORMATTING BUTTONS
// ─────────────────────────────────────────────
const formatButtons = {
  boldBtn: { prefix: '**', suffix: '**', placeholder: 'text' },
  italicBtn: { prefix: '*', suffix: '*', placeholder: 'text' },
  underlineBtn: { prefix: '++', suffix: '++', placeholder: 'text' },
  strikeBtn: { prefix: '~~', suffix: '~~', placeholder: 'text' },
  codeBtn: { prefix: '`', suffix: '`', placeholder: 'code' },
  linkBtn: { prefix: '[', suffix: '](url)', placeholder: 'link text' }
};

function insertMarkdown(prefix, suffix, placeholder) {
  const start = ideaInput.selectionStart;
  const end = ideaInput.selectionEnd;
  const text = ideaInput.value;
  const selectedText = text.substring(start, end) || placeholder;
  
  const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
  ideaInput.value = newText;
  
  // Move cursor to inside the formatting
  const cursorPos = start + prefix.length + selectedText.length;
  ideaInput.focus();
  ideaInput.setSelectionRange(cursorPos, cursorPos);
}

Object.entries(formatButtons).forEach(([btnId, config]) => {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      insertMarkdown(config.prefix, config.suffix, config.placeholder);
    });
  }
});

// Keyboard shortcuts
ideaInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      insertMarkdown('**', '**', 'text');
    } else if (e.key === 'i' || e.key === 'I') {
      e.preventDefault();
      insertMarkdown('*', '*', 'text');
    } else if (e.key === 'u' || e.key === 'U') {
      e.preventDefault();
      insertMarkdown('++', '++', 'text');
    }
  }
});

loadIdeas();
renderIdeas();


/* ─────────────────────────────────────────────
   4. GPA CALCULATOR
───────────────────────────────────────────── */
const GRADE_MAP = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F':  0.0
};

const GRADE_OPTIONS = Object.keys(GRADE_MAP)
  .map(g => `<option value="${g}">${g} (${GRADE_MAP[g].toFixed(1)})</option>`)
  .join('');

const courseRowsEl    = document.getElementById('courseRows');
const addCourseBtn    = document.getElementById('addCourseBtn');
const clearCoursesBtn = document.getElementById('clearCoursesBtn');
const calculateGpaBtn = document.getElementById('calculateGpaBtn');
const gpaValue        = document.getElementById('gpaValue');
const gpaBreakdown    = document.getElementById('gpaBreakdown');

let courseIdCounter = 0;

function addCourseRow(name = '', credits = '', grade = '') {
  const id  = ++courseIdCounter;
  const row = document.createElement('div');
  row.className = 'course-row';
  row.id = `course-${id}`;

  row.innerHTML = `
    <input type="text"   placeholder="e.g. Introduction to CS" value="${escapeHtml(name)}" data-field="name" />
    <input type="number" placeholder="3" min="0" max="12" step="0.5" value="${credits}"  data-field="credits" />
    <input type="text"   placeholder="A, B+, C…" maxlength="2" value="${escapeHtml(grade)}" data-field="grade" />
    <button class="remove-row-btn" onclick="removeCourseRow(${id})" title="Remove">✕</button>
  `;

  courseRowsEl.appendChild(row);
}

function removeCourseRow(id) {
  const row = document.getElementById(`course-${id}`);
  if (row) row.remove();
}

function calculateGpa() {
  const rows = courseRowsEl.querySelectorAll('.course-row');
  let totalPoints  = 0;
  let totalCredits = 0;
  const breakdown  = [];
  let valid = true;

  rows.forEach(row => {
    const name    = row.querySelector('[data-field="name"]').value.trim() || 'Course';
    const credits = parseFloat(row.querySelector('[data-field="credits"]').value);
    const grade   = (row.querySelector('[data-field="grade"]').value || '').trim().toUpperCase();

    if (!grade || !(grade in GRADE_MAP) || isNaN(credits) || credits <= 0) {
      valid = false;
      return;
    }

    const points = GRADE_MAP[grade] * credits;
    totalPoints  += points;
    totalCredits += credits;
    breakdown.push({ name, credits, grade, points });
  });

  if (!valid || breakdown.length === 0) {
    gpaValue.textContent = '—';
    gpaBreakdown.innerHTML = `<span style="color:var(--text-muted);font-size:0.82rem;">Fill in all courses with valid credits and letter grades (e.g. A, B+, C-).</span>`;
    return;
  }

  const gpa = totalPoints / totalCredits;
  gpaValue.textContent = gpa.toFixed(2);

  gpaBreakdown.innerHTML = breakdown
    .map(c =>
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
         <span style="color:var(--text);font-weight:600;">${escapeHtml(c.name)}</span>
         <span>${c.credits}&thinsp;cr &nbsp; <strong>${c.grade}</strong> &nbsp; +${c.points.toFixed(1)}pts</span>
       </div>`
    )
    .concat([`<div style="border-top:1px solid var(--border);margin-top:0.5rem;padding-top:0.5rem;">
                <strong>Total credits: ${totalCredits}</strong>
              </div>`])
    .join('');
}

addCourseBtn.addEventListener('click', () => addCourseRow());
clearCoursesBtn.addEventListener('click', () => {
  courseRowsEl.innerHTML = '';
  gpaValue.textContent = '—';
  gpaBreakdown.innerHTML = '';
  addCourseRow();
  addCourseRow();
  addCourseRow();
});
calculateGpaBtn.addEventListener('click', calculateGpa);

// Seed initial rows
addCourseRow();
addCourseRow();
addCourseRow();


/* ─────────────────────────────────────────────
   5. POMODORO TIMER
───────────────────────────────────────────── */
const timerDisplay     = document.getElementById('timerDisplay');
const timerProgressBar = document.getElementById('timerProgressBar');
const startPauseBtn    = document.getElementById('startPauseBtn');
const resetBtn         = document.getElementById('resetBtn');
const timerStatus      = document.getElementById('timerStatus');
const sessionLog       = document.getElementById('sessionLog');
const clearLogBtn      = document.getElementById('clearLogBtn');
const modeTabs         = document.querySelectorAll('.mode-tab');

const sessionsEl       = document.getElementById('sessionsToday');
const focusTimeEl      = document.getElementById('totalFocusTime');
const streakEl         = document.getElementById('currentStreak');
const customTimerSettings = document.getElementById('customTimerSettings');
const customMinutesInput  = document.getElementById('customMinutes');

let timerInterval  = null;
let timeRemaining  = 1500;
let totalDuration  = 1500;
let timerRunning   = false;
let currentMode    = 'pomodoro';
let sessionHistory = [];

const MODE_LABELS = {
  'pomodoro':    'Focus session',
  'short-break': 'Short break',
  'custom':      'Custom session'
};

function loadTimerData() {
  const saved = localStorage.getItem('pomodoroHistory');
  if (saved) {
    sessionHistory = JSON.parse(saved);
    filterTodaySessions();
  }
}

function saveTimerData() {
  localStorage.setItem('pomodoroHistory', JSON.stringify(sessionHistory));
}

function filterTodaySessions() {
  const today = new Date().toDateString();
  const todaySessions = sessionHistory.filter(
    s => new Date(s.ts).toDateString() === today && s.mode === 'pomodoro'
  );
  sessionsEl.textContent   = todaySessions.length;
  const totalMins = todaySessions.reduce((a, s) => a + (s.duration / 60), 0);
  focusTimeEl.textContent  = Math.round(totalMins) + 'm';
  streakEl.textContent     = todaySessions.length;
  renderSessionLog();
}

function renderSessionLog() {
  const today = new Date().toDateString();
  const todaySessions = sessionHistory
    .filter(s => new Date(s.ts).toDateString() === today)
    .reverse();

  if (todaySessions.length === 0) {
    sessionLog.innerHTML = '<p class="log-empty">No sessions yet. Start focusing!</p>';
    return;
  }

  sessionLog.innerHTML = todaySessions.map(s => `
    <div class="log-entry">
      <div>
        <div class="log-entry-time">${s.label}</div>
        <div class="log-entry-label">${new Date(s.ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div>
      </div>
      <span class="log-entry-dur">${Math.round(s.duration / 60)}m</span>
    </div>
  `).join('');
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateProgress() {
  const pct = (timeRemaining / totalDuration) * 100;
  timerProgressBar.style.width = pct + '%';
}

function setMode(mode, seconds) {
  if (timerRunning) stopTimer();
  currentMode   = mode;
  totalDuration = seconds;
  timeRemaining = seconds;
  timerDisplay.textContent = formatTime(seconds);
  timerDisplay.classList.remove('running');
  startPauseBtn.textContent = 'Start';
  timerStatus.textContent   = 'Ready to focus';
  timerProgressBar.style.width = '100%';
  timerProgressBar.style.transition = 'none';
}

function startTimer() {
  timerRunning = true;
  startPauseBtn.textContent = 'Pause';
  timerDisplay.classList.add('running');
  timerStatus.textContent = currentMode === 'pomodoro' ? 'Stay focused...' : 'Rest up...';

  timerProgressBar.style.transition = 'width 1s linear';

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = formatTime(timeRemaining);
    updateProgress();

    if (timeRemaining <= 0) {
      timerComplete();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  startPauseBtn.textContent = 'Resume';
  timerDisplay.classList.remove('running');
  timerStatus.textContent = 'Paused';
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  timeRemaining = totalDuration;
  timerDisplay.textContent  = formatTime(totalDuration);
  timerDisplay.classList.remove('running');
  startPauseBtn.textContent = 'Start';
  timerStatus.textContent   = 'Ready to focus';
  timerProgressBar.style.transition = 'none';
  timerProgressBar.style.width = '100%';
}

function timerComplete() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerDisplay.classList.remove('running');
  startPauseBtn.textContent = 'Start';
  timerStatus.textContent   = '✓ Session complete!';

  // Bell sound (Web Audio API)
  playBell();

  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('StudyBoard', {
      body: `${MODE_LABELS[currentMode]} complete! 🎉`,
      icon: ''
    });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        new Notification('StudyBoard', {
          body: `${MODE_LABELS[currentMode]} complete! 🎉`,
        });
      }
    });
  }

  // Log session
  sessionHistory.push({
    ts:       Date.now(),
    mode:     currentMode,
    label:    MODE_LABELS[currentMode],
    duration: totalDuration
  });
  saveTimerData();
  filterTodaySessions();

  // Reset
  timeRemaining = totalDuration;
  timerProgressBar.style.transition = 'none';
  timerProgressBar.style.width = '100%';
  timerDisplay.textContent = formatTime(totalDuration);
}

function playBell() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();

    function tone(freq, startTime, duration, gain) {
      const osc  = ctx.createOscillator();
      const amp  = ctx.createGain();
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(gain, startTime);
      amp.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    const now = ctx.currentTime;
    tone(880,  now,       1.8, 0.4);
    tone(1100, now + 0.1, 1.5, 0.25);
    tone(660,  now + 0.3, 1.2, 0.2);
  } catch (e) {
    // Audio not supported, fail silently
  }
}

// Mode tab switching
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const mode = tab.dataset.mode;
    
    // Toggle custom settings visibility
    if (mode === 'custom') {
      customTimerSettings.style.display = 'block';
      const seconds = parseInt(customMinutesInput.value, 10) * 60;
      setMode(mode, seconds);
    } else {
      customTimerSettings.style.display = 'none';
      setMode(mode, parseInt(tab.dataset.seconds, 10));
    }
  });
});

// Custom minutes input change
customMinutesInput.addEventListener('input', () => {
  if (currentMode === 'custom') {
    let mins = parseInt(customMinutesInput.value, 10);
    if (isNaN(mins) || mins < 1) mins = 1;
    if (mins > 999) mins = 999;
    
    const seconds = mins * 60;
    setMode('custom', seconds);
  }
});

startPauseBtn.addEventListener('click', () => {
  if (timerRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener('click', resetTimer);

clearLogBtn.addEventListener('click', () => {
  const today = new Date().toDateString();
  sessionHistory = sessionHistory.filter(
    s => new Date(s.ts).toDateString() !== today
  );
  saveTimerData();
  filterTodaySessions();
});

loadTimerData();

// Request notification permission early
if ('Notification' in window && Notification.permission === 'default') {
  // Will be requested on first completion automatically
}
