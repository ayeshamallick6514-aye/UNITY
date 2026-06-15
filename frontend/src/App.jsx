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
import { api } from './services/api';

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

  const [refreshKey, setRefreshKey] = useState(0);
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalKey, setActiveModalKey] = useState(null);
  const [activeSection, setActiveSection] = useState('s-brief');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [syncTime, setSyncTime] = useState('--:--:--');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDecisions = async () => {
    try {
      const data = await api.getActiveDecisions();
      const mapped = {};
      data.forEach((d, idx) => {
        let key = `dc${idx + 1}`;
        if (d.project.includes('MP Nagar')) key = 'dc1';
        else if (d.project.includes('AIIMS')) key = 'dc2';
        else if (d.project.includes('Kolar')) key = 'dc3';

        mapped[key] = {
          dbId: d.id,
          status: d.escalationStatus,
          project: d.project,
          situation: d.situation,
          blockingDept: d.blockingDept,
          waitingDept: d.waitingDept,
          daysPending: d.daysPending
        };
      });
      setDecisions(mapped);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching decisions:', err);
      setError('Server connection failed. Please verify the backend is running.');
    }
  };

  const fetchEvents = async (filter) => {
    try {
      const data = await api.getEvents(filter);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDecisions(), fetchEvents(activeFilter)]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Fetch events when filter changes
  useEffect(() => {
    fetchEvents(activeFilter);
  }, [activeFilter]);

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

  // Periodic live events refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents(activeFilter);
    }, 14000);

    return () => clearInterval(interval);
  }, [activeFilter]);

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

  const handleEscalate = async (key, title, dept) => {
    const dbId = decisions[key]?.dbId;
    if (!dbId) return;
    try {
      const res = await api.executeDecisionAction({
        dependencyId: dbId,
        action: 'escalate',
        reason: `Escalated — ${title}. Awaiting response from ${dept}.`,
        authorizedBy: 'District Collector'
      });
      if (res.success) {
        await Promise.all([fetchDecisions(), fetchEvents(activeFilter)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDefer = async (key) => {
    const dbId = decisions[key]?.dbId;
    if (!dbId) return;
    try {
      const res = await api.executeDecisionAction({
        dependencyId: dbId,
        action: 'defer',
        reason: 'Scheduled review deferred.',
        authorizedBy: 'District Collector'
      });
      if (res.success) {
        await Promise.all([fetchDecisions(), fetchEvents(activeFilter)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthorize = async (key, actionLabel) => {
    const dbId = decisions[key]?.dbId;
    if (!dbId) return;
    try {
      const res = await api.executeDecisionAction({
        dependencyId: dbId,
        action: 'authorize',
        reason: actionLabel,
        authorizedBy: 'District Collector'
      });
      if (res.success) {
        await Promise.all([fetchDecisions(), fetchEvents(activeFilter)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogModalAction = (key, actionLabel) => {
    console.log(`Log modal action: ${actionLabel}`);
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
        <MorningBrief refreshKey={refreshKey} decisions={decisions} />

        <AttentionPanel refreshKey={refreshKey} />

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

        <DependenciesMatrix refreshKey={refreshKey} />

        <BottleneckIndex refreshKey={refreshKey} />

        <CitizenImpact refreshKey={refreshKey} />

        <EventLog 
          events={events}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <IntelligenceMap decisions={decisions} />

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

        <PublicServiceImpact refreshKey={refreshKey} />

        <CostIntelligence refreshKey={refreshKey} />

        <RippleEffect refreshKey={refreshKey} onIssueDirection={openModal} />

        <NetworkGraph decisions={decisions} />

        <InterventionTimeline decisions={decisions} />

        <InsightsForecast decisions={decisions} />
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
