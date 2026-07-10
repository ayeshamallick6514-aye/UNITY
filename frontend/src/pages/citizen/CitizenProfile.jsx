import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { User, Phone, MapPin, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CitizenProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/select-role');
  };

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Citizen Profile</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your contact credentials and resident verification parameters
        </p>
      </div>

      {/* ─── Details Card ────────────────────────────────────────── */}
      <Card>
        <Card.Header className="bg-gray-50/20 py-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
            A
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Amit Sharma</h3>
            <span className="text-[10px] text-gray-400 font-mono">Bhopal Resident · MP-RES-92812</span>
          </div>
        </Card.Header>
        
        <Card.Body className="space-y-4 py-4 text-xs">
          <div className="flex items-center gap-3 py-1.5 border-b border-gray-50">
            <Phone size={14} className="text-gray-400" />
            <div>
              <span className="text-[10px] text-gray-400 font-bold block">MOBILE NUMBER</span>
              <p className="font-semibold text-gray-700">+91-98765-43210</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1.5 border-b border-gray-50">
            <Mail size={14} className="text-gray-400" />
            <div>
              <span className="text-[10px] text-gray-400 font-bold block">EMAIL ADDRESS</span>
              <p className="font-semibold text-gray-700">amit.sharma@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1.5">
            <MapPin size={14} className="text-gray-400" />
            <div>
              <span className="text-[10px] text-gray-400 font-bold block">WARD LOCATION</span>
              <p className="font-semibold text-gray-700">Ward 47 - Zone 12, Bhopal Municipal Corp</p>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="bg-gray-50/50 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={13} /> Exit Citizen Portal
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
