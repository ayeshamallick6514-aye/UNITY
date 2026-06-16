import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function AnimatedNumber({ value, duration = 1000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = null;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCurrent(value);
      return;
    }

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const pct = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setCurrent(Math.floor(ease * end));
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const displayVal = typeof current === 'number' 
    ? (current >= 1000 ? current.toLocaleString('en-IN') : current)
    : current;

  return <span>{displayVal}</span>;
}

export default function MorningBrief({ refreshKey, decisions }) {
  const [summary, setSummary] = useState(null);
  const [citizenImpact, setCitizenImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [intelIdx, setIntelIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [dateStr, setDateStr] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumData, citData] = await Promise.all([
        api.getBriefSummary(),
        api.getCitizenImpact()
      ]);
      setSummary(sumData);
      setCitizenImpact(citData);
      setError(null);
    } catch (err) {
      console.error('Error fetching brief data:', err);
      setError('L1 BRIEF SECURE SYNC OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    const now = new Date();
    setDateStr(`${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  const totalBlockedDepts = summary?.blockedDepartmentsCount || 3;
  const totalBlockedProjects = summary?.blockedProjectsCount || 11;
  const pendingDeps = summary?.pendingDependenciesCount || 23;
  const longestStall = summary?.longestStallDays || 19;
  const totalCitizens = citizenImpact?.totalAffectedCitizens || 3750;

  const isDc1Resolved = decisions?.dc1?.status === 'authorized';
  const isDc2Resolved = decisions?.dc2?.status === 'authorized';
  const isDc3Resolved = decisions?.dc3?.status === 'authorized';
  const allResolved = isDc1Resolved && isDc2Resolved && isDc3Resolved;

  // Dynamically constructed intelligence brief sentences based on live API parameters
  const intelSentences = [
    isDc1Resolved 
      ? `MP Nagar land acquisition clearance APPROVED. PWD paving mobilization underway.`
      : `Revenue Department land acquisition delay has reached ${longestStall} days. PWD, Energy, Water Supply, and Transport are waiting. One unresolved clearance is blocking ${totalBlockedProjects} projects and affecting ${totalCitizens.toLocaleString('en-IN')}+ citizens.`,
    isDc1Resolved && isDc3Resolved && isDc2Resolved
      ? `All active coordination blocks resolved. Operational network status nominal.`
      : `WHO IS WAITING: ${!isDc1Resolved ? 'PWD is waiting for Revenue. ' : ''}${!isDc3Resolved ? 'Energy is waiting for PWD. ' : ''}${!isDc2Resolved ? 'Water is waiting for Energy. ' : ''}This chain cannot move until the pending clearances are authorized.`,
    allResolved
      ? `All 3 critical infrastructure projects (MP Nagar, AIIMS Pipeline, Kolar Road) resumed construction.`
      : `WHAT IS BLOCKED: ${!isDc1Resolved ? 'MP Nagar Road Widening, ' : ''}${!isDc2Resolved ? 'AIIMS Pipeline Upgrade, ' : ''}${!isDc3Resolved ? 'Kolar Road Utility Relocation. ' : ''}${totalBlockedProjects} projects.`,
    allResolved
      ? `All scheduled actions implemented. Compliance deadline audits active.`
      : `ACTION REQUIRED: ${!isDc1Resolved ? '(1) Direct Revenue Commissioner to convene clearance session. ' : ''}${!isDc2Resolved ? '(2) Reschedule AIIMS maintenance to 23:00 window. ' : ''}${!isDc3Resolved ? '(3) Issue 48-hour compliance notice to Energy Department.' : ''}`,
    allResolved
      ? `₹3.7 Cr avoidable liability saved. Citizen services fully secured.`
      : `CITIZEN IMPACT: ${!isDc2Resolved ? '400+ AIIMS patients at risk. ' : ''}${!isDc1Resolved ? '2,400 students on disrupted school routes. ' : ''}Emergency vehicle access narrowed. ${!isDc1Resolved ? '₹2.3 Cr penalty clause activates Friday if no action is taken today.' : ''}`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setIntelIdx((prev) => (prev + 1) % intelSentences.length);
        setOpacity(1);
      }, 400);
    }, 12000);

    return () => clearInterval(interval);
  }, [summary, citizenImpact, decisions]);


  if (loading) {
    return (
      <section className="morning-brief" id="s-brief">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.15em' }}>SYNCING SECURE COMMAND BRIEF...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="morning-brief" id="s-brief">
        <div style={{ padding: '48px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.05em' }}>
            [ERROR] CONNECTION FAILURE: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="morning-brief" id="s-brief">
      <div className="brief-container">
        <div className="brief-left">
          <div className="brief-greeting-row">
            <div className="brief-status-tag">COORDINATION INTELLIGENCE BRIEF — {dateStr}</div>
          </div>
          <h1 className="brief-headline">{totalBlockedDepts} {totalBlockedDepts === 1 ? 'Department' : 'Departments'}<br/>Cannot Proceed.</h1>
          <h2 className="brief-subheadline">Administrative Intervention Required — Active Now</h2>
          <p 
            className="brief-intel" 
            style={{ 
              opacity: opacity, 
              transition: 'opacity 0.6s ease' 
            }}
          >
            {intelSentences[intelIdx]}
          </p>
          <div className="brief-meta-row">
            <div className="brief-meta-item">
              <span className="brief-meta-label">INTERVENTION NEEDED</span>
              <span className="brief-meta-value threat-elevated">{totalBlockedDepts} {totalBlockedDepts === 1 ? 'DEPARTMENT' : 'DEPARTMENTS'}</span>
            </div>
            <div className="brief-meta-item">
              <span className="brief-meta-label">PROJECTS BLOCKED</span>
              <span className="brief-meta-value">{totalBlockedProjects} TODAY</span>
            </div>
            <div className="brief-meta-item">
              <span className="brief-meta-label">WINDOW TO ACT</span>
              <span className="brief-meta-value threat-elevated">3 DAYS</span>
            </div>
          </div>
        </div>
        <div className="brief-right">
          <div className="brief-stat-panel">
            <div className="bsp-row">
              <div className="bsp-item">
                <span className="bsp-num"><AnimatedNumber value={totalBlockedProjects} /></span>
                <span className="bsp-label">Blocked<br/>Projects</span>
              </div>
              <div className="bsp-divider"></div>
              <div className="bsp-item">
                <span className="bsp-num"><AnimatedNumber value={pendingDeps} /></span>
                <span className="bsp-label">Pending<br/>Dependencies</span>
              </div>
              <div className="bsp-divider"></div>
              <div className="bsp-item">
                <span className="bsp-num"><AnimatedNumber value={totalBlockedDepts} /></span>
                <span className="bsp-label">Depts<br/>Blocked</span>
              </div>
            </div>
            <div className="bsp-row bsp-row-bottom">
              <div className="bsp-item">
                <span className="bsp-num bsp-amber"><AnimatedNumber value={3} /></span>
                <span className="bsp-label">Require<br/>Intervention</span>
              </div>
              <div className="bsp-divider"></div>
              <div className="bsp-item">
                <span className="bsp-num bsp-green"><AnimatedNumber value={14} /></span>
                <span className="bsp-label">Cleared<br/>Today</span>
              </div>
              <div className="bsp-divider"></div>
              <div className="bsp-item">
                <span className="bsp-num">{longestStall}d</span>
                <span className="bsp-label">Longest<br/>Stall</span>
              </div>
            </div>
          </div>
          {/* 3-Question Command Strip */}
          <div className="brief-command-strip">
            <div className="bcs-item">
              <div className="bcs-q">WHO IS WAITING?</div>
              <div className="bcs-a">PWD, Energy, Water Supply, Transport — waiting on Revenue</div>
            </div>
            <div className="bcs-divider"></div>
            <div className="bcs-item">
              <div className="bcs-q">WHAT IS BLOCKED?</div>
              <div className="bcs-a">{totalBlockedProjects} projects — Land clearance, utility relocation, AIIMS pipeline</div>
            </div>
            <div className="bcs-divider"></div>
            <div className="bcs-item">
              <div className="bcs-q">ACTION NEEDED?</div>
              <div className="bcs-a bcs-a-critical">Revenue review today · AIIMS reschedule · Energy compliance notice</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
