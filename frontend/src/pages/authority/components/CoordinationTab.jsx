import React from 'react';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

export default function CoordinationTab({ cri }) {
  if (!cri) return null;

  const headers = ['Department', 'Scope of Task', 'Status', 'Stall Age'];

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Department Tasks
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-0">
        <Table>
          <Table.Header headers={headers} />
          <Table.Body>
            {cri.coordinationTasks?.map((task, idx) => (
              <Table.Row key={idx}>
                <Table.Cell className="font-bold text-slate-800">
                  {task.department}
                </Table.Cell>
                <Table.Cell className="text-slate-600 leading-relaxed font-normal">
                  {task.title}
                </Table.Cell>
                <Table.Cell className="text-center">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${
                      task.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                      task.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {task.status}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center">
                  <span
                    className={`font-mono font-bold text-[11px] ${
                      task.daysStalled > 10 ? 'text-red-600' :
                      task.daysStalled > 0 ? 'text-amber-600' :
                      'text-slate-400'
                    }`}
                  >
                    {task.daysStalled || '0'} Days
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Body>
    </Card>
  );
}
