import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { User, Lock, Shield, KeyRound, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleType = searchParams.get('role') || 'authority'; // authority | command

  const { login, instantLogin, loading, error, clearError, otpPending, pendingEmail, otpMessage } = useAuth();
  
  const [identifier, setIdentifier] = useState(
    roleType === 'command' ? 'nodal@bhopal.mp.gov.in' : 'collector@bhopal.mp.gov.in'
  );
  const [password, setPassword] = useState('GovBhopal@Admin2026');

  // Handle redirect if OTP verification is required
  useEffect(() => {
    if (otpPending && pendingEmail) {
      navigate('/auth/verify', { state: { email: pendingEmail, message: otpMessage } });
    }
  }, [otpPending, pendingEmail, otpMessage, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!identifier || !password) return;
    login(identifier, password);
  }

  return (
    <Card className="card-class">
      
      {/* Header */}
      <Card.Header className="border-b border-slate-800/80 px-0 pt-0 pb-4">
        <Card.Title className="text-white font-bold text-base flex items-center gap-2">
          <Lock size={16} className="text-blue-400" />
          {roleType === 'command' ? 'Nodal Command Login' : 'Government Sign In'}
        </Card.Title>
      </Card.Header>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <Card.Body className="px-0 py-0 flex flex-col gap-4">
          
          {error && (
            <div className="p-3 rounded-md bg-red-950/60 border border-red-900/50 text-xs text-red-400 flex flex-col gap-1">
              <span className="font-semibold uppercase tracking-wider">Authentication Error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick-Fill Demonstration Selector */}
          <div className="bg-[#081225] border border-blue-900/30 rounded-lg p-3 text-xs text-slate-300 flex flex-col gap-2">
            <span className="font-bold text-[10px] text-blue-400 uppercase tracking-widest block">
              Quick-Select Demo Role:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('collector@bhopal.mp.gov.in');
                  setPassword('GovBhopal@Admin2026');
                }}
                className="text-left px-2.5 py-1.5 rounded bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 text-[11px] text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <User size={12} className="text-blue-400" />
                <span>Collector (Bhopal)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('PWD-BPL-4412');
                  setPassword('GovBhopal@Admin2026');
                }}
                className="text-left px-2.5 py-1.5 rounded bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 text-[11px] text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Briefcase size={12} className="text-blue-400" />
                <span>Executive Engineer</span>
              </button>
            </div>
          </div>

          {/* Identifier Input */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Employee ID or Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                disabled={loading}
                placeholder="e.g. IAS-MP-2201"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) clearError();
                }}
                className="w-full pl-10 pr-3 py-2 text-sm text-white bg-[#070e1b] border border-blue-900/40 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                className="w-full pl-10 pr-3 py-2 text-sm text-white bg-[#070e1b] border border-blue-900/40 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <Link
              to="/auth/forgot"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </Card.Body>

        {/* Action Buttons */}
        <Card.Footer className="px-0 pb-0 pt-4 flex flex-col gap-2.5 border-t border-slate-800/80">
          {/* Instant 1-Click Demo Entry */}
          <button
            type="button"
            onClick={() => instantLogin(roleType === 'command' ? 'nodal_officer' : 'collector')}
            className="w-full py-2.5 rounded-lg font-bold bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>⚡ Instant 1-Click Access ({roleType === 'command' ? 'Nodal Officer' : 'District Collector'})</span>
          </button>

          <Button
            type="submit"
            className="w-full py-2.5 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2"
            loading={loading}
          >
            <Shield size={14} />
            Authenticate Credentials
          </Button>
          <Link
            to="/select-role"
            className="w-full text-center py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Back to Role Selection
          </Link>
        </Card.Footer>
      </form>
    </Card>
  );
}
