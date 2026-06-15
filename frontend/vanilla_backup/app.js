/* ─────────────────────────────────────────────────
   UNITY — UNIFIED NETWORK FOR INTERDEPARTMENTAL TRANSPARENCY AND YIELD
   ───────────────────────────────────────────────── */

'use strict';

/* ── UTILITIES ──────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const padZ = (n) => String(n).padStart(2, '0');

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ── CLOCK ──────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const h = padZ(now.getHours());
  const m = padZ(now.getMinutes());
  const s = padZ(now.getSeconds());
  const clockEl = $('liveClock');
  if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;

  const dateEl = $('liveDate');
  if (dateEl) dateEl.textContent = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  const briefDateEl = $('briefDate');
  if (briefDateEl) briefDateEl.textContent = `${MONTHS[now.getMonth()].substring(0,3).toUpperCase()} ${now.getDate()}, ${now.getFullYear()}`;

  const briefTimeEl = $('briefTime');
  if (briefTimeEl) briefTimeEl.textContent = `${h}:${m} HRS`;

  const footerEl = $('footerTs');
  if (footerEl) footerEl.textContent = `Last sync: ${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ── ATTENTION DATE ─────────────────────────────── */
const attentionDateEl = document.getElementById('attentionDate');
if (attentionDateEl) {
  const now = new Date();
  attentionDateEl.textContent = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

/* ── DYNAMIC INTEL SENTENCE ────────────────── */
const intelSentences = [
  'Revenue Department has not cleared land acquisition for 12 days. PWD, Energy, Water Supply, and Transport are all waiting. One unresolved clearance is blocking 11 projects and affecting 3,750+ citizens.',
  'WHO IS WAITING: PWD is waiting for Revenue. Energy is waiting for PWD. Water is waiting for Energy. This chain cannot move until Revenue issues the clearance today.',
  'WHAT IS BLOCKED: MP Nagar Road Widening, AIIMS Pipeline Upgrade, Kolar Road Utility Relocation. Three projects. One root cause. Revenue Department land acquisition clearance.',
  'ACTION REQUIRED: (1) Direct Revenue Commissioner to convene clearance session. (2) Reschedule AIIMS maintenance to 23:00 window. (3) Issue 48-hour compliance notice to Energy Department.',
  'CITIZEN IMPACT: 400+ AIIMS patients at risk. 2,400 students on disrupted school routes. Emergency vehicle access narrowed. ₹2.3 Cr penalty clause activates Friday if no action taken.',
];
const briefEl = $('briefIntel');
if (briefEl) {
  let idx = 0;
  briefEl.textContent = intelSentences[0];
  setInterval(() => {
    idx = (idx + 1) % intelSentences.length;
    briefEl.style.opacity = 0;
    setTimeout(() => {
      briefEl.textContent = intelSentences[idx];
      briefEl.style.transition = 'opacity 0.6s ease';
      briefEl.style.opacity = 1;
    }, 400);
  }, 12000);
}

/* ── GOVERNANCE PULSE SCORE & INTEL BRIEFING ───── */
const pulseValEl = $('pulseVal');
if (pulseValEl) {
  let animScore = 0;
  const targetScore = 78;
  const animInterval = setInterval(() => {
    animScore = Math.min(animScore + 1, targetScore);
    pulseValEl.textContent = Math.round(animScore);
    if (animScore >= targetScore) clearInterval(animInterval);
  }, 20);
}

const pulseBriefingSentences = [
  'Dependency monitoring active. Revenue Department is the primary coordination bottleneck — 7 active inter-department dependencies blocked. PWD and Energy await clearances.',
  'Coordination conditions under stress. 23 active inter-department dependencies tracked. 5 coordination conflicts elevated. Immediate administrative intervention required on 3 projects.',
  'Revenue clearance backlog at 90-day high. Three departments waiting on single clearance chain. Resolution window narrowing — Revenue-PWD review must be scheduled today.',
  'Coordination indicators show elevated failure risk. Energy Department has been non-responsive for 19 days. PHE and Transport dependency chains also at risk of escalation.'
];

const briefingEl = $('pulseBriefing');
if (briefingEl) {
  let idx = 0;
  briefingEl.textContent = pulseBriefingSentences[0];
  setInterval(() => {
    idx = (idx + 1) % pulseBriefingSentences.length;
    briefingEl.style.opacity = 0;
    setTimeout(() => {
      briefingEl.textContent = pulseBriefingSentences[idx];
      briefingEl.style.transition = 'opacity 0.6s ease';
      briefingEl.style.opacity = 1;
    }, 400);
  }, 12000);
}

/* ── ACTIVITY FEED DATA ─────────────────────────── */
const feedData = [
  { type: 'completed', text: 'Land compensation approved — Plot 47-B, MP Nagar extension.',    dept: 'Revenue Dept',       time: '07:42' },
  { type: 'completed', text: 'Utility relocation completed — Sector 12 water main diverted.',   dept: 'Water Supply',       time: '07:31' },
  { type: 'flagged',   text: 'New conflict detected — MP Nagar road widening, pole zone B.',    dept: 'Energy Dept',        time: '07:18' },
  { type: 'completed', text: 'Sewer maintenance completed — Arera Colony Ward 4.',              dept: 'Health & Sanitation',time: '07:05' },
  { type: 'critical',  text: 'Revenue clearance overdue — 12-day threshold breached.',          dept: 'Revenue Dept',       time: '06:55' },
  { type: 'completed', text: 'Traffic signal installation approved — Kolar–Hoshangabad Rd.',    dept: 'Public Works',       time: '06:40' },
  { type: 'flagged',   text: 'AIIMS pipeline schedule conflict escalated to Water Department.',  dept: 'Water Supply',       time: '06:28' },
  { type: 'info',      text: 'Morning operational briefing generated at 06:00 hours.',          dept: 'Command Center',     time: '06:00' },
  { type: 'completed', text: 'Contractor payment released — Phase 2, Kolar road.',              dept: 'Finance Dept',       time: '05:48' },
  { type: 'completed', text: 'NOC issued — JP Hospital building expansion, Block D.',           dept: 'Urban Planning',     time: '05:30' },
  { type: 'info',      text: 'Shift handover completed — Night operations transferred.',        dept: 'Operations',         time: '05:00' },
  { type: 'flagged',   text: 'Street lighting fault reported — Bhopal Taal embankment.',       dept: 'Energy Dept',        time: '04:33' },
  { type: 'completed', text: 'Water pressure normalised — Zone 6, after overnight maintenance.',dept: 'Water Supply',       time: '03:55' },
  { type: 'critical',  text: 'Energy pole relocation SLA breached — Kolar corridor, Day 19.',  dept: 'Energy Dept',        time: '00:01' },
];

const ICON_MAP = { completed: '✓', flagged: '⚠', critical: '●', info: '○' };
const CLASS_MAP = { completed: 'fi-completed', flagged: 'fi-flagged', critical: 'fi-critical', info: 'fi-info' };

let feedCounts = { completed: 0, flagged: 0, critical: 0, info: 0 };
let activeFilter = 'all';

function renderFeed(filter = 'all') {
  const stream = $('feedStream');
  if (!stream) return;
  stream.innerHTML = '';
  feedCounts = { completed: 0, flagged: 0, critical: 0, info: 0 };

  feedData.forEach(item => {
    feedCounts[item.type]++;
    if (filter !== 'all' && item.type !== filter) return;

    const div = document.createElement('div');
    div.className = `feed-item ${CLASS_MAP[item.type]}`;
    div.innerHTML = `
      <span class="feed-item-icon">${ICON_MAP[item.type]}</span>
      <div>
        <div class="feed-item-text">${item.text}</div>
        <div class="feed-item-dept">${item.dept}</div>
      </div>
      <span class="feed-item-time">${item.time}</span>
    `;
    stream.appendChild(div);
  });

  $('feedCountGreen').textContent = feedCounts.completed;
  $('feedCountAmber').textContent = feedCounts.flagged;
  $('feedCountRed').textContent = feedCounts.critical;
  $('feedCountGrey').textContent = feedCounts.info;
}

renderFeed();

// Live feed: add new items periodically
const liveEvents = [
  { type: 'completed', text: 'Tree relocation clearance granted — Phase 1, MG Road.',          dept: 'Urban Planning' },
  { type: 'flagged',   text: 'Footpath encroachment detected — Arera Colony crossing.',        dept: 'Public Works' },
  { type: 'completed', text: 'Drainage inspection cleared — Ward 7, Kolar extension.',         dept: 'Health & Sanitation' },
  { type: 'info',      text: 'Contractor mobilization confirmed — Bridge repair, Lake Road.',   dept: 'Public Works' },
  { type: 'flagged',   text: 'Permit delay reported — Commercial building, Zone 3B.',          dept: 'Urban Planning' },
];
let liveIdx = 0;

setInterval(() => {
  const now = new Date();
  const timeStr = `${padZ(now.getHours())}:${padZ(now.getMinutes())}`;
  const evt = { ...liveEvents[liveIdx % liveEvents.length], time: timeStr };
  feedData.unshift(evt);
  liveIdx++;
  renderFeed(activeFilter);
}, 14000);

// Feed filter buttons
['filterAll','filterCompleted','filterFlagged','filterCritical'].forEach(id => {
  const btn = $(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.feed-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderFeed(activeFilter);
  });
});

