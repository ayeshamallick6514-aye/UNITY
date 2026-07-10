import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { GitBranch, Info, ChevronUp, ChevronDown } from 'lucide-react';

const DEPTS = [
  { id: 'pwd',          short: 'PWD',     name: 'Public Works Dept'          },
  { id: 'revenue',      short: 'Revenue', name: 'Revenue Dept'               },
  { id: 'energy',       short: 'Energy',  name: 'Energy Dept (MPEB)'         },
  { id: 'water_supply', short: 'Water',   name: 'Water Supply Dept'          },
  { id: 'transport',    short: 'Traffic', name: 'Urban Transport / Traffic Cell' },
];

const MATRIX_DATA = {
  pwd:          { pwd: -1, revenue: 2, energy: 1, water_supply: 2, transport: 0 },
  revenue:      { pwd: 0,  revenue: -1, energy: 0, water_supply: 0, transport: 0 },
  energy:       { pwd: 0,  revenue: 0, energy: -1, water_supply: 0, transport: 0 },
  water_supply: { pwd: 0,  revenue: 0, energy: 0, water_supply: -1, transport: 0 },
  transport:    { pwd: 0,  revenue: 0, energy: 1, water_supply: 0, transport: -1 },
};

const CELL_CONFIG = {
  '-1': { bg: 'bg-slate-100',     text: '—', textColor: 'text-slate-400',               desc: 'Self reference'    },
   '0': { bg: 'bg-emerald-50/50', text: '✓', textColor: 'text-emerald-600',             desc: 'Cleared / No Block'},
   '1': { bg: 'bg-amber-50/50',   text: '1', textColor: 'text-amber-700',               desc: 'Pending NOC (1)'   },
   '2': { bg: 'bg-red-50/50',     text: '⚠', textColor: 'text-red-600 font-bold',       desc: 'Critical Hold'     },
};

const INTERLOCKS = [
  { waiting: 'PWD',            blocking: 'Revenue Dept',       project: 'MP Nagar Road Widening',        issue: 'Land compensation clearance - Plot 47-B',   age: '12 Days' },
  { waiting: 'PWD',            blocking: 'Water Supply Dept',  project: 'AIIMS Pipeline Upgrade',        issue: 'Shutdown window permit sign-off',           age: '8 Days'  },
  { waiting: 'PWD',            blocking: 'Energy Dept (MPEB)', project: 'Kolar Road Utility Relocation', issue: '15 High-voltage transmission poles relocation', age: '19 Days' },
  { waiting: 'Urban Transport', blocking: 'Energy Dept (MPEB)', project: 'Kolar Road Utility Relocation', issue: 'Traffic diversion permit correlation',      age: '5 Days'  },
];

const INTERLOCK_HEADERS = ['Waiting Unit', 'Blocking Unit', 'Project Area', 'Dependency Detail', 'Stall Age'];

export default function DeptMatrix() {
  const [showLegend, setShowLegend] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={15} className="text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Departmental Interlock Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Cross-referencing organizational dependencies — Waiting Rows vs Blocking Columns
          </p>
        </div>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          <Info size={13} />
          {showLegend ? 'Hide Legend' : 'Show Legend'}
          {showLegend ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs animate-fade-in">
          {Object.entries(CELL_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center font-mono font-bold ${cfg.textColor}`}>
                {cfg.text}
              </div>
              <p className="font-bold text-slate-700">{cfg.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Interlock Grid */}
      <Card>
        <Card.Header className="bg-slate-50/50">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Interlock Grid
          </Card.Title>
        </Card.Header>
        <Card.Body className="p-0 overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 font-mono text-[9px] font-bold text-slate-400 uppercase">
                <th className="text-left px-5 py-4 w-48 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-200">
                  Waiting ↓ / Blocking →
                </th>
                {DEPTS.map(d => (
                  <th key={d.id} className="px-4 py-4 text-center border-r border-slate-200 last:border-r-0">
                    {d.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPTS.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-200">
                    <span>{row.short}</span>
                    <span className="text-[9px] text-slate-400 font-normal block tracking-wide mt-0.5">{row.name}</span>
                  </td>
                  {DEPTS.map((col) => {
                    const val = MATRIX_DATA[row.id]?.[col.id] ?? 0;
                    const cfg = CELL_CONFIG[String(val)];
                    const key = `${row.id}-${col.id}`;
                    return (
                      <td
                        key={col.id}
                        onMouseEnter={() => setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`px-4 py-4 text-center border-r border-slate-100 last:border-r-0 transition-colors ${
                          hoveredCell === key ? 'bg-slate-100/50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center font-bold font-mono text-xs shadow-inner ${cfg.bg} ${cfg.textColor}`}>
                          {cfg.text}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      {/* Clearance Logs — using Table primitive */}
      <Card>
        <Card.Header className="bg-slate-50/50">
          <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Active Clearance Logs
          </Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Header headers={INTERLOCK_HEADERS} />
            <Table.Body>
              {INTERLOCKS.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell className="font-bold text-slate-800">{item.waiting}</Table.Cell>
                  <Table.Cell className="font-bold text-red-600">{item.blocking}</Table.Cell>
                  <Table.Cell className="text-slate-600">{item.project}</Table.Cell>
                  <Table.Cell className="text-slate-500 font-normal leading-relaxed">{item.issue}</Table.Cell>
                  <Table.Cell className="text-center font-mono font-bold text-slate-700">{item.age}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>

    </div>
  );
}
