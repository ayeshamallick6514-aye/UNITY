import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Sparkles, Send, Globe, ChevronRight } from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['ladli', 'behna', 'bahna', 'लाडली', 'बहना', '1250'],
    title: 'Mukhyamantri Ladli Behna Yojana',
    answer: 'Mukhyamantri Ladli Behna Yojana provides ₹1,250 per month direct financial assistance to married women aged 21 to 60 years in MP. Requirement: Active Samagra e-KYC, Aadhaar-linked DBT bank account, and family income under ₹2.5 Lakhs.',
    answerHi: 'मुख्यमंत्री लाडली बहना योजना के तहत 21 से 60 वर्ष की पात्र महिलाओं को प्रतिमाह ₹1,250 की आर्थिक सहायता सीधे बैंक खाते में दी जाती है। समग्र ई-केवाईसी और आधार लिंक बैंक खाता अनिवार्य है।',
    route: '/citizen/schemes'
  },
  {
    keywords: ['medhavi', 'chhatra', 'scholarship', 'मेधावी', 'छात्रवृत्ति', 'fees'],
    title: 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)',
    answer: 'MMVY provides 100% academic tuition fee waiver for higher education in premier institutions (IIT, NIT, Medical, Law) for MP students scoring 70%+ in MP Board or 85%+ in CBSE with family income below ₹6 Lakhs.',
    answerHi: 'मेधावी विद्यार्थी योजना में एमपी बोर्ड में 70% या सीबीएसई में 85% से अधिक अंक लाने वाले विद्यार्थियों की उच्च शिक्षा की पूरी फीस सरकार भरती है।',
    route: '/citizen/schemes'
  },
  {
    keywords: ['kisan', 'kalyan', 'farmer', 'किसान', 'कल्याण', 'khet', 'crop'],
    title: 'Mukhyamantri Kisan Kalyan Yojana (MKKY)',
    answer: 'MKKY provides ₹6,000 per year state cash assistance in addition to ₹6,000 from PM-Kisan, totaling ₹12,000 per year for verified MP farmers transferred directly into bank accounts via DBT.',
    answerHi: 'मुख्यमंत्री किसान कल्याण योजना के तहत पीएम-किसान के ₹6,000 के अलावा राज्य सरकार ₹6,000 अतिरिक्त देती है, यानी किसानों को कुल ₹12,000 प्रतिवर्ष मिलते हैं।',
    route: '/citizen/schemes'
  },
  {
    keywords: ['pothole', 'road', 'digging', 'गड्ढा', 'सड़क', 'excavation', 'pwd'],
    title: 'Civic & Road Grievance Reporting',
    answer: 'You can report broken roads, potholes, or uncoordinated digging directly on our portal. We use on-device Tesseract OCR to read signboards and live WebRTC camera with GPS watermarking to verify evidence.',
    answerHi: 'आप सड़क के गड्ढे या अवैध खुदाई की शिकायत हमारे पोर्टल पर लाइव फोटो और जीपीएस लोकेशन के साथ दर्ज कर सकते हैं।',
    route: '/citizen/report'
  },
  {
    keywords: ['hospital', 'bed', 'doctor', 'medicine', 'अस्पताल', 'दवा', 'jp', 'aiims'],
    title: 'Healthcare & Hospital Availability',
    answer: 'In Bhopal, AIIMS Bhopal, Hamidia Hospital, and JP District Hospital provide tertiary healthcare. Current ICU bed buffer is tracked live. You can report medicine stockouts or equipment breakdowns in our Healthcare domain form.',
    answerHi: 'भोपाल के जेपी अस्पताल, हमीदिया और एम्स में आईसीयू बेड और दवाओं की उपलब्धता की जानकारी और शिकायत आप स्वास्थ्य सेक्शन में दर्ज कर सकते हैं।',
    route: '/citizen/home'
  },
  {
    keywords: ['track', 'status', 'complaint', 'स्थिति', 'ट्रैक', 'शिकायत'],
    title: 'Universal Grievance Tracking',
    answer: 'To track your complaint or scheme status, enter your Reference ID (e.g., BPL-COM-88492 or HLTH-BPL-2026-8812) in our Universal 4-Stage Tracker (Filed → Assigned → Under Review → Resolved).',
    answerHi: 'अपनी शिकायत की स्थिति जानने के लिए अपना रेफरेंस नंबर हमारे यूनिवर्सल ट्रैकर में दर्ज करें।',
    route: '/citizen/track'
  },
  {
    keywords: ['helpline', 'emergency', 'help', 'मदद', 'हेल्पलाइन'],
    title: 'State Emergency Helplines',
    answer: 'Important Helplines for MP: CM Helpline: 181, Emergency Ambulance: 108, Police: 112, Women Helpline: 1090, Kisan Call Center: 1800-180-1551.',
    answerHi: 'मध्य प्रदेश महत्वपूर्ण हेल्पलाइन: सीएम हेल्पलाइन: 181, एम्बुलेंस: 108, पुलिस: 112, महिला हेल्पलाइन: 1090.',
    route: '/citizen/home'
  }
];

