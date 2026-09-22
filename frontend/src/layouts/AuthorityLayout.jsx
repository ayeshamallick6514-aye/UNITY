import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthoritySidebar from '../components/shared/AuthoritySidebar';
import AuthorityTopBar from '../components/shared/AuthorityTopBar';

// Map route paths to human-readable page titles
const PAGE_TITLES = {
  '/authority/dashboard':     'Priorities Dashboard',
  '/authority/projects':      'Mission Workspace',
  '/authority/map':           'Operational Coordination Map — Bhopal',
  '/authority/departments':   'Department Registry',
  '/authority/coordination':  'Coordination Matrix',
  '/authority/approvals':     'Clearance Console',
  '/authority/brief':         'Sentinel Briefing Room',
  '/authority/analytics':     'Analytics Console',
  '/authority/settings':      'System Settings',
};

/**
 * AuthorityLayout — sidebar + topbar shell for Government Authority role.
 * Sidebar is fixed left. TopBar is fixed top. Content scrolls independently.
 */
export default function AuthorityLayout() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? '';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Fixed Sidebar */}
      <AuthoritySidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <AuthorityTopBar pageTitle={pageTitle} />

        {/* Page Content */}
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
    </div>
  );
}
