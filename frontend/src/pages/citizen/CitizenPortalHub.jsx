import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, GraduationCap, Award, Briefcase, Search,
  Plus, Calendar, CheckCircle2, AlertCircle, Clock,
  FileText, ShieldCheck, ChevronRight, Send, ArrowRight,
  Loader2, RotateCcw, MapPin, Compass, Landmark, Lock
} from 'lucide-react';
import UnityMap from '../../components/map/UnityMap';
import api from '../../services/api';

export default function CitizenPortalHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('urban'); // 'urban' | 'education' | 'scholarships' | 'recruitment' | 'tracker'
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // ─── Education Grievance State ─────────────────────────────────────────────
  const [eduSchool, setEduSchool] = useState('Govt. Model Higher Secondary School, TT Nagar');
  const [eduCategory, setEduCategory] = useState('DIGITAL_EQUIPMENT');
  const [eduDesc, setEduDesc] = useState('');
  const [eduSubmitting, setEduSubmitting] = useState(false);
  const [eduResult, setEduResult] = useState(null);

  // ─── Scholarship AI Verification State ─────────────────────────────────────
  const [samagraId, setSamagraId] = useState('902188412');
  const [marksPct, setMarksPct] = useState('88.5');
  const [familyIncome, setFamilyIncome] = useState('320000');
  const [courseType, setCourseType] = useState('ENGINEERING_DEGREE');
  const [verifyingSch, setVerifyingSch] = useState(false);
  const [schEligibility, setSchEligibility] = useState(null);

  // Scholarship Application Tracker State
  const [schAppId, setSchAppId] = useState('SCH-MP-2026-8814');
  const [trackingSch, setTrackingSch] = useState(false);
  const [schRecord, setSchRecord] = useState(null);
  const [schError, setSchError] = useState('');

  // ─── Recruitment Tracker State ─────────────────────────────────────────────
  const [examRollNo, setExamRollNo] = useState('MPESB-2026-90412');
  const [trackingExam, setTrackingExam] = useState(false);
  const [examRecord, setExamRecord] = useState(null);
  const [examError, setExamError] = useState('');

  // Recruitment Grievance State
  const [recRollNo, setRecRollNo] = useState('MPESB-2026-90412');
  const [recExamName, setRecExamName] = useState('MP Sub-Engineer & Assistant Engineer Exam 2026');
  const [recType, setRecType] = useState('ANSWER_KEY_OBJECTION');
  const [recDesc, setRecDesc] = useState('');
  const [recSubmitting, setRecSubmitting] = useState(false);
  const [recResult, setRecResult] = useState(null);

  // ─── Unified Ticket Tracker State ──────────────────────────────────────────
  const [universalToken, setUniversalToken] = useState('');
  const [universalStatus, setUniversalStatus] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoadingSummary(true);
        const res = await api.getCitizenSummary();
        setSummary(res);
      } catch (err) {
        console.error('[Citizen Summary Error]', err);
      } finally {
        setLoadingSummary(false);
      }
    }
    fetchSummary();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleEduSubmit = async (e) => {
    e.preventDefault();
    if (!eduDesc.trim()) return;
    setEduSubmitting(true);
    setEduResult(null);
    try {
      const res = await api.reportEducationGrievance({
        schoolName: eduSchool,
        category: eduCategory,
        description: eduDesc,
        schoolCode: 'MP-BPL-SCH-042',
        wardCode: 'WARD_042',
      });
      setEduResult(res);
      setEduDesc('');
    } catch (err) {
      alert(err.message || 'Failed to file education grievance.');
    } finally {
      setEduSubmitting(false);
    }
  };

  const handleVerifyScholarship = async (e) => {
    e.preventDefault();
    setVerifyingSch(true);
    setSchEligibility(null);
    try {
      const res = await api.verifyScholarshipMerit({
        samagraId,
        marksPercentage: marksPct,
        annualFamilyIncome: familyIncome,
        courseType,
      });
      setSchEligibility(res);
    } catch (err) {
      alert(err.message || 'Scholarship verification failed.');
    } finally {
      setVerifyingSch(false);
    }
  };

  const handleTrackScholarship = async (e) => {
    e.preventDefault();
    if (!schAppId.trim()) return;
    setTrackingSch(true);
    setSchError('');
    setSchRecord(null);
    try {
      const res = await api.getScholarshipStatus(schAppId.trim());
      setSchRecord(res);
    } catch (err) {
      setSchError(err.message || 'Application not found. Try sample: SCH-MP-2026-8814');
    } finally {
      setTrackingSch(false);
    }
  };

  const handleTrackExam = async (e) => {
    e.preventDefault();
    if (!examRollNo.trim()) return;
    setTrackingExam(true);
    setExamError('');
    setExamRecord(null);
    try {
      const res = await api.trackRecruitmentRecord(examRollNo.trim());
      setExamRecord(res);
    } catch (err) {
      setExamError(err.message || 'Roll number not found. Try sample: MPESB-2026-90412');
    } finally {
      setTrackingExam(false);
    }
  };

  const handleRecSubmit = async (e) => {
    e.preventDefault();
    if (!recDesc.trim()) return;
    setRecSubmitting(true);
    setRecResult(null);
    try {
      const res = await api.reportRecruitmentGrievance({
        rollNo: recRollNo,
        examName: recExamName,
        grievanceType: recType,
        description: recDesc,
      });
      setRecResult(res);
      setRecDesc('');
    } catch (err) {
      alert(err.message || 'Failed to submit exam grievance.');
    } finally {
      setRecSubmitting(false);
    }
  };

  const handleUniversalTrack = (e) => {
    e.preventDefault();
    const token = universalToken.trim().toUpperCase();
    if (!token) return;

    if (token.startsWith('BPL-GRV') || token.startsWith('BPL-COM')) {
      setUniversalStatus({
        token,
        domain: 'Urban Infrastructure & Roads',
        status: 'FIELD_INSPECTION_COMPLETED',
        dept: 'MP Public Works Dept (PWD)',
        summary: 'Joint inspection completed. Pavement patch order scheduled under SLA-48.',
        lastUpdate: 'Today, 11:30 AM IST',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
      });
    } else if (token.startsWith('SCH-MP')) {
      setUniversalStatus({
        token,
        domain: 'State Scholarships & DBT',
        status: 'DBT_DISBURSED',
        dept: 'Higher Education Department, GoMP',
        summary: 'Direct Benefit Transfer of ₹60,000 credited to Aadhaar-linked Bank Account.',
        lastUpdate: '18 Sep 2026',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
      });
    } else if (token.startsWith('EDU-BPL')) {
      setUniversalStatus({
        token,
        domain: 'Education Infrastructure',
        status: 'ASSIGNED_TO_ENGINEER',
        dept: 'District Education Office (DEO Bhopal)',
        summary: 'Inspection order issued for Smart Class digital smartboard repair at TT Nagar campus.',
        lastUpdate: 'Yesterday, 04:15 PM IST',
        color: 'text-blue-800 bg-blue-50 border-blue-300'
      });
    } else if (token.startsWith('EXAM-MP') || token.startsWith('MPESB')) {
      setUniversalStatus({
        token,
        domain: 'State Recruitment & Exams',
        status: 'COMMITTEE_REVIEW_APPROVED',
        dept: 'MP Employees Selection Board (MPESB)',
        summary: 'Answer Key Objection for Question 47 validated by Subject Expert Committee.',
        lastUpdate: '20 Sep 2026',
        color: 'text-purple-800 bg-purple-50 border-purple-300'
      });
    } else {
      setUniversalStatus({
        token,
        domain: 'Citizen Registry',
        status: 'UNDER_VALIDATION',
        dept: 'Bhopal District Nodal Cell',
        summary: 'Application received and routed to the competent municipal authority.',
        lastUpdate: 'Synced live with MPOnline Portal',
        color: 'text-amber-800 bg-amber-50 border-amber-300'
      });
    }
  };

  const t = summary?.telemetry;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* ── TRICOLOR TOP STRIP ────────────────────────────────────────────── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* ── INSTITUTIONAL HEADER BAR ──────────────────────────────────────── */}
      <header className="bg-[#0B1B3D] text-white px-6 py-3 border-b border-[#162444] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-black text-xs">
              MP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-black uppercase tracking-[0.18em] leading-none">
                  GOVERNMENT OF MADHYA PRADESH • CITIZEN SERVICES PORTAL
                </h1>
                <span className="text-[9px] font-mono bg-white/15 px-2 py-0.5 rounded text-slate-200">
                  PS-5 MULTI-DOMAIN
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono mt-1">
                Unified Portal for Urban Governance, Education, DBT Scholarships &amp; State Recruitment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-mono text-white/70">
            <span>PORTAL: <strong>MPONLINE_PS5_SECURE</strong></span>
            <span>•</span>
            <span className="text-amber-400 font-bold">[ROLE: CITIZEN_APPLICANT]</span>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* ── Multi-Domain Pillar Switcher Tabs ───────────────────────────── */}
        <div className="bg-white border border-slate-200 p-1.5 rounded-md shadow-2xs flex flex-wrap gap-1.5">
          {[
            { id: 'urban',        label: 'Urban Services & Infrastructure',  icon: Building2,      badge: 'Bhopal GIS' },
            { id: 'education',    label: 'Education & Digital Learning',      icon: GraduationCap,  badge: '384 Schools' },
            { id: 'scholarships', label: 'Scholarships & DBT Status',        icon: Award,          badge: '₹14.8 Cr Disbursed' },
            { id: 'recruitment',  label: 'State Recruitment & Exams',        icon: Briefcase,      badge: 'MPPSC / ESB' },
            { id: 'tracker',      label: 'Universal Grievance Tracker',       icon: Search,         badge: 'All Domains' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-2.5 rounded transition-all text-xs font-bold uppercase tracking-wider ${
                  active
                    ? 'bg-[#0B1B3D] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} className={active ? 'text-amber-400' : 'text-slate-500'} />
                  <span>{tab.label}</span>
                </div>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: URBAN INFRASTRUCTURE & MUNICIPAL SERVICES
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'urban' && (
          <div className="space-y-6 animate-fade-in">
            {/* Telemetry ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Work Packages</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{t?.urbanInfrastructure?.activeWorkPackages || 74}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Bhopal Metro Zone-01</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Grievances Resolved</p>
                <p className="text-2xl font-black font-mono text-emerald-700 mt-1">{t?.urbanInfrastructure?.grievancesResolved || 1420}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">98.2% Resolution SLA</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg. Resolution Time</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{t?.urbanInfrastructure?.avgResolutionDays || 4.2} Days</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Statutory 7-day limit</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">File Civic Grievance</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">Photo Evidence + Tesseract OCR</p>
                </div>
                <button
                  onClick={() => navigate('/citizen/report')}
                  className="bg-[#0B1B3D] hover:bg-[#162444] text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 mt-2 transition-colors"
                >
                  <Plus size={12} /> Launch Grievance Form
                </button>
              </div>
            </div>

            {/* Map & Notices Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-md p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Live Bhopal Municipal Work Zones &amp; Road Closures
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400">GIS UTILITY OVERLAY</span>
                </div>
                <div className="h-96 rounded overflow-hidden border border-slate-200">
                  <UnityMap activeLayers={['road_projects', 'road_closures', 'conflict_zones']} />
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-slate-200 rounded-md p-5 space-y-3 shadow-2xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    Active Municipal Public Notices
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-red-50/70 border border-red-200 rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-red-800 uppercase">AIIMS Corridor Water Shutdown</span>
                        <span className="text-[8px] font-bold bg-red-200 text-red-900 px-1.5 py-0.2 rounded">48 HR CUT</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        Scheduled utility diversion for upgraded main pipeline. Affected: AIIMS Hospital Block &amp; Ward 28.
                      </p>
                      <p className="text-[9px] font-mono text-slate-500">Duration: 24 Sep 22:00 - 26 Sep 22:00</p>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-amber-800 uppercase">MP Nagar Zone-1 Road Diversion</span>
                        <span className="text-[8px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">TRAFFIC</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        Arterial drain reconstruction in progress. Follow alternate corridor via DB Mall underpass.
                      </p>
                      <p className="text-[9px] font-mono text-slate-500">Status: Active traffic cell diversion</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-md space-y-2 text-xs">
                  <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Need Urgent Civic Assistance?</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Contact Bhopal District CM Helpline <strong>181</strong> or WhatsApp Bhopal Smart City Command at <strong>+91-755-2540100</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: EDUCATION & DIGITAL CLASSROOMS
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'education' && (
          <div className="space-y-6 animate-fade-in">
            {/* Telemetry Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Connected Schools</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{t?.educationPillar?.connectedSchools || 384}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Bhopal District Education Registry</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Digital Classrooms Active</p>
                <p className="text-2xl font-black font-mono text-blue-900 mt-1">{t?.educationPillar?.smartClassroomsActive || 290}</p>
                <p className="text-[10px] text-blue-900 mt-0.5 font-bold">75.5% Digital Coverage</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Open Audit Issues</p>
                <p className="text-2xl font-black font-mono text-amber-700 mt-1">{t?.educationPillar?.infrastructureGrievancesOpen || 14}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">SLA Target: 48 Hours</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Govt Department</p>
                <p className="text-xs font-black text-slate-900 mt-1 uppercase">School Education Dept</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Bhopal District Unit</p>
              </div>
            </div>

            {/* Form + Information Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-5 space-y-4 shadow-2xs">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    File School Infrastructure &amp; Digital Learning Grievance
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    SLA: 48 HOURS
                  </span>
                </div>

                {eduResult ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3 text-center">
                    <CheckCircle2 size={32} className="text-emerald-700 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-900">Education Grievance Registered</h4>
                    <p className="text-xs text-slate-600">Assigned to District Education Officer (DEO Bhopal) for immediate site verification.</p>
                    <div className="p-3 bg-white border border-slate-200 rounded inline-block font-mono text-sm font-black text-slate-900">
                      Tracking Token: {eduResult.refId}
                    </div>
                    <div>
                      <button
                        onClick={() => setEduResult(null)}
                        className="text-xs font-bold text-blue-900 hover:underline uppercase tracking-wider"
                      >
                        File Another Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEduSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Target Educational Institution <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={eduSchool}
                        onChange={(e) => setEduSchool(e.target.value)}
                        className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-800 outline-none focus:border-[#0B1B3D] bg-white font-sans"
                      >
                        <option value="Govt. Model Higher Secondary School, TT Nagar">Govt. Model Higher Secondary School, TT Nagar (Bhopal)</option>
                        <option value="Govt. Subhash Higher Secondary School of Excellence, Shivaji Nagar">Govt. Subhash Excellence School, Shivaji Nagar</option>
                        <option value="Govt. Girls Higher Secondary School, Jahangirabad">Govt. Girls Higher Secondary School, Jahangirabad</option>
                        <option value="Govt. Naveen Boys Higher Secondary School, Bairagarh">Govt. Naveen Boys School, Bairagarh</option>
                        <option value="CM RISE School, MP Nagar Zone-II">CM RISE School, MP Nagar Zone-II</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          Issue Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={eduCategory}
                          onChange={(e) => setEduCategory(e.target.value)}
                          className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-800 outline-none focus:border-[#0B1B3D] bg-white font-sans"
                        >
                          <option value="DIGITAL_EQUIPMENT">Smart Board / Digital Classroom Malfunction</option>
                          <option value="CIVIL_INFRASTRUCTURE">Roof Leakage / Boundary Wall Hazard</option>
                          <option value="SANITATION_DRINKING">Drinking Water &amp; Toilet Sanitation</option>
                          <option value="MID_DAY_MEAL">Mid-Day Meal Quality / Ration Delay</option>
                          <option value="TEXTBOOK_SUPPLY">Free Textbook &amp; Uniform Disbursal Delay</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          District Ward
                        </label>
                        <input
                          type="text"
                          disabled
                          value="WARD_042 (Bhopal Urban)"
                          className="w-full border border-slate-200 bg-slate-50 rounded p-2.5 text-xs text-slate-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Problem Description &amp; Specific Classroom Details <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={eduDesc}
                        onChange={(e) => setEduDesc(e.target.value)}
                        placeholder="e.g. Smart interactive panel in Class 10-A is non-functional since 5 days, impacting digital science lectures..."
                        className="w-full border border-slate-300 rounded p-3 text-xs text-slate-900 outline-none focus:border-[#0B1B3D] bg-white font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={eduSubmitting || !eduDesc.trim()}
                      className="bg-[#0B1B3D] hover:bg-[#162444] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      {eduSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                      Submit Education Grievance
                    </button>
                  </form>
                )}
              </div>

              {/* Education Quality Standards card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 rounded-md p-5 space-y-3 shadow-2xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    MP School Standards &amp; Redressal Framework
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                      <p className="font-bold text-slate-900 text-[11px]">48-Hour DEO Resolution SLA</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Critical hazards are audited within 48 hours by Assistant District Project Coordinators.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                      <p className="font-bold text-slate-900 text-[11px]">Digital Classroom Maintenance Guarantee</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Hardware vendors are contractually bound under MPSEDC AMC to replace faulty smart panels within 3 working days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: SCHOLARSHIPS & DIRECT BENEFIT TRANSFER (DBT)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6 animate-fade-in">
            {/* Telemetry */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Disbursed This Cycle</p>
                <p className="text-2xl font-black font-mono text-emerald-700 mt-1">{t?.scholarshipsDBT?.totalDisbursedThisCycle || '₹14.8 Cr'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Higher Education &amp; Tribal Welfare</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verified Beneficiaries</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{(t?.scholarshipsDBT?.verifiedBeneficiaries || 18400).toLocaleString()}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">100% Aadhaar Seeded</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">DBT Success Rate</p>
                <p className="text-2xl font-black font-mono text-emerald-700 mt-1">{t?.scholarshipsDBT?.dbtSuccessRate || '99.4%'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Direct to Student Bank A/C</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active MP State Schemes</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{t?.scholarshipsDBT?.activeSchemesCount || 8}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">MMVY, Post-Matric, Gaon Ki Beti</p>
              </div>
            </div>

            {/* Grid Split: AI Eligibility Validator + Application Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left (7 Cols): AI Merit Eligibility Checker */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-5 space-y-4 shadow-2xs">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    AI-Assisted Merit &amp; Fee Waiver Eligibility Engine
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    RULES ENGINE v2.1
                  </span>
                </div>

                <form onSubmit={handleVerifyScholarship} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Samagra Member ID (9 Digits) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={samagraId}
                        onChange={(e) => setSamagraId(e.target.value)}
                        placeholder="e.g. 902188412"
                        className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Class 12th Board Marks (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={marksPct}
                        onChange={(e) => setMarksPct(e.target.value)}
                        placeholder="e.g. 88.5"
                        className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Annual Family Income (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={familyIncome}
                        onChange={(e) => setFamilyIncome(e.target.value)}
                        placeholder="e.g. 320000"
                        className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Enrolled Program
                      </label>
                      <select
                        value={courseType}
                        onChange={(e) => setCourseType(e.target.value)}
                        className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-800 outline-none focus:border-[#0B1B3D] bg-white font-sans"
                      >
                        <option value="ENGINEERING_DEGREE">B.Tech / B.E. (MANIT / State Govt)</option>
                        <option value="MEDICAL_DEGREE">MBBS / BDS (AIIMS / GMC Bhopal)</option>
                        <option value="GENERAL_DEGREE">B.Sc / B.Com / B.A. Degree</option>
                        <option value="POLYTECHNIC">Polytechnic Diploma</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={verifyingSch}
                    className="bg-[#0B1B3D] hover:bg-[#162444] text-white font-bold px-5 py-2.5 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {verifyingSch ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                    Verify Scholarship Eligibility
                  </button>
                </form>

                {schEligibility && (
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-900">{schEligibility.schemeName}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        schEligibility.eligible
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-red-100 text-red-900 border-red-300'
                      }`}>
                        {schEligibility.eligible ? 'ELIGIBLE FOR DBT' : 'NOT ELIGIBLE'}
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded">
                      <p className="text-[9px] font-bold uppercase text-slate-400">Estimated State Benefit:</p>
                      <p className="text-sm font-black text-emerald-800 mt-0.5">{schEligibility.estimatedBenefit}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Verification Criteria Checklist:</p>
                      {schEligibility.criteria.map((c, i) => (
                        <div key={i} className="text-[10px] text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-700 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[8.5px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-200 pt-2">
                      <span>VERIFICATION TOKEN: {schEligibility.verificationToken}</span>
                      <span>CONFIDENCE: {schEligibility.confidenceScore}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right (5 Cols): Direct Benefit Transfer Status Tracker */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md p-5 space-y-4 shadow-2xs">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Track DBT Application &amp; Disbursement Status
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">MP State Scholarship 2.0 Integration</p>
                </div>

                <form onSubmit={handleTrackScholarship} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Application ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={schAppId}
                        onChange={(e) => setSchAppId(e.target.value)}
                        placeholder="e.g. SCH-MP-2026-8814"
                        className="flex-1 border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
                      />
                      <button
                        type="submit"
                        disabled={trackingSch}
                        className="bg-[#0B1B3D] text-white px-3 py-2 rounded text-xs font-bold uppercase transition-colors"
                      >
                        {trackingSch ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                      </button>
                    </div>
                  </div>
                </form>

                {schError && (
                  <div className="bg-red-50 border border-red-200 p-2.5 rounded text-xs text-red-700">
                    {schError}
                  </div>
                )}

                {schRecord && (
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3 animate-fade-in text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-900">{schRecord.appId}</span>
                      <span className="text-[8.5px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 uppercase">
                        {schRecord.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <p><strong className="text-slate-500 text-[10px] uppercase block">Scheme:</strong> {schRecord.schemeName}</p>
                      <p><strong className="text-slate-500 text-[10px] uppercase block">Institution:</strong> {schRecord.institution}</p>
                      <p><strong className="text-slate-500 text-[10px] uppercase block">Disbursed Amount:</strong> <span className="font-bold text-emerald-800 font-mono">{schRecord.disbursedAmount}</span></p>
                      <p><strong className="text-slate-500 text-[10px] uppercase block">Direct Benefit Bank:</strong> {schRecord.dbtBank}</p>
                      {schRecord.transactionId && (
                        <p className="font-mono text-[10px] text-slate-600">
                          <strong className="text-slate-500 text-[9px] uppercase block">Bank Transaction Ref:</strong> {schRecord.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-slate-500 bg-slate-50 border border-slate-200 p-3 rounded space-y-1">
                  <p className="font-bold text-slate-800 uppercase">Sample Application IDs:</p>
                  <p className="font-mono text-blue-900 cursor-pointer" onClick={() => setSchAppId('SCH-MP-2026-8814')}>
                    • SCH-MP-2026-8814 (MMVY MANIT Bhopal - Disbursed)
                  </p>
                  <p className="font-mono text-blue-900 cursor-pointer" onClick={() => setSchAppId('SCH-MP-2026-4419')}>
                    • SCH-MP-2026-4419 (Post-Matric Barkatullah Univ - Sanctioned)
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4: STATE RECRUITMENT & TRANSPARENT EXAMS
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6 animate-fade-in">
            {/* Telemetry */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active State Exams</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{t?.stateRecruitment?.activeExams || 6}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">MPPSC / MPESB Boards</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Candidates Enrolled</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{(t?.stateRecruitment?.totalCandidatesEnrolled || 82000).toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Biometric Verified at Centers</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Objections Resolved</p>
                <p className="text-2xl font-black font-mono text-emerald-700 mt-1">{t?.stateRecruitment?.grievancesAddressed || 341}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">100% Expert Committee Audited</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Audit Transparency Score</p>
                <p className="text-2xl font-black font-mono text-slate-900 mt-1">{t?.stateRecruitment?.transparentAuditScore || '96.8 / 100'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">ISO 27001 Exam Protocol</p>
              </div>
            </div>

            {/* Split: Roll No Tracker & Exam Grievance Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left (6 Cols): Candidate Examination Record */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md p-5 space-y-4 shadow-2xs">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Candidate Admit Card &amp; Objection Status
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Official MPESB / MPPSC Candidate Portal</p>
                </div>

                <form onSubmit={handleTrackExam} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Roll Number / Candidate ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={examRollNo}
                        onChange={(e) => setExamRollNo(e.target.value)}
                        placeholder="e.g. MPESB-2026-90412"
                        className="flex-1 border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
                      />
                      <button
                        type="submit"
                        disabled={trackingExam}
                        className="bg-[#0B1B3D] text-white px-4 py-2 rounded text-xs font-bold uppercase"
                      >
                        {trackingExam ? <Loader2 size={12} className="animate-spin" /> : 'Track'}
                      </button>
                    </div>
                  </div>
                </form>

                {examError && (
                  <div className="bg-red-50 border border-red-200 p-2.5 rounded text-xs text-red-700">
                    {examError}
                  </div>
                )}

                {examRecord && (
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3 animate-fade-in text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold font-mono text-slate-900">{examRecord.rollNo}</span>
                      <span className="text-[8.5px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 uppercase">
                        ADMIT CARD: {examRecord.admitCardStatus}
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <p><strong className="text-slate-500 text-[10px] uppercase block">Examination:</strong> {examRecord.examName}</p>
                      <p><strong className="text-slate-500 text-[10px] uppercase block">Assigned Center:</strong> {examRecord.examCenter}</p>
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                        <div className="bg-white border border-slate-200 p-2 rounded">
                          <span className="text-[8.5px] text-slate-400 block uppercase font-bold">Normalized Score</span>
                          <span className="text-sm font-black text-slate-900">{examRecord.scoreNormalized || 'EVALUATING'}</span>
                        </div>
                        <div className="bg-white border border-slate-200 p-2 rounded">
                          <span className="text-[8.5px] text-slate-400 block uppercase font-bold">Statewide Rank Status</span>
                          <span className="text-xs font-bold text-blue-900">{examRecord.rankZone}</span>
                        </div>
                      </div>
                      {examRecord.grievanceSummary && (
                        <div className="p-2.5 bg-white border border-slate-200 rounded space-y-1">
                          <span className="text-[9px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                            <CheckCircle2 size={11} /> Objection Status: {examRecord.grievanceStatus}
                          </span>
                          <p className="text-[10px] text-slate-600">{examRecord.grievanceSummary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right (6 Cols): Exam Grievance / Answer Key Challenge */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md p-5 space-y-4 shadow-2xs">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    File Exam Center / Answer Key Objection
                  </h3>
                  <span className="text-[8.5px] font-mono text-slate-400">EXPERT COMMITTEE REVIEW</span>
                </div>

                {recResult ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3 text-center">
                    <CheckCircle2 size={32} className="text-emerald-700 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-900">Objection Registered for Committee Review</h4>
                    <p className="text-xs text-slate-600">Your challenge has been submitted to the Subject Expert Board for technical verification.</p>
                    <div className="p-3 bg-white border border-slate-200 rounded inline-block font-mono text-sm font-black text-slate-900">
                      Tracking ID: {recResult.refId}
                    </div>
                    <div>
                      <button
                        onClick={() => setRecResult(null)}
                        className="text-xs font-bold text-blue-900 hover:underline uppercase tracking-wider"
                      >
                        Submit Another Query
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRecSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          Roll Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={recRollNo}
                          onChange={(e) => setRecRollNo(e.target.value)}
                          placeholder="e.g. MPESB-2026-90412"
                          className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          Grievance Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={recType}
                          onChange={(e) => setRecType(e.target.value)}
                          className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-800 outline-none focus:border-[#0B1B3D] bg-white font-sans"
                        >
                          <option value="ANSWER_KEY_OBJECTION">Answer Key Technical Challenge</option>
                          <option value="BIOMETRIC_FAIL">Biometric / Identity Verification Issue</option>
                          <option value="CENTER_FACILITY">Exam Center Computer / Power Glitch</option>
                          <option value="ADMIT_CARD_CORRECTION">Admit Card Name / Photo Correction</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Detailed Objection Narrative &amp; Standard Reference <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={recDesc}
                        onChange={(e) => setRecDesc(e.target.value)}
                        placeholder="e.g. Question 47 (Hydraulics): Option B is technically correct as per Bureau of Indian Standards (IS 456-2000). Official key lists Option C..."
                        className="w-full border border-slate-300 rounded p-3 text-xs text-slate-900 outline-none focus:border-[#0B1B3D] bg-white font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={recSubmitting || !recDesc.trim()}
                      className="bg-[#0B1B3D] hover:bg-[#162444] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      {recSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                      Submit Official Examination Objection
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 5: UNIVERSAL GRIEVANCE TRACKER (CROSS-DOMAIN)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tracker' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-md p-6 space-y-5 shadow-2xs animate-fade-in">
            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Universal Multi-Domain Grievance &amp; Application Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Track status across Urban Works, Education, DBT Scholarships, and State Recruitment using any reference key.
              </p>
            </div>

            <form onSubmit={handleUniversalTrack} className="flex gap-2">
              <input
                type="text"
                required
                value={universalToken}
                onChange={(e) => setUniversalToken(e.target.value)}
                placeholder="Enter Token (e.g. BPL-GRV-88214, SCH-MP-2026-8814, EDU-BPL-10492, EXAM-MP-99412)"
                className="flex-1 border border-slate-300 rounded px-4 py-3 text-xs text-slate-900 font-mono outline-none focus:border-[#0B1B3D]"
              />
              <button
                type="submit"
                className="bg-[#0B1B3D] hover:bg-[#162444] text-white px-6 py-3 rounded text-xs font-black uppercase tracking-wider transition-colors shadow-2xs"
              >
                Track Live Status
              </button>
            </form>

            {universalStatus && (
              <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Domain Pillar</span>
                    <span className="text-xs font-bold text-slate-900">{universalStatus.domain}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded border uppercase ${universalStatus.color}`}>
                    {universalStatus.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong className="text-slate-500 text-[10px] uppercase block">Competent Department:</strong> {universalStatus.dept}</p>
                  <p><strong className="text-slate-500 text-[10px] uppercase block">Official Summary:</strong> {universalStatus.summary}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-2">LAST SYSTEM TIMESTAMP: {universalStatus.lastUpdate}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs space-y-2">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Try Sample Reference Keys:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-blue-900">
                <span className="cursor-pointer hover:underline" onClick={() => setUniversalToken('BPL-GRV-44102')}>• BPL-GRV-44102 (Road Trenching - Ward 42)</span>
                <span className="cursor-pointer hover:underline" onClick={() => setUniversalToken('SCH-MP-2026-8814')}>• SCH-MP-2026-8814 (MANIT DBT - ₹60,000)</span>
                <span className="cursor-pointer hover:underline" onClick={() => setUniversalToken('EDU-BPL-90214')}>• EDU-BPL-90214 (Smart Class - TT Nagar)</span>
                <span className="cursor-pointer hover:underline" onClick={() => setUniversalToken('EXAM-MP-33104')}>• EXAM-MP-33104 (ESB Answer Key Objection)</span>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
