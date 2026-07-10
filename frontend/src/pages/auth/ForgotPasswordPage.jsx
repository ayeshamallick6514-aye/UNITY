import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

/**
 * ForgotPasswordPage — public password recovery request gateway.
 */
export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error, clearError } = useAuth();
  
  const [email, setEmail]       = useState('');
  const [success, setSuccess]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    const msg = await forgotPassword(email);
    if (msg) {
      setSuccess(msg);
      setEmail('');
    }
  }

  return (
    <Card className="shadow-lg border-gray-100">
      <Card.Header>
        <Card.Title className="text-gray-900 font-bold">Password Recovery</Card.Title>
      </Card.Header>

      <form onSubmit={handleSubmit}>
        <Card.Body className="flex flex-col gap-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Enter your registered government email or mobile number to receive password recovery instructions.
          </p>

          {success && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span className="font-semibold uppercase tracking-wider block mb-1">Request Submitted</span>
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
              <span className="font-semibold uppercase tracking-wider block mb-1">Recovery Error</span>
              {error}
            </div>
          )}

          {!success && (
            <Input
              label="Registered Email or Mobile"
              required
              placeholder="e.g. collector@bhopal.mp.gov.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) clearError();
              }}
              disabled={loading}
            />
          )}
        </Card.Body>

        <Card.Footer className="flex flex-col gap-2">
          {!success ? (
            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Send Instructions
            </Button>
          ) : (
            <Link
              to="/select-role"
              className="w-full"
            >
              <Button variant="secondary" className="w-full">
                Return to Login
              </Button>
            </Link>
          )}
          <Link
            to="/select-role"
            className="w-full text-center py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Role Selection
          </Link>
        </Card.Footer>
      </form>
    </Card>
  );
}
