import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import heroBg from '../../assets/bhopal_hero.png';
import UnityLogo from './UnityLogo';

// Bhopal Smart City GIS Coordinates for Nodes
const GIS_NODES = [
  { id: 'pwd',       name: 'PWD Division',       x: 25, y: 40 },
  { id: 'revenue',   name: 'Collectorate HQ',    x: 45, y: 35 },
  { id: 'energy',    name: 'MPEB Kolar Grid',    x: 60, y: 65 },
  { id: 'water',     name: 'Bhadbhada Water',    x: 35, y: 55 },
  { id: 'transport', name: 'Traffic Operations', x: 75, y: 45 },
];

const CONNECTION_PATHS = [
  { from: 'pwd',       to: 'revenue' },
  { from: 'revenue',   to: 'energy'  },
  { from: 'energy',    to: 'water'   },
  { from: 'water',     to: 'transport'},
  { from: 'transport', to: 'pwd'     },
];

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        // Add varying increments to simulate real computation steps
        let increment = 1;
        if (currentProgress === 30 || currentProgress === 60 || currentProgress === 85) {
          // Pause slightly at key check gates
          increment = 0;
          setTimeout(() => {
            currentProgress += 1;
            setProgress(currentProgress);
          }, 150);
        } else {
          currentProgress += increment;
          setProgress(currentProgress);
        }
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Determine active log message based on progress percentage
  let statusMessage = 'Authenticating Credentials...';
  if (progress >= 15 && progress < 30) {
    statusMessage = 'Loading Mission Registry...';
  } else if (progress >= 30 && progress < 45) {
    statusMessage = 'Synchronizing Department Graph...';
  } else if (progress >= 45 && progress < 60) {
    statusMessage = 'Calculating CRI...';
  } else if (progress >= 60 && progress < 75) {
    statusMessage = 'Initializing Sentinel Engine...';
  } else if (progress >= 75 && progress < 90) {
    statusMessage = 'Connecting GIS Services...';
  } else if (progress >= 90 && progress < 100) {
    statusMessage = 'Preparing Operational Intelligence Map...';
  } else if (progress === 100) {
    statusMessage = 'SYSTEM READY';
  }

  // Letter by letter animations for UNITY
  const showU = progress >= 15;
  const showN = progress >= 20;
  const showI = progress >= 25;
  const showT = progress >= 30;
  const showY = progress >= 35;
  const showSubtitle = progress >= 40;

  // GIS graphics trigger stages
  const showNodes = progress >= 48;
  const drawLines = progress >= 62;

  return (
    <div
      className="fixed inset-0 bg-slate-950 flex flex-col justify-between p-8 md:p-12 z-50 overflow-hidden font-sans select-none text-slate-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Scope CSS for drawing lines */}
      <style>{`
        @keyframes drawStroke {
          to {
            stroke-dashoffset: 0;
          }
        }
        .gis-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawStroke 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .pulse-soft {
          animation: pulseSoft 2s infinite ease-in-out;
        }
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0.8; }
        }
      `}</style>

      {/* Dark Navy Overlay */}
      <div className="absolute inset-0 bg-[#070b13]/85 z-0 pointer-events-none" />

      {/* ── GIS LAYERS OVERLAY (Smart City Infrastructure Nodes & Vectors) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* Nodes */}
        {showNodes && GIS_NODES.map((node, idx) => (
          <div
            key={node.id}
            className="absolute transition-opacity duration-700 ease-out"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: progress >= 48 + idx * 3 ? 1 : 0
            }}
          >
            {/* Outer Pulsing Ring */}
            <div className="absolute w-6 h-6 -left-3 -top-3 rounded-full bg-blue-500/20 border border-blue-400/40 pulse-soft" />
            
            {/* Core Node Marker */}
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full border border-white shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            
            {/* Label */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
              {node.name}
            </span>
          </div>
        ))}

        {/* Connections */}
        {drawLines && (
          <svg className="w-full h-full absolute inset-0">
            {CONNECTION_PATHS.map((path, idx) => {
              const fromNode = GIS_NODES.find(n => n.id === path.from);
              const toNode = GIS_NODES.find(n => n.id === path.to);
              if (!fromNode || !toNode) return null;
              
              return (
                <line
                  key={idx}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="rgba(96, 165, 250, 0.4)"
                  strokeWidth="1"
                  className="gis-line"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-20 animate-fade-in">
        <div className="flex items-center gap-3">
          {/* Emblem Icon */}
          <UnityLogo size={36} />
          <div>
            <h2 className="text-[11px] font-black tracking-widest text-slate-300 uppercase leading-none">
              Government of Madhya Pradesh
            </h2>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 leading-none">
              Department of Information Technology
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onComplete}
            className="text-[9px] font-mono font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 px-2.5 py-1 rounded uppercase tracking-wider transition-colors cursor-pointer"
          >
            Skip Intro →
          </button>
          <span className="hidden sm:inline-block text-[9px] font-mono font-bold bg-blue-950/60 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded uppercase tracking-wider">
            Node Gateway
          </span>
        </div>
      </div>

      {/* ── CENTRAL BRANDING & LOADER ────────────────────────────────────────── */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 relative z-20">
        
        {/* Core System Identifier */}
        <div className="text-center space-y-3">
          {/* Letter by Letter UNITY Group */}
          <div className="flex items-center justify-center gap-1.5 font-sans font-black text-6xl tracking-tight text-white select-none">
            <span className={`transition-all duration-300 transform ${showU ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>U</span>
            <span className={`transition-all duration-300 transform ${showN ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>N</span>
            <span className={`transition-all duration-300 transform ${showI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>I</span>
            <span className={`transition-all duration-300 transform ${showT ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>T</span>
            <span className={`transition-all duration-300 transform ${showY ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>Y</span>
          </div>

          <p className={`text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed transition-all duration-700 ${showSubtitle ? 'opacity-100' : 'opacity-0'}`}>
            Unified Network for Interdepartmental Transparency &amp; Yield
          </p>
        </div>

        {/* Loading Bar & Logs Area */}
        <div className="w-full space-y-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 shadow-2xl backdrop-blur-md">
          
          {/* Progress Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span>System Initialization</span>
              <span className="font-mono text-blue-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Active Process Log */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
            <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">
              {statusMessage}
            </span>
          </div>

        </div>

      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-t border-slate-800/80 pt-4 relative z-20 text-[9px] text-slate-500 font-mono uppercase tracking-widest">
        <div>
          <span>Bhopal District command segment</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SECURED CONNECT v2.5</span>
        </div>
      </div>

    </div>
  );
}