/* ── MODAL ──────────────────────────────────────── */
const modalData = {
  dc1: {
    title: 'MP Nagar Road Widening — Revenue Clearance',
    body: `
      <p style="margin-bottom:14px">The Revenue Commissioner's office has not processed the land acquisition counter-signature for 12 days. The contractor (M/s Patel Infrastructure) has flagged this as a blocking issue and has formally requested extension approval.</p>
      <p style="margin-bottom:14px">Under the contract terms (Clause 14.3), delays beyond 15 working days trigger a penalty waiver provision. <strong style="color:#e8e0d0">Friday is the deadline.</strong></p>
      <p style="margin-bottom:14px">Recommended course of action: Direct the Revenue Commissioner to convene an emergency clearance session today. Assign a nodal officer to track daily until resolution.</p>
      <div style="background:#0e1016;border:1px solid #242a38;padding:14px;margin-top:16px">
        <div style="font-family:IBM Plex Mono;font-size:9px;letter-spacing:0.18em;color:#55637a;margin-bottom:8px">FILE REFERENCE</div>
        <div style="font-family:IBM Plex Mono;font-size:11px;color:#8a9bb5">BMC/INFRA/2026/0341 — MP Nagar Road Widening Phase 2</div>
      </div>
    `,
    actions: ['Initiate Review Meeting', 'Escalate to Commissioner', 'Request Status Report'],
  },
  dc2: {
    title: 'AIIMS Pipeline Upgrade — Maintenance Conflict',
    body: `
      <p style="margin-bottom:14px">The Water Supply Department has scheduled a 6-hour water main maintenance window (08:00–14:00) that directly overlaps with AIIMS Bhopal's operational peak hours. The hospital has flagged this as a potential patient safety risk.</p>
      <p style="margin-bottom:14px">AIIMS administration has formally requested either a night window (23:00–05:00) or a reduced-flow maintenance approach using parallel pipelines.</p>
      <p style="margin-bottom:14px">The Water Supply SE has indicated that a night window is technically feasible but requires coordination with hospital backup systems.</p>
    `,
    actions: ['Reschedule to Night Window', 'Request Technical Assessment', 'Coordinate with AIIMS Admin'],
  },
  dc3: {
    title: 'Energy Utility Relocation — Kolar Corridor',
    body: `
      <p style="margin-bottom:14px">15 MPEB electrical poles in the Kolar Road corridor remain unshifted despite a formal relocation request filed 19 days ago. The Energy Department's field team has not been deployed.</p>
      <p style="margin-bottom:14px">The PWD contractor (M/s Sharma Constructions) has halted foundation work in the affected segment. Idle costs are accumulating at approximately ₹80,000 per day.</p>
      <p style="margin-bottom:14px">The MPEB Division Engineer has cited "resource reallocation" as the delay reason. A 48-hour compliance notice is recommended.</p>
    `,
    actions: ['Issue 48-Hour Notice', 'Escalate to Energy Secretary', 'Schedule Site Meeting'],
  },
};

