import React, { useState, useMemo } from 'react';
import {
  Wheat, GraduationCap, Users, Heart, Home, Briefcase,
  Shield, LayoutGrid, ArrowRight, Search, CheckCircle,
  AlertCircle, X, Check, HelpCircle, FileText, Landmark
} from 'lucide-react';

// ─── Scheme Categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',          label: 'All Categories',        count: 105, icon: LayoutGrid,    color: 'text-slate-600 bg-slate-100' },
  { id: 'farmers',      label: 'Farmers & Agriculture', count: 18,  icon: Wheat,         color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  { id: 'education',    label: 'Education & Skill',     count: 16,  icon: GraduationCap, color: 'text-blue-700 bg-blue-50 border-blue-100' },
  { id: 'women',        label: 'Women & Child Dev',     count: 22,  icon: Users,         color: 'text-purple-700 bg-purple-50 border-purple-100' },
  { id: 'health',       label: 'Health & Welfare',      count: 15,  icon: Heart,         color: 'text-rose-700 bg-rose-50 border-rose-100' },
  { id: 'housing',      label: 'Housing & Urban',       count: 14,  icon: Home,          color: 'text-cyan-700 bg-cyan-50 border-cyan-100' },
  { id: 'employment',   label: 'Employment & Labor',    count: 12,  icon: Briefcase,     color: 'text-amber-700 bg-amber-50 border-amber-100' },
  { id: 'social',       label: 'Social Security',       count: 10,  icon: Shield,        color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
];

// ─── Schemes Master Data ──────────────────────────────────────────────────────
const SCHEMES_DATA = [
  {
    id: 'kisan_samman',
    name: 'Kisan Samman Nidhi Yojana',
    category: 'farmers',
    catLabel: 'Farmers & Agriculture',
    dept: 'Agriculture Department',
    benefit: '₹6,000 per year financial assistance',
    eligibility: 'All landholding farmer families',
    active: true,
    catColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    details: 'This scheme aims to supplement the financial needs of all landholding farmer families in procuring various inputs related to agriculture and allied activities as well as domestic needs.',
    docs: ['Landholding Papers', 'Aadhaar Card', 'Bank Passbook', 'PM-KISAN Registration ID'],
  },
  {
    id: 'medhavi_vidyarthi',
    name: 'Mukhyamantri Medhavi Vidyarthi Yojana',
    category: 'education',
    catLabel: 'Education & Skill Development',
    dept: 'Higher Education Department',
    benefit: 'Full academic fee waiver for higher education',
    eligibility: 'Meritorious students of MP (70%+ MP Board, 85%+ CBSE)',
    active: true,
    catColor: 'text-blue-700 bg-blue-50 border-blue-200',
    details: 'Supports bright students belonging to financially backward families to pursue professional courses like Engineering, Medical, Law, and Degree programs.',
    docs: ['Class 12th Marksheet', 'Domicile Certificate of MP', 'Income Certificate (< ₹6 Lakhs/year)', 'Admission Letter'],
  },
  {
    id: 'ladli_behna',
    name: 'Ladli Behna Yojana',
    category: 'women',
    catLabel: 'Women & Child Development',
    dept: 'Women & Child Development Department',
    benefit: '₹1,250 monthly financial assistance',
    eligibility: 'Women aged 21-60 years, family income < ₹2.5 Lakhs',
    active: true,
    catColor: 'text-purple-700 bg-purple-50 border-purple-200',
    details: 'Empowers women financially, encouraging self-reliance and improving their health and nutrition levels within families.',
    docs: ['Samagra ID', 'Aadhaar Card', 'MP Domicile Certificate', 'Bank account linked with Aadhaar/DBT'],
  },
  {
    id: 'jan_arogya',
    name: 'PM Jan Arogya Yojana',
    category: 'health',
    catLabel: 'Health & Family Welfare',
    dept: 'Public Health Department',
    benefit: '₹5 Lakhs health cover per family',
    eligibility: 'Families as per SECC database',
    active: true,
    catColor: 'text-rose-700 bg-rose-50 border-rose-200',
    details: 'Provides cashless diagnostic, treatment, and hospitalization cover at empanelled public and private hospitals for secondary and tertiary care.',
    docs: ['Ayushman Card / Ration Card', 'Aadhaar Card', 'Active mobile number'],
  },
  {
    id: 'awas_urban',
    name: 'PM Awas Yojana (Urban)',
    category: 'housing',
    catLabel: 'Housing & Urban Development',
    dept: 'Urban Development Department',
    benefit: 'Financial assistance for pucca house',
    eligibility: 'Urban homeless families',
    active: true,
    catColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    details: 'Enables urban poor families living in kutcha houses or slums to build or upgrade to permanent, hygienic pucca homes with basic amenities.',
    docs: ['Affidavit of no land ownership elsewhere', 'Identity & Address Proof', 'Income Proof Certificate'],
  },
  {
    id: 'rojgar_setu',
    name: 'MP Rojgar Setu Yojana',
    category: 'employment',
    catLabel: 'Employment & Livelihood',
    dept: 'Skill Development Department',
    benefit: 'Employment & skill training assistance',
    eligibility: 'Job seekers of Madhya Pradesh',
    active: true,
    catColor: 'text-amber-700 bg-amber-50 border-amber-200',
    details: 'Connects skilled migrant laborers and local job seekers with potential employers in industries, construction, and other business sectors.',
    docs: ['Rojgar Panjiyan (Registration)', 'Skill Qualification Certificate', 'Aadhaar Card'],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GovSchemes() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewDetailsScheme, setViewDetailsScheme] = useState(null);
  const [applyScheme, setApplyScheme] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [toast, setToast] = useState(null);

  // Wizard fields
  const [wizardForm, setWizardForm] = useState({ category: 'farmers', income: '', age: '', domicile: 'yes' });

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATA.filter((s) => {
      const matchCat = selectedCat === 'all' || s.category === selectedCat;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.dept.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === 'all' || s.dept.toLowerCase().includes(selectedDept.toLowerCase());
      return matchCat && matchSearch && matchDept;
    });
  }, [selectedCat, searchQuery, selectedDept]);

  // Show Toast Helper
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    triggerToast(`Application submitted successfully for ${applyScheme.name}! Track progress in alerts page.`);
    setApplyScheme(null);
  };

  // Run Wizard recommendation logic
  const handleWizardSubmit = (e) => {
    e.preventDefault();
    if (wizardForm.domicile !== 'yes') {
      triggerToast('Schemes are only available for permanent residents of Madhya Pradesh.');
      setShowWizard(false);
      return;
    }
    // Filter matching category
    setSelectedCat(wizardForm.category);
    setShowWizard(false);
    triggerToast(`Found matching schemes for ${wizardForm.category}!`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle size={14} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Government Welfare Schemes
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-2">
            Explore welfare schemes and find benefits you are eligible for
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm shrink-0 self-start md:self-auto"
        >
          <HelpCircle size={14} />
          Find My Schemes
        </button>
      </div>

      {/* ─── CATEGORY HORIZONTAL ROW ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                isActive
                  ? 'border-blue-900 bg-blue-900 text-white shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/10 text-white' : cat.color} shrink-0`}>
                <CatIcon size={14} />
              </div>
              <div>
                <p className={`text-[10px] font-bold leading-none ${isActive ? 'text-white' : 'text-slate-950'}`}>{cat.label}</p>
                <p className={`text-[9px] mt-1 leading-none ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>{cat.count} Schemes</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── SEARCH & FILTER BAR ───────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
            Popular Schemes
          </h3>
          <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black px-1.5 py-0.5 rounded-md">
            {filteredSchemes.length}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Dept Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 bg-white cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="agriculture">Agriculture</option>
            <option value="education">Education</option>
            <option value="women">Women & Child</option>
            <option value="health">Public Health</option>
            <option value="urban">Urban Development</option>
            <option value="skill">Skill Development</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 bg-white cursor-pointer"
          >
            <option value="popular">Sort by: Popular</option>
            <option value="name">Sort by: Name</option>
          </select>
        </div>
      </div>

      {/* ─── SCHEMES GRID ──────────────────────────────────────────────────── */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold">
          No schemes found matching the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white border border-slate-200/80 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[220px]"
            >
              {/* Header */}
              <div className="px-5 pt-4 pb-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${scheme.catColor}`}>
                  {scheme.catLabel}
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-2 leading-snug">
                  {scheme.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-none">
                  Department: {scheme.dept}
                </p>
              </div>

              {/* Body */}
              <div className="px-5 py-3 flex-1 space-y-3 bg-slate-50/30 border-t border-b border-slate-100">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">BENEFIT</span>
                  <p className="text-[11px] font-bold text-slate-700 leading-normal">{scheme.benefit}</p>
                </div>
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">ELIGIBILITY</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{scheme.eligibility}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
                <button
                  onClick={() => setViewDetailsScheme(scheme)}
                  className="text-[10px] font-bold text-blue-900 hover:underline"
                >
                  View Details
                </button>
                <button
                  onClick={() => setApplyScheme(scheme)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors"
                >
                  Apply Online <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── FOOTER QUICK LINKS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transparency Banner */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100/60 flex items-center justify-center shrink-0 text-blue-900">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 leading-none">All schemes are 100% transparent</p>
              <p className="text-[9px] text-slate-500 mt-1 leading-none">No middlemen · No bribes · Direct benefit transfer</p>
            </div>
          </div>
          <button className="text-[10px] font-bold text-blue-900 hover:underline whitespace-nowrap flex items-center gap-0.5">
            Learn How It Works <ArrowRight size={11} />
          </button>
        </div>

        {/* Tracking Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200/60 flex items-center justify-center shrink-0 text-slate-600">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 leading-none">Track your applications</p>
              <p className="text-[9px] text-slate-500 mt-1 leading-none">Check status, upload documents, download certificates</p>
            </div>
          </div>
          <button className="text-[10px] font-bold text-blue-900 hover:underline whitespace-nowrap flex items-center gap-0.5">
            Go to My Applications <ArrowRight size={11} />
          </button>
        </div>
      </div>

      {/* ─── MODAL: SCHEME DETAILS ─────────────────────────────────────────── */}
      {viewDetailsScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{viewDetailsScheme.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Welfare Scheme Guidelines & Documents</p>
              </div>
              <button onClick={() => setViewDetailsScheme(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-xs text-slate-600 leading-relaxed">{viewDetailsScheme.details}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Benefit Structure</span>
                <p className="text-xs text-slate-800 font-bold leading-normal">{viewDetailsScheme.benefit}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Eligibility Criteria</span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">{viewDetailsScheme.eligibility}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Required Documents</span>
                <div className="grid grid-cols-2 gap-2">
                  {viewDetailsScheme.docs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-lg p-2">
                      <FileText size={12} className="text-slate-400 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-700 truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={() => setViewDetailsScheme(null)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setApplyScheme(viewDetailsScheme);
                  setViewDetailsScheme(null);
                }}
                className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                Apply Online <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: SCHEME APPLICATION FORM ────────────────────────────────── */}
      {applyScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Application Console</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Apply for: {applyScheme.name}</p>
              </div>
              <button onClick={() => setApplyScheme(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name (As in Samagra/Aadhaar) *</label>
                <input
                  required
                  placeholder="e.g. Ramesh Kumar Patel"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aadhaar Number *</label>
                  <input
                    required
                    pattern="[0-9]{12}"
                    placeholder="12 digit number"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Samagra Member ID *</label>
                  <input
                    required
                    placeholder="9 digit ID"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Upload Documents (PDF/JPG) *</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                  <FileText size={20} className="text-slate-400 mb-1" />
                  <p className="text-[10px] font-bold text-slate-700">Choose all required documents</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Land papers, income cert, or domicile proof</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyScheme(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: FIND MY SCHEMES WIZARD ────────────────────────────────── */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Eligibility Wizard</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Answer 3 questions to discover eligible schemes</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWizardSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Category Interest</label>
                <select
                  value={wizardForm.category}
                  onChange={e => setWizardForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-750 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="farmers">Agriculture & Farming</option>
                  <option value="education">Student / Education</option>
                  <option value="women">Women Welfare</option>
                  <option value="health">Family Health Insurance</option>
                  <option value="housing">Housing & Settlement</option>
                  <option value="employment">Job Seekers & Training</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Income</label>
                  <select
                    value={wizardForm.income}
                    onChange={e => setWizardForm(f => ({ ...f, income: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-750 outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="under_25">Under ₹20,000</option>
                    <option value="under_50">₹20,000 - ₹50,000</option>
                    <option value="above_50">Above ₹50,000</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Domicile of MP *</label>
                  <select
                    value={wizardForm.domicile}
                    onChange={e => setWizardForm(f => ({ ...f, domicile: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-750 outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWizard(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  Show Eligible Schemes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
