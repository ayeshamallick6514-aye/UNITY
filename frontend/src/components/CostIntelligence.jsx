import React, { useState, useEffect } from 'react';

function AnimatedCostNumber({ value, suffix = '', duration = 1200 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = null;
    const end = parseFloat(value);
    if (isNaN(end)) {
      setCurrent(value);
      return;
    }

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const pct = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setCurrent(ease * end);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  // Format as decimal or localized currency format (e.g. ₹3.7 Cr)
  const displayVal = current.toFixed(1);

  return <span>₹{displayVal}{suffix}</span>;
}

export default function CostIntelligence() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section l2-section cost-section" id="s-cost">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — 03 / 06</div>
          <h2 className="section-title">Cost Impact Intelligence</h2>
          <p className="section-desc">Financial consequences of delayed decisions — updated at 06:00 daily.</p>
        </div>
        <div className="cost-layout">
          <div className="cost-primary-metrics">
            <div className="cost-metric-card cost-metric-exposure">
              <div className="cost-metric-eyebrow">POTENTIAL COST EXPOSURE</div>
              <div className="cost-metric-value" id="costExposure">
                <AnimatedCostNumber value={3.7} suffix=" Cr" />
              </div>
              <div className="cost-metric-sub">if current decisions remain unresolved by end of week</div>
              <div className="cost-metric-bar">
                <div 
                  className="cost-metric-fill cost-fill-critical" 
                  style={{ 
                    width: animate ? '78%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
            </div>
            <div className="cost-metric-card cost-metric-rework">
              <div className="cost-metric-eyebrow">REWORK COST AVOIDABLE</div>
              <div className="cost-metric-value cost-value-green" id="costRework">
                <AnimatedCostNumber value={2.3} suffix=" Cr" />
              </div>
              <div className="cost-metric-sub">through early resolution before penalty clause activates</div>
              <div className="cost-metric-bar">
                <div 
                  className="cost-metric-fill cost-fill-nominal" 
                  style={{ 
                    width: animate ? '62%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
            </div>
            <div className="cost-metric-card cost-metric-projects">
              <div className="cost-metric-eyebrow">PROJECTS AT FINANCIAL RISK</div>
              <div className="cost-metric-value cost-value-amber">7</div>
              <div className="cost-metric-sub">active contracts with penalty clauses triggered or near threshold</div>
              <div className="cost-metric-bar">
                <div className="cost-metric-fill cost-fill-high" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          <div className="cost-intel-panel">
            <div className="cip-title">COST INTELLIGENCE SUMMARY</div>
            <p className="cip-summary">Revenue delays and utility conflicts are the primary contributors to projected cost overruns this month. The MP Nagar contractor penalty clause activates on Friday. Immediate authorization can avoid ₹2.3 Cr in projected liability.</p>
            <div className="cip-breakdown-title">COST BREAKDOWN BY CAUSE</div>
            <div className="cip-breakdown-list">
              <div className="cip-row">
                <span className="cip-cause">Revenue Clearance Delays</span>
                <div className="cip-bar-wrap">
                  <div 
                    className="cip-bar cip-bar-critical" 
                    style={{ 
                      width: animate ? '78%' : '0%',
                      transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </div>
                <span className="cip-amount">₹1.4 Cr</span>
              </div>
              <div className="cip-row">
                <span className="cip-cause">Energy Utility Idle Cost</span>
                <div className="cip-bar-wrap">
                  <div 
                    className="cip-bar cip-bar-high" 
                    style={{ 
                      width: animate ? '55%' : '0%',
                      transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </div>
                <span className="cip-amount">₹56 Lac</span>
              </div>
              <div className="cip-row">
                <span className="cip-cause">Pipeline Conflict Rescheduling</span>
                <div className="cip-bar-wrap">
                  <div 
                    className="cip-bar cip-bar-moderate" 
                    style={{ 
                      width: animate ? '30%' : '0%',
                      transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </div>
                <span className="cip-amount">₹28 Lac</span>
              </div>
              <div className="cip-row">
                <span className="cip-cause">Contractor Extensions</span>
                <div className="cip-bar-wrap">
                  <div 
                    className="cip-bar cip-bar-low" 
                    style={{ 
                      width: animate ? '18%' : '0%',
                      transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </div>
                <span className="cip-amount">₹18 Lac</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