function openModal(key) {
  const data = modalData[key];
  if (!data) return;
  $('modalTitle').textContent = data.title;
  $('modalBody').innerHTML = data.body;
  const actionsEl = $('modalActions');
  actionsEl.innerHTML = '';
  data.actions.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = i === 0 ? 'modal-action-primary' : 'modal-action-secondary';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      btn.textContent = '✓ Logged';
      btn.disabled = true;
    });
    actionsEl.appendChild(btn);
  });
  $('modalOverlay').classList.add('active');
}

['reviewBtn1','reviewBtn2','reviewBtn3'].forEach((id, i) => {
  const btn = $(id);
  if (btn) btn.addEventListener('click', () => openModal(`dc${i+1}`));
});

$('modalClose').addEventListener('click', () => {
  $('modalOverlay').classList.remove('active');
});
$('modalOverlay').addEventListener('click', (e) => {
  if (e.target === $('modalOverlay')) $('modalOverlay').classList.remove('active');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') $('modalOverlay').classList.remove('active');
});

/* ── MAP BUTTON ─────────────────────────────────── */
$('openMapBtn').addEventListener('click', () => {
  alert('Full Governance Map — integration with GIS layer pending. This would open the city-wide spatial command interface.');
});

/* ── ANIMATE BOTTLENECK SUMMARY BARS ────────────── */
const bsFills = document.querySelectorAll('.bs-fill[data-target]');
const bsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.dataset.target;
      entry.target.style.width = target + '%';
      bsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
