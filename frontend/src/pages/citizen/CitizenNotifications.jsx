import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { BellRing, Calendar, MapPin } from 'lucide-react';

const NOTICES = [
  {
    id: 'not_01',
    title: 'Roshanpura Square Road Widening Diversion',
    desc: 'PWD is executing critical asphalt foundation works. All school buses and light motors rerouted via link road corridors.',
    date: '08 July 2025',
    loc: 'Roshanpura, Bhopal',
    type: 'traffic'
  },
  {
    id: 'not_02',
    title: 'Water Mains Line Pipeline Diversion Shutoff',
    desc: 'Bhopal Water Resources requires a scheduled 48-hour shutoff window to lay the main pipeline serving AIIMS area.',
    date: '05 July 2025',
    loc: 'AIIMS Corridor, Bhopal',
    type: 'utility'
  }
];

export default function CitizenNotifications() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Public Alerts &amp; Notifications</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Real-time updates regarding scheduled utility cuts, traffic road diversions, and public safety announcements
        </p>
      </div>

      {/* ─── Feed ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {NOTICES.map(notice => (
          <Card key={notice.id} status={notice.type === 'utility' ? 'high' : 'medium'}>
            <Card.Header className="py-2.5">
              <div className="flex items-center gap-2">
                <BellRing size={15} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-900">{notice.title}</span>
              </div>
              <Badge variant={notice.type === 'utility' ? 'high' : 'medium'}>
                {notice.type.toUpperCase()}
              </Badge>
            </Card.Header>
            <Card.Body className="text-xs text-gray-500 py-3 space-y-2 leading-relaxed">
              <p>{notice.desc}</p>
              <div className="flex gap-4 font-mono text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={10} /> {notice.loc}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {notice.date}</span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
