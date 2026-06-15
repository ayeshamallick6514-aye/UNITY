import React, { useState, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const padZ = (n) => String(n).padStart(2, '0');

export default function TopBar() {
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
        dateStr: `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="seal">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="#c8a84b" strokeWidth="1.5"/>
            <circle cx="18" cy="18" r="12" stroke="#c8a84b" strokeWidth="0.75"/>
            <polygon points="18,6 20.5,13.5 28.5,13.5 22,18.5 24.5,26 18,21 11.5,26 14,18.5 7.5,13.5 15.5,13.5" fill="#c8a84b" opacity="0.85"/>
          </svg>
        </div>
        <div className="topbar-title-block">
          <span className="topbar-entity">BHOPAL MUNICIPAL CORPORATION</span>
          <span className="topbar-subtitle">UNITY — Unified Network for Interdepartmental Transparency and Yield</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-label">LIVE OPERATIONS</span>
        </div>
        <div className="topbar-clock">{timeState.timeStr}</div>
        <div className="topbar-date">{timeState.dateStr}</div>
      </div>
    </header>
  );
}
