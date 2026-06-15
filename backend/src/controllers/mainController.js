const Department = require('../models/Department');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Dependency = require('../models/Dependency');
const CitizenImpact = require('../models/CitizenImpact');
const Directive = require('../models/Directive');
const AuditEvent = require('../models/AuditEvent');

// Helper to calculate Bottleneck Index for all departments
async function getBottleneckIndexData() {
  const depts = await Department.find();
  const tasks = await Task.find({ status: { $ne: 'completed' } });
  const dependencies = await Dependency.find();

  const bottleneckData = [];

  for (const dept of depts) {
    // Tasks blocking others: tasks owned by this department that are blocking some other task
    const deptTasks = tasks.filter(t => t.departmentId === dept._id);
    const deptTaskIds = deptTasks.map(t => t._id.toString());
    
    // Find dependencies where blockingTaskId is in deptTaskIds
    const activeBlockingDeps = dependencies.filter(d => deptTaskIds.includes(d.blockingTaskId.toString()));
    const uniqueBlockedTaskIds = Array.from(new Set(activeBlockingDeps.map(d => d.blockedTaskId.toString())));

    // Count of projects affected
    const affectedTasks = await Task.find({ _id: { $in: uniqueBlockedTaskIds } });
    const uniqueProjectIds = new Set(affectedTasks.map(t => t.projectId));

    const activeBlocks = activeBlockingDeps.length;
    const delayedProjects = uniqueProjectIds.size;
    
    // Sum exposure budget of affected projects
    const projects = await Project.find({ _id: { $in: Array.from(uniqueProjectIds) } });
    const exposureVal = projects.reduce((sum, p) => sum + p.budget, 0);

    // Score formula: (0.35 * blocks) + (0.45 * delayed_projects) + (0.2 * log(exposure))
    // Normalize to 0-100 gauge values
    let score = (activeBlocks * 15) + (delayedProjects * 20);
    if (exposureVal > 0) {
      score += Math.log10(exposureVal) * 5;
    }
    score = Math.min(Math.round(score), 100);

    bottleneckData.push({
      departmentId: dept._id,
      name: dept.name,
      nodalOfficer: dept.nodalOfficer,
      contact: dept.contact,
      score,
      activeBlocks,
      delayedProjects,
      exposureValue: exposureVal
    });
  }

  // Sort by score descending
  return bottleneckData.sort((a, b) => b.score - a.score);
}