bsFills.forEach(el => {
  el.style.width = '0%';
  el.style.transition = 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
  bsObserver.observe(el);
});


/* ── CITIZEN IMPACT COUNTER ────────────────────── */
const cmCitizensEl = document.getElementById('cmCitizens');
if (cmCitizensEl) {
  const TARGET_CITIZENS = 3750;
  const citizenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let count = 0;
        const step = Math.ceil(TARGET_CITIZENS / 80);
        const ticker = setInterval(() => {
          count = Math.min(count + step, TARGET_CITIZENS);
          cmCitizensEl.textContent = count.toLocaleString('en-IN');
          if (count >= TARGET_CITIZENS) clearInterval(ticker);
        }, 18);
        citizenObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  citizenObserver.observe(cmCitizensEl);
}

/* ── RIPPLE NODE INTERACTIVITY ──────────────────── */
const rippleData = {
  revenue: {
    badge: 'ORIGIN — REVENUE DEPT',
    title: 'Revenue Clearance Delay',
    origin: 'Land acquisition counter-signature not issued by Revenue Commissioner — 12 days overdue',
    depts: 'PWD, Energy, Water Supply, Transport, Urban Planning (5 departments cascading)',
    projects: '11 projects blocked — MP Nagar Road Widening, Kolar Corridor, 9 downstream projects',
    delay: '45+ days if unresolved by Friday',
    citizen: '3,750+ citizens — 800 hospital patients, 2,400 students, 350 traders',
    financial: '₹2.3 Cr penalty clause activates Friday — ₹80,000/day idle contractor costs',
  },
  land: {
    badge: 'CASCADE 1 — LAND ACQUISITION',
    title: 'Land Acquisition Pending',
    origin: 'Revenue clearance not issued — title transfer blocked for MP Nagar Plot 47-B',
    depts: 'Revenue Department, Public Works Department',
    projects: 'MP Nagar Road Widening, Plot 47-B compensation case',
    delay: '12–20 days depending on Revenue response speed',
    citizen: '2,400 students on disrupted school transport routes',
    financial: '₹40,000/day contractor idle cost — penalty clause approaching activation',
  },
  road: {
    badge: 'CASCADE 2 — PWD',
    title: 'Road Widening Delayed',
    origin: 'Foundation work halted — contractor M/s Patel Infrastructure demobilized',
    depts: 'Public Works Department',
    projects: 'MP Nagar Road Widening Phase 2 — 3 downstream utility projects also held',
    delay: '45 days projected total delay from contract start',
    citizen: '800+ residents — emergency vehicle route narrowed',
    financial: '₹2.3 Cr contract penalty + ₹80,000/day idle costs accumulating',
  },
  utility: {
    badge: 'CASCADE 3 — ENERGY DEPT',
    title: 'Utility Relocation Delayed',
    origin: '15 MPEB poles unshifted — Energy field teams not deployed for 19 days',
    depts: 'Energy Department (MPEB), Public Works Department',
    projects: 'Kolar Road Utility Relocation, Traffic Signal Infrastructure, Emergency Route Widening',
    delay: '19 days elapsed — 30+ days projected if compliance notice not issued today',
    citizen: 'Emergency route effectively narrowed — ambulance response time at risk',
    financial: '₹80,000/day idle contractor cost — total exposure Rs 15.2 Lakh so far',
  },
  traffic: {
    badge: 'CASCADE 4 — TRAFFIC + URBAN',
    title: 'Traffic Diversion Delayed',
    origin: 'BMC Traffic Cell has not processed diversion sign-off — 6 days in queue',
    depts: 'Transport Department, Municipal Corporation, Urban Planning',
    projects: '2 active contractor sites blocked — Kolar signal infrastructure, Arera Colony diversion',
    delay: '6 days elapsed — escalates to critical within 3 days',
    citizen: 'Daily commuters on 2 major corridors affected — estimated 12,000 vehicles/day',
    financial: 'Contractor extensions required — ₹18 Lakh in avoidable rescheduling costs',
  },
  hospital: {
    badge: 'TERMINAL IMPACT — CITIZENS',
    title: 'Hospital Access Risk Increased',
    origin: 'Cascading failures from Revenue, Energy, and Water Supply unresolved decisions',
    depts: 'All 5 blocked departments — Revenue, PWD, Energy, Water Supply, Health',
    projects: 'AIIMS Pipeline, Kolar Road Widening, MP Nagar Road Widening, Water Main Maintenance',
    delay: 'Immediate — ongoing right now',
    citizen: 'AIIMS Bhopal: 400+ daily patients. 3 schools: 2,400 students. Emergency route: ambulance risk. 4 market zones: 350 traders.',
    financial: 'Total projected liability: ₹3.7 Cr — avoidable with decisions taken today',
  },
};

