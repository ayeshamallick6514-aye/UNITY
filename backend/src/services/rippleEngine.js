const Task = require('../models/Task');
const Dependency = require('../models/Dependency');
const Project = require('../models/Project');
const CitizenImpact = require('../models/CitizenImpact');

async function calculateRipple(departmentId, simulatedDelayDays = 10) {
  // 1. Find all active (non-completed) tasks of the target department
  const startTasks = await Task.find({ departmentId, status: { $ne: 'completed' } });
  
  if (startTasks.length === 0) {
    return {
      root_department: departmentId,
      simulated_delay_days: simulatedDelayDays,
      metrics: {
        total_projects_blocked: 0,
        projected_cost_exposure: 0,
        additional_idle_burn: 0,
        citizens_impacted: 0
      },
      cascade_path: [],
      public_service_risks: []
    };
  }

  const visitedTaskIds = new Set();
  const queue = [...startTasks.map(t => t._id.toString())];
  startTasks.forEach(t => visitedTaskIds.add(t._id.toString()));
  
  const cascadePath = []; // Array of { from, to, delay_propagation_days }
  const blockedTasks = []; 
  
  const taskMap = {};
  for (const t of startTasks) {
    taskMap[t._id.toString()] = t;
  }

  // BFS traversal to resolve downstream dependencies
  while (queue.length > 0) {
    const currentTaskId = queue.shift();
    const currentTask = taskMap[currentTaskId];
    
    // Find all dependencies where this task is the blocker
    const deps = await Dependency.find({ blockingTaskId: currentTaskId });
    
    for (const dep of deps) {
      const blockedId = dep.blockedTaskId.toString();
      if (!visitedTaskIds.has(blockedId)) {
        visitedTaskIds.add(blockedId);
        
        const blockedTask = await Task.findById(blockedId);
        if (blockedTask && blockedTask.status !== 'completed') {
          taskMap[blockedId] = blockedTask;
          blockedTasks.push(blockedTask);
          queue.push(blockedId);
          
          cascadePath.push({
            from: currentTask.departmentId,
            to: blockedTask.departmentId,
            delay_propagation_days: simulatedDelayDays
          });
        }
      }
    }
  }

  // Aggregate project metrics
  const uniqueProjectIds = new Set(blockedTasks.map(t => t.projectId));
  startTasks.forEach(t => uniqueProjectIds.add(t.projectId));

  const projects = await Project.find({ _id: { $in: Array.from(uniqueProjectIds) } });
  
  let totalProjectsBlocked = uniqueProjectIds.size;
  let projectedCostExposure = 0;
  let additionalIdleBurn = 0;
  
  for (const proj of projects) {
    const projIdleCost = proj.dailyIdleBurn * simulatedDelayDays;
    additionalIdleBurn += projIdleCost;
    
    // Baseline exposure: project budget + additional idle cost
    projectedCostExposure += proj.budget + projIdleCost;
    
    // Check if the delay breaches penalty thresholds
    const projTasks = startTasks.concat(blockedTasks).filter(t => t.projectId === proj._id);
    let projectBreached = false;
    
    for (const t of projTasks) {
      const projectedEnd = new Date(t.plannedEndDate.getTime() + simulatedDelayDays * 24 * 60 * 60 * 1000);
      if (projectedEnd > proj.penaltyActivationDate) {
        projectBreached = true;
        break;
      }
    }
    
    if (projectBreached) {
      projectedCostExposure += proj.penaltyValue;
    }
  }

  // Aggregate citizen impacts
  const citizenImpacts = await CitizenImpact.find({ projectId: { $in: Array.from(uniqueProjectIds) } });
  const citizensImpacted = citizenImpacts.reduce((acc, ci) => acc + ci.citizensAffected, 0);
  
  const publicServiceRisks = citizenImpacts.map(ci => ({
    asset: ci.name,
    threat_level: ci.citizensAffected > 1000 ? 'CRITICAL' : 'HIGH'
  }));

  return {
    root_department: departmentId,
    simulated_delay_days: simulatedDelayDays,
    metrics: {
      total_projects_blocked: totalProjectsBlocked,
      projected_cost_exposure: projectedCostExposure,
      additional_idle_burn: additionalIdleBurn,
      citizens_impacted: citizensImpacted
    },
    cascade_path: cascadePath,
    public_service_risks: publicServiceRisks
  };
}

module.exports = { calculateRipple };
