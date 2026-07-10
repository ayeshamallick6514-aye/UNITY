import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Alert from '../../components/ui/Alert';
import { BellRing, MapPin, Calendar, Send, Radio } from 'lucide-react';

const SEEDED_ALERTS = [
  {
    id: 'alt_001',
    title: 'Roshanpura Square Road Closure',
    category: 'traffic',
    description: 'Complete road widening excavation. Traffic diverted to link road corridor.',
    location: 'Roshanpura Square, Bhopal',
    duration: 'Until 15 July 2025',
    active: true
  },
  {
    id: 'alt_002',
    title: 'AIIMS Corridor Main Water Line Cut',
    category: 'utility',
    description: 'Mandatory 48-hour scheduled pipeline diversion shutdown serving AIIMS area.',
    location: 'AIIMS Bhopal medical corridor',
    duration: '22 - 24 May 2025',
    active: true
  }
];

const CATEGORY_STYLE = {
  utility: { badge: 'high',   border: 'border-l-4 border-l-amber-400' },
  traffic: { badge: 'medium', border: 'border-l-4 border-l-blue-400'  },
};

export default function CitizenAlerts() {
  const [alerts, setAlerts]         = useState(SEEDED_ALERTS);
  const [newTitle, setNewTitle]     = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [newLoc, setNewLoc]         = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [success, setSuccess]       = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    setAlerts(prev => [{
      id: `alt_${Date.now()}`,
      title: newTitle,
      category: 'traffic',
      description: newDesc,
      location: newLoc || 'Bhopal City Center',
      duration: newDuration || 'Temporary diversion',
      active: true
    }, ...prev]);
    setNewTitle(''); setNewDesc(''); setNewLoc(''); setNewDuration('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio size={15} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Citizen Alert Dispatcher
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Publish municipal road closures, utility cuts, and traffic advisories to the public Citizen Portal
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-blue-950 border border-blue-900 px-3 py-1 rounded-lg shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {alerts.length} ACTIVE ALERTS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left — Active Alerts List */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Live Broadcasts ({alerts.length})
          </span>
          <div className="space-y-3">
            {alerts.map(a => {
              const style = CATEGORY_STYLE[a.category] || CATEGORY_STYLE.traffic;
              return (
                <Card key={a.id} className={`overflow-hidden ${style.border}`}>
                  <Card.Header className="py-2.5">
                    <span className="text-xs font-bold text-slate-900">{a.title}</span>
                    <Badge variant={a.category === 'utility' ? 'high' : 'approved'}>
                      {a.category}
                    </Badge>
                  </Card.Header>
                  <Card.Body className="text-xs text-slate-500 space-y-2 py-3">
                    <p className="leading-relaxed font-normal">{a.description}</p>
                    <div className="flex flex-col gap-1 font-mono text-[10px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={10} className="text-slate-400" /> {a.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={10} className="text-slate-400" /> {a.duration}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right — Dispatch Form */}
        <Card>
          <Card.Header>
            <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Dispatch New Alert
            </Card.Title>
          </Card.Header>
          <form onSubmit={handleSubmit}>
            <Card.Body className="space-y-4">
              {success && (
                <Alert variant="success" title="Alert Published">
                  Advisory successfully broadcast to the Citizen Portal.
                </Alert>
              )}
              <Input
                label="Alert Title"
                id="alert-title"
                placeholder="e.g. Roshanpura Square Road Closure"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Input
                label="Location"
                id="alert-location"
                placeholder="e.g. Roshanpura Square, Bhopal"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
              />
              <Input
                label="Duration"
                id="alert-duration"
                placeholder="e.g. Until 15 July 2025"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
              />
              <Textarea
                label="Alert Description"
                id="alert-description"
                rows={3}
                placeholder="Traffic diversion instructions, bus route changes..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              />
            </Card.Body>
            <Card.Footer>
              <Button type="submit" icon={Send} className="w-full justify-center">
                Publish to Citizen Portal
              </Button>
            </Card.Footer>
          </form>
        </Card>

      </div>
    </div>
  );
}