const rippleNodes = document.querySelectorAll('.ripple-node[data-ripple]');
const rdpEmpty   = document.getElementById('rdpEmpty');
const rdpContent = document.getElementById('rdpContent');

rippleNodes.forEach(node => {
  node.addEventListener('click', () => {
    const key = node.dataset.ripple;
    const data = rippleData[key];
    if (!data) return;

    // Highlight active node
    rippleNodes.forEach(n => n.classList.remove('rn-active'));
    node.classList.add('rn-active');

    // Populate detail panel
    document.getElementById('rdpBadge').textContent  = data.badge;
    document.getElementById('rdpTitle').textContent  = data.title;
    document.getElementById('rdpOrigin').textContent = data.origin;
    document.getElementById('rdpDepts').textContent  = data.depts;
    document.getElementById('rdpProjects').textContent = data.projects;
    document.getElementById('rdpDelay').textContent    = data.delay;
    document.getElementById('rdpCitizen').textContent  = data.citizen;
    document.getElementById('rdpFinancial').textContent = data.financial;

    // Show content, hide empty state
    if (rdpEmpty)   rdpEmpty.style.display   = 'none';
    if (rdpContent) rdpContent.style.display = 'block';
  });
});

/* ── DECISION CARD BUTTON STATES ────────────────── */
document.querySelectorAll('.dc-ghost-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.textContent = '✓ Deferred';
    this.disabled = true;
    this.style.color = 'var(--text-dim)';
  });
});

