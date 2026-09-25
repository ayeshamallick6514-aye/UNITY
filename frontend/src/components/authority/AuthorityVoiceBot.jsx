import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, X, Play, Square, Shield, Radio, Sparkles } from 'lucide-react';

const EXECUTIVE_BRIEF_SCRIPT = 
  "Good morning, Commissioner. Here is your daily municipal executive briefing for Bhopal. " +
  "Currently, 3 major civil works projects are active in Zone 1. " +
  "The AI Geospatial Buffer Engine has detected 2 spatial-temporal overlaps between MP Jal Nigam and PWD excavation on Kolar Road Corridor. " +
  "48 citizen grievances were successfully resolved under the 48-hour SLA window. " +
  "Live weather telemetry reports optimal operational conditions at 31 degrees Celsius. " +
  "Zero critical security breaches. Nodal conflict resolution gate is active.";

export default function AuthorityVoiceBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statusLog, setStatusLog] = useState([
    'Nodal Voice Copilot initialized. Tap "Play Morning Brief" or use voice commands.'
  ]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text) => {
    if (!soundEnabled || !synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const playExecutiveBrief = () => {
    setStatusLog(prev => [...prev, '▶ Playing daily municipal executive briefing...']);
    speakText(EXECUTIVE_BRIEF_SCRIPT);
  };

  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();
    setStatusLog(prev => [...prev, `🎤 Command heard: "${command}"`]);

    if (cmd.includes('brief') || cmd.includes('morning')) {
      playExecutiveBrief();
    } else if (cmd.includes('conflict') || cmd.includes('overlap') || cmd.includes('coordination')) {
      const reply = "Navigating to Inter-Agency Coordination Matrix.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply);
      navigate('/authority/coordination');
    } else if (cmd.includes('map') || cmd.includes('geospatial') || cmd.includes('gis')) {
      const reply = "Opening Operational Coordination Map for Bhopal.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply);
      navigate('/authority/map');
    } else if (cmd.includes('approval') || cmd.includes('clearance') || cmd.includes('noc')) {
      const reply = "Opening Clearance and Digital NOC Console.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply);
      navigate('/authority/approvals');
    } else if (cmd.includes('project') || cmd.includes('mission')) {
      const reply = "Opening Mission Workspace.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply);
      navigate('/authority/projects');
    } else if (cmd.includes('health') || cmd.includes('status')) {
      const reply = "All municipal telemetry services, Tesseract OCR, and Leaflet spatial buffers are running at 100% operational readiness.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply);
    } else {
      const reply = "Command logged. You can say: 'Play brief', 'Show conflicts', 'Open map', or 'Show approvals'.";
      setStatusLog(prev => [...prev, `🤖 ${reply}`]);
      speakText(reply);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  return (
    <>
      {/* ─── Floating Trigger Button ────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0B1B3D] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-cyan-400 hover:border-cyan-300 hover:scale-105 transition-all flex items-center gap-2.5 group"
        title="Nodal Command Voice Copilot"
      >
        <div className="relative">
          <Radio size={16} className="text-cyan-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-100 font-mono">
          Voice Copilot
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
                  <span>Nodal Voice Copilot</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">COMMAND_AI</span>
                </h3>
                <p className="text-[10px] text-slate-400">Voice Navigation &amp; Executive Briefing</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">EXECUTIVE AUDIO BRIEF</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Today's Road Coordination &amp; Weather</p>
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
                  <span>Stop Brief</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="white" />
                  <span>Play Brief</span>
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
                <span>Listening for Command... (e.g., 'Show conflicts', 'Open map')</span>
              </div>
            )}
          </div>

          {/* Voice Input & Command Prompts */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Voice Shortcuts:</span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {['Show Conflicts', 'Open Map', 'Approvals'].map((txt, idx) => (
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
              <span>{isListening ? 'Listening... Tap to Cancel' : 'Speak Voice Command'}</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
