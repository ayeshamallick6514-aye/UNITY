import React, { useState, useEffect } from 'react';

const intelSentences = [
  'Revenue Department has not cleared land acquisition for 12 days. PWD, Energy, Water Supply, and Transport are all waiting. One unresolved clearance is blocking 11 projects and affecting 3,750+ citizens.',
  'WHO IS WAITING: PWD is waiting for Revenue. Energy is waiting for PWD. Water is waiting for Energy. This chain cannot move until Revenue issues the clearance today.',
  'WHAT IS BLOCKED: MP Nagar Road Widening, AIIMS Pipeline Upgrade, Kolar Road Utility Relocation. Three projects. One root cause. Revenue Department land acquisition clearance.',
  'ACTION REQUIRED: (1) Direct Revenue Commissioner to convene clearance session. (2) Reschedule AIIMS maintenance to 23:00 window. (3) Issue 48-hour compliance notice to Energy Department.',
  'CITIZEN IMPACT: 400+ AIIMS patients at risk. 2,400 students on disrupted school routes. Emergency vehicle access narrowed. ₹2.3 Cr penalty clause activates Friday if no action taken.',
];

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function AnimatedNumber({ value, duration = 1000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = null;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      // Just set directly if it's not a number (e.g. "19d")
      setCurrent(value);
      return;
    }

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const pct = Math.min(progress / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - pct, 3);
      setCurrent(Math.floor(ease * end));
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(value); // Make sure it ends at exactly value (like "3,750")
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  // Format with commas if it's 3750 -> 3,750
  const displayVal = typeof current === 'number' 
    ? (current >= 1000 ? current.toLocaleString('en-IN') : current)
    : current;

  return <span>{displayVal}</span>;
}

export default function MorningBrief() {
  const [intelIdx, setIntelIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setDateStr(`${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);

    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setIntelIdx((prev) => (prev + 1) % intelSentences.length);
        setOpacity(1);
      }, 400); // match transition time
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="morning-brief" id="s-brief">
      <div className="brief-container">
        <div className="brief-left">
          <div className="brief-greeting-row">
            <div className="brief-status-tag">COORDINATION INTELLIGENCE BRIEF — {dateStr}</div>
          </div>
          <h1 className="brief-headline">3 Departments<br/>Cannot Proceed.</h1>
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
              <span className="brief-meta-value threat-elevated">5 DEPARTMENTS</span>
            </div>
            <div className="brief-meta-item">
              <span className="brief-meta-label">PROJECTS BLOCKED</span>
              <span className="brief-meta-value">11 TODAY</span>
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
                <span className="bsp-num"><AnimatedNumber value={11} /></span>
                <span className="bsp-label">Blocked<br/>Projects</span>
              </div>
              <div className="bsp-divider"></div>
              <div className="bsp-item">
                <span className="bsp-num"><AnimatedNumber value={23} /></span>
                <span className="bsp-label">Pending<br/>Dependencies</span>
              </div>
              <div className="bsp-divider"></div>
              <div className="bsp-item">
                <span className="bsp-num"><AnimatedNumber value={5} /></span>
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
                <span className="bsp-num">19d</span>
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
              <div className="bcs-a">11 projects — Land clearance, utility relocation, AIIMS pipeline</div>
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