document.querySelectorAll('.dc-secondary-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.decision-card');
    const dept = card ? card.querySelector('.dc-dept')?.textContent : 'Department';
    this.textContent = '✓ Escalated';
    this.disabled = true;
    this.style.borderColor = 'var(--critical-light)';
    this.style.color = 'var(--critical-light)';

    // Add to live feed
    const now = new Date();
    const timeStr = `${padZ(now.getHours())}:${padZ(now.getMinutes())}`;
    const title = card?.querySelector('.dc-title')?.textContent || 'Project';
    feedData.unshift({
      type: 'flagged',
      text: `Escalation logged — ${title}. Awaiting response from ${dept}.`,
      dept: 'Command Center',
      time: timeStr
    });
    renderFeed(activeFilter);
  });
});

/* ── CONSOLE SIGNATURE ──────────────────────────── */
console.log('%cUNITY — Unified Network for Interdepartmental Transparency and Yield', 'color:#c8a84b;font-size:16px;font-weight:bold;font-family:monospace');
console.log('%cBhopal Municipal Corporation — UNITY v3.0.0', 'color:#55637a;font-size:11px;font-family:monospace');
console.log('%cOFFICIAL — RESTRICTED', 'color:#b5451b;font-size:10px;font-family:monospace');

/* ── SECTION SCROLL-SPY NAV ─────────────────────── */
const sectionIds = ['s-brief','s-attention','s-decisions','s-pulse','s-risk','s-pressure','s-impact','s-feed','s-map','s-exec-decisions','s-citizen','s-cost','s-ripple','s-network','s-timeline','s-insights','s-forecast'];
const navItems   = document.querySelectorAll('.sn-item');

// Back-to-top button
const bttBtn = document.createElement('button');
bttBtn.className = 'back-to-top';
bttBtn.textContent = '↑ Top';
bttBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(bttBtn);
bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

function updateActiveNav() {
  const scrollY = window.scrollY;
  const topbarH = 56;

  // Back-to-top visibility
  if (scrollY > 400) bttBtn.classList.add('visible');
  else bttBtn.classList.remove('visible');

  // Find current section
  let currentId = sectionIds[0];
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= topbarH + 80) {
      currentId = id;
    }
  });

  navItems.forEach(item => {
    const isActive = item.dataset.section === currentId;
    item.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ================================================================== */
/*  UNITY ANIMATION ENGINE                                              */
/*  Added: Section reveal, counters, ripple cascade, dependency flow   */
/* ================================================================== */

/* ─── 1. PROGRESSIVE SECTION REVEAL (Intersection Observer) ─────── */
(function() {
  const sections = document.querySelectorAll('.section');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('unity-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  sections.forEach((sec, i) => {
    // Stagger the initial reveal delay based on position on page
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Already visible on load — reveal immediately with slight stagger
      setTimeout(() => sec.classList.add('unity-visible'), i * 80);
    } else {
      revealObs.observe(sec);
    }
  });
})();

/* ─── 2. GENERIC COUNTER ANIMATION UTILITY ───────────────────────── */
function unityAnimateCount(el, target, duration, suffix) {
  if (!el) return;
  suffix = suffix || '';
  const start = performance.now();
  const startVal = 0;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic ease-out
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * ease);
    el.textContent = current.toLocaleString('en-IN') + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString('en-IN') + suffix;
      el.classList.add('unity-counter-done');
      setTimeout(() => el.classList.remove('unity-counter-done'), 1000);
    }
  }
  requestAnimationFrame(tick);
}

