import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, ArrowLeft, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Question tree ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'occupation',
    label: 'What is your primary occupation?',
    options: [
      { value: 'farmer',   label: 'Farmer / Agriculture' },
      { value: 'student',  label: 'Student / Scholar' },
      { value: 'employed', label: 'Employed / Salaried' },
      { value: 'women',    label: 'Homemaker / Self-employed Woman' },
      { value: 'labourer', label: 'Daily Wage Labourer' },
    ],
  },
  {
    id: 'income',
    label: 'What is your approximate annual household income?',
    options: [
      { value: 'below1l',   label: 'Below ₹1 Lakh' },
      { value: '1l_2.5l',  label: '₹1 Lakh – ₹2.5 Lakh' },
      { value: '2.5l_5l',  label: '₹2.5 Lakh – ₹5 Lakh' },
      { value: 'above5l',  label: 'Above ₹5 Lakh' },
    ],
  },
  {
    id: 'residence',
    label: 'Where do you reside?',
    options: [
      { value: 'rural',  label: 'Rural / Village / Gram Panchayat' },
      { value: 'urban',  label: 'Urban / Municipality / City' },
    ],
  },
  {
    id: 'aadhaar',
    label: 'Do you have an Aadhaar-linked bank account?',
    options: [
      { value: 'yes', label: 'Yes — Aadhaar-linked DBT enabled' },
      { value: 'no',  label: 'No — Not yet linked' },
    ],
  },
];

// ─── Recommendation engine ────────────────────────────────────────────────────
function getRecommendations(answers) {
  const recs = [];
  const { occupation, income, residence, aadhaar } = answers;

  if (occupation === 'farmer') {
    if (aadhaar === 'yes') {
      recs.push({
        name: 'PM Kisan Samman Nidhi Yojana',
        benefit: '₹6,000/year direct transfer (3 × ₹2,000)',
        matchPct: 97,
        color: 'emerald',
      });
      recs.push({
        name: 'Mukhyamantri Kisan Kalyan Yojana (MKKY)',
        benefit: '₹6,000/year additional state top-up',
        matchPct: 95,
        color: 'emerald',
      });
    }
    recs.push({
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      benefit: 'Crop insurance against drought, flood & pests',
      matchPct: 90,
      color: 'emerald',
    });
  }

  if (occupation === 'student') {
    if (income === 'below1l' || income === '1l_2.5l') {
      recs.push({
        name: 'Mukhyamantri Medhavi Vidyarthi Yojana',
        benefit: 'Full tuition waiver for 12th board ≥70% (CBSE ≥85%)',
        matchPct: 94,
        color: 'blue',
      });
    }
    recs.push({
      name: 'MP Scholarship Portal 2.0 (State Scholarship)',
      benefit: 'OBC/SC/ST pre-matric & post-matric scholarships',
      matchPct: 88,
      color: 'blue',
    });
  }

  if (occupation === 'women') {
    recs.push({
      name: 'Ladli Behna Yojana',
      benefit: '₹1,250/month direct transfer to eligible women',
      matchPct: 96,
      color: 'purple',
    });
    if (residence === 'rural') {
      recs.push({
        name: 'PM Ujjwala Yojana (PMUY)',
        benefit: 'Free LPG connection for BPL households',
        matchPct: 85,
        color: 'purple',
      });
    }
  }

  if (occupation === 'labourer' || income === 'below1l') {
    recs.push({
      name: 'Ayushman Bharat – PM-JAY',
      benefit: '₹5 Lakh/year health coverage per family',
      matchPct: 92,
      color: 'rose',
    });
    if (residence === 'rural') {
      recs.push({
        name: 'MGNREGA (Mahatma Gandhi NREGA)',
        benefit: '100 days guaranteed wage employment',
        matchPct: 89,
        color: 'amber',
      });
    }
  }

  if (residence === 'rural' && income === 'below1l') {
    recs.push({
      name: 'PM Awas Yojana – Gramin (PMAY-G)',
      benefit: 'Housing assistance up to ₹1.2 Lakh for BPL families',
      matchPct: 87,
      color: 'cyan',
    });
  }

  if (aadhaar === 'no') {
    recs.push({
      name: 'Aadhaar Seeding Camp — Bhopal Municipal Corporation',
      benefit: 'Link Aadhaar to bank account to access all DBT schemes',
      matchPct: 99,
      color: 'slate',
      isAction: true,
    });
  }

  // Always include Ayushman if not already
  if (!recs.find(r => r.name.includes('Ayushman')) && income !== 'above5l') {
    recs.push({
      name: 'Ayushman Bharat – PM-JAY',
      benefit: '₹5 Lakh/year health coverage per family',
      matchPct: 78,
      color: 'rose',
    });
  }

  return recs.sort((a, b) => b.matchPct - a.matchPct).slice(0, 5);
}

const COLOR_MAP = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  blue:    'bg-blue-50 border-blue-200 text-blue-700',
  purple:  'bg-purple-50 border-purple-200 text-purple-700',
  rose:    'bg-rose-50 border-rose-200 text-rose-700',
  amber:   'bg-amber-50 border-amber-200 text-amber-700',
  cyan:    'bg-cyan-50 border-cyan-200 text-cyan-700',
  slate:   'bg-slate-100 border-slate-300 text-slate-700',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SchemeEligibilityQuiz({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]       = useState(false);
  const [recs, setRecs]       = useState([]);

  function handleSelect(qId, value) {
    const updated = { ...answers, [qId]: value };
    setAnswers(updated);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Last question answered
      setRecs(getRecommendations(updated));
      setDone(true);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleViewSchemes() {
    onClose();
    navigate('/citizen/schemes');
  }

  const q = QUESTIONS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 shadow-2xl w-full max-w-md rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-[#0B1B3D] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Landmark size={15} className="text-amber-400" />
            <span className="text-[11px] font-black text-white uppercase tracking-widest">
              Scheme Eligibility Finder
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {!done ? (
          <>
            {/* Progress bar */}
            <div className="h-1 bg-slate-100">
              <div
                className="h-full bg-[#0B1B3D] transition-all duration-300"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="px-5 pt-5 pb-2">
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{q.label}</h3>
            </div>

            {/* Options */}
            <div className="px-5 pb-4 space-y-2">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(q.id, opt.value)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 hover:border-[#0B1B3D] hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-all text-left"
                >
                  <span>{opt.label}</span>
                  <ChevronRight size={13} className="text-slate-300 shrink-0" />
                </button>
              ))}
            </div>

            {/* Back */}
            {step > 0 && (
              <div className="px-5 pb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-700 transition-colors font-bold uppercase tracking-wider"
                >
                  <ArrowLeft size={11} /> Back
                </button>
              </div>
            )}
          </>
        ) : (
          /* Results */
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              <h3 className="text-sm font-black text-slate-900">
                {recs.length} Schemes Match Your Profile
              </h3>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recs.map((rec, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${COLOR_MAP[rec.color] || COLOR_MAP.slate}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-black leading-snug">{rec.name}</p>
                    <span className="text-[9px] font-black shrink-0 bg-white/60 border border-current px-1.5 py-0.5 rounded">
                      {rec.matchPct}%
                    </span>
                  </div>
                  <p className="text-[10px] mt-0.5 opacity-80 font-medium">{rec.benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleViewSchemes}
                className="flex-1 px-4 py-2.5 bg-[#0B1B3D] text-white text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#162444] transition-colors"
              >
                View All Schemes
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider rounded hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
