import React, { useEffect, useRef, useState } from 'react';

export default function Loader({ actualProgress = 100, loadStage = 'Initializing' }) {
  const loaderRef = useRef(null);
  const [displayedProgress, setDisplayedProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedProgress((prev) => {
        if (prev >= actualProgress) {
          return prev;
        }
        // Increment progress smoothly
        const next = prev + 1.25;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [actualProgress]);

  useEffect(() => {
    if (displayedProgress >= 100) {
      if (loaderRef.current) {
        loaderRef.current.classList.add('loader-exit');
        setTimeout(() => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none';
          }
        }, 750);
      }
    }
  }, [displayedProgress]);

  const waterLevel = 100 - displayedProgress;
  const wave1 = displayedProgress > 5 && displayedProgress < 95 ? 4 : 0;
  const wave2 = displayedProgress > 5 && displayedProgress < 95 ? -2 : 0;
  const clipPath = `polygon(0% ${waterLevel}%, 15% ${waterLevel + wave2}%, 30% ${waterLevel + wave1}%, 45% ${waterLevel + wave2}%, 60% ${waterLevel + wave1}%, 75% ${waterLevel + wave2}%, 100% ${waterLevel}%, 100% 100%, 0% 100%)`;

  return (
    <div id="unity-loader" ref={loaderRef}>
      <style>{`
        #unity-loader .loader-text::before,
        #unity-loader .loader-logo-fill-svg {
          clip-path: ${clipPath} !important;
          transition: clip-path 0.05s linear;
        }
      `}</style>
      <div className="loader-main">
        <h1 className="loader-text loader-left" data-text="UNI">UNI</h1>
        <div className="loader-logo-wrap">
          {/* Base Background Logo */}
          <svg className="loader-logo-bg-svg" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2"/>
            <polygon points="18,6 20.5,13.5 28.5,13.5 22,18.5 24.5,26 18,21 11.5,26 14,18.5 7.5,13.5 15.5,13.5" fill="rgba(255, 255, 255, 0.03)"/>
          </svg>
          {/* Filled Foreground Logo */}
          <svg className="loader-logo-fill-svg" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="var(--accent-gold)" strokeWidth="2"/>
            <polygon points="18,6 20.5,13.5 28.5,13.5 22,18.5 24.5,26 18,21 11.5,26 14,18.5 7.5,13.5 15.5,13.5" fill="var(--accent-gold)"/>
          </svg>
        </div>
        <h1 className="loader-text loader-right" data-text="TY">TY</h1>
      </div>
      <div className="loader-details">
        <div className="loader-title">UNITY</div>
        <div className="loader-subtitle">UNIFIED NETWORK FOR INTER-DEPARTMENTAL TRANSPARENCY AND YIELD</div>
        <div className="loader-tag">GOVERNMENT COORDINATION INTELLIGENCE PLATFORM</div>
        <div className="loader-status">
          <span className="loader-percentage">{Math.round(displayedProgress)}%</span>
          <span className="loader-stage-text">{loadStage}</span>
        </div>
      </div>
    </div>
  );
}