/* ─── 3. COUNTER TARGETS ─────────────────────────────────────────── */
const counterTargets = [
  // Morning brief stat panel
  { id: 'bspDepts',     target: 3,    duration: 900,  suffix: '' },
  { id: 'bspProjects',  target: 11,   duration: 1100, suffix: '' },
  { id: 'bspCitizens',  target: 3750, duration: 1200, suffix: '' },
  { id: 'bspDays',      target: 12,   duration: 800,  suffix: '' },
  // Citizen metrics (cm- prefix)
  { id: 'cmProjects',   target: 11,   duration: 900,  suffix: '' },
  { id: 'cmDepts',      target: 5,    duration: 700,  suffix: '' },
  { id: 'cmSchools',    target: 4,    duration: 700,  suffix: '' },
  { id: 'cmRoutes',     target: 1,    duration: 500,  suffix: '' },
];

(function() {
  counterTargets.forEach(cfg => {
    const el = document.getElementById(cfg.id);
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          unityAnimateCount(el, cfg.target, cfg.duration, cfg.suffix);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
})();

/* ─── 4. RIPPLE CASCADE ANIMATION ───────────────────────────────── */
/* When a ripple node is clicked, cascade highlight flows downward   */
const RIPPLE_ORDER = ['revenue','land','road','utility','traffic','hospital'];

(function() {
  const allNodes = document.querySelectorAll('.ripple-node[data-ripple]');

  allNodes.forEach(node => {
    node.addEventListener('click', () => {
      const clickedKey = node.dataset.ripple;
      const clickedIdx = RIPPLE_ORDER.indexOf(clickedKey);
      if (clickedIdx === -1) return;

      // Clear all cascade classes
      allNodes.forEach(n => {
        n.classList.remove('rn-cascade', 'rn-cascade-critical');
      });

      // Animate cascade: each downstream node lights up in sequence
      RIPPLE_ORDER.forEach((key, idx) => {
        if (idx <= clickedIdx) return; // only downstream

        const downstreamNode = document.querySelector(`.ripple-node[data-ripple="${key}"]`);
        if (!downstreamNode) return;

        const delay = (idx - clickedIdx) * 320; // 320ms between each cascade step
        setTimeout(() => {
          // Terminal node (hospital) = critical red; others = warning amber
          if (key === 'hospital') {
            downstreamNode.classList.add('rn-cascade-critical');
          } else {
            downstreamNode.classList.add('rn-cascade');
          }
        }, delay);
      });
    });
  });
})();

/* ─── 5. PRESSURE CARD GAUGE FILL (trigger on visibility) ────────── */
(function() {
  const gauges = document.querySelectorAll('.pc-gauge-fill[data-target]');
  const gaugeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.target || '0';
        // Small delay so the section reveal completes first
        setTimeout(() => {
          entry.target.style.width = target + '%';
        }, 200);
        gaugeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  gauges.forEach(g => {
    g.style.width = '0%';
    gaugeObs.observe(g);
  });
})();

/* ─── 6. COST BAR FILL ANIMATION (trigger on visibility) ─────────── */
(function() {
  const costBars = document.querySelectorAll('.cip-bar[data-target], .cost-metric-fill[data-target]');
  const costObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.target || '0';
        setTimeout(() => {
          entry.target.style.width = target + '%';
        }, 250);
        costObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  costBars.forEach(bar => {
    bar.style.width = '0%';
    costObs.observe(bar);
  });
})();

/* ─── 7. RIPPLE SECTION CONNECTOR LINE PULSE ─────────────────────── */
/* Draws attention to the chain structure via subtle CSS toggle        */
(function() {
  const rippleSection = document.getElementById('s-ripple');
  if (!rippleSection) return;
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Auto-trigger first ripple node after a brief delay
        const firstNode = rippleSection.querySelector('.ripple-node[data-ripple="revenue"]');
        if (firstNode) {
          setTimeout(() => firstNode.click(), 800);
        }
        sectionObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  sectionObs.observe(rippleSection);
})();

/* ─── 8. WAITING MATRIX — ROW STATUS DOT PULSE (CRITICAL ROWS) ───── */
(function() {
  const criticalRows = document.querySelectorAll('.wm-row');
  criticalRows.forEach(row => {
    const statusEl = row.querySelector('.wm-col-status');
    if (statusEl && statusEl.textContent.includes('CRITICAL')) {
      row.style.setProperty('--row-urgency', '1');
    }
  });
})();

