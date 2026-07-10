import React from 'react';
import KPIBlock from '../../../components/ui/KPIBlock';

export default function FinancialTab({ project, activeBlock }) {
  const accumulatedLoss = activeBlock
    ? ((project.dailyIdleBurn * activeBlock.daysPending) / 100000).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPIBlock
        value={`₹${project.budget} Cr`}
        label="DPR Approved Allocation"
        color="blue"
      />
      <KPIBlock
        value={`₹${(project.dailyIdleBurn / 1000).toFixed(0)}k`}
        label="Daily Capital Leakage"
        color="red"
      />
      <KPIBlock
        value={`₹${accumulatedLoss} Lac`}
        label="Accumulated Idle Loss"
        color="red"
      />
    </div>
  );
}
