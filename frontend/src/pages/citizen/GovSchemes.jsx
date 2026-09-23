import React, { useState, useMemo } from 'react';
import {
  Wheat, GraduationCap, Users, Heart, Home, Briefcase,
  Shield, LayoutGrid, ArrowRight, Search, CheckCircle,
  AlertCircle, X, Check, HelpCircle, FileText, Landmark
} from 'lucide-react';

// ─── Scheme Categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',          label: 'All Categories',        icon: LayoutGrid,    color: 'text-slate-600 bg-slate-100' },
  { id: 'farmers',      label: 'Farmers & Agriculture', icon: Wheat,         color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  { id: 'education',    label: 'Education & Skill',     icon: GraduationCap, color: 'text-blue-700 bg-blue-50 border-blue-100' },
  { id: 'women',        label: 'Women & Child Dev',     icon: Users,         color: 'text-purple-700 bg-purple-50 border-purple-100' },
  { id: 'health',       label: 'Health & Welfare',      icon: Heart,         color: 'text-rose-700 bg-rose-50 border-rose-100' },
  { id: 'housing',      label: 'Housing & Urban',       icon: Home,          color: 'text-cyan-700 bg-cyan-50 border-cyan-100' },
  { id: 'employment',   label: 'Employment & Labor',    icon: Briefcase,     color: 'text-amber-700 bg-amber-50 border-amber-100' },
  { id: 'social',       label: 'Social Security',       icon: Shield,        color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
];

// ─── Authentic Schemes Master Data (Madhya Pradesh & National) ────────────────
const SCHEMES_DATA = [
  // ── 1. Farmers & Agriculture ────────────────────────────────────────────────
  {
    id: 'kisan_samman',
    name: 'PM Kisan Samman Nidhi Yojana',
    category: 'farmers',
    catLabel: 'Farmers & Agriculture',
    dept: 'Farmer Welfare & Agriculture Dept',
    benefit: '₹6,000 per year direct income transfer (3 installments of ₹2,000)',
    eligibility: 'All small & marginal landholding farmer families with verified eKYC',
    active: true,
    catColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    details: 'Supplements financial requirements of farmer families in procuring agricultural inputs, high-yield seeds, fertilizers, and addressing seasonal cultivation expenditures.',
    docs: ['Land Record (Khasra/Khatauni)', 'Aadhaar Card', 'Bank Passbook (Aadhaar linked)', 'PM-KISAN Registration ID'],
  },
  {
    id: 'kisan_kalyan',
    name: 'Mukhyamantri Kisan Kalyan Yojana (MKKY)',
    category: 'farmers',
    catLabel: 'Farmers & Agriculture',
    dept: 'Farmer Welfare & Agriculture Dept',
    benefit: '₹6,000/yr additional state assistance (Total ₹12,000/yr with PM-Kisan)',
    eligibility: 'All MP farmers registered & verified under the PM-Kisan database',
    active: true,
    catColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    details: 'State-funded direct cash transfer top-up for farmers in Madhya Pradesh transferred directly into active DBT-enabled bank accounts twice a year.',
    docs: ['Samagra Member ID', 'Aadhaar Card', 'Land Revenue Record (B-1/Khasra)', 'DBT Bank Account Verification'],
  },
  {
    id: 'fasal_bima',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'farmers',
    catLabel: 'Farmers & Agriculture',
    dept: 'Farmer Welfare & Agriculture Dept',
    benefit: 'Comprehensive crop insurance against drought, flood & localized pest loss',
    eligibility: 'All loanee & non-loanee farmers growing notified Kharif/Rabi crops',
    active: true,
    catColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    details: 'Insulates farmers against severe financial losses from natural calamities, pests, and unseasonal weather. Nominal premium of 1.5% to 2% with full state-central subsidy.',
    docs: ['Land Possession Certificate', 'Crop Sowing Certificate / Patwari Report', 'Aadhaar Card', 'Bank Passbook'],
  },
  {
    id: 'bhavantar_bhugtan',
    name: 'Bhavantar Bhugtan Yojana (Price Deficit Scheme)',
    category: 'farmers',
    catLabel: 'Farmers & Agriculture',
    dept: 'Farmer Welfare & Agriculture Dept',
    benefit: 'Direct transfer of price deficit difference between MSP and Mandi auction price',
    eligibility: 'MP farmers selling notified oilseeds and pulses at registered Krishi Mandis',
    active: true,
    catColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    details: 'Protects cultivators from distress selling during market gluts by compensating the gap between Minimum Support Price (MSP) and actual modal mandi auction rates.',
    docs: ['Krishi Mandi Sale Slip', 'E-Uparjan Registration Slip', 'Farmer Aadhaar Card', 'Bank Account Details'],
  },

  // ── 2. Education & Skill ────────────────────────────────────────────────────
  {
    id: 'medhavi_vidyarthi',
    name: 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)',
    category: 'education',
    catLabel: 'Education & Skill',
    dept: 'Higher Education Department',
    benefit: '100% academic tuition fee waiver for higher professional education',
    eligibility: 'MP students (≥70% MP Board / ≥85% CBSE) with family income < ₹6 Lakhs/yr',
    active: true,
    catColor: 'text-blue-700 bg-blue-50 border-blue-200',
    details: 'Finances total admission and tuition fees for bright students admitted to premier professional courses in Engineering (IIT/NIT/MANIT), Medical (AIIMS/GMC), Law, and Management.',
    docs: ['Class 10th & 12th Marksheets', 'MP Domicile Certificate', 'Income Certificate (< ₹6 Lakhs)', 'College Admission Allotment Letter'],
  },
  {
    id: 'seekho_kamao',
    name: 'Mukhya Mantri Seekho Kamao Yojana (MMSKY)',
    category: 'education',
    catLabel: 'Education & Skill',
    dept: 'Skill Development & Employment Dept',
    benefit: 'Paid on-the-job industrial apprenticeship with ₹8,000–₹10,000/mo stipend',
    eligibility: 'MP youth aged 18 to 29 years with minimum 12th, ITI, Diploma or Degree',
    active: true,
    catColor: 'text-blue-700 bg-blue-50 border-blue-200',
    details: 'Provides industry-relevant vocational training across 700+ recognized sectors (manufacturing, electronics, IT, healthcare) with state-guaranteed monthly stipends.',
    docs: ['Samagra Member ID', 'Aadhaar Card', 'Educational Marksheet / Diploma', 'Bank Account linked to DBT'],
  },
  {
    id: 'pratibha_kiran',
    name: 'Pratibha Kiran Scholarship Scheme',
    category: 'education',
    catLabel: 'Education & Skill',
    dept: 'Higher Education Department',
    benefit: '₹5,000 per year financial scholarship (₹7,500/yr for professional degree)',
    eligibility: 'Urban BPL girl students scoring 60%+ in 12th from MP municipal areas',
    active: true,
    catColor: 'text-blue-700 bg-blue-50 border-blue-200',
    details: 'Enables meritorious female students from impoverished urban households in municipal zones to pursue undergraduate degrees and university courses.',
    docs: ['BPL Ration Card', '12th Marksheet', 'MP Domicile Certificate', 'College Identity Card / Fee Receipt'],
  },
  {
    id: 'gaon_ki_beti',
    name: 'Gaon Ki Beti Yojana',
    category: 'education',
    catLabel: 'Education & Skill',
    dept: 'Higher Education Department',
    benefit: '₹5,000 per year financial grant for 10 months during degree studies',
    eligibility: 'Rural girl students residing in MP villages passing 12th in 1st division',
    active: true,
    catColor: 'text-blue-700 bg-blue-50 border-blue-200',
    details: 'Encourages rural female students to continue into higher education institutions by granting direct annual stipends upon college admission.',
    docs: ['Village Residence Certificate (Gram Panchayat)', '12th First Division Marksheet', 'College Admission Receipt', 'Samagra ID'],
  },

  // ── 3. Women & Child Development ────────────────────────────────────────────
  {
    id: 'ladli_behna',
    name: 'Mukhyamantri Ladli Behna Yojana',
    category: 'women',
    catLabel: 'Women & Child Dev',
    dept: 'Women & Child Development Dept',
    benefit: '₹1,250 monthly direct cash transfer into bank account (₹15,000/year)',
    eligibility: 'Resident women of MP aged 21 to 60 years with family income < ₹2.5 Lakhs',
    active: true,
    catColor: 'text-purple-700 bg-purple-50 border-purple-200',
    details: 'Empowers women economically, fosters financial self-reliance, and enhances health and nutritional indicators for families across Madhya Pradesh.',
    docs: ['Samagra Member & Family ID', 'Aadhaar Card', 'Active DBT-Enabled Bank Account', 'Self-Declaration Form'],
  },
  {
    id: 'ladli_laxmi',
    name: 'Ladli Laxmi Yojana 2.0',
    category: 'women',
    catLabel: 'Women & Child Dev',
    dept: 'Women & Child Development Dept',
    benefit: 'Cumulative financial assurance up to ₹1,43,000 for education and maturity',
    eligibility: 'Girl children born in MP after Jan 2006 to parents registered in Samagra',
    active: true,
    catColor: 'text-purple-700 bg-purple-50 border-purple-200',
    details: 'Provides scheduled educational milestone cash incentives and guarantees a final lump-sum bond payment upon the girl child turning 21 years of age.',
    docs: ['Child Birth Certificate', 'Parents Samagra ID', 'Immunization / Anganwadi Card', 'Non-Tax Payer Declaration'],
  },
  {
    id: 'kanya_vivah',
    name: 'Mukhyamantri Kanya Vivah & Nikah Yojana',
    category: 'women',
    catLabel: 'Women & Child Dev',
    dept: 'Social Justice & Disabled Welfare Dept',
    benefit: '₹55,000 financial grant (₹49,000 direct bank transfer + ₹6,000 event costs)',
    eligibility: 'Destitute, poor or BPL families, widows & divorcees solemnizing marriage in MP',
    active: true,
    catColor: 'text-purple-700 bg-purple-50 border-purple-200',
    details: 'Provides comprehensive state financial assistance for the marriage expenses of adult daughters from economically disadvantaged families.',
    docs: ['Age Proof (Bride ≥ 18, Groom ≥ 21)', 'BPL Card / Samagra Family ID', 'MP Domicile Certificate', 'Bank Account Passbook'],
  },
  {
    id: 'matru_vandana',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    category: 'women',
    catLabel: 'Women & Child Dev',
    dept: 'Women & Child Development Dept',
    benefit: '₹5,000 maternity cash incentive in DBT installments for first live birth',
    eligibility: 'Pregnant women and lactating mothers aged 19+ delivering first living child',
    active: true,
    catColor: 'text-purple-700 bg-purple-50 border-purple-200',
    details: 'Compensates wage loss during pregnancy, encourages institutional deliveries, and ensures essential health checkups and vaccinations for newborns.',
    docs: ['Mother-Child Protection (MCP) Card', 'Aadhaar Card of Mother & Father', 'Bank Account Passbook', 'Institutional Birth Slip'],
  },

  // ── 4. Health & Welfare ─────────────────────────────────────────────────────
  {
    id: 'jan_arogya',
    name: 'Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)',
    category: 'health',
    catLabel: 'Health & Welfare',
    dept: 'Public Health & Family Welfare Dept',
    benefit: '₹5,00,000 cashless hospitalization and surgical treatment per family per year',
    eligibility: 'Families listed under SECC database, NFSA ration card, or Sambal scheme',
    active: true,
    catColor: 'text-rose-700 bg-rose-50 border-rose-200',
    details: 'Provides paperless and cashless access to secondary and tertiary medical treatments across 1,000+ empanelled government and private hospitals throughout Madhya Pradesh.',
    docs: ['Ayushman Gold Card / NFSA Ration Card', 'Aadhaar Card', 'Samagra Family ID', 'Active Mobile Number'],
  },
  {
    id: 'deendayal_upchar',
    name: 'Deendayal Antyodaya Upchar Yojana',
    category: 'health',
    catLabel: 'Health & Welfare',
    dept: 'Public Health & Family Welfare Dept',
    benefit: 'Free inpatient treatment, diagnostic tests and medicines up to ₹30,000/yr',
    eligibility: 'BPL and Antyodaya cardholders admitted to MP government district hospitals',
    active: true,
    catColor: 'text-rose-700 bg-rose-50 border-rose-200',
    details: 'Covers entire inpatient medical and hospitalization costs for below-poverty-line patients treated at district hospitals such as JP Hospital Bhopal and medical colleges.',
    docs: ['BPL Card', 'MP Domicile Certificate', 'Hospital Admission Slip', 'Patient Aadhaar Card'],
  },
  {
    id: 'bal_hriday',
    name: 'Mukhyamantri Bal Hriday Upchar Yojana',
    category: 'health',
    catLabel: 'Health & Welfare',
    dept: 'Public Health & Family Welfare Dept',
    benefit: '100% free surgical and cardiac treatment (up to ₹2.0 Lakhs per surgery)',
    eligibility: 'Children aged 0 to 15 years residing in MP diagnosed with congenital heart defects',
    active: true,
    catColor: 'text-rose-700 bg-rose-50 border-rose-200',
    details: 'Fully finances life-saving pediatric open-heart surgeries, ventricular septal defect repairs, and valve replacements at designated super-specialty hospitals like AIIMS Bhopal.',
    docs: ['Child Birth Certificate', 'Pediatric Cardiologist Clinical Report', 'Samagra Family ID', 'Parents MP Domicile Certificate'],
  },

  // ── 5. Housing & Urban ──────────────────────────────────────────────────────
  {
    id: 'awas_urban',
    name: 'PM Awas Yojana (Urban) - PMAY-U',
    category: 'housing',
    catLabel: 'Housing & Urban',
    dept: 'Urban Development & Housing Dept',
    benefit: 'Financial subsidy of ₹2.50 Lakhs for pucca house construction or purchase',
    eligibility: 'Urban homeless and EWS/LIG families residing in MP municipal limits',
    active: true,
    catColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    details: 'Enables urban poor families living in kutcha structures or informal settlements within Bhopal Municipal Corporation to build or acquire permanent pucca homes with water and power.',
    docs: ['Land Title / Patta / Municipal Registry', 'Aadhaar Card', 'Income Certificate', 'Municipal Ward Survey Slip'],
  },
  {
    id: 'bhu_adhikar',
    name: 'Mukhyamantri Bhu-Adhikar (Residential Plots) Yojana',
    category: 'housing',
    catLabel: 'Housing & Urban',
    dept: 'Urban Development & Housing Dept',
    benefit: 'Free 600 sq.ft residential land lease plot with permanent ownership rights',
    eligibility: 'Homeless and landless rural/peri-urban families residing in MP',
    active: true,
    catColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    details: 'Allots free government residential land plots with registered titles (Patta) to landless families so they can construct permanent homes under PMAY.',
    docs: ['Gram Panchayat Survey NOC', 'Samagra Family ID', 'Landless Self-Affidavit', 'Aadhaar Card'],
  },
  {
    id: 'pm_svanidhi',
    name: 'PM SVANidhi (Street Vendors AtmaNirbhar Nidhi)',
    category: 'housing',
    catLabel: 'Housing & Urban',
    dept: 'Urban Development & Housing Dept',
    benefit: 'Collateral-free working capital loan: ₹10,000 (1st), ₹20,000 (2nd), ₹50,000 (3rd)',
    eligibility: 'Urban street vendors and hawkers with municipal vending certificates',
    active: true,
    catColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    details: 'Enables street vendors and micro-traders in urban areas to obtain formal low-interest micro-credit with 7% annual interest subsidy and digital cashback bonuses.',
    docs: ['Vending Certificate / ID from Municipal Corp', 'Aadhaar Card', 'Bank Passbook', 'Active Mobile Number'],
  },

  // ── 6. Employment & Labor ───────────────────────────────────────────────────
  {
    id: 'sambal_yojana',
    name: 'Mukhyamantri Jan Kalyan (Sambal 2.0) Yojana',
    category: 'employment',
    catLabel: 'Employment & Labor',
    dept: 'Skill Development & Employment Dept',
    benefit: '₹2 Lakhs accidental cover, ₹16,000 maternity aid, and free college tuition',
    eligibility: 'All unorganized sector workers aged 18 to 60 years registered in MP',
    active: true,
    catColor: 'text-amber-700 bg-amber-50 border-amber-200',
    details: 'Comprehensive social security umbrella providing life cover, disability compensation, funeral assistance, and educational benefits for families of unorganized workers.',
    docs: ['Sambal Portal Registration Slip', 'Samagra Member ID', 'Aadhaar Card', 'Bank Passbook'],
  },
  {
    id: 'udyam_kranti',
    name: 'Mukhyamantri Udyam Kranti Yojana (MMUKY)',
    category: 'employment',
    catLabel: 'Employment & Labor',
    dept: 'Skill Development & Employment Dept',
    benefit: 'Collateral guarantee on enterprise loans ₹1 Lakh–₹50 Lakhs + 3% interest subsidy',
    eligibility: 'MP youth aged 18 to 40 years with minimum 8th class pass and enterprise plan',
    active: true,
    catColor: 'text-amber-700 bg-amber-50 border-amber-200',
    details: 'Encourages self-employment and micro-business establishment in manufacturing, services, and retail trading by covering loan security with the state credit guarantee fund.',
    docs: ['Detailed Project Report (DPR)', 'Educational Marksheet', 'MP Domicile Certificate', 'Aadhaar & PAN Card'],
  },
  {
    id: 'pmegp_scheme',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    category: 'employment',
    catLabel: 'Employment & Labor',
    dept: 'Skill Development & Employment Dept',
    benefit: 'Government capital subsidy up to 35% on project costs up to ₹50 Lakhs',
    eligibility: 'Any individual aged 18+ setting up a new micro-enterprise in MP',
    active: true,
    catColor: 'text-amber-700 bg-amber-50 border-amber-200',
    details: 'Credit-linked capital subsidy programme to generate non-farm micro-enterprises and direct employment opportunities in urban and rural regions.',
    docs: ['Project Proposal & Cost Estimate', 'Caste/Category Certificate (if applicable)', 'Aadhaar Card', 'EDP Skill Training Certificate'],
  },

  // ── 7. Social Security ──────────────────────────────────────────────────────
  {
    id: 'old_age_pension',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    category: 'social',
    catLabel: 'Social Security',
    dept: 'Social Justice & Disabled Welfare Dept',
    benefit: '₹600 per month direct financial pension credited directly via DBT',
    eligibility: 'Senior citizens aged 60 years and above belonging to BPL families in MP',
    active: true,
    catColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    details: 'Guarantees basic monthly sustenance and financial dignity to elderly citizens living below the poverty line without family support.',
    docs: ['Age Proof (Aadhaar / Voter ID)', 'BPL Ration Card', 'Samagra Member ID', 'Bank Account with DBT Active'],
  },
  {
    id: 'divyang_pension',
    name: 'MP Divyangjan Social Security Pension Scheme',
    category: 'social',
    catLabel: 'Social Security',
    dept: 'Social Justice & Disabled Welfare Dept',
    benefit: '₹600/month monthly pension + free assistive motorized tricycles & hearing aids',
    eligibility: 'Persons with 40% or more benchmark disability residing in Madhya Pradesh',
    active: true,
    catColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    details: 'Supports disabled persons through lifetime financial pensions and assistive rehabilitative equipment to foster independence and equal societal opportunity.',
    docs: ['UDID Card / Disability Certificate (≥40%)', 'Aadhaar Card', 'Samagra Member ID', 'Bank Passbook'],
  },
  {
    id: 'kalyani_sahayata',
    name: 'Mukhyamantri Kalyani Sahayata Yojana',
    category: 'social',
    catLabel: 'Social Security',
    dept: 'Social Justice & Disabled Welfare Dept',
    benefit: '₹600/mo lifetime pension + ₹2 Lakhs financial grant on remarriage',
    eligibility: 'Widowed women (Kalyani) aged 18 to 79 years who are permanent residents of MP',
    active: true,
    catColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    details: 'Provides steady financial security, social rehabilitation, and dignity for widowed women across all urban and rural districts of Madhya Pradesh.',
    docs: ['Husband Death Certificate', 'Age Proof (Aadhaar)', 'MP Domicile Certificate', 'Samagra Member ID', 'Bank Passbook'],
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

  // Dynamic Category Counts calculated from actual master data (Zero fake numbers)
  const categoryCounts = useMemo(() => {
    const counts = { all: SCHEMES_DATA.length };
    SCHEMES_DATA.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

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
          <p className="text-xs text-slate-500 font-medium mt-2">
            Explore authentic Madhya Pradesh citizen welfare schemes, direct benefit transfers &amp; eligibility requirements
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
          const count = categoryCounts[cat.id] || 0;
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
                <p className={`text-[9px] mt-1 leading-none ${isActive ? 'text-blue-200' : 'text-slate-500 font-mono font-medium'}`}>{count} Schemes</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── SEARCH & FILTER BAR ───────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
            {selectedCat === 'all' ? 'All Verified Schemes' : `${CATEGORIES.find(c => c.id === selectedCat)?.label || 'Category'} Schemes`}
          </h3>
          <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
            {filteredSchemes.length} Available
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
            <option value="Farmer Welfare">Agriculture &amp; Farmer Welfare</option>
            <option value="Higher Education">Higher Education</option>
            <option value="Women & Child">Women &amp; Child Development</option>
            <option value="Public Health">Public Health &amp; Welfare</option>
            <option value="Urban Development">Urban Development &amp; Housing</option>
            <option value="Skill Development">Skill Development &amp; Employment</option>
            <option value="Social Justice">Social Justice &amp; Disabled Welfare</option>
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
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none">
                  {scheme.dept}
                </p>
              </div>

              {/* Body */}
              <div className="px-5 py-3 flex-1 space-y-3 bg-slate-50/30 border-t border-b border-slate-100">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">BENEFIT</span>
                  <p className="text-[11px] font-bold text-slate-800 leading-normal">{scheme.benefit}</p>
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
              <p className="text-[11px] font-bold text-slate-800 leading-none">All welfare schemes are 100% transparent</p>
              <p className="text-[9px] text-slate-500 mt-1 leading-none">Direct Benefit Transfer (DBT) · No middlemen · Aadhaar authenticated</p>
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
              <p className="text-[11px] font-bold text-slate-800 leading-none">Track your active welfare applications</p>
              <p className="text-[9px] text-slate-500 mt-1 leading-none">Check status, verify DBT disbursement, and download sanction orders</p>
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
                <p className="text-[10px] text-slate-500 mt-0.5">{viewDetailsScheme.dept} · Official Guidelines</p>
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
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
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
                  placeholder="e.g. Applicant Full Name (as per Aadhaar)"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aadhaar Number *</label>
                  <input
                    required
                    pattern="[0-9]{12}"
                    placeholder="12 digit number"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Samagra Member ID *</label>
                  <input
                    required
                    placeholder="9 digit ID"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
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
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="farmers">Agriculture &amp; Farming</option>
                  <option value="education">Student / Education</option>
                  <option value="women">Women Welfare</option>
                  <option value="health">Family Health Insurance</option>
                  <option value="housing">Housing &amp; Settlement</option>
                  <option value="employment">Job Seekers &amp; Training</option>
                  <option value="social">Social Security &amp; Pensions</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Income</label>
                  <select
                    value={wizardForm.income}
                    onChange={e => setWizardForm(f => ({ ...f, income: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white"
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
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white"
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
