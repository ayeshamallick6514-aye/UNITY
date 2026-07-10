import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Map, Building2, GitBranch,
  CheckSquare, FileText, BarChart3, Settings, ChevronLeft,
  ChevronRight, Shield, BadgeAlert, Landmark
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { APP_NAME } from '../../utils/constants';
import { hasPermission } from '../../utils/roleConfig';
import UnityLogo from './UnityLogo';

const NAV_ITEMS = [
  { key: 'dashboard',    label: 'Operations Dashboard',        icon: LayoutDashboard, to: '/authority/dashboard'    },
  { key: 'projects',     label: 'Mission Control',              icon: FolderOpen,      to: '/authority/projects'     },
  { key: 'map',          label: 'Operational Intelligence Map', icon: Map,             to: '/authority/map'          },
  { key: 'departments',  label: 'Department Directory',         icon: Building2,       to: '/authority/departments'  },
  { key: 'coordination', label: 'Dependency Matrix',            icon: GitBranch,       to: '/authority/coordination' },
  { key: 'approvals',    label: 'Clearance Hub',                icon: CheckSquare,     to: '/authority/approvals'    },
  { key: 'brief',        label: 'Sentinel Intelligence',        icon: Shield,          to: '/authority/brief'        },
  { key: 'settings',     label: 'Administration',               icon: Settings,        to: '/authority/settings'     },
];

export default function AuthoritySidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  const role = user?.role;

  const width = collapsed ? 'w-16' : 'w-64';

  return (
    <aside
      className={`${width} sidebar-transition flex flex-col h-screen bg-slate-900 border-r border-slate-800 shrink-0 relative z-30 font-sans text-slate-300`}
      aria-label="Main navigation"
    >
      {/* Upper Brand Section */}
      <div className="flex items-center h-14 px-4 border-b border-slate-800 shrink-0 bg-slate-950">
        <div className="flex items-center gap-2.5 overflow-hidden w-full">
          <UnityLogo size={32} />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-extrabold text-xs tracking-wider uppercase leading-none">
                {APP_NAME}
              </p>
              <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase mt-1 leading-none">
                Gov. OS Pilot
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto dark-scroll py-4 px-2.5 flex flex-col gap-1">
        {/* Separator for Core Ops */}
        {!collapsed && (
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 block">
            Core Operations
          </span>
        )}
        
        {NAV_ITEMS.map(({ key, label, icon: Icon, to }) => {
          const permitted = role ? hasPermission(role, key) : true;
          if (!permitted) return null;

          return (
            <NavLink
              key={key}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-150 group border border-transparent ${
                  isActive
                    ? 'bg-blue-950 text-white font-semibold border-blue-900/50 shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={14} className="shrink-0" aria-hidden="true" />
              {!collapsed && (
                <span className="truncate tracking-wide">{label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Secure Session Status Block */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40 space-y-2">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Secure Session</p>
            </div>
            <p className="text-[9px] text-slate-500 leading-none font-mono">● Active</p>
            <p className="text-[9px] text-slate-500 leading-none font-mono mt-0.5">Intra-net Protected</p>
          </div>
        </div>
      )}

      {/* User Information Block */}
      {user && (
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900/50 flex items-center justify-center shrink-0">
              <span className="text-blue-400 text-xs font-bold">
                {user.name?.[0]?.toUpperCase() ?? 'O'}
              </span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-white text-xs font-bold leading-tight truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <p className="text-slate-500 text-[9px] font-mono uppercase tracking-wider leading-none">
                    {user.role?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapse Trigger Button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10 shadow-md"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
      </button>
    </aside>
  );
}
