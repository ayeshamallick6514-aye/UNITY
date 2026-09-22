import axiosInstance from './axiosInstance';

/**
 * api — unified API layer using axiosInstance.
 * Integrates directly with existing backend endpoints.
 */
export const api = {
  // Consolidated dashboard status
  getDashboard() {
    return axiosInstance.get('/dashboard');
  },

  // Morning briefing stats
  getBriefSummary() {
    return axiosInstance.get('/brief/summary');
  },

  // Attention Panel task priorities
  getAttentionPriorities() {
    return axiosInstance.get('/alerts/priorities');
  },

  // Decisions board active items
  getActiveDecisions() {
    return axiosInstance.get('/decisions/active');
  },

  // Department matrix grid
  getMatrixGrid() {
    return axiosInstance.get('/matrix/grid');
  },

  // Bottlenecks list & index scores
  getBottlenecks() {
    return axiosInstance.get('/bottlenecks/index');
  },

  // Citizen impact details
  getCitizenImpact() {
    return axiosInstance.get('/impact/citizens');
  },

  // Logs event feed
  getEvents(filter = 'all') {
    return axiosInstance.get(`/events?filter=${filter}`);
  },

  // Decision directive action execution
  executeDecisionAction(data, config) {
    return axiosInstance.post('/decisions/action', data, config);
  },

  // Ripple simulation cascade paths
  simulateRipple(dept, delay) {
    return axiosInstance.get(`/cascade/simulate?dept=${dept}&delay=${delay}`);
  },

  // Cost Exposure dynamic values
  getCostExposure() {
    return axiosInstance.get('/cost/exposure');
  },

  // Sentinel policy query
  sentinelQuery(query) {
    return axiosInstance.post('/sentinel/query', { query });
  },

  // Sentinel decision compliance review
  sentinelReview(dependencyId, decisionKey) {
    return axiosInstance.post('/sentinel/review', { dependencyId, decisionKey });
  },

  // Sentinel document ingest
  sentinelIngest(data) {
    return axiosInstance.post('/sentinel/ingest', data);
  },

  // Sentinel audit history log
  sentinelHistory() {
    return axiosInstance.get('/sentinel/history');
  },

  // ── CRI — Coordination Readiness Index ──────────────────────────────────

  // Get CRI score for a specific project
  fetchProjectCRI(projectId) {
    return axiosInstance.get(`/projects/${projectId}/cri`);
  },

  // Get all projects with their CRI scores (for dashboard overview)
  fetchAllProjectsCRI() {
    return axiosInstance.get('/projects/cri/all');
  },

  // ── Open-Source OCR & Geospatial Integration ────────────────────────────

  // Run Tesseract OCR on uploaded civic photo / evidence
  analyzeImageOCR(formData) {
    return axiosInstance.post('/ocr/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Health probe for OCR engine
  getOcrStatus() {
    return axiosInstance.get('/ocr/status');
  },

  // Reverse geocode lat/lng to Bhopal municipal ward address
  reverseGeocode(lat, lng) {
    return axiosInstance.get(`/geo/reverse?lat=${lat}&lng=${lng}`);
  },

  // Batch reverse geocode points
  batchGeocode(points) {
    return axiosInstance.post('/geo/batch', { points });
  },

  // Fetch full Bhopal municipal ward directory
  getWards() {
    return axiosInstance.get('/geo/wards');
  },
};
export default api;
