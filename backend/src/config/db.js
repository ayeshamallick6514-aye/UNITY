const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI;

    // If running in development and no remote DB is configured, spin up memory server
    if (!dbUri || dbUri.includes('127.0.0.1') || dbUri.includes('localhost')) {
      try {
        console.log('Starting In-Memory MongoDB Server...');
        mongod = await MongoMemoryServer.create();
        dbUri = mongod.getUri();
        console.log(`In-Memory MongoDB Started at: ${dbUri}`);
      } catch (memError) {
        console.warn(`Could not start In-Memory DB: ${memError.message}. Attempting local default...`);
        dbUri = 'mongodb://127.0.0.1:27017/unity';
      }
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed database if empty
    await autoSeedIfEmpty();

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB Disconnected.');
  } catch (error) {
    console.error('Error disconnecting database:', error.message);
  }
};

// Auto-seed helper
const autoSeedIfEmpty = async () => {
  const Department = require('../models/Department');
  const Project = require('../models/Project');
  const Task = require('../models/Task');
  const Dependency = require('../models/Dependency');
  const CitizenImpact = require('../models/CitizenImpact');
  const AuditEvent = require('../models/AuditEvent');
  const User = require('../models/User');

  const deptCount = await Department.countDocuments();
  if (deptCount === 0) {
    console.log('Database is empty. Initiating automatic seeding...');
    
    // Seed Departments
    const depts = [
      { _id: 'revenue', name: 'Revenue Dept', nodalOfficer: 'Revenue Nodal Cell', contact: '+91-755-2540101' },
      { _id: 'pwd', name: 'Public Works Dept', nodalOfficer: 'PWD Project Cell', contact: '+91-755-2540102' },
      { _id: 'energy', name: 'Energy Dept (MPEB)', nodalOfficer: 'MPEB Shifting Desk', contact: '+91-755-2540103' },
      { _id: 'water_supply', name: 'Water Supply Dept', nodalOfficer: 'BMC Water Nodal Desk', contact: '+91-755-2540104' },
      { _id: 'transport', name: 'Urban Transport/Traffic Cell', nodalOfficer: 'Traffic Coordination Cell', contact: '+91-755-2540105' }
    ];
    await Department.insertMany(depts);

    // Seed Users
    const users = [
      { name: 'District Collector Bhopal', email: 'collector.bhopal@mp.gov.in', role: 'Collector' },
      { name: 'BMC Municipal Commissioner', email: 'commissioner.bmc@mp.gov.in', role: 'Commissioner' },
      { name: 'Superintending Engineer PWD', email: 'se.pwd.bhopal@mp.gov.in', role: 'Department Head', departmentId: 'pwd' },
      { name: 'Revenue Officer Bhopal', email: 'ro.revenue.bhopal@mp.gov.in', role: 'Department Head', departmentId: 'revenue' }
    ];
    await User.insertMany(users);

    // Seed Projects
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);

    const projects = [
      {
        _id: 'proj_mp_nagar',
        name: 'MP Nagar Road Widening',
        description: 'Arterial road widening at Zone 1 and 2 to decongest school and commercial traffic.',
        budget: 145000000,
        dailyIdleBurn: 80000,
        penaltyActivationDate: threeDaysFromNow,
        penaltyValue: 23000000
      },
      {
        _id: 'proj_aiims',
        name: 'AIIMS Pipeline Upgrade',
        description: 'New water main pipeline laying serving the AIIMS hospital corridor.',
        budget: 35000000,
        dailyIdleBurn: 25000,
        penaltyActivationDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        penaltyValue: 5000000
      },
      {
        _id: 'proj_kolar',
        name: 'Kolar Road Utility Relocation',
        description: 'Relocation of high-voltage transmission poles and drainage lines along the Kolar corridor.',
        budget: 52000000,
        dailyIdleBurn: 40000,
        penaltyActivationDate: oneDayAgo,
        penaltyValue: 8000000
      },
      {
        _id: 'proj_bhopal_metro',
        name: 'Bhopal Metro Orange Line (Subhash Nagar to Karond)',
        description: 'Viaduct pier construction and 33KV high-tension grid relocation along 14.99 km corridor.',
        budget: 2150000000,
        dailyIdleBurn: 150000,
        penaltyActivationDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        penaltyValue: 45000000
      },
      {
        _id: 'proj_bhadbhada_flyover',
        name: 'Bhadbhada Junction 4-Lane Flyover',
        description: '1.2 km grade separator construction to eliminate traffic bottleneck at New Market - Kaliasot axis.',
        budget: 850000000,
        dailyIdleBurn: 65000,
        penaltyActivationDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
        penaltyValue: 12000000
      },
      {
        _id: 'proj_hoshangabad_brts',
        name: 'Hoshangabad Road Corridor Redesign & Drain Network',
        description: 'Reconstruction of mixed traffic lanes and sub-surface stormwater culvert widening along Misrod corridor.',
        budget: 1200000000,
        dailyIdleBurn: 90000,
        penaltyActivationDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
        penaltyValue: 18000000
      },
      {
        _id: 'proj_upper_lake_stp',
        name: 'Upper Lake Catchment 50 MLD STP Project',
        description: 'Interception and diversion of untreated nullahs entering Bhoj Wetland with SBR technology.',
        budget: 1650000000,
        dailyIdleBurn: 75000,
        penaltyActivationDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        penaltyValue: 28000000
      },
      {
        _id: 'proj_hamidia_smart_corridor',
        name: 'Hamidia Hospital Smart Transit Access Corridor',
        description: 'Pedestrian and emergency ambulance transit spine widening around historic Hamidia Medical Campus.',
        budget: 480000000,
        dailyIdleBurn: 45000,
        penaltyActivationDate: oneDayAgo,
        penaltyValue: 7500000
      }
    ];
    await Project.insertMany(projects);

    // Seed Tasks
    const tasks = [
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_mp_nagar',
        departmentId: 'revenue',
        title: 'Land compensation clearance - Plot 47-B, MP Nagar extension',
        status: 'pending',
        plannedStartDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
        plannedEndDate: threeDaysFromNow,
        daysStalled: 12
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_mp_nagar',
        departmentId: 'pwd',
        title: 'Asphalt paving and road widening works',
        status: 'blocked',
        plannedStartDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
        daysStalled: 12
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_aiims',
        departmentId: 'water_supply',
        title: 'Main pipeline diversion scheduling and shutdown window sign-off',
        status: 'pending',
        plannedStartDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
        daysStalled: 8
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_aiims',
        departmentId: 'pwd',
        title: 'Excavation and sub-surface alignment laying',
        status: 'blocked',
        plannedStartDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000),
        daysStalled: 8
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_kolar',
        departmentId: 'energy',
        title: 'Relocation of 15 high-voltage electrical poles from main alignment',
        status: 'pending',
        plannedStartDate: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000),
        plannedEndDate: oneDayAgo,
        daysStalled: 19
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_kolar',
        departmentId: 'pwd',
        title: 'Corridor road foundation laying and storm-drain widening',
        status: 'blocked',
        plannedStartDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        daysStalled: 19
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_bhopal_metro',
        departmentId: 'energy',
        title: '33KV electrical grid shifting along Subhash Nagar railway crossing',
        status: 'pending',
        plannedStartDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000),
        plannedEndDate: threeDaysFromNow,
        daysStalled: 18
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_bhopal_metro',
        departmentId: 'pwd',
        title: 'Elevated metro viaduct pier foundation casting',
        status: 'blocked',
        plannedStartDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000),
        daysStalled: 18
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_bhadbhada_flyover',
        departmentId: 'revenue',
        title: 'Forest Dept and tree translocation NOC for approach road',
        status: 'pending',
        plannedStartDate: new Date(today.getTime() - 22 * 24 * 60 * 60 * 1000),
        plannedEndDate: threeDaysFromNow,
        daysStalled: 22
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_bhadbhada_flyover',
        departmentId: 'pwd',
        title: 'Flyover girder launching and pier cap installation',
        status: 'blocked',
        plannedStartDate: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
        daysStalled: 22
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_upper_lake_stp',
        departmentId: 'water_supply',
        title: 'MPPCB environmental consent to establish & wetland buffer clearance',
        status: 'pending',
        plannedStartDate: new Date(today.getTime() - 26 * 24 * 60 * 60 * 1000),
        plannedEndDate: oneDayAgo,
        daysStalled: 26
      },
      {
        _id: new mongoose.Types.ObjectId(),
        projectId: 'proj_upper_lake_stp',
        departmentId: 'pwd',
        title: 'STP civil structure and primary sedimentation tank excavation',
        status: 'blocked',
        plannedStartDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
        plannedEndDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000),
        daysStalled: 26
      }
    ];
    await Task.insertMany(tasks);

    // Seed Dependencies
    const dependencies = [
      {
        blockedTaskId: tasks[1]._id,
        blockingTaskId: tasks[0]._id,
        dependencyType: 'finish_to_start',
        escalationStatus: 'idle'
      },
      {
        blockedTaskId: tasks[3]._id,
        blockingTaskId: tasks[2]._id,
        dependencyType: 'finish_to_start',
        escalationStatus: 'idle'
      },
      {
        blockedTaskId: tasks[5]._id,
        blockingTaskId: tasks[4]._id,
        dependencyType: 'finish_to_start',
        escalationStatus: 'idle'
      },
      {
        blockedTaskId: tasks[7]._id,
        blockingTaskId: tasks[6]._id,
        dependencyType: 'finish_to_start',
        escalationStatus: 'idle'
      },
      {
        blockedTaskId: tasks[9]._id,
        blockingTaskId: tasks[8]._id,
        dependencyType: 'finish_to_start',
        escalationStatus: 'idle'
      },
      {
        blockedTaskId: tasks[11]._id,
        blockingTaskId: tasks[10]._id,
        dependencyType: 'finish_to_start',
        escalationStatus: 'idle'
      }
    ];
    await Dependency.insertMany(dependencies);

    // Seed Citizen Impacts
    const impacts = [
      { name: 'AIIMS Bhopal Corridor Hospital Water Supply', impactType: 'healthcare', citizensAffected: 800, projectId: 'proj_aiims' },
      { name: 'Kolar Road Ambulance Corridor Vehicle Access', impactType: 'emergency_route', citizensAffected: 1200, projectId: 'proj_kolar' },
      { name: 'MP Nagar School Bus Transport Route Carmel Convent/Campion', impactType: 'education', citizensAffected: 2400, projectId: 'proj_mp_nagar' },
      { name: 'MP Nagar Zone 2 Local Traders Commercial Corridor', impactType: 'commercial', citizensAffected: 350, projectId: 'proj_mp_nagar' },
      { name: 'Subhash Nagar - Karond Metro Corridor Commuter Flow', impactType: 'transit', citizensAffected: 4500, projectId: 'proj_bhopal_metro' },
      { name: 'Bhadbhada Junction Peak Hour Congestion Relief', impactType: 'transit', citizensAffected: 3200, projectId: 'proj_bhadbhada_flyover' },
      { name: 'Bhoj Wetland Upper Lake Water Purity & Public Health', impactType: 'environmental', citizensAffected: 18000, projectId: 'proj_upper_lake_stp' },
      { name: 'Hamidia Hospital Emergency Patient Access Corridor', impactType: 'healthcare', citizensAffected: 1500, projectId: 'proj_hamidia_smart_corridor' }
    ];
    await CitizenImpact.insertMany(impacts);

    // Seed Audit Events
    const events = [
      { eventType: 'completed', message: 'Utility relocation completed — Sector 12 water main diverted.', departmentId: 'water_supply', time: '07:31' },
      { eventType: 'flagged', message: 'New conflict detected — MP Nagar road widening, pole zone B.', departmentId: 'energy', time: '07:18' },
      { eventType: 'critical', message: 'Revenue clearance overdue — 12-day threshold breached.', departmentId: 'revenue', time: '06:55' },
      { eventType: 'info', message: 'Morning operational briefing generated at 06:00 hours.', departmentId: 'pwd', time: '06:00' },
      { eventType: 'completed', message: 'Traffic signal installation approved — Kolar–Hoshangabad Rd.', departmentId: 'transport', time: '06:40' }
    ];
    await AuditEvent.insertMany(events);

    // Seed Sentinel Policy Documents if empty
    const Document = require('../models/Document');
    const docCount = await Document.countDocuments();
    if (docCount === 0) {
      console.log('Seeding policy documents and vector embeddings for UNITY Sentinel...');
      const { ingestDocument } = require('../services/sentinelService');
      
      const seedDocs = [
        {
          title: 'Compensation and Acquisition SOP for Public Infrastructure Projects',
          source: 'MP Circular 14.3',
          department: 'Revenue Dept',
          documentType: 'Circular',
          content: 'SOP Section 2.4: Clearance of land acquisition for road projects must be finalized within 15 days of compensation disbursement. Section 2.5: Any pending claim dispute on commercial plots (like MP Nagar extension Zone 2) requires the collector to sign a conditional waiver to authorize asphalt laying, with a retrospective audit query to be cleared within 30 days.'
        },
        {
          title: 'Guidelines for Relocation of High Voltage Overhead Transmission Lines',
          source: 'Municipal SOP Clause 7',
          department: 'Energy Dept',
          documentType: 'SOP',
          content: 'SOP Clause 7.2: Power transmission line shifting along utility corridors (such as Kolar road utility alignment) must be executed within 10 days of alternative site clearance. Clause 7.3: For delayed relocation exceeding 15 days, the executing department (PWD) is permitted to request emergency route waivers. However, waivers must be approved by the Municipal Commissioner with a structural stability certification.'
        },
        {
          title: 'Standard Protocol for Laying Main Water Pipeline Diversions near Medical Corridors',
          source: 'Health SOP Clause 3',
          department: 'Water Supply Dept',
          documentType: 'Guidelines',
          content: 'Water Supply Guidelines Clause 3.4: Main water pipeline layout and connection works near critical hospital facilities (such as AIIMS Bhopal Medical Corridor) require a mandatory 48-hour scheduled shutdown window. Clause 3.5: Sign-off of the shutdown window must be approved by both the Chief Medical Officer and the Water Supply Nodal Officer. Clearances delayed by more than 7 days must be escalated to the District Collector for direct administrative bypass.'
        }
      ];

      for (const doc of seedDocs) {
        await ingestDocument(doc);
      }
      console.log('Sentinel policy documents seeded and embedded successfully!');
    }

    console.log('Database auto-seeded successfully!');
  } else {
    // If the database has data, check if Documents specifically needs seeding
    const Document = require('../models/Document');
    const docCount = await Document.countDocuments();
    if (docCount === 0) {
      console.log('Seeding policy documents and vector embeddings for existing database...');
      const { ingestDocument } = require('../services/sentinelService');
      const seedDocs = [
        {
          title: 'Compensation and Acquisition SOP for Public Infrastructure Projects',
          source: 'MP Circular 14.3',
          department: 'Revenue Dept',
          documentType: 'Circular',
          content: 'SOP Section 2.4: Clearance of land acquisition for road projects must be finalized within 15 days of compensation disbursement. Section 2.5: Any pending claim dispute on commercial plots (like MP Nagar extension Zone 2) requires the collector to sign a conditional waiver to authorize asphalt laying, with a retrospective audit query to be cleared within 30 days.'
        },
        {
          title: 'Guidelines for Relocation of High Voltage Overhead Transmission Lines',
          source: 'Municipal SOP Clause 7',
          department: 'Energy Dept',
          documentType: 'SOP',
          content: 'SOP Clause 7.2: Power transmission line shifting along utility corridors (such as Kolar road utility alignment) must be executed within 10 days of alternative site clearance. Clause 7.3: For delayed relocation exceeding 15 days, the executing department (PWD) is permitted to request emergency route waivers. However, waivers must be approved by the Municipal Commissioner with a structural stability certification.'
        },
        {
          title: 'Standard Protocol for Laying Main Water Pipeline Diversions near Medical Corridors',
          source: 'Health SOP Clause 3',
          department: 'Water Supply Dept',
          documentType: 'Guidelines',
          content: 'Water Supply Guidelines Clause 3.4: Main water pipeline layout and connection works near critical hospital facilities (such as AIIMS Bhopal Medical Corridor) require a mandatory 48-hour scheduled shutdown window. Clause 3.5: Sign-off of the shutdown window must be approved by both the Chief Medical Officer and the Water Supply Nodal Officer. Clearances delayed by more than 7 days must be escalated to the District Collector for direct administrative bypass.'
        }
      ];
      for (const doc of seedDocs) {
        await ingestDocument(doc);
      }
      console.log('Sentinel policy documents seeded and embedded successfully!');
    }
    console.log('Database already contains data. Skipping auto-seeding.');
  }
};

module.exports = { connectDB, disconnectDB };
