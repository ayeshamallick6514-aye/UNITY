import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, X, Play, Square, Shield, Radio } from 'lucide-react';

const EXECUTIVE_BRIEF_SCRIPT_EN = 
  "Good morning, Commissioner. Here is your daily municipal executive briefing for Bhopal. " +
  "Currently, 3 major civil works projects are active in Zone 1. " +
  "The AI Geospatial Buffer Engine has detected 2 spatial-temporal overlaps between MP Jal Nigam and PWD excavation on Kolar Road Corridor. " +
  "48 citizen grievances were successfully resolved under the 48-hour SLA window. " +
  "Live weather telemetry reports optimal operational conditions at 31 degrees Celsius. " +
  "Zero critical security breaches. Nodal conflict resolution gate is active.";

const EXECUTIVE_BRIEF_SCRIPT_HI = 
  "नमस्कार कमिश्नर महोदय। यह भोपाल के लिए आपका दैनिक प्रशासनिक एवं अवसंरचना ब्रीफिंग है। " +
  "वर्तमान में जोन 1 में 3 प्रमुख निर्माण परियोजनाएं चल रही हैं। " +
  "कोलार रोड कॉरिडोर पर एमपी जल निगम और पीडब्ल्यूडी खुदाई के बीच समय और स्थान का टकराव दर्ज हुआ है। " +
  "48 नागरिक शिकायतों का 48 घंटे के भीतर त्वरित समाधान किया गया है। " +
  "लाइव मौसम टेलीमेट्री भोपाल में 31 डिग्री पर अनुकूल कार्य स्थिति रिपोर्ट कर रही है। सभी नोडल सुरक्षा द्वार सक्रिय हैं।";

