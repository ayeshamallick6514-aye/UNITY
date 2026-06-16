import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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

  const displayVal = current.toFixed(1);

  return <span>{displayVal}{suffix}</span>;
}

export default function CostIntelligence({ refreshKey }) {
  const [animate, setAnimate] = useState(false);
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCostData = async () => {
    try {
      setLoading(true);
      const res = await api.getCostExposure();
      setCostData(res);
      setError(null);
    } catch (err) {
      console.error('Error fetching cost exposure:', err);
      setError('Cost intelligence sync offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostData();
  }, [refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <section className="section l2-section cost-section" id="s-cost">
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>SYNCING FINANCIAL METRICS...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section l2-section cost-section" id="s-cost">
        <div className="section-container">
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            [ERROR] FINANCIAL MONITOR: {error}
          </div>
        </div>
      </section>
    );
  }

  const exposureVal = costData?.potentialCostExposure ?? 23.2;
  const reworkVal = costData?.avoidableReworkCost ?? 2.3;
  const projectsAtRisk = costData?.projectsAtRisk ?? 3;
  const breakdown = costData?.breakdown || { revenue: 14.0, energy: 0.56, water: 0.28, transport: 0.18 };

  const formatCostValue = (valInCr) => {
    if (valInCr === 0) return '₹0';
    if (valInCr >= 1) return `₹${valInCr.toFixed(1)} Cr`;
    return `₹${Math.round(valInCr * 100)} Lac`;
  };

  // Compute gauge percentages (relative to baseline maximums)
  const exposurePct = Math.min((exposureVal / 23.2) * 100, 100);
  const reworkPct = Math.min((reworkVal / 2.3) * 100, 100);

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
                ₹<AnimatedCostNumber value={exposureVal} suffix=" Cr" />
              </div>
              <div className="cost-metric-sub">
                {exposureVal > 0 
                  ? 'if current decisions remain unresolved by end of week'
                  : 'All financial risk eliminated. System clear.'}
              </div>
              <div className="cost-metric-bar">
                <div 
                  className="cost-metric-fill cost-fill-critical" 
                  style={{ 
                    width: animate ? `${exposurePct}%` : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
            </div>
            <div className="cost-metric-card cost-metric-rework">
              <div className="cost-metric-eyebrow">REWORK COST AVOIDABLE</div>
              <div className="cost-metric-value cost-value-green" id="costRework">
                ₹<AnimatedCostNumber value={reworkVal} suffix=" Cr" />
              </div>
              <div className="cost-metric-sub">
                {reworkVal > 0 
                  ? 'through early resolution before penalty clause activates'
                  : 'No active penalty liabilities pending.'}
              </div>
              <div className="cost-metric-bar">
                <div 
                  className="cost-metric-fill cost-fill-nominal" 
                  style={{ 
                    width: animate ? `${reworkPct}%` : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
            </div>
            <div className="cost-metric-card cost-metric-projects">
              <div className="cost-metric-eyebrow">PROJECTS AT FINANCIAL RISK</div>
              <div className="cost-metric-value cost-value-amber">{projectsAtRisk}</div>
              <div className="cost-metric-sub">
                {projectsAtRisk > 0 
                  ? 'active contracts with penalty clauses triggered or near threshold'
                  : 'Zero contracts at risk of penalty.'}
              </div>
              <div className="cost-metric-bar">
                <div 
                  className="cost-metric-fill cost-fill-high" 
                  style={{ width: projectsAtRisk > 0 ? `${(projectsAtRisk / 3) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>
          <div className="cost-intel-panel">
            <div className="cip-title">COST INTELLIGENCE SUMMARY</div>
            <p className="cip-summary">
              {exposureVal > 0 
                ? `Revenue delays and utility conflicts are the primary contributors to projected cost overruns. Immediate authorization can avoid ${formatCostValue(reworkVal)} in projected contractor liability.`
                : 'All critical interventions completed. No active financial penalty exposures logged this sector.'}
            </p>
            {exposureVal > 0 && (
              <>
                <div className="cip-breakdown-title">COST BREAKDOWN BY CAUSE</div>
                <div className="cip-breakdown-list">
                  <div className="cip-row">
                    <span className="cip-cause">Revenue Clearance Delays</span>
                    <div className="cip-bar-wrap">
                      <div 
                        className="cip-bar cip-bar-critical" 
                        style={{ 
                          width: animate ? `${(breakdown.revenue / 14.0) * 100}%` : '0%',
                          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    <span className="cip-amount">{formatCostValue(breakdown.revenue)}</span>
                  </div>
                  <div className="cip-row">
                    <span className="cip-cause">Energy Utility Idle Cost</span>
                    <div className="cip-bar-wrap">
                      <div 
                        className="cip-bar cip-bar-high" 
                        style={{ 
                          width: animate ? `${(breakdown.energy / 0.56) * 100}%` : '0%',
                          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    <span className="cip-amount">{formatCostValue(breakdown.energy)}</span>
                  </div>
                  <div className="cip-row">
                    <span className="cip-cause">Pipeline Conflict Rescheduling</span>
                    <div className="cip-bar-wrap">
                      <div 
                        className="cip-bar cip-bar-moderate" 
                        style={{ 
                          width: animate ? `${(breakdown.water / 0.28) * 100}%` : '0%',
                          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    <span className="cip-amount">{formatCostValue(breakdown.water)}</span>
                  </div>
                  <div className="cip-row">
                    <span className="cip-cause">Contractor Extensions</span>
                    <div className="cip-bar-wrap">
                      <div 
                        className="cip-bar cip-bar-low" 
                        style={{ 
                          width: animate ? `${(breakdown.transport / 0.18) * 100}%` : '0%',
                          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    <span className="cip-amount">{formatCostValue(breakdown.transport)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
