import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/authStore';

// ─── Command Centre Navigation ───────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Mission Overview',    to: '/command/overview'     },
  { label: 'Escalation Console',  to: '/command/escalations'  },
  { label: 'Interlock Matrix',    to: '/command/matrix'       },
  { label: 'Project Monitor',     to: '/command/projects'     },
  { label: 'Citizen Alerts',      to: '/command/citizens'     },
  { label: 'Funding Risk',        to: '/command/funding'      },
  { label: 'Executive Reports',   to: '/command/reports'      },
  { label: 'Performance KPIs',    to: '/command/kpis'         },
  { label: 'Sentinel AI',         to: '/command/ai'           },
];

/**
 * CommandLayout — top-navigation horizontal shell for Nodal Command Centre.
 * Compact header + horizontal nav tabs + full-width content area.
 */
export default function CommandLayout() {
  const [time, setTime]  = useState('');
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
      }) + ' IST');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function handleLogout() {
    logout();
    navigate('/select-role', { replace: true });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* ─── Command Header ─────────────────────────────────────── */}
      <header className="bg-gray-950 border-b border-white/5 shrink-0">
        {/* Top strip */}
        <div className="flex items-center justify-between px-6 h-12 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <ShieldCheck size={13} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm tracking-tight">UNITY</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-400 text-xs font-medium">District Command Centre</span>
            </div>
            <span className="ml-2 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs font-mono tabular-nums">{time}</span>
            <button
              className="relative p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? 'N'}
                </span>
              </div>
              <span className="text-gray-400 text-xs hidden sm:block">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Horizontal Nav */}
        <nav
          className="flex items-center px-6 gap-1 overflow-x-auto"
          aria-label="Command navigation"
        >
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto" aria-label="Command content">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