export default function AuthorityVoiceBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('hi'); // Default to Hindi as requested
  const [voices, setVoices] = useState([]);
  
  const [statusLog, setStatusLog] = useState([
    'नोडल वॉइस कोपायलट तैयार है। "दैनिक ब्रीफिंग सुनें" दबाएं या बोलकर कमांड दें।'
  ]);

  const recognitionRef = useRef(null);
  const activeUtteranceRef = useRef(null);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const v = window.speechSynthesis.getVoices() || [];
      if (v.length > 0) {
        setVoices(v);
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Initialize Speech Recognition for Authority Commands
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
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Voice selector: identifies genuine native Hindi voice
  const isNativeHindiVoice = (v) => {
    if (!v) return false;
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return l.startsWith('hi') || n.includes('hindi') || n.includes('हिन्दी');
  };

  const getBestVoice = (targetLang) => {
    const available = window.speechSynthesis?.getVoices() || voices || [];
    if (!available || available.length === 0) return null;

    if (targetLang === 'hi') {
      return available.find(isNativeHindiVoice) || null;
    } else {
      return available.find(v => v.lang.toLowerCase() === 'en-in') ||
             available.find(v => v.lang.toLowerCase().startsWith('en')) ||
             available[0] || null;
    }
  };

  // Robust Speech Output with audible fallback
  const speakText = (text, targetLang = language, fallbackEnglishText = '') => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!text || !text.trim()) return;

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const availableVoices = window.speechSynthesis.getVoices() || voices || [];
      const hindiVoice = availableVoices.find(isNativeHindiVoice);
      
      let finalSpeechText = text;
      let finalLang = targetLang === 'hi' ? 'hi-IN' : 'en-IN';
      let selectedVoice = null;

      if (targetLang === 'hi') {
        if (hindiVoice) {
          selectedVoice = hindiVoice;
          finalLang = 'hi-IN';
          finalSpeechText = text;
        } else {
          // Native Hindi TTS pack missing on OS; speak English text so audio is crystal clear
          const englishVoice = availableVoices.find(v => v.lang.toLowerCase() === 'en-in') ||
                               availableVoices.find(v => v.lang.toLowerCase().startsWith('en')) ||
                               availableVoices[0] || null;
          selectedVoice = englishVoice;
          finalLang = 'en-IN';
          finalSpeechText = fallbackEnglishText || text;
          setStatusLog(prev => [...prev, '💡 सिस्टम पर हिंदी TTS पैक नहीं मिला - अंग्रेजी ऑडियो सुनाया जा रहा है।']);
        }
      } else {
        selectedVoice = availableVoices.find(v => v.lang.toLowerCase() === 'en-in') ||
                        availableVoices.find(v => v.lang.toLowerCase().startsWith('en')) ||
                        availableVoices[0] || null;
        finalLang = 'en-IN';
        finalSpeechText = text;
      }

      const utterance = new SpeechSynthesisUtterance(finalSpeechText);
      utterance.lang = finalLang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Authority VoiceBot TTS event:', e.error);
        }
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };

      activeUtteranceRef.current = utterance;
      window._activeAuthorityUtterance = utterance;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS execution error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      activeUtteranceRef.current = null;
    }
  };

  const playExecutiveBrief = () => {
    const briefText = language === 'hi' ? EXECUTIVE_BRIEF_SCRIPT_HI : EXECUTIVE_BRIEF_SCRIPT_EN;
    const label = language === 'hi' ? '▶ दैनिक प्रशासनिक एवं अवसंरचना ब्रीफिंग चल रही है...' : '▶ Playing daily municipal executive briefing...';
    setStatusLog(prev => [...prev, label]);
    speakText(briefText, language, EXECUTIVE_BRIEF_SCRIPT_EN);
  };

  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();
    setStatusLog(prev => [...prev, `🎤 ${language === 'hi' ? 'कमांड सुनी गई' : 'Command heard'}: "${command}"`]);

    if (cmd.includes('brief') || cmd.includes('morning') || cmd.includes('ब्रीफ') || cmd.includes('संक्षिप्त') || cmd.includes('रिपोर्ट')) {
      playExecutiveBrief();
    } else if (cmd.includes('conflict') || cmd.includes('overlap') || cmd.includes('coordination') || cmd.includes('टकराव') || cmd.includes('विवाद') || cmd.includes('समन्वय')) {
      const reply = language === 'hi'
        ? "अंतर-विभागीय समन्वय और सी-लॉक मैट्रिक्स खोल रहे हैं।"
        : "Navigating to Inter-Agency Coordination Matrix.";
      const replyEn = "Navigating to Inter-Agency Coordination Matrix.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply, language, replyEn);
      navigate('/authority/coordination');
    } else if (cmd.includes('map') || cmd.includes('geospatial') || cmd.includes('gis') || cmd.includes('नक्शा') || cmd.includes('मैप')) {
      const reply = language === 'hi'
        ? "भोपाल का लाइव परिचालन समन्वय मानचित्र खोला जा रहा है।"
        : "Opening Operational Coordination Map for Bhopal.";
      const replyEn = "Opening Operational Coordination Map for Bhopal.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply, language, replyEn);
      navigate('/authority/map');
    } else if (cmd.includes('approval') || cmd.includes('clearance') || cmd.includes('noc') || cmd.includes('मंजूरी') || cmd.includes('एनओसी') || cmd.includes('अनुमोदन')) {
      const reply = language === 'hi'
        ? "डिजिटल एनओसी एवं क्लीयरेंस कंसोल खोला जा रहा है।"
        : "Opening Clearance and Digital NOC Console.";
      const replyEn = "Opening Clearance and Digital NOC Console.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply, language, replyEn);
      navigate('/authority/approvals');
    } else if (cmd.includes('project') || cmd.includes('mission') || cmd.includes('परियोजना') || cmd.includes('प्रोजेक्ट')) {
      const reply = language === 'hi'
        ? "मिशन कंट्रोल वर्कस्पेस खोला जा रहा है।"
        : "Opening Mission Workspace.";
      const replyEn = "Opening Mission Workspace.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply, language, replyEn);
      navigate('/authority/projects');
    } else {
      const reply = language === 'hi'
        ? "कमांड दर्ज हुई। आप कह सकते हैं: 'ब्रीफिंग सुनाएं', 'टकराव दिखाएं', 'मैप खोलें' या 'मंजूरी दिखाएं'।"
        : "Command logged. You can say: 'Play brief', 'Show conflicts', 'Open map', or 'Show approvals'.";
      const replyEn = "Command logged. You can say: 'Play brief', 'Show conflicts', 'Open map', or 'Show approvals'.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply, language, replyEn);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi'
        ? 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।'
        : 'Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      try {
        recognitionRef.current.start();
      } catch (_) {}
    }
  };

  return (
    <>
      {/* ─── Floating Trigger Button ────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0B1B3D] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-cyan-400 hover:border-cyan-300 hover:scale-105 transition-all flex items-center gap-2.5 group"
        title="Nodal Command Voice Copilot (आवाज कोपायलट)"
      >
        <div className="relative">
          <Radio size={16} className="text-cyan-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-100 font-mono">
          {language === 'hi' ? 'आवाज कोपायलट' : 'Voice Copilot'}
        </span>
      </button>

      {/* ─── Voice Copilot Modal ────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col animate-fade-in font-sans">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Shield size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
                  <span>{language === 'hi' ? 'नोडल आवाज कोपायलट' : 'Nodal Voice Copilot'}</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">COMMAND_AI</span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  {language === 'hi' ? 'दैनिक ब्रीफिंग व आवाज संचालन' : 'Voice Navigation & Executive Briefing'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                onClick={() => {
                  stopSpeaking();
                  const newLang = language === 'en' ? 'hi' : 'en';
                  setLanguage(newLang);
                  const sample = newLang === 'hi' ? 'कमांड कोपायलट सक्रिय है। बोलिए।' : 'Command Copilot active.';
                  speakText(sample, newLang);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors"
                title="Change language / भाषा बदलें"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>

              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setSoundEnabled(!soundEnabled);
                }}
                className="text-slate-400 hover:text-white p-1"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  if (isListening && recognitionRef.current) recognitionRef.current.stop();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Action: Morning Briefing Player */}
          <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                {language === 'hi' ? 'दैनिक ऑडियो ब्रीफिंग' : 'EXECUTIVE AUDIO BRIEF'}
              </span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                {language === 'hi' ? 'अवसंरचना समन्वय एवं मौसम रिपोर्ट' : "Today's Road Coordination & Weather"}
              </p>
            </div>

            <button
              onClick={isSpeaking ? stopSpeaking : playExecutiveBrief}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                isSpeaking
                  ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square size={12} fill="white" />
                  <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="white" />
                  <span>{language === 'hi' ? 'ब्रीफिंग सुनें' : 'Play Brief'}</span>
                </>
              )}
            </button>
          </div>

          {/* Event Log Console */}
          <div className="p-4 font-mono text-[11px] text-slate-300 space-y-2 overflow-y-auto bg-slate-950/70" style={{ maxHeight: '200px', minHeight: '130px' }}>
            {statusLog.map((log, i) => (
              <div key={i} className="leading-relaxed border-l-2 border-cyan-500/40 pl-2 text-slate-300">
                {log}
              </div>
            ))}
            {isListening && (
              <div className="flex items-center gap-2 text-cyan-400 font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>
                  {language === 'hi' ? 'कमांड सुन रहा हूँ... बोलिए (जैसे "टकराव दिखाएं", "मैप खोलें")...' : "Listening for Command... (e.g. 'Show conflicts', 'Open map')"}
                </span>
              </div>
            )}
          </div>

          {/* Voice Input & Command Prompts */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'शॉर्टकट:' : 'Voice Shortcuts:'}
              </span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {(language === 'hi'
                  ? ['ब्रीफिंग सुनाएं', 'टकराव दिखाएं', 'मैप खोलें', 'मंजूरी दिखाएं']
                  : ['Show Conflicts', 'Open Map', 'Approvals', 'Projects']
                ).map((txt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVoiceCommand(txt)}
                    className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={toggleListening}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              <span>
                {isListening
                  ? (language === 'hi' ? 'सुन रहा हूँ... रोकने के लिए टैप करें' : 'Listening... Tap to Cancel')
                  : (language === 'hi' ? 'माइक दबाकर बोलें (Voice Command)' : 'Speak Voice Command')}
              </span>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
