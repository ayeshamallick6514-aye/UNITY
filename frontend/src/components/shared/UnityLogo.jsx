export default function UnityLogo({ size = 32, className = '', flat = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      <defs>
        {/* Blue/Cyan gradient for the left arm */}
        <linearGradient id="unityLeftArm" x1="20" y1="20" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0052D4" />
          <stop offset="50%" stopColor="#4364F7" />
          <stop offset="100%" stopColor="#6FB1FC" />
        </linearGradient>

        {/* Green/Emerald gradient for the right arm */}
        <linearGradient id="unityRightArm" x1="100" y1="20" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="60%" stopColor="#00B0FF" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>

        {/* Subtle drop shadow for building to float nicely */}
        <filter id="unityShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#08101d" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer App-Icon Container (styled like the iOS app icon in the photo) */}
      {!flat && <rect width="120" height="120" rx="26" fill="#0c1d37" />}

      {/* Central Government Dome & Assembly Palace (Vidhan Sabha dome) */}
      <g filter="url(#unityShadow)">
        {/* Main Dome */}
        <path
          d="M 60 36 A 14 14 0 0 1 74 50 L 46 50 A 14 14 0 0 1 60 36 Z"
          fill="#e2e8f0"
          stroke="#475569"
          strokeWidth="1.5"
        />
        {/* Top small dome pill */}
        <path d="M 57 36 L 63 36 L 63 34 L 57 34 Z" fill="#94a3b8" />
        <circle cx="60" cy="32" r="2.5" fill="#f8fafc" />

        {/* Flag Pole and waving flag */}
        <line x1="60" y1="30" x2="60" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
        <path d="M 60 20 L 72 23 L 60 26 Z" fill="#38bdf8" />

        {/* Main Building Base (Front facade with pillars) */}
        <rect x="42" y="50" width="36" height="18" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        
        {/* Portico Entrance */}
        <rect x="52" y="56" width="16" height="12" rx="1" fill="#f1f5f9" stroke="#475569" strokeWidth="1" />
        {/* Pillars */}
        <line x1="47" y1="50" x2="47" y2="68" stroke="#475569" strokeWidth="1" />
        <line x1="73" y1="50" x2="73" y2="68" stroke="#475569" strokeWidth="1" />
        
        {/* Small side minarets/domes */}
        <rect x="37" y="54" width="5" height="14" rx="1" fill="#94a3b8" />
        <path d="M 37 54 A 2.5 2.5 0 0 1 42 54 Z" fill="#e2e8f0" />
        <rect x="78" y="54" width="5" height="14" rx="1" fill="#94a3b8" />
        <path d="M 78 54 A 2.5 2.5 0 0 1 83 54 Z" fill="#e2e8f0" />
      </g>

      {/* Left arm/hand (Blue gradient) wrapping around */}
      <path
        d="M 22 25
           C 22 25, 20 62, 35 78
           C 50 94, 60 96, 60 96
           L 60 88
           C 60 88, 52 86, 42 74
           C 32 62, 32 25, 32 25
           Z"
        fill="url(#unityLeftArm)"
      />

      {/* Right arm/hand (Green gradient) wrapping around */}
      <path
        d="M 98 25
           C 98 25, 100 62, 85 78
           C 70 94, 60 96, 60 96
           L 60 88
           C 60 88, 68 86, 78 74
           C 88 62, 88 25, 88 25
           Z"
        fill="url(#unityRightArm)"
      />

      {/* Stylized Interlocking Handshake at the Bottom */}
      {/* Finger loops interlocking */}
      <path
        d="M 50 82 C 50 82, 53 85, 57 85 C 61 85, 63 82, 63 82"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 47 85 C 47 85, 50 88, 54 88 C 58 88, 60 85, 60 85"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 44 88 C 44 88, 47 91, 51 91 C 55 91, 57 88, 57 88"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 41 91 C 41 91, 44 94, 48 94 C 52 94, 54 91, 54 91"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
