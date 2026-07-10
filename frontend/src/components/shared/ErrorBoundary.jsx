import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, log to analytics/error reporter
    // Console output omitted for clean production logs
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900">Application Error</h2>
              <p className="text-xs text-gray-500">
                An unexpected interface execution error occurred in the UNITY layout engine.
              </p>
            </div>
            {this.state.error?.message && (
              <pre className="text-[10px] font-mono bg-slate-50 text-red-700 p-2.5 rounded border border-red-100/50 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reload Interface
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/select-role';
                }}
              >
                Gateway Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
