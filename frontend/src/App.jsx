import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import MorningBrief from './components/MorningBrief';
import AttentionPanel from './components/AttentionPanel';
import DecisionsBoard from './components/DecisionsBoard';
import CoordinationIssues from './components/CoordinationIssues';
import DependenciesMatrix from './components/DependenciesMatrix';
import BottleneckIndex from './components/BottleneckIndex';
import CitizenImpact from './components/CitizenImpact';
import EventLog from './components/EventLog';
import IntelligenceMap from './components/IntelligenceMap';
import ExecDecisions from './components/ExecDecisions';
import PublicServiceImpact from './components/PublicServiceImpact';
import CostIntelligence from './components/CostIntelligence';
import RippleEffect from './components/RippleEffect';
import NetworkGraph from './components/NetworkGraph';
import InterventionTimeline from './components/InterventionTimeline';
import InsightsForecast from './components/InsightsForecast';
import DecisionModal from './components/DecisionModal';

const initialEvents = [
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

const liveEvents = [
  { type: 'completed', text: 'Tree relocation clearance granted — Phase 1, MG Road.',          dept: 'Urban Planning' },
  { type: 'flagged',   text: 'Footpath encroachment detected — Arera Colony crossing.',        dept: 'Public Works' },
  { type: 'completed', text: 'Drainage inspection cleared — Ward 7, Kolar extension.',         dept: 'Health & Sanitation' },
  { type: 'info',      text: 'Contractor mobilization confirmed — Bridge repair, Lake Road.',   dept: 'Public Works' },
  { type: 'flagged',   text: 'Permit delay reported — Commercial building, Zone 3B.',          dept: 'Urban Planning' },
];

const sectionIds = [
  's-brief', 's-attention', 's-decisions', 's-pulse', 's-risk', 's-pressure',
  's-impact', 's-feed', 's-map', 's-exec-decisions', 's-citizen', 's-cost',
  's-ripple', 's-network', 's-timeline', 's-insights', 's-forecast'
];

export default function App() {
  const [decisions, setDecisions] = useState({
    dc1: { status: 'idle' },
    dc2: { status: 'idle' },
    dc3: { status: 'idle' }
  });

  const [events, setEvents] = useState(initialEvents);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalKey, setActiveModalKey] = useState(null);
  const [activeSection, setActiveSection] = useState('s-brief');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [syncTime, setSyncTime] = useState('--:--:--');
  const [liveIdx, setLiveIdx] = useState(0);

  // Sync running clock in footer
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setSyncTime(`${h}:${m}:${s}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic live events simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const baseEvt = liveEvents[liveIdx % liveEvents.length];
      const newEvt = { ...baseEvt, time: timeStr };

      setEvents((prev) => [newEvt, ...prev]);
      setLiveIdx((prev) => prev + 1);
    }, 14000);

    return () => clearInterval(interval);
  }, [liveIdx]);

  // Scroll spy & back to top listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 400);

      const topbarH = 56;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= topbarH + 120) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Progressive Section Reveal Observer
  useEffect(() => {
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
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Already visible on load — reveal immediately with slight stagger
        setTimeout(() => sec.classList.add('unity-visible'), i * 80);
      } else {
        revealObs.observe(sec);
      }
    });

    return () => {
      revealObs.disconnect();
    };
  }, []);

  const addEvent = (type, text, dept) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setEvents((prev) => [
      { type, text, dept, time: timeStr },
      ...prev
    ]);
  };

  const handleEscalate = (key, title, dept) => {
    setDecisions((prev) => ({
      ...prev,
      [key]: { status: 'escalated' }
    }));
    addEvent('flagged', `Escalation logged — ${title}. Awaiting response from ${dept}.`, 'Command Center');
  };

  const handleDefer = (key) => {
    setDecisions((prev) => ({
      ...prev,
      [key]: { status: 'deferred' }
    }));
  };

  const handleAuthorize = (key, actionLabel) => {
    setDecisions((prev) => ({
      ...prev,
      [key]: { status: 'authorized' }
    }));
    const projectTitle = key === 'dc1' 
      ? 'MP Nagar Road Widening' 
      : key === 'dc2' 
      ? 'AIIMS Pipeline Upgrade' 
      : 'Kolar Road Utility Relocation';
    addEvent('completed', `Direction Issued: ${actionLabel} authorized for ${projectTitle}.`, 'District Collector');
  };

  const handleLogModalAction = (key, actionLabel) => {
    const projectTitle = key === 'dc1' 
      ? 'MP Nagar Road Widening' 
      : key === 'dc2' 
      ? 'AIIMS Pipeline Upgrade' 
      : 'Kolar Road Utility Relocation';
    addEvent('info', `Action Logged: ${actionLabel} for ${projectTitle}.`, 'Command Center');
  };

  const openModal = (key) => setActiveModalKey(key);
  const closeModal = () => setActiveModalKey(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topbarH = 56;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topbarH;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <TopBar />

      <main>
        <MorningBrief />

        <AttentionPanel />

        <DecisionsBoard 
          decisions={decisions}
          onIssueDirection={openModal}
          onEscalate={handleEscalate}
          onDefer={handleDefer}
        />

        <CoordinationIssues 
          decisions={decisions}
          onIssueDirection={openModal}
          onEscalate={handleEscalate}
          onDefer={handleDefer}
        />

        <DependenciesMatrix />

        <BottleneckIndex />

        <CitizenImpact />

        <EventLog 
          events={events}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <IntelligenceMap />

        {/* LAYER 2 DIVIDER */}
        <div className="layer-divider">
          <div className="layer-divider-inner">
            <span className="layer-divider-line"></span>
            <span className="layer-divider-label">ADMINISTRATIVE ACTIONS — LAYER II</span>
            <span className="layer-divider-line"></span>
          </div>
        </div>

        <ExecDecisions 
          decisions={decisions}
          onIssueDirection={openModal}
          onEscalate={handleEscalate}
          onDefer={handleDefer}
        />

        <PublicServiceImpact />

        <CostIntelligence />

        <RippleEffect onIssueDirection={openModal} />

        <NetworkGraph />

        <InterventionTimeline />

        <InsightsForecast />
      </main>

      {/* FOOTER */}
      <footer className="command-footer">
        <div className="cf-inner">
          <div className="cf-left">
            <div className="cf-entity">BHOPAL MUNICIPAL CORPORATION</div>
            <div className="cf-sub">UNITY — Unified Network for Interdepartmental Transparency and Yield — Classified Internal Use</div>
          </div>
          <div className="cf-center">
            <div className="cf-classification">OFFICIAL — RESTRICTED</div>
          </div>
          <div className="cf-right">
            <div className="cf-version">UNITY v3.0.0</div>
            <div className="cf-timestamp">Last sync: {syncTime}</div>
          </div>
        </div>
      </footer>

      {/* SECTION NAVIGATOR */}
      <nav className="section-nav" id="sectionNav" aria-label="Section Navigation">
        <div className="sn-label">NAVIGATE</div>
        <a 
          href="#s-brief" 
          className={`sn-item ${activeSection === 's-brief' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-brief'); }}
          title="Coordination Brief"
        >
          <span className="sn-dot"></span><span className="sn-text">Brief</span>
        </a>
        <a 
          href="#s-attention" 
          className={`sn-item ${activeSection === 's-attention' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-attention'); }}
          title="Admin Attention"
        >
          <span className="sn-dot"></span><span className="sn-text">Attention</span>
        </a>
        <a 
          href="#s-decisions" 
          className={`sn-item ${activeSection === 's-decisions' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-decisions'); }}
          title="Active Decisions"
        >
          <span className="sn-dot"></span><span className="sn-text">Decisions</span>
        </a>
        <a 
          href="#s-pulse" 
          className={`sn-item ${activeSection === 's-pulse' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-pulse'); }}
          title="Coordination Issues"
        >
          <span className="sn-dot"></span><span className="sn-text">Coord</span>
        </a>
        <a 
          href="#s-risk" 
          className={`sn-item ${activeSection === 's-risk' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-risk'); }}
          title="Who Waits for Whom"
        >
          <span className="sn-dot"></span><span className="sn-text">Waiting</span>
        </a>
        <a 
          href="#s-pressure" 
          className={`sn-item ${activeSection === 's-pressure' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-pressure'); }}
          title="Bottleneck Index"
        >
          <span className="sn-dot"></span><span className="sn-text">Bottleneck</span>
        </a>
        <a 
          href="#s-impact" 
          className={`sn-item ${activeSection === 's-impact' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-impact'); }}
          title="Citizen Impact"
        >
          <span className="sn-dot"></span><span className="sn-text">Impact</span>
        </a>
        <a 
          href="#s-feed" 
          className={`sn-item ${activeSection === 's-feed' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-feed'); }}
          title="Dependency Feed"
        >
          <span className="sn-dot"></span><span className="sn-text">Feed</span>
        </a>
        <a 
          href="#s-map" 
          className={`sn-item ${activeSection === 's-map' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-map'); }}
          title="Coord Map"
        >
          <span className="sn-dot"></span><span className="sn-text">Map</span>
        </a>
        
        <div className="sn-layer-divider"></div>

        <a 
          href="#s-exec-decisions" 
          className={`sn-item ${activeSection === 's-exec-decisions' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-exec-decisions'); }}
          title="Administrative Actions"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Actions</span>
        </a>
        <a 
          href="#s-citizen" 
          className={`sn-item ${activeSection === 's-citizen' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-citizen'); }}
          title="Citizen Impact"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Citizen</span>
        </a>
        <a 
          href="#s-cost" 
          className={`sn-item ${activeSection === 's-cost' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-cost'); }}
          title="Cost Intelligence"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Cost</span>
        </a>
        <a 
          href="#s-ripple" 
          className={`sn-item ${activeSection === 's-ripple' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-ripple'); }}
          title="Dependency Chain"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Chain</span>
        </a>
        <a 
          href="#s-network" 
          className={`sn-item ${activeSection === 's-network' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-network'); }}
          title="Dependency Graph"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Network</span>
        </a>
        <a 
          href="#s-timeline" 
          className={`sn-item ${activeSection === 's-timeline' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-timeline'); }}
          title="Intervention Timeline"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Timeline</span>
        </a>
        <a 
          href="#s-insights" 
          className={`sn-item ${activeSection === 's-insights' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-insights'); }}
          title="Inter-Dept Insights"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Insights</span>
        </a>
        <a 
          href="#s-forecast" 
          className={`sn-item ${activeSection === 's-forecast' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); scrollToSection('s-forecast'); }}
          title="Coordination Forecast"
        >
          <span className="sn-dot sn-dot-gold"></span><span className="sn-text">Forecast</span>
        </a>
      </nav>

      {/* Back to top button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑ Top
      </button>

      {/* Decision Modal component */}
      <DecisionModal 
        activeKey={activeModalKey}
        onClose={closeModal}
        onAuthorize={handleAuthorize}
        onLogAction={handleLogModalAction}
      />
    </>
  );
}
