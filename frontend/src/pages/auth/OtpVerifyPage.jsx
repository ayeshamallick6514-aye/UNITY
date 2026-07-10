import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

/**
 * OtpVerifyPage — verification page for entering government OTP.
 * Expects user location state from LoginPage to carry the email address.
 */
export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const initialMessage = location.state?.message || 'Verification code sent to registered mobile/email.';

  const { verifyOtp, loading, error, clearError } = useAuth();
  const [otp, setOtp] = useState('');

  // Protect page from direct access without email context
  useEffect(() => {
    if (!email) {
      navigate('/select-role', { replace: true });
    }
  }, [email, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (otp.length !== 6) return;
    verifyOtp(email, otp);
  }

  return (
    <Card className="card-class">
      <Card.Header className="border-b border-slate-800/80 px-0 pt-0 pb-4">
        <Card.Title className="text-white font-bold text-base">OTP Verification</Card.Title>
      </Card.Header>

      <form onSubmit={handleSubmit} className="mt-4">
        <Card.Body className="px-0 py-0 flex flex-col gap-4">
          <div className="bg-[#081225] border border-blue-900/30 rounded-lg p-3 text-xs text-blue-300">
            <p className="font-bold uppercase tracking-widest text-[10px] text-blue-400 mb-1">Dual-Factor Authentication</p>
            <p className="text-slate-300">{initialMessage}</p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-950/60 border border-red-900/50 text-xs text-red-400 flex flex-col gap-1">
              <span className="font-semibold uppercase tracking-wider">Verification Error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="text-center py-2">
            <span className="text-xs text-gray-500 font-medium">VERIFYING ACCOUNT</span>
            <p className="text-sm font-mono text-gray-900 font-semibold mt-0.5">{email}</p>
          </div>

          <Input
            label="Enter 6-Digit OTP"
            required
            type="text"
            maxLength={6}
            placeholder="e.g. 123456"
            className="text-center font-mono tracking-[0.25em] text-lg"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setOtp(val);
              if (error) clearError();
            }}
            disabled={loading}
          />
        </Card.Body>

        <Card.Footer className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full font-mono"
            disabled={otp.length !== 6}
            loading={loading}
          >
            Verify &amp; Establish Session
          </Button>
          <Link
            to="/select-role"
            className="w-full text-center py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Cancel Sign In
          </Link>
        </Card.Footer>
      </form>
    </Card>
  );
}
