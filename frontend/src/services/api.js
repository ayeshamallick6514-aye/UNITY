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

  // ── C-Lock (Coordination Lock) State Engine ─────────────────────────────

  // Fetch all projects with multi-departmental C-Lock states
  getCLockProjects() {
    return axiosInstance.get('/clock/projects');
  },

  // Fetch detailed C-Lock status for a single project
  getCLockProject(projectId) {
    return axiosInstance.get(`/clock/project/${projectId}`);
  },

  // Execute departmental sign-off or clearance directive
  signOffDepartment(projectId, deptCode, authorityRole, referenceNote) {
    return axiosInstance.post('/clock/sign-off', {
      projectId,
      deptCode,
      authorityRole,
      referenceNote,
    });
  },

  // Reset C-Lock demonstration states
  resetCLock() {
    return axiosInstance.post('/clock/reset');
  },

  // ── Multi-Domain Citizen Portal (Education, Scholarships, Recruitment) ──

  // Fetch cross-domain citizen telemetry summary
  getCitizenSummary() {
    return axiosInstance.get('/citizen/services/summary');
  },

  // AI-assisted scholarship merit eligibility & criteria verification
  verifyScholarshipMerit(data) {
    return axiosInstance.post('/citizen/scholarship/verify', data);
  },

  // Direct Benefit Transfer (DBT) & Scholarship status tracking
  getScholarshipStatus(appId) {
    return axiosInstance.get(`/citizen/scholarship/status/${appId}`);
  },

  // School infrastructure & digital learning grievance filing
  reportEducationGrievance(data) {
    return axiosInstance.post('/citizen/education/report', data);
  },

  // State recruitment examination & admit card tracking
  trackRecruitmentRecord(rollNo) {
    return axiosInstance.get(`/citizen/recruitment/track/${rollNo}`);
  },

  // Exam center / answer key challenge grievance submission
  reportRecruitmentGrievance(data) {
    return axiosInstance.post('/citizen/recruitment/grievance', data);
  },

  // ── Healthcare Services & Hospital Telemetry ────────────────────────────

  // Live hospital telemetry & ICU/oxygen buffers
  getHealthcareTelemetry() {
    return axiosInstance.get('/healthcare/telemetry');
  },

  // Medical / public health grievance filing
  reportHealthGrievance(data) {
    return axiosInstance.post('/healthcare/grievance', data);
  },

  // Track medical grievance by reference ID
  trackHealthGrievance(refId) {
    return axiosInstance.get(`/healthcare/track/${refId}`);
  },

  // ── Agricultural Governance & Mandi E-Uparjan ───────────────────────────

  // Mandi prices, arrival telemetry & DBT summary
  getAgricultureTelemetry() {
    return axiosInstance.get('/agriculture/telemetry');
  },

  // Farmer PM-Kisan / Mukhyamantri Kisan Kalyan DBT status
  getFarmerDbtStatus(farmerId) {
    return axiosInstance.get(`/agriculture/dbt/status/${farmerId}`);
  },

  // PMFBY Crop damage re-survey appeal submission
  reportCropDamageGrievance(data) {
    return axiosInstance.post('/agriculture/crop-damage/report', data);
  },
};
export default api;