export default function CitizenVoiceBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your MP Citizen Voice Mitra. Ask me how to apply for schemes, report grievances, or track applications by voice or text.',
      textHi: 'नमस्ते! मैं आपका मध्य प्रदेश नागरिक वाणी मित्र हूँ। योजनाओं के आवेदन, शिकायत दर्ज करने या स्थिति जानने के लिए बोलें या लिखें।'
    }
  ]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserQuery(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Speech Synthesis Helper
  const speakText = (textToSpeak) => {
    if (!soundEnabled || !synthRef.current) return;
    synthRef.current.cancel(); // Cancel ongoing speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel();
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  const handleUserQuery = (userText) => {
    if (!userText.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setQuery('');

    // Process intent
    const lower = userText.toLowerCase();
    let matched = null;

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => lower.includes(k))) {
        matched = item;
        break;
      }
    }

    let botResponseText = '';
    let navRoute = null;

    if (matched) {
      botResponseText = language === 'hi' ? matched.answerHi : matched.answer;
      navRoute = matched.route;
    } else {
      botResponseText = language === 'hi'
        ? 'मैं आपकी बात समझ रहा हूँ। आप सड़क शिकायत, लाडली बहना, मेधावी छात्रवृत्ति या शिकायत ट्रैक करने के बारे में पूछ सकते हैं।'
        : 'I can assist you with MP government schemes (Ladli Behna, Medhavi Chhatra, Kisan Kalyan), reporting civic or health grievances, and complaint tracking. What would you like to do?';
    }

    newMessages.push({
      sender: 'bot',
      text: botResponseText,
      route: navRoute
    });

    setMessages(newMessages);
    speakText(botResponseText);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* ─── Floating Trigger Button ────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0B1B3D] text-white p-3.5 rounded-full shadow-2xl border-2 border-amber-400 hover:scale-105 transition-all flex items-center gap-2 group"
        title="Open MP Citizen Voice Mitra"
      >
        <div className="relative">
          <Mic size={20} className="text-amber-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
        </div>
        <span className="hidden sm:inline text-xs font-black tracking-wider uppercase pr-1 text-slate-100">
          Voice Mitra
        </span>
      </button>

      {/* ─── Voice Bot Interactive Modal ────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col animate-fade-in text-slate-900 font-sans" style={{ maxHeight: '560px' }}>
          
          {/* Header */}
          <div className="bg-[#0B1B3D] text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <span>MP Citizen Voice Mitra</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">AI Active</span>
                </h3>
                <p className="text-[10px] text-slate-300">GovTech Speech &amp; Scheme Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                className="text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 hover:bg-white/10 text-amber-300 transition-colors"
                title="Toggle English / Hindi"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setSoundEnabled(!soundEnabled);
                }}
                className="text-slate-300 hover:text-white p-1"
                title={soundEnabled ? "Mute audio" : "Enable audio"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopSpeaking();
                  if (isListening && recognitionRef.current) recognitionRef.current.stop();
                  setIsOpen(false);
                }}
                className="text-slate-300 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs" style={{ minHeight: '260px', maxHeight: '340px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p>{language === 'hi' && m.textHi ? m.textHi : m.text}</p>
                  {m.route && (
                    <button
                      onClick={() => {
                        navigate(m.route);
                        setIsOpen(false);
                      }}
                      className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded transition-colors"
                    >
                      <span>Open Page</span>
                      <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isListening && (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span>Listening... Please speak now / बोलिए...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar">
            {[
              { label: 'लाडली बहना योजना', query: 'लाडली बहना योजना' },
              { label: 'Medhavi Scheme', query: 'How to apply for Medhavi scholarship?' },
              { label: 'Report Pothole', query: 'How to report a broken road?' },
              { label: 'Track Complaint', query: 'Track my complaint status' },
              { label: 'Helpline 181', query: 'What is CM helpline number?' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleUserQuery(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-[10px] font-semibold text-slate-700 rounded-full border border-slate-200 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Voice Input & Text Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-full transition-all shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white animate-bounce'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
              }`}
              title={isListening ? "Stop listening" : "Click to speak"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserQuery(query);
              }}
              className="flex-1 flex items-center gap-1.5"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'hi' ? 'यहाँ लिखें या माइक दबाएं...' : 'Type or tap mic to speak...'}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="p-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white rounded-lg transition-colors shrink-0"
              >
                <Send size={13} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
