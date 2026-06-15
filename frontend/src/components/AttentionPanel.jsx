import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function AttentionPanel({ refreshKey }) {
  const [dateStr, setDateStr] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPriorities = async () => {
    try {
      setLoading(true);
      const data = await api.getAttentionPriorities();
      
      // Classify severities dynamically
      const mapped = data.map(item => {
        let severity = 'watch';
        let windowText = '⏱ Review by 17:00 hrs';
        let recommendedAction = 'Convene inter-departmental meeting within 24 hours. Review pipeline alignments and clear pending permits. Responsible: Department Nodal Officer — Resolution Window: 72 hours.';

        if (item.status === 'blocked' || item.daysStalled > 10) {
          severity = 'critical';
          windowText = '⏱ Act before 15:00 hrs today';
        } else if (item.daysStalled >= 5) {
          severity = 'high';
          windowText = '⏱ Issue notice/follow up by 12:00 hrs';
        }

        // Recommended actions tailored to departments/roles
        const deptUpper = item.department.toUpperCase();
        if (deptUpper.includes('REVENUE')) {
          recommendedAction = 'Direct Revenue Commissioner to convene an emergency clearance session today. Assign a nodal officer for daily status tracking until resolution. Responsible: Revenue Commissioner\'s Office — Resolution Window: 24 hours.';
        } else if (deptUpper.includes('WATER') || deptUpper.includes('HEALTH')) {
          recommendedAction = 'Reschedule maintenance to 23:00–05:00 window immediately. Water Supply SE to coordinate with AIIMS backup systems. Responsible: Water Supply Department SE — Resolution Window: 6 hours.';
        } else if (deptUpper.includes('ENERGY') || deptUpper.includes('MPEB')) {
          recommendedAction = 'Issue a 48-hour compliance notice to Energy Department Principal Secretary. Schedule site meeting with MPEB Division Engineer within 24 hours. Responsible: Energy Department — Resolution Window: 48 hours.';
        } else if (deptUpper.includes('TRANSPORT') || deptUpper.includes('TRAFFIC') || deptUpper.includes('BMC')) {
          recommendedAction = 'BMC Traffic Cell to process pending diversion applications by EOD. Report status to command center. Responsible: BMC Traffic Cell — Resolution Window: 5 days.';
        }

        return {
          ...item,
          severity,
          windowText,
          recommendedAction
        };
      });

      setPriorities(mapped);
      setError(null);
    } catch (err) {
      console.error('Error fetching priorities:', err);
      setError('Attention brief sync offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorities();
  }, [refreshKey]);

  useEffect(() => {
    const now = new Date();
    setDateStr(`${DAYS[now.getDay()]} ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  const criticalCount = priorities.filter(p => p.severity === 'critical').length;
  const highCount = priorities.filter(p => p.severity === 'high').length;
  const watchCount = priorities.filter(p => p.severity === 'watch').length;

  if (loading) {
    return (
      <section className="section attention-section" id="s-attention">
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>SYNCING ATTENTION PRIORITIES...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section attention-section" id="s-attention">
        <div className="section-container">
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            ⚠ ATTENTION MONITOR: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section attention-section" id="s-attention">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">COORDINATION BRIEF</div>
          <h2 className="section-title">Today's Administrative Attention</h2>
          <p className="section-desc">Priority-ranked items requiring the Collector's personal attention — time-sensitive, department-specific, actionable.</p>
        </div>

        <div className="attention-layout">
          {/* Banner */}
          <div className="attention-brief-banner">
            <div className="abb-left">
              <div className="abb-icon">⬛</div>
              <div>
                <div className="abb-title">Morning Briefing Note</div>
                <div className="abb-sub">Generated at 06:00 hrs — {dateStr} — {priorities.length} items require attention today</div>
              </div>
            </div>
            <div className="abb-right">
              <div className="abb-stat"><span className="abb-stat-n abb-critical">{criticalCount}</span><span className="abb-stat-l">Critical</span></div>
              <div className="abb-stat"><span className="abb-stat-n abb-high">{highCount}</span><span className="abb-stat-l">High</span></div>
              <div className="abb-stat"><span className="abb-stat-n abb-watch">{watchCount}</span><span className="abb-stat-l">Watch</span></div>
            </div>
          </div>

          {/* Item list */}
          <div className="attention-items">
            {priorities.length === 0 ? (
              <div style={{ border: '1px dashed var(--border-accent)', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                ⬡ ALL SYSTEMS OPERATIONAL — NO ATTENTION REQUIRED
              </div>
            ) : (
              priorities.map((item) => (
                <div key={item.id} className={`ai-row ai-${item.severity}`}>
                  <div className="ai-number">{item.number}</div>
                  <div className={`ai-priority-stripe ai-stripe-${item.severity}`}></div>
                  <div className="ai-body">
                    <div className="ai-top">
                      <span className={`ai-badge ai-badge-${item.severity}`}>{item.severity.toUpperCase()}</span>
                      <span className="ai-dept">{item.department}</span>
                      <span className="ai-window">{item.windowText}</span>
                    </div>
                    <div className="ai-headline">{item.title} — overdue by {item.daysStalled} days.</div>
                    <div className="ai-detail">{item.blockingReason} The PWD contractor has filed delay reports. This block affects the {item.project} pipeline and cascades into downstream utility works.</div>
                    <div className="ai-action-row">
                      <span className="ai-action-label">Recommended Action</span>
                      <span className="ai-action-text">{item.recommendedAction}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
