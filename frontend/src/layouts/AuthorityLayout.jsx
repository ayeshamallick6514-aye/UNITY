import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthorityTopBar from '../components/shared/AuthorityTopBar';

// ─── Page titles (used if any consumer still reads them) ──────────────────────
const PAGE_TITLES = {
  '/authority/dashboard':    'Priorities Dashboard',
  '/authority/projects':     'Mission Workspace',
  '/authority/map':          'Operational Coordination Map — Bhopal',
  '/authority/departments':  'Department Registry',
  '/authority/coordination': 'Coordination Matrix',
  '/authority/approvals':    'Clearance Console',
  '/authority/brief':        'Sentinel Briefing Room',
  '/authority/analytics':    'Analytics Console',
  '/authority/settings':     'System Settings',
};

/**
 * AuthorityLayout — single unified top header + scrollable content.
 * Sidebar deliberately removed: navigation lives in AuthorityTopBar tabs.
 */
export default function AuthorityLayout() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? '';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">

      {/* Single unified top header — nav lives inside */}
      <AuthorityTopBar pageTitle={pageTitle} />

      {/* Full-width scrollable content */}
      <main
        className="flex-1 overflow-y-auto"
        id="main-content"
        aria-label="Main content"
      >
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
