import React, { useState, useEffect } from 'react';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS   = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const padZ = (n) => String(n).padStart(2, '0');

export default function TopBar({ summary, decisions, onOpenSentinel }) {
  const [timeState, setTimeState] = useState({
    timeStr: '--:--:--',
    dateStr: '---',
  });

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = padZ(now.getHours());
      const m = padZ(now.getMinutes());
      const s = padZ(now.getSeconds());

      setTimeState({
        timeStr: `${h}:${m}:${s}`,
        dateStr: `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingDecisionsCount = decisions
    ? Object.keys(decisions).filter(k => decisions[k].status === 'idle').length
    : 0;

  return (
    <header className="topbar">
      <div className="topbar-main-row">
        <div className="topbar-left">
          <div className="seal">
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" stroke="var(--accent-gold)" strokeWidth="2.5"/>
              <polygon points="18,6 20.5,13.5 28.5,13.5 22,18.5 24.5,26 18,21 11.5,26 14,18.5 7.5,13.5 15.5,13.5" fill="var(--accent-gold)"/>
            </svg>
          </div>
          <div className="topbar-title-block">
            <div className="topbar-branding-row">
              <span className="topbar-logo-text">UNITY</span>
              <span className="topbar-tagline">GOVERNMENT COORDINATION INTELLIGENCE PLATFORM</span>
            </div>
            <span className="topbar-subtitle">Unified Network for Inter-Departmental Transparency and Yield</span>
          </div>
        </div>

        <div className="topbar-center">
          <div className="indicator-chip status-active">
            <span className="indicator-dot dot-green"></span>
            <span className="indicator-label">OPERATIONAL STATUS: <strong className="success-text">ACTIVE</strong></span>
          </div>
        </div>

        <div className="topbar-right">
          <button 
            className="sentinel-trigger-chip"
            onClick={onOpenSentinel}
            title="Open UNITY Sentinel AI Engine"
          >
            <span className="indicator-dot dot-sentinel-green animate-pulse-green"></span>
            <span className="indicator-label font-mono">SENTINEL ENGINE: <strong className="sentinel-text-highlight">ACTIVE</strong></span>
          </button>

          <div className="clock-block">
            <span className="topbar-clock">{timeState.timeStr}</span>
            <span className="topbar-date">{timeState.dateStr}</span>
          </div>
        </div>
      </div>

      <div className="topbar-kpi-row">
        <div className="kpi-item">
          <span className="kpi-value font-mono">14</span>
          <span className="kpi-label">DEPARTMENTS CONNECTED</span>
        </div>
        <div className="kpi-divider"></div>
        <div className="kpi-item">
          <span className="kpi-value font-mono">28</span>
          <span className="kpi-label">PROJECTS MONITORED</span>
        </div>
        <div className="kpi-divider"></div>
        <div className="kpi-item">
          <span className="kpi-value value-highlight font-mono">{pendingDecisionsCount}</span>
          <span className="kpi-label">PENDING DECISIONS</span>
        </div>
        <div className="kpi-divider"></div>
        <div className="kpi-item">
          <span className="kpi-value value-alert font-mono">{summary?.pendingDependenciesCount || 23}</span>
          <span className="kpi-label">CRITICAL DEPENDENCIES</span>
        </div>
      </div>
    </header>
  );
}
