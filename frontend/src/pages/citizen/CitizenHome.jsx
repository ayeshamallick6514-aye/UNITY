import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnityMap from '../../components/map/UnityMap';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FileText, Landmark, Search, Plus, Calendar } from 'lucide-react';
import heroBg from '../../assets/bhopal_hero.png';

export default function CitizenHome() {
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Report Local Issue', icon: <Plus size={20} />, path: '/citizen/report', desc: 'File water cuts, road potholes, or power issues' },
    { label: 'Monitored Projects', icon: <Search size={20} />, path: '/citizen/projects', desc: 'Check ongoing public works in Bhopal' },
    { label: 'Government Schemes', icon: <Landmark size={20} />, path: '/citizen/schemes', desc: 'Explore citizen welfare benefits and programs' },
    { label: 'Track Complaint', icon: <FileText size={20} />, path: '/citizen/track', desc: 'Check ticket progress using your reference ID' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800 animate-fade-in">
      
      {/* ─── Banner ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-xl bg-cover bg-center p-8 md:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark blue-slate overlay matching the design theme */}
        <div className="absolute inset-0 bg-[#0d1e3d]/75 z-0" />
        
        <div className="relative z-10 space-y-1.5">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Unified Citizen Services — Bhopal</h2>
          <p className="text-xs text-slate-200 max-w-xl leading-relaxed font-normal">
            Real-time public works monitoring, emergency road closure notifications, and direct complaint resolution dashboard for Bhopal residents.
          </p>
        </div>
        
        <Button
          variant="secondary"
          className="relative z-10 bg-white text-blue-900 hover:bg-blue-50 border-transparent shrink-0 font-bold shadow-md flex items-center gap-2 px-5 py-2.5 rounded-lg"
          onClick={() => navigate('/citizen/report')}
        >
          <FileText size={15} className="text-blue-900" />
          File Local Complaint
        </Button>
      </div>

      {/* ─── Quick Actions Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, idx) => (
          <Card
            key={idx}
            hoverable
            onClick={() => navigate(link.path)}
            className="flex items-center gap-4 p-5 hover:border-blue-100 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center shrink-0">
              {link.icon}
            </div>
            <div className="space-y-1 overflow-hidden">
              <h3 className="text-xs font-bold text-slate-900 truncate">{link.label}</h3>
              <p className="text-[10px] text-slate-400 leading-normal font-normal line-clamp-2">{link.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Map & Public Alerts ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Container */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Ongoing Work Zones Map
          </h3>
          <div className="h-96 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
            <UnityMap activeLayers={['road_projects', 'road_closures']} />
          </div>
        </div>

        {/* Public Notices */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Active Public Notices
          </h3>
          
          <div className="space-y-3">
            <Card status="high">
              <Card.Header className="py-2.5">
                <span className="text-xs font-bold text-slate-900">AIIMS Corridor Water Shutdown</span>
                <Badge variant="high">UTILITY CUT</Badge>
              </Card.Header>
              <Card.Body className="text-xs text-slate-500 py-3 leading-relaxed font-normal">
                <p className="mb-2">
                  A scheduled 48-hour shutdown is required to connect the upgraded water main pipeline. Residents along AIIMS Corridor are advised to store water.
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                  <Calendar size={10} />
                  <span>10 Jul 2026 · 10:00 PM - 12 Jul 2026 · 10:00 PM</span>
                </div>
              </Card.Body>
            </Card>

            <Card status="medium">
              <Card.Header className="py-2.5">
                <span className="text-xs font-bold text-slate-900">MP Nagar Zone 1 Diversion</span>
                <Badge variant="medium">TRAFFIC</Badge>
              </Card.Header>
              <Card.Body className="text-xs text-slate-500 py-3 leading-relaxed font-normal">
                <p className="mb-2">
                  Traffic diversion in effect due to ongoing drain construction. Please follow the alternate routes.
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                  <Calendar size={10} />
                  <span>09 Jul 2026 - 15 Jul 2026</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

      </div>

    </div>
  );
}