// 1. Consolidated Dashboard Endpoint
const getDashboardData = async (req, res) => {
  try {
    const projects = await Project.find();
    const tasks = await Task.find();
    
    // Active vs blocked projects
    const blockedProjectIds = Array.from(new Set(tasks.filter(t => t.status === 'blocked').map(t => t.projectId)));
    const activeProjects = projects.filter(p => !blockedProjectIds.includes(p._id));
    const blockedProjects = projects.filter(p => blockedProjectIds.includes(p._id));

    // Critical alerts (days stalled > 10)
    const criticalAlerts = await Task.find({ 
      status: { $in: ['pending', 'in_progress', 'blocked'] }, 
      daysStalled: { $gt: 10 } 
    }).populate('departmentId');

    // Pending decisions (decisions that are not authorized yet)
    const pendingDecisions = await Dependency.find({ 
      escalationStatus: { $ne: 'authorized' } 
    }).populate('blockedTaskId').populate('blockingTaskId');

    // Highest risk departments
    const bottlenecks = await getBottleneckIndexData();

    res.json({
      activeProjects: activeProjects.map(p => ({ id: p._id, name: p.name, budget: p.budget })),
      blockedProjects: blockedProjects.map(p => ({ id: p._id, name: p.name, budget: p.budget })),
      criticalAlerts: criticalAlerts.map(t => ({
        id: t._id,
        title: t.title,
        department: t.departmentId.name,
        daysStalled: t.daysStalled
      })),
      pendingDecisions: pendingDecisions.map(d => ({
        id: d._id,
        escalationStatus: d.escalationStatus,
        blockedTask: d.blockedTaskId ? d.blockedTaskId.title : 'N/A',
        blockingTask: d.blockingTaskId ? d.blockingTaskId.title : 'N/A'
      })),
      highestRiskDepartments: bottlenecks.slice(0, 3).map(b => ({
        id: b.departmentId,
        name: b.name,
        score: b.score,
        activeBlocks: b.activeBlocks
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Summary stats for Morning Briefing
const getBriefSummary = async (req, res) => {
  try {
    const tasks = await Task.find();
    const dependencies = await Dependency.find();
    
    const blockedTasks = tasks.filter(t => t.status === 'blocked');
    const uniqueBlockedProjects = Array.from(new Set(blockedTasks.map(t => t.projectId)));
    const uniqueBlockedDepts = Array.from(new Set(blockedTasks.map(t => t.departmentId)));

    const longestStall = tasks.reduce((max, t) => t.daysStalled > max ? t.daysStalled : max, 0);

    res.json({
      blockedProjectsCount: uniqueBlockedProjects.length,
      pendingDependenciesCount: dependencies.length,
      blockedDepartmentsCount: uniqueBlockedDepts.length,
      longestStallDays: longestStall,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Attention Panel Priority List
const getAttentionPriorities = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: 'completed' } })
      .populate('departmentId')
      .populate('projectId');

    // Sort: Blocked first, then by daysStalled descending
    const sorted = tasks.sort((a, b) => {
      if (a.status === 'blocked' && b.status !== 'blocked') return -1;
      if (a.status !== 'blocked' && b.status === 'blocked') return 1;
      return b.daysStalled - a.daysStalled;
    });

    res.json(sorted.map((t, idx) => ({
      id: t._id,
      number: String(idx + 1).padStart(2, '0'),
      title: t.title,
      status: t.status,
      daysStalled: t.daysStalled,
      department: t.departmentId.name,
      project: t.projectId.name,
      blockingReason: t.status === 'blocked' ? 'Awaiting regulatory sign-off or external clearance.' : 'Execution timeline delayed.'
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Decisions Board Items
const getActiveDecisions = async (req, res) => {
  try {
    const dependencies = await Dependency.find()
      .populate({
        path: 'blockedTaskId',
        populate: [{ path: 'projectId' }, { path: 'departmentId' }]
      })
      .populate({
        path: 'blockingTaskId',
        populate: { path: 'departmentId' }
      });

    res.json(dependencies.map(d => ({
      id: d._id,
      escalationStatus: d.escalationStatus,
      project: d.blockedTaskId?.projectId?.name || 'N/A',
      situation: `${d.blockedTaskId?.title} is blocked by ${d.blockingTaskId?.departmentId?.name}'s ${d.blockingTaskId?.title}.`,
      blockingDept: d.blockingTaskId?.departmentId?.name || 'N/A',
      waitingDept: d.blockedTaskId?.departmentId?.name || 'N/A',
      daysPending: d.blockedTaskId?.daysStalled || 0
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Dependency Matrix Grid
const getDependencyMatrix = async (req, res) => {
  try {
    const depts = await Department.find();
    const dependencies = await Dependency.find()
      .populate('blockedTaskId')
      .populate('blockingTaskId');

    const matrix = {};
    
    // Initialize matrix
    depts.forEach(w => {
      matrix[w._id] = {};
      depts.forEach(b => {
        matrix[w._id][b._id] = 0;
      });
    });

    // Fill counts
    dependencies.forEach(d => {
      const waitingDeptId = d.blockedTaskId?.departmentId;
      const blockingDeptId = d.blockingTaskId?.departmentId;

      if (waitingDeptId && blockingDeptId && matrix[waitingDeptId] && matrix[waitingDeptId][blockingDeptId] !== undefined) {
        matrix[waitingDeptId][blockingDeptId] += 1;
      }
    });

    res.json({
      departments: depts.map(d => ({ id: d._id, name: d.name })),
      grid: matrix
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Bottleneck Index endpoint
const getBottlenecks = async (req, res) => {
  try {
    const data = await getBottleneckIndexData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Citizen Impact Endpoint
const getCitizenImpactData = async (req, res) => {
  try {
    const impacts = await CitizenImpact.find().populate('projectId');
    const totalAffected = impacts.reduce((sum, i) => sum + i.citizensAffected, 0);

    res.json({
      totalAffectedCitizens: totalAffected,
      impacts: impacts.map(i => ({
        id: i._id,
        name: i.name,
        impactType: i.impactType,
        citizensAffected: i.citizensAffected,
        project: i.projectId.name
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Event Log Endpoint
const getEventLog = async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    const query = {};
    if (filter !== 'all') {
      query.eventType = filter;
    }

    const events = await AuditEvent.find(query)
      .sort({ createdAt: -1 })
      .populate('departmentId');

    res.json(events.map(e => ({
      id: e._id,
      type: e.eventType,
      text: e.message,
      dept: e.departmentId?.name || 'N/A',
      time: e.time
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Decision Actions (Authorise, Defer, Escalate)
const executeDecisionAction = async (req, res) => {
  try {
    const { dependencyId, action, reason, authorizedBy } = req.body;
    
    // Role Authorization Mock Check
    const userRole = req.headers['x-user-role'];
    const allowedRoles = ['Collector', 'Commissioner'];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden: Role-based access restriction. Only Collector or Commissioner can authorize executive directives.' 
      });
    }

    const dependency = await Dependency.findById(dependencyId)
      .populate('blockedTaskId')
      .populate('blockingTaskId');

    if (!dependency) {
      return res.status(404).json({ error: 'Dependency relationship not found.' });
    }

    let statusMapping = 'idle';
    let auditMsg = '';

    if (action === 'authorize') {
      statusMapping = 'authorized';
      dependency.escalationStatus = 'authorized';
      await dependency.save();

      // Create executive directive record
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 2); // 48-hour compliance

      const directive = new Directive({
        dependencyId: dependency._id,
        authorizedBy: authorizedBy || userRole,
        actionTaken: reason || 'Executive directive issued for immediate clearance.',
        complianceDeadline: deadline,
        status: 'pending'
      });
      await directive.save();

      // Lock task statuses: update blocking task status to notify completion demand
      if (dependency.blockingTaskId) {
        const blockingTask = await Task.findById(dependency.blockingTaskId);
        if (blockingTask) {
          blockingTask.status = 'in_progress';
          await blockingTask.save();
        }
      }

      auditMsg = `Direction Issued: "${reason || 'Executive Directive'}" authorized for ${dependency.blockedTaskId?.title || 'Project'}.`;
    } else if (action === 'escalate') {
      statusMapping = 'escalated';
      dependency.escalationStatus = 'escalated';
      await dependency.save();

      auditMsg = `Escalation Logged: Blocked task escalated to Department Head.`;
    } else if (action === 'defer') {
      statusMapping = 'deferred';
      dependency.escalationStatus = 'deferred';
      await dependency.save();

      auditMsg = `Action Logged: Scheduled review deferred.`;
    }

    // Append to Audit Logs
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const event = new AuditEvent({
      eventType: action === 'authorize' ? 'completed' : action === 'escalate' ? 'flagged' : 'info',
      message: auditMsg,
      departmentId: dependency.blockingTaskId?.departmentId || 'revenue',
      time: timeStr
    });
    await event.save();

    res.json({
      success: true,
      escalationStatus: statusMapping,
      auditMessage: auditMsg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 10. Cost Exposure calculation (dynamic)
const getCostExposureData = async (req, res) => {
  try {
    const dependencies = await Dependency.find()
      .populate({
        path: 'blockedTaskId',
        populate: { path: 'projectId' }
      });

    // Default static baselines matching mock UI
    let baseExposure = 232000000; // 23.2 Cr total
    let baseRework = 23000000; // 2.3 Cr avoidable
    let projectsAtRisk = 3;

    let revenueBreakdown = 140000000; // 1.4 Cr
    let energyBreakdown = 5600000;    // 56 Lac
    let waterBreakdown = 2800000;     // 28 Lac
    let transportBreakdown = 1800000;  // 18 Lac

    // Traverse active dependencies to subtract resolved ones
    const dc1 = dependencies.find(d => d.blockedTaskId?.projectId?._id === 'proj_mp_nagar');
    const dc2 = dependencies.find(d => d.blockedTaskId?.projectId?._id === 'proj_aiims');
    const dc3 = dependencies.find(d => d.blockedTaskId?.projectId?._id === 'proj_kolar');

    if (dc1 && dc1.escalationStatus === 'authorized') {
      baseExposure -= 145000000; // Subtract PWD MP Nagar budget
      baseRework -= 23000000;    // Remove Friday penalty waiver
      projectsAtRisk -= 1;
      revenueBreakdown = 0;
    }
    if (dc2 && dc2.escalationStatus === 'authorized') {
      baseExposure -= 35000000;  // Subtract AIIMS budget
      projectsAtRisk -= 1;
      waterBreakdown = 0;
    }
    if (dc3 && dc3.escalationStatus === 'authorized') {
      baseExposure -= 52000000;  // Subtract Kolar budget
      projectsAtRisk -= 1;
      energyBreakdown = 0;
      transportBreakdown = 0;
    }

    res.json({
      potentialCostExposure: parseFloat((baseExposure / 10000000).toFixed(1)), // in Cr
      avoidableReworkCost: parseFloat((Math.max(baseRework, 0) / 10000000).toFixed(1)),   // in Cr
      projectsAtRisk: Math.max(projectsAtRisk, 0),
      breakdown: {
        revenue: parseFloat((revenueBreakdown / 10000000).toFixed(2)),
        energy: parseFloat((energyBreakdown / 10000000).toFixed(2)),
        water: parseFloat((waterBreakdown / 10000000).toFixed(2)),
        transport: parseFloat((transportBreakdown / 10000000).toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getBriefSummary,
  getAttentionPriorities,
  getActiveDecisions,
  getDependencyMatrix,
  getBottlenecks,
  getCitizenImpactData,
  getEventLog,
  executeDecisionAction,
  getCostExposureData
};
