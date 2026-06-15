const BASE_URL = 'http://localhost:5001/api/v1';

export const api = {
  // Consolidated dashboard status
  getDashboard: () => fetch(`${BASE_URL}/dashboard`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Morning briefing stats
  getBriefSummary: () => fetch(`${BASE_URL}/brief/summary`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Attention Panel task priorities
  getAttentionPriorities: () => fetch(`${BASE_URL}/alerts/priorities`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Decisions board active items
  getActiveDecisions: () => fetch(`${BASE_URL}/decisions/active`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Department matrix grid
  getMatrixGrid: () => fetch(`${BASE_URL}/matrix/grid`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Bottlenecks list & index scores
  getBottlenecks: () => fetch(`${BASE_URL}/bottlenecks/index`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Citizen impact details
  getCitizenImpact: () => fetch(`${BASE_URL}/impact/citizens`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Logs event feed
  getEvents: (filter = 'all') => fetch(`${BASE_URL}/events?filter=${filter}`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Decision directive action execution
  executeDecisionAction: (data) => fetch(`${BASE_URL}/decisions/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'Collector' // Mock executive role
    },
    body: JSON.stringify(data)
  }).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Ripple simulation cascade paths
  simulateRipple: (dept, delay) => fetch(`${BASE_URL}/cascade/simulate?dept=${dept}&delay=${delay}`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  }),

  // Cost Exposure dynamic values
  getCostExposure: () => fetch(`${BASE_URL}/cost/exposure`).then(res => {
    if (!res.ok) throw new Error('Network response not OK');
    return res.json();
  })
};
