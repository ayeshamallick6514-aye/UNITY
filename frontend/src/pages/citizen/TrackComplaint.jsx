import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, FileText, CheckCircle, Clock } from 'lucide-react';

export default function TrackComplaint() {
  const [queryId, setQueryId] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [trackedItem, setTrackedItem] = useState(null);
  const [searched, setSearched] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    const list = JSON.parse(sessionStorage.getItem('complaints') || '[]');
    setComplaints(list);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!queryId.trim()) return;

    const found = complaints.find(c => c.id.toLowerCase() === queryId.trim().toLowerCase());
    setTrackedItem(found || null);
    setSearched(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Track Your Complaint</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Verify resolution status, department assignments, and updates on your submitted tickets
        </p>
      </div>

      {/* ─── Search Bar ─────────────────────────────────────────── */}
      <Card>
        <form onSubmit={handleSearch} className="flex items-end gap-3 p-4">
          <div className="flex-1">
            <Input
              label="Enter Ticket Reference ID"
              placeholder="e.g. BPL-COM-88492"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              required
            />
          </div>
          <Button type="submit">
            <Search size={14} /> Search
          </Button>
        </form>
      </Card>

      {/* ─── Search Result Panel ────────────────────────────────── */}
      {searched && (
        <div className="animate-fade-in">
          {trackedItem ? (
            <Card status={trackedItem.status === 'resolved' ? 'approved' : 'high'}>
              <Card.Header className="py-2.5">
                <span className="text-xs font-semibold text-gray-900 font-mono">{trackedItem.id}</span>
                <Badge variant={trackedItem.status === 'resolved' ? 'approved' : 'high'}>
                  {trackedItem.status.toUpperCase()}
                </Badge>
              </Card.Header>
              <Card.Body className="text-xs text-gray-500 py-3 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-0.5">{trackedItem.title}</h4>
                  <p>{trackedItem.description}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-md space-y-1 text-[10px] font-mono text-gray-400">
                  <p>Location: {trackedItem.location}</p>
                  <p>Filed Date: {trackedItem.date}</p>
                </div>

                {/* Progress bar */}
                <div className="pt-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-2">TIMELINE PROGRESS</span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="text-blue-600 font-semibold">1. Filed</span>
                    <span className={trackedItem.status === 'resolved' ? 'text-blue-600 font-semibold' : ''}>2. Assigned</span>
                    <span className={trackedItem.status === 'resolved' ? 'text-emerald-600 font-semibold' : ''}>3. Resolved</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-1 relative">
                    <div
                      className={`h-full rounded-full ${trackedItem.status === 'resolved' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: trackedItem.status === 'resolved' ? '100%' : '50%' }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <div className="p-6 bg-white border border-gray-100 rounded-lg text-center text-xs text-gray-400">
              Ticket ID not found. Ensure spelling matches exact pattern: <code className="font-mono bg-gray-50 px-1 py-0.5 rounded">BPL-COM-XXXXX</code>
            </div>
          )}
        </div>
      )}

      {/* ─── Local list of submissions ───────────────────────────── */}
      {complaints.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block">Your Submitted Tickets</span>
          <div className="space-y-2">
            {complaints.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  setQueryId(c.id);
                  setTrackedItem(c);
                  setSearched(true);
                }}
                className="p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900">{c.title}</p>
                  <span className="text-[10px] text-gray-400 font-mono">{c.id} · {c.date}</span>
                </div>
                <Badge variant={c.status === 'resolved' ? 'approved' : 'high'}>
                  {c.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
