import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter, Plus, MapPin, CheckCircle2, Clock, XCircle,
  AlertTriangle, ArrowRight, Bell, Calendar, FileText,
  Users, Zap, Building2, AlertCircle, TrendingUp, Activity,
  ChevronRight, Cpu, X, Check, Send, Download, ShieldAlert,
  Search, RefreshCw, Eye, MessageSquare, Layers, Lock, Unlock
} from 'lucide-react';

// ─── Per-Mission Master Data ───────────────────────────────────────────────────

const MISSION_DB = {
  aiims: {
    id: 'aiims',
    name: 'AIIMS Pipeline Upgrade',
    loc: 'AIIMS Corridor, Saket Nagar',
    level: 'CRITICAL',
    levelClass: 'bg-red-600 text-white',
    cri: 67,
    criColor: 'text-red-500',
    health: {
      risk: 'HIGH', riskColor: 'text-red-600',
      delay: '12 Days', burn: '₹80K / day',
      budget: 42, complaints: 28, approvals: 3,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: true,  active: false },
      { label: 'Excavation &\nWork Start', done: true,  active: false },
      { label: 'Utility\nShifting',        done: false, active: true  },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning',  status: 'completed',   dates: '15 May – 22 May', left: 0,  width: 18 },
      { label: 'Approvals & NOCs',   status: 'completed',   dates: '23 May – 05 Jun', left: 20, width: 20 },
      { label: 'Excavation',         status: 'in_progress', dates: '06 Jun – 18 Jun', left: 42, width: 18 },
      { label: 'Utility Shifting',   status: 'blocked',     dates: '19 Jun – 30 Jun', left: 62, width: 17 },
      { label: 'Construction',       status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Inspection',         status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Completion',         status: 'none',        dates: '',                left: 0,  width: 0  },
    ],
    blockers: 3,
    detailedBlockers: [
      {
        id: 'BLK-AIM-01',
        dept: 'Traffic Police',
        severity: 'CRITICAL',
        title: 'Emergency Ambulance Corridor Diversion Dispute',
        desc: 'Traffic Cell flagged severe gridlock risk during peak hours on Saket Nagar link road. Requires dedicated 3.5m ambulance passage before granting trenching permit.',
        daysStalled: 12,
        burn: '₹80,000 / day',
        nocStatus: 'Review Required',
        actionRequired: 'Authorize 24/7 dedicated traffic marshal deployment and approve revised one-way diversion protocol.'
      },
      {
        id: 'BLK-AIM-02',
        dept: 'Revenue Department',
        severity: 'HIGH',
        title: 'Land Right-of-Way Survey Document Missing',
        desc: 'Revenue inspector requested verified cadastral map for 120m stretch adjacent to AIIMS Gate 3 to prevent private boundary encroachment.',
        daysStalled: 8,
        burn: '₹40,000 / day',
        nocStatus: 'Pending DM Seal',
        actionRequired: 'Submit geo-referenced demarcation sheet certified by Nazul tehsildar.'
      },
      {
        id: 'BLK-AIM-03',
        dept: 'Energy Department',
        severity: 'MEDIUM',
        title: 'Underground Feeder HT Line Clearance',
        desc: '33KV underground electrical conduit detected 1.2m below planned 900mm ductile iron pipe trajectory. Joint shifting estimate pending.',
        daysStalled: 5,
        burn: '₹35,000 / day',
        nocStatus: 'Awaiting Joint Survey',
        actionRequired: 'Convene joint site inspection with MPPKVVCL distribution division.'
      }
    ],
    dependencies: [
      { name: 'Public Works Department', sub: 'Cleared & Handed Over', status: 'done',    Icon: Building2 },
      { name: 'Revenue Department',      sub: 'Land ROW Map Pending', status: 'pending', Icon: FileText  },
      { name: 'Traffic Police',          sub: 'Diversion Dispute (12d)', status: 'blocked', Icon: Users     },
      { name: 'Energy Department',       sub: 'HT Line Shifting Est.', status: 'pending', Icon: Zap       },
      { name: 'Municipal Corporation',   sub: 'Water Connection NOC Ready', status: 'done', Icon: Building2 },
    ],
    handshake: [
      { name: 'PWD',          status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. R. K. Sharma (EE)', phone: '0755-2554101' },
      { name: 'Revenue',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400', officer: 'Shri V. S. Chauhan (SLO)', phone: '0755-2554204' },
      { name: 'Traffic',      status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',             dot: 'bg-red-500',   officer: 'DSP M. P. Singh (Traffic HQ)', phone: '0755-2554308' },
      { name: 'Energy',       status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400', officer: 'Er. S. N. Verma (MPPKVVCL)', phone: '0755-2554412' },
      { name: 'Municipality', status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. Anoop Goyal (BMC Water)', phone: '0755-2554520' },
    ],
    feed: [
      { id: 'LOG-AIM-105', time: '09:41 AM', date: 'Today', actor: '[REVENUE_DEPT]', text: 'Revenue Department requested additional land demarcation sheet for AIIMS Gate 3 corridor.', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200', category: 'blocker' },
      { id: 'LOG-AIM-104', time: '09:27 AM', date: 'Today', actor: '[TRAFFIC_HQ]', text: 'Traffic Police raised concern on peak hour diversion and emergency vehicle transit.', tag: 'Pending', tagClass: 'text-amber-600 bg-amber-50 border-amber-200', category: 'action' },
      { id: 'LOG-AIM-103', time: '08:50 AM', date: 'Today', actor: '[AI_SENTINEL]', text: 'AI Recommendation: Resequence utility shifting activities along Saket Nagar link road to unlock 4 days.', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200', category: 'ai' },
      { id: 'LOG-AIM-102', time: '08:11 AM', date: 'Today', actor: '[CITIZEN_DESK]', text: 'Citizen report verified: Water pipeline pressure drop near work zone, BMC notified.', tag: 'Verified', tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200', category: 'citizen' },
      { id: 'LOG-AIM-101', time: 'Yesterday', date: '22 Sep', actor: '[PWD_CIVIL]', text: 'PWD updated work progress: Section A excavation 70% complete with safety barriers deployed.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
      { id: 'LOG-AIM-100', time: '21 Sep', date: '21 Sep', actor: '[DISTRICT_COLLECTOR]', text: 'Collector directive: Mandate joint interdepartmental inspection for Saket Nagar sector.', tag: 'Directive', tagClass: 'text-purple-600 bg-purple-50 border-purple-200', category: 'action' },
    ],
  },

  mpnagar: {
    id: 'mpnagar',
    name: 'MP Nagar Road Widening',
    loc: 'Zone 1 & 2 Commercial Corridor',
    level: 'CRITICAL',
    levelClass: 'bg-red-600 text-white',
    cri: 63,
    criColor: 'text-red-500',
    health: {
      risk: 'HIGH', riskColor: 'text-red-600',
      delay: '18 Days', burn: '₹95K / day',
      budget: 35, complaints: 41, approvals: 5,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: true,  active: false },
      { label: 'Excavation &\nWork Start', done: false, active: true  },
      { label: 'Utility\nShifting',        done: false, active: false },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '01 Apr – 10 Apr', left: 0,  width: 15 },
      { label: 'Approvals & NOCs',  status: 'completed',   dates: '11 Apr – 30 Apr', left: 17, width: 22 },
      { label: 'Excavation',        status: 'blocked',     dates: '01 May – 20 Jun', left: 41, width: 28 },
      { label: 'Utility Shifting',  status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Construction',      status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Inspection',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                left: 0,  width: 0  },
    ],
    blockers: 5,
    detailedBlockers: [
      {
        id: 'BLK-MPN-01',
        dept: 'Revenue Department',
        severity: 'CRITICAL',
        title: 'Commercial Land Compensation Sign-off Pending',
        desc: 'Land compensation file for 8 commercial establishments at Carmel Junction pending with Sub-Divisional Magistrate for 47 consecutive days.',
        daysStalled: 47,
        burn: '₹95,000 / day',
        nocStatus: 'Pending DM Seal',
        actionRequired: 'Issue formal Section 11 award decree under Land Acquisition Act.'
      },
      {
        id: 'BLK-MPN-02',
        dept: 'Energy Department (MPPKVVCL)',
        severity: 'CRITICAL',
        title: '33KV Transmission Pole Relocation Obstruction',
        desc: '7 high-tension distribution poles directly in the proposed 4-lane carriage path require scheduled grid shutdown clearance.',
        daysStalled: 24,
        burn: '₹55,000 / day',
        nocStatus: 'Shutdown Scheduled',
        actionRequired: 'Approve weekend night shutdown window (01:00 AM - 05:00 AM).'
      },
      {
        id: 'BLK-MPN-03',
        dept: 'Traffic Police',
        severity: 'HIGH',
        title: 'Zone 1 Peak Hour Traffic Diversion Plan Pending',
        desc: 'Traffic cell requested alternative parking plan for Chetak Bridge commuters during central median demolition.',
        daysStalled: 14,
        burn: '₹30,000 / day',
        nocStatus: 'In Review',
        actionRequired: 'Coordinate temporary multi-level parking access with BMC.'
      },
      {
        id: 'BLK-MPN-04',
        dept: 'Municipal Corporation (BMC)',
        severity: 'HIGH',
        title: 'Underground Stormwater Trunk Line Conflict',
        desc: 'Excavation plans clash with 1200mm stormwater box drain crossing DB Mall feeder road.',
        daysStalled: 11,
        burn: '₹25,000 / day',
        nocStatus: 'Engineering Re-design',
        actionRequired: 'Approve box-culvert bridge overpass design modification.'
      },
      {
        id: 'BLK-MPN-05',
        dept: 'Telecom & Fiber Ops',
        severity: 'MEDIUM',
        title: 'BSNL / Private OFC Duct Relocation',
        desc: 'Unmapped optical fiber bundles found along north pavement; joint shifting notice issued.',
        daysStalled: 7,
        burn: '₹15,000 / day',
        nocStatus: 'Notice Dispatched',
        actionRequired: 'Enforce 72-hour shifting deadline under Urban Infrastructure Rules.'
      }
    ],
    dependencies: [
      { name: 'Revenue Department',    sub: 'Land sign-off pending 47 days', status: 'blocked', Icon: FileText  },
      { name: 'Public Works Dept',     sub: 'Contractor mobilized on stand-by', status: 'done', Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Diversion plan submitted',       status: 'pending', Icon: Users     },
      { name: 'MPEB Energy',           sub: 'Pole relocation shutdown pending', status: 'blocked', Icon: Zap       },
      { name: 'Municipal Corporation', sub: 'Drain alignment review ongoing',  status: 'pending', Icon: Building2 },
    ],
    handshake: [
      { name: 'Revenue',  status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'Shri R. P. Tiwari (SDM)', phone: '0755-2558801' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. Dinesh Malviya (EE)', phone: '0755-2558802' },
      { name: 'Traffic',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'ACP Sanjay Soni', phone: '0755-2558803' },
      { name: 'MPEB',     status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'Er. Hemant Jain (SE)', phone: '0755-2558804' },
      { name: 'BMC',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'Er. Santosh Gupta (City Eng)', phone: '0755-2558805' },
    ],
    feed: [
      { id: 'LOG-MPN-205', time: '10:15 AM', date: 'Today', actor: '[REVENUE_DEPT]', text: 'Revenue Dept: Land compensation file escalated to DM office for fast-track clearance.', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200', category: 'blocker' },
      { id: 'LOG-MPN-204', time: '09:50 AM', date: 'Today', actor: '[PWD_CIVIL]', text: 'PWD site engineer confirmed 47-day blockage at Carmel Junction costing ₹95K/day in idle machinery.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
      { id: 'LOG-MPN-203', time: '08:30 AM', date: 'Today', actor: '[AI_SENTINEL]', text: 'AI: Friday penalty trigger in 2 days if unresolved — project CRI will drop to 48.', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200', category: 'ai' },
      { id: 'LOG-MPN-202', time: '08:00 AM', date: 'Today', actor: '[TRAFFIC_HQ]', text: 'Traffic Police: Peak hour concern flagged for MP Nagar Zone 2 rotary.', tag: 'Pending', tagClass: 'text-amber-600 bg-amber-50 border-amber-200', category: 'action' },
      { id: 'LOG-MPN-201', time: 'Yesterday', date: '22 Sep', actor: '[CITIZEN_DESK]', text: 'Citizen complaint: Road dust affecting school vicinity near Board Office, water sprinkling ordered.', tag: 'Verified', tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200', category: 'citizen' },
    ],
  },

  kolar: {
    id: 'kolar',
    name: 'Kolar Utility Relocation',
    loc: 'Kolar Corridor, Sarvadharma',
    level: 'HIGH',
    levelClass: 'bg-amber-500 text-white',
    cri: 56,
    criColor: 'text-amber-500',
    health: {
      risk: 'HIGH', riskColor: 'text-red-600',
      delay: '19 Days', burn: '₹45K / day',
      budget: 28, complaints: 15, approvals: 2,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: false, active: true  },
      { label: 'Excavation &\nWork Start', done: false, active: false },
      { label: 'Utility\nShifting',        done: false, active: false },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '10 May – 18 May', left: 0,  width: 18 },
      { label: 'Approvals & NOCs',  status: 'blocked',     dates: '19 May – ongoing', left: 20, width: 30 },
      { label: 'Excavation',        status: 'waiting',     dates: '',                 left: 0,  width: 0  },
      { label: 'Utility Shifting',  status: 'waiting',     dates: '',                 left: 0,  width: 0  },
      { label: 'Construction',      status: 'waiting',     dates: '',                 left: 0,  width: 0  },
      { label: 'Inspection',        status: 'waiting',     dates: '',                 left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                 left: 0,  width: 0  },
    ],
    blockers: 2,
    detailedBlockers: [
      {
        id: 'BLK-KLR-01',
        dept: 'Energy Department',
        severity: 'CRITICAL',
        title: '33KV Sub-Transmission Pole Relocation Pending',
        desc: 'MPPKVVCL has stalled pole shifting estimate for 19 days due to feeder shutdown scheduling constraints in Sarvadharma colony.',
        daysStalled: 19,
        burn: '₹45,000 / day',
        nocStatus: 'Estimate In Dispute',
        actionRequired: 'Convene coordination session with Superintending Engineer to authorize Sunday 6-hour shutdown.'
      },
      {
        id: 'BLK-KLR-02',
        dept: 'Municipal Corporation (BMC)',
        severity: 'HIGH',
        title: 'Stormwater Secondary Drain Invert Levels Conflict',
        desc: 'BMC drainage plan does not match road cross-section gradient. Waterlogging hazard flagged for upcoming monsoon.',
        daysStalled: 10,
        burn: '₹20,000 / day',
        nocStatus: 'Joint Survey Pending',
        actionRequired: 'Joint site survey by BMC Drainage Wing and PWD Civil Team.'
      }
    ],
    dependencies: [
      { name: 'Energy Department',     sub: 'Pole relocation 19 days stalled', status: 'blocked', Icon: Zap       },
      { name: 'Traffic Cell',          sub: 'Permit cleared',                   status: 'done',    Icon: Users     },
      { name: 'Public Works Dept',     sub: 'Awaiting energy NOC',             status: 'pending', Icon: Building2 },
      { name: 'Revenue Department',    sub: 'Site boundary confirmed',          status: 'done',    Icon: FileText  },
      { name: 'Municipal Corporation', sub: 'Storm drain layout pending',       status: 'pending', Icon: Building2 },
    ],
    handshake: [
      { name: 'Energy',   status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'Er. R. S. Solanki (MPPKVVCL)', phone: '0755-2559901' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Inspector K. P. Singh', phone: '0755-2559902' },
      { name: 'PWD',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'Er. Manish Joshi', phone: '0755-2559903' },
      { name: 'Revenue',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Shri B. L. Patidar', phone: '0755-2559904' },
      { name: 'BMC',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'Er. Ajay Saxena', phone: '0755-2559905' },
    ],
    feed: [
      { id: 'LOG-KLR-305', time: '11:02 AM', date: 'Today', actor: '[ENERGY_DEPT]', text: 'Energy Dept: Pole relocation estimate revised and submitted for technical sanction.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
      { id: 'LOG-KLR-304', time: '10:30 AM', date: 'Today', actor: '[AI_SENTINEL]', text: 'AI: Suggest parallel storm drain survey to compress critical path by 4 working days.', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200', category: 'ai' },
      { id: 'LOG-KLR-303', time: '09:15 AM', date: 'Today', actor: '[TRAFFIC_HQ]', text: 'Traffic Cell permit officially cleared — corridor designated for daytime light traffic.', tag: 'Verified', tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200', category: 'action' },
      { id: 'LOG-KLR-302', time: '08:45 AM', date: 'Today', actor: '[PWD_CIVIL]', text: 'PWD contractor stand-by notice received — awaiting Energy NOC to avoid contractor penalty.', tag: 'Pending', tagClass: 'text-amber-600 bg-amber-50 border-amber-200', category: 'blocker' },
      { id: 'LOG-KLR-301', time: 'Yesterday', date: '22 Sep', actor: '[REVENUE_DEPT]', text: 'Revenue Dept confirmed site boundary — cleared for preliminary grading.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
    ],
  },

  metro: {
    id: 'metro',
    name: 'Bhopal Metro Orange Line',
    loc: 'Subhash Nagar – Karond Axis',
    level: 'CRITICAL',
    levelClass: 'bg-red-600 text-white',
    cri: 54,
    criColor: 'text-amber-500',
    health: {
      risk: 'HIGH', riskColor: 'text-red-600',
      delay: '18 Days', burn: '₹150K / day',
      budget: 215, complaints: 52, approvals: 2,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: true,  active: false },
      { label: 'Excavation &\nWork Start', done: true,  active: false },
      { label: 'Utility\nShifting',        done: false, active: true  },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '01 Jan – 20 Jan', left: 0,  width: 15 },
      { label: 'Approvals & NOCs',  status: 'completed',   dates: '21 Jan – 15 Feb', left: 16, width: 20 },
      { label: 'Excavation',        status: 'completed',   dates: '16 Feb – 30 Mar', left: 38, width: 22 },
      { label: 'Utility Shifting',  status: 'blocked',     dates: '01 Apr – ongoing', left: 62, width: 24 },
      { label: 'Construction',      status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Inspection',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                left: 0,  width: 0  },
    ],
    blockers: 2,
    detailedBlockers: [
      {
        id: 'BLK-MTR-01',
        dept: 'Energy Department (MPPKVVCL)',
        severity: 'CRITICAL',
        title: '33KV Main Grid Feeder Shift along Pier 84–96',
        desc: 'Overhead 33KV cables crossing Subhash Nagar railway overbridge obstruct launch gantry deployment for elevated viaduct.',
        daysStalled: 18,
        burn: '₹150,000 / day',
        nocStatus: 'Pending Shutdown NOC',
        actionRequired: 'Issue District Collector executive order approving night-time 8-hour grid diversion.'
      },
      {
        id: 'BLK-MTR-02',
        dept: 'Traffic Police HQ',
        severity: 'HIGH',
        title: 'Karond Mandi Heavy Commercial Vehicle Routing',
        desc: 'Traffic cell requires dedicated truck diversion corridor via Bypass Road before closing central median for pier construction.',
        daysStalled: 12,
        burn: '₹60,000 / day',
        nocStatus: 'Traffic Plan Under Review',
        actionRequired: 'Deploy 40 traffic marshals and complete signages on outer bypass.'
      }
    ],
    dependencies: [
      { name: 'Energy Department',     sub: '33KV grid shift pending',   status: 'blocked', Icon: Zap       },
      { name: 'Traffic Police',        sub: 'Peak truck diversion plan',  status: 'pending', Icon: Users     },
      { name: 'Water Resources',       sub: 'Culvert drainage NOC done', status: 'done',    Icon: Building2 },
      { name: 'MPMRCL Metro Corp',     sub: 'Pier drawings approved',    status: 'done',    Icon: Building2 },
      { name: 'Public Works Dept',     sub: 'Service road widened',      status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Energy',   status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'Er. A. K. Shukla (Discom)', phone: '0755-2771101' },
      { name: 'Traffic',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'DCP Traffic MP', phone: '0755-2771102' },
      { name: 'Water',    status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. P. K. Singhal', phone: '0755-2771103' },
      { name: 'MPMRCL',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Director Works (MPMRCL)', phone: '0755-2771104' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'CE PWD Bhopal Zone', phone: '0755-2771105' },
    ],
    feed: [
      { id: 'LOG-MTR-403', time: '02:15 PM', date: 'Today', actor: '[MPPKVVCL]', text: 'Discom: 33KV power shutdown schedule submitted to Metro Cell for final approval.', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200', category: 'blocker' },
      { id: 'LOG-MTR-402', time: '11:20 AM', date: 'Today', actor: '[MPMRCL]', text: 'MPMRCL completed soil testing on Subhash Nagar bridge sector — foundations passed.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
      { id: 'LOG-MTR-401', time: '09:10 AM', date: 'Today', actor: '[AI_SENTINEL]', text: 'AI: Critical interlock on 33KV grid — convene joint Discom review to avoid ₹1.5L/day stall cost.', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200', category: 'ai' },
    ],
  },

  bhadbhada: {
    id: 'bhadbhada',
    name: 'Bhadbhada Junction Flyover',
    loc: 'Bhadbhada – Kaliasot Axis',
    level: 'CRITICAL',
    levelClass: 'bg-red-600 text-white',
    cri: 38,
    criColor: 'text-red-500',
    health: {
      risk: 'HIGH', riskColor: 'text-red-600',
      delay: '22 Days', burn: '₹65K / day',
      budget: 85, complaints: 38, approvals: 2,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: false, active: true  },
      { label: 'Excavation &\nWork Start', done: false, active: false },
      { label: 'Utility\nShifting',        done: false, active: false },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '10 Feb – 28 Feb', left: 0,  width: 18 },
      { label: 'Approvals & NOCs',  status: 'blocked',     dates: '01 Mar – ongoing', left: 20, width: 32 },
      { label: 'Excavation',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Utility Shifting',  status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Construction',      status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Inspection',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                left: 0,  width: 0  },
    ],
    blockers: 2,
    detailedBlockers: [
      {
        id: 'BLK-BHD-01',
        dept: 'Forest & Environment Dept',
        severity: 'CRITICAL',
        title: 'Tree Translocation & Environmental Buffer NOC',
        desc: 'Translocation of 42 mature trees on Kaliasot approach corridor pending sanction from District Tree Authority.',
        daysStalled: 22,
        burn: '₹65,000 / day',
        nocStatus: 'Pending DFO Approval',
        actionRequired: 'Sanction compensatory afforestation deposit of ₹18 Lakhs to Van Vihar authority.'
      },
      {
        id: 'BLK-BHD-02',
        dept: 'Public Works Dept (PWD)',
        severity: 'HIGH',
        title: 'Foundation Piling Geo-Technical Clearance',
        desc: 'Hard basalt rock stratum depth mismatch between borehole 4 and borehole 7 requires structural re-check.',
        daysStalled: 9,
        burn: '₹35,000 / day',
        nocStatus: 'Soil Report Under Review',
        actionRequired: 'Authorize MANIT civil engineering department audit report.'
      }
    ],
    dependencies: [
      { name: 'Revenue / Forest',      sub: 'Tree translocation NOC pending (22d)', status: 'blocked', Icon: FileText  },
      { name: 'Public Works Dept',     sub: 'Foundation piling queued',       status: 'pending', Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Bypass diversion tested',        status: 'done',    Icon: Users     },
      { name: 'Water Resources',       sub: 'Dam spillway clearance done',    status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Forest',   status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'DFO Bhopal Social Forestry', phone: '0755-2882201' },
      { name: 'PWD',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'Er. Gautam Roy', phone: '0755-2882202' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'DSP South Zone Traffic', phone: '0755-2882203' },
      { name: 'Water',    status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. S. C. Mishra (WRD)', phone: '0755-2882204' },
    ],
    feed: [
      { id: 'LOG-BHD-502', time: '03:40 PM', date: 'Today', actor: '[FOREST_DEPT]', text: 'Forest Dept compensatory afforestation plan awaiting Collector seal and treasury deposit.', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200', category: 'blocker' },
      { id: 'LOG-BHD-501', time: '01:15 PM', date: 'Today', actor: '[TRAFFIC_HQ]', text: 'Traffic diversion along Kaliasot bypass operational and tested during peak hours.', tag: 'Verified', tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200', category: 'action' },
    ],
  },

  lake_stp: {
    id: 'lake_stp',
    name: 'Upper Lake 50 MLD STP',
    loc: 'Bhoj Wetland Catchment Area',
    level: 'CRITICAL',
    levelClass: 'bg-red-600 text-white',
    cri: 30,
    criColor: 'text-red-500',
    health: {
      risk: 'CRITICAL', riskColor: 'text-red-600',
      delay: '26 Days', burn: '₹75K / day',
      budget: 165, complaints: 64, approvals: 2,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: false, active: true  },
      { label: 'Excavation &\nWork Start', done: false, active: false },
      { label: 'Utility\nShifting',        done: false, active: false },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '01 Jan – 15 Jan', left: 0,  width: 14 },
      { label: 'Approvals & NOCs',  status: 'blocked',     dates: '16 Jan – ongoing', left: 16, width: 35 },
      { label: 'Excavation',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Utility Shifting',  status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Construction',      status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Inspection',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                left: 0,  width: 0  },
    ],
    blockers: 2,
    detailedBlockers: [
      {
        id: 'BLK-STP-01',
        dept: 'MPPCB Pollution Board',
        severity: 'CRITICAL',
        title: 'Consent to Establish (CTE) Wetland Buffer Clearance',
        desc: 'MPPCB environmental committee requested secondary effluent bio-remediation design review to protect Ramsar wetland status.',
        daysStalled: 26,
        burn: '₹75,000 / day',
        nocStatus: 'CTE Under Scrutiny',
        actionRequired: 'Submit EPCO wetland boundary compliance affidavit signed by BMC Commissioner.'
      },
      {
        id: 'BLK-STP-02',
        dept: 'Energy Department',
        severity: 'HIGH',
        title: 'Dedicated Dual-Feeder 11KV Substation Land',
        desc: 'Site for continuous uninterruptible power feeder substation pending allotment from Revenue Department.',
        daysStalled: 14,
        burn: '₹35,000 / day',
        nocStatus: 'Revenue Allotment Pending',
        actionRequired: 'Revenue Dept to issue Khasra land transfer order for 2,000 sq ft plot.'
      }
    ],
    dependencies: [
      { name: 'MPPCB Pollution Board', sub: 'Consent to Establish pending (26d)', status: 'blocked', Icon: Building2 },
      { name: 'Energy Department',     sub: 'Feeder line plot allotment pending', status: 'pending', Icon: Zap       },
      { name: 'Public Works Dept',     sub: 'Inflow pipeline route survey cleared', status: 'done',    Icon: Building2 },
      { name: 'Smart City Mission',    sub: 'Tender award finalized',              status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'MPPCB',    status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'Member Secretary MPPCB', phone: '0755-2993301' },
      { name: 'Energy',   status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'EE City Circle MPEB', phone: '0755-2993302' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. N. K. Baghel', phone: '0755-2993303' },
      { name: 'SmartCity',status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'CEO Smart City Bhopal', phone: '0755-2993304' },
    ],
    feed: [
      { id: 'LOG-STP-602', time: '04:10 PM', date: 'Today', actor: '[MPPCB_BOARD]', text: 'MPPCB: Environmental compliance committee meeting scheduled for Friday 11:00 AM.', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200', category: 'blocker' },
      { id: 'LOG-STP-601', time: '01:50 PM', date: 'Today', actor: '[EPCO_SURVEY]', text: 'Bhoj Wetland ecological buffer zone demarcated by EPCO survey team.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
    ],
  },

  hamidia: {
    id: 'hamidia',
    name: 'Hamidia Smart Transit Spine',
    loc: 'Old City & Royal Market Access',
    level: 'CRITICAL',
    levelClass: 'bg-red-600 text-white',
    cri: 32,
    criColor: 'text-red-500',
    health: {
      risk: 'CRITICAL', riskColor: 'text-red-600',
      delay: '31 Days', burn: '₹45K / day',
      budget: 48, complaints: 47, approvals: 2,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: false, active: true  },
      { label: 'Excavation &\nWork Start', done: false, active: false },
      { label: 'Utility\nShifting',        done: false, active: false },
      { label: 'Construction',             done: false, active: false },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '01 Feb – 15 Feb', left: 0,  width: 14 },
      { label: 'Approvals & NOCs',  status: 'blocked',     dates: '16 Feb – ongoing', left: 16, width: 38 },
      { label: 'Excavation',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Utility Shifting',  status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Construction',      status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Inspection',        status: 'waiting',     dates: '',                left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                left: 0,  width: 0  },
    ],
    blockers: 2,
    detailedBlockers: [
      {
        id: 'BLK-HMD-01',
        dept: 'Revenue Department',
        severity: 'CRITICAL',
        title: 'Peer Gate Heritage Commercial Compensation Dispute',
        desc: 'Old city heritage precinct rehabilitation package disputed by 14 shopkeepers near Peer Gate.',
        daysStalled: 31,
        burn: '₹45,000 / day',
        nocStatus: 'Dispute Hearing Pending',
        actionRequired: 'Convene Collector tripartite hearing to finalize alternative market complex allotments.'
      },
      {
        id: 'BLK-HMD-02',
        dept: 'Traffic Police',
        severity: 'HIGH',
        title: 'Emergency Trauma Ward Transit Routing',
        desc: 'Traffic cell requires operational bypass ensuring 24/7 unhindered transit for ambulances entering Hamidia Trauma Centre.',
        daysStalled: 15,
        burn: '₹25,000 / day',
        nocStatus: 'Bypass Under Review',
        actionRequired: 'Deploy automated boom barrier and dedicated emergency green corridor.'
      }
    ],
    dependencies: [
      { name: 'Revenue Department',    sub: 'Old city shop compensation (31d)', status: 'blocked', Icon: FileText  },
      { name: 'Traffic Police',        sub: 'Ambulance bay routing in review',  status: 'pending', Icon: Users     },
      { name: 'Energy Department',     sub: 'Old cable undergrounding ready',   status: 'done',    Icon: Zap       },
      { name: 'Public Works Dept',     sub: 'Road geometry cleared',            status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Revenue',  status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',   dot: 'bg-red-500', officer: 'City Magistrate Bhopal', phone: '0755-2664401' },
      { name: 'Traffic',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400', officer: 'ACP Old City Traffic', phone: '0755-2664402' },
      { name: 'Energy',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. O. P. Sen (MPEB)', phone: '0755-2664403' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. Vikas Khare', phone: '0755-2664404' },
    ],
    feed: [
      { id: 'LOG-HMD-702', time: '05:00 PM', date: 'Today', actor: '[DISTRICT_COLLECTOR]', text: 'Collector directive: fast-track Peer Gate commercial compensation settlement hearing on Monday.', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200', category: 'blocker' },
      { id: 'LOG-HMD-701', time: '02:30 PM', date: 'Today', actor: '[SMART_CITY]', text: 'Hamidia emergency ward access maintained via temporary bypass road during day shift.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
    ],
  },

  brts: {
    id: 'brts',
    name: 'BRTS Corridor Redesign',
    loc: 'Hoshangabad Road Axis',
    level: 'MEDIUM',
    levelClass: 'bg-blue-600 text-white',
    cri: 82,
    criColor: 'text-blue-500',
    health: {
      risk: 'MEDIUM', riskColor: 'text-amber-600',
      delay: '3 Days', burn: '₹60K / day',
      budget: 65, complaints: 7, approvals: 1,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: true,  active: false },
      { label: 'Excavation &\nWork Start', done: true,  active: false },
      { label: 'Utility\nShifting',        done: true,  active: false },
      { label: 'Construction',             done: false, active: true  },
      { label: 'Inspection',               done: false, active: false },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '01 Mar – 08 Mar', left: 0,  width: 12 },
      { label: 'Approvals & NOCs',  status: 'completed',   dates: '09 Mar – 25 Mar', left: 14, width: 18 },
      { label: 'Excavation',        status: 'completed',   dates: '26 Mar – 15 Apr', left: 34, width: 16 },
      { label: 'Utility Shifting',  status: 'completed',   dates: '16 Apr – 05 May', left: 52, width: 14 },
      { label: 'Construction',      status: 'in_progress', dates: '06 May – ongoing', left: 68, width: 20 },
      { label: 'Inspection',        status: 'waiting',     dates: '',                 left: 0,  width: 0  },
      { label: 'Completion',        status: 'none',        dates: '',                 left: 0,  width: 0  },
    ],
    blockers: 1,
    detailedBlockers: [
      {
        id: 'BLK-BRT-01',
        dept: 'Revenue Department',
        severity: 'MEDIUM',
        title: 'Road Width Demarcation NOC for Misrod Section',
        desc: 'Final demarcation verification pending at Misrod junction before placing median kerbstones.',
        daysStalled: 3,
        burn: '₹60,000 / day',
        nocStatus: 'Pending Final Inspection',
        actionRequired: 'Depute revenue surveyor to complete final chainage check.'
      }
    ],
    dependencies: [
      { name: 'Public Works Dept',     sub: 'Cleared',                   status: 'done',    Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Signal plan approved',      status: 'done',    Icon: Users     },
      { name: 'Energy Department',     sub: 'Streetlight poles shifted', status: 'done',    Icon: Zap       },
      { name: 'Revenue Department',    sub: 'Pending final NOC (3d)',    status: 'pending', Icon: FileText  },
      { name: 'Municipal Corporation', sub: 'Drain linkage cleared',     status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. Sunita Roy', phone: '0755-2441101' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'TI Hoshangabad Road', phone: '0755-2441102' },
      { name: 'Energy',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. R. Sharma (MPEB)', phone: '0755-2441103' },
      { name: 'Revenue',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400', officer: 'Tehsildar Huzur', phone: '0755-2441104' },
      { name: 'BMC',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'BMC Zone 14 Officer', phone: '0755-2441105' },
    ],
    feed: [
      { id: 'LOG-BRT-803', time: '12:10 PM', date: 'Today', actor: '[PWD_CIVIL]', text: 'Construction team confirmed 70% median redesign complete along Board Office–Misrod stretch.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
      { id: 'LOG-BRT-802', time: '11:30 AM', date: 'Today', actor: '[REVENUE_DEPT]', text: 'Revenue Dept final NOC expected by tomorrow EOD following site verification.', tag: 'Pending', tagClass: 'text-amber-600 bg-amber-50 border-amber-200', category: 'action' },
      { id: 'LOG-BRT-801', time: '10:00 AM', date: 'Today', actor: '[AI_SENTINEL]', text: 'AI: On-track for 3-day buffer — no critical escalation required.', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200', category: 'ai' },
    ],
  },

  smart2: {
    id: 'smart2',
    name: 'Smart Road Package - 2',
    loc: 'Polytechnic – Depot Square Corridor',
    level: 'LOW',
    levelClass: 'bg-slate-600 text-white',
    cri: 91,
    criColor: 'text-emerald-500',
    health: {
      risk: 'LOW', riskColor: 'text-emerald-600',
      delay: '0 Days', burn: '₹30K / day',
      budget: 78, complaints: 3, approvals: 0,
    },
    timeline: [
      { label: 'Survey &\nPlanning',       done: true,  active: false },
      { label: 'Approvals &\nNOCs',        done: true,  active: false },
      { label: 'Excavation &\nWork Start', done: true,  active: false },
      { label: 'Utility\nShifting',        done: true,  active: false },
      { label: 'Construction',             done: true,  active: false },
      { label: 'Inspection',               done: false, active: true  },
      { label: 'Completion',               done: false, active: false },
    ],
    gantt: [
      { label: 'Survey & Planning', status: 'completed',   dates: '01 Jan – 10 Jan', left: 0,  width: 10 },
      { label: 'Approvals & NOCs',  status: 'completed',   dates: '11 Jan – 31 Jan', left: 12, width: 14 },
      { label: 'Excavation',        status: 'completed',   dates: '01 Feb – 20 Feb', left: 28, width: 12 },
      { label: 'Utility Shifting',  status: 'completed',   dates: '21 Feb – 10 Mar', left: 42, width: 12 },
      { label: 'Construction',      status: 'completed',   dates: '11 Mar – 30 May', left: 56, width: 22 },
      { label: 'Inspection',        status: 'in_progress', dates: '01 Jun – ongoing', left: 80, width: 14 },
      { label: 'Completion',        status: 'waiting',     dates: '',                 left: 0,  width: 0  },
    ],
    blockers: 0,
    detailedBlockers: [],
    dependencies: [
      { name: 'Public Works Dept',     sub: 'Cleared',                status: 'done', Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Cleared',                status: 'done', Icon: Users     },
      { name: 'Energy Department',     sub: 'Cleared',                status: 'done', Icon: Zap       },
      { name: 'Revenue Department',    sub: 'Cleared',                status: 'done', Icon: FileText  },
      { name: 'Municipal Corporation', sub: 'Final sign-off pending', status: 'pending', Icon: Building2 },
    ],
    handshake: [
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. Kamal Soni', phone: '0755-2335501' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'TI TT Nagar', phone: '0755-2335502' },
      { name: 'Energy',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Er. Naveen Jain', phone: '0755-2335503' },
      { name: 'Revenue',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', officer: 'Naib Tehsildar City', phone: '0755-2335504' },
      { name: 'BMC',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400', officer: 'Er. Deepak Rai', phone: '0755-2335505' },
    ],
    feed: [
      { id: 'LOG-SM2-903', time: '01:00 PM', date: 'Today', actor: '[QA_INSPECTION]', text: 'Inspection team: structural integrity check in progress — surface compaction passed.', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200', category: 'action' },
      { id: 'LOG-SM2-902', time: '10:45 AM', date: 'Today', actor: '[BMC_OFFICE]', text: 'BMC final sign-off to complete upon inspection clearance certification.', tag: 'Pending', tagClass: 'text-amber-600 bg-amber-50 border-amber-200', category: 'action' },
      { id: 'LOG-SM2-901', time: '09:30 AM', date: 'Today', actor: '[AI_SENTINEL]', text: 'AI: Completion forecast on schedule — zero active risk flags.', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200', category: 'ai' },
    ],
  },
};

const MISSIONS = Object.values(MISSION_DB);

const GANTT_BAR_STYLES = {
  completed:   { bar: 'bg-emerald-500' },
  in_progress: { bar: 'bg-blue-600'   },
  blocked:     { bar: 'bg-amber-500'  },
  waiting:     { bar: 'bg-slate-200'  },
  none:        { bar: ''              },
};

const OFFICER_ACTIONS = [
  { label: 'Approve NOC',               Icon: CheckCircle2, color: 'text-emerald-600', toast: 'NOC Approval initiated successfully.' },
  { label: 'Request Clarification',     Icon: AlertCircle,  color: 'text-blue-600',    toast: 'Clarification request sent to departments.' },
  { label: 'Escalate to Collector',     Icon: TrendingUp,   color: 'text-red-500',     toast: 'Mission escalated to District Collector.' },
  { label: 'Notify Departments',        Icon: Bell,         color: 'text-amber-500',   toast: 'All departments notified via UNITY alert.' },
  { label: 'Schedule Joint Inspection', Icon: Calendar,     color: 'text-slate-600',   toast: 'Joint inspection scheduled for next working day.' },
  { label: 'Generate Meeting Brief',    Icon: FileText,     color: 'text-slate-600',   toast: 'Meeting brief generated and ready to download.' },
];

// ─── CRI Gauge ────────────────────────────────────────────────────────────────
function CRIGauge({ value }) {
  const r = 44;
  const circ = Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100) / 100;
  const offset = circ * (1 - pct);
  const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="120" height="68" viewBox="0 0 120 68">
          <path d="M 10 62 A 44 44 0 0 1 110 62" fill="none" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
          <path d="M 10 62 A 44 44 0 0 1 110 62" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
          <text x="6"   y="67" fontSize="8" fill="#94a3b8" fontWeight="bold">0</text>
          <text x="100" y="67" fontSize="8" fill="#94a3b8" fontWeight="bold">100</text>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-black text-slate-900 leading-none">{value}</span>
        </div>
      </div>
      <p className="text-xs font-bold text-slate-500 mt-1">CRI Score</p>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-700';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${bg} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl max-w-sm animate-fade-in`}>
      <Check size={14} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white ml-1"><X size={13} /></button>
    </div>
  );
}

// ─── New Mission Modal ────────────────────────────────────────────────────────
function NewMissionModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', loc: '', dept: 'roads', level: 'MEDIUM', budget: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.loc) return;
    setSubmitting(true);
    setTimeout(() => {
      onCreated(form.name);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">New Mission</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Register a new coordination mission in UNITY</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Name *</label>
            <input
              required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Ring Road Phase 3 Expansion"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location *</label>
            <input
              required value={form.loc} onChange={e => setForm(f => ({ ...f, loc: e.target.value }))}
              placeholder="e.g. Zone 3, Bhopal"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white">
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Department</label>
              <select value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white">
                <option value="roads">PWD / Roads</option>
                <option value="water">BMC Water</option>
                <option value="energy">MPEB Energy</option>
                <option value="traffic">Traffic Police</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Budget (Cr)</label>
            <input
              type="number" min="0" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              placeholder="e.g. 12.5"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {submitting ? <><Clock size={12} className="animate-spin" /> Creating…</> : <><Send size={12} /> Create Mission</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Projects() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId]       = useState('aiims');
  const [toast, setToast]                 = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [activeTab, setActiveTab]         = useState('timeline'); // 'timeline' | 'blockers' | 'activity' | 'handshake'
  const [missions, setMissions]           = useState(MISSIONS);
  const [feedItems, setFeedItems]         = useState([]);
  const [activeBlockers, setActiveBlockers] = useState([]);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'action' | 'blocker' | 'ai' | 'citizen'
  const [newDirectiveText, setNewDirectiveText] = useState('');

  const mission = MISSION_DB[selectedId] || MISSION_DB['aiims'];

  // Sync state when mission changes
  useEffect(() => {
    setFeedItems(mission.feed || []);
    setActiveBlockers(mission.detailedBlockers || []);
  }, [selectedId]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const handleAction = (action) => {
    showToast(action.toast, 'success');
    const newEntry = {
      id: `LOG-ACT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      date: 'Today',
      actor: '[DISTRICT_COLLECTOR]',
      text: `Officer Directive: ${action.label} executed for ${mission.name}. Status updated in inter-agency matrix.`,
      tag: 'Action Taken',
      tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      category: 'action'
    };
    setFeedItems(prev => [newEntry, ...prev]);
  };

  const handleResolveBlocker = (blockerId, actionName) => {
    showToast(`Fast-Track Action: "${actionName}" executed on ${blockerId}`, 'success');
    setActiveBlockers(prev => prev.filter(b => b.id !== blockerId));
    
    // Register in real-time activity log
    const newEntry = {
      id: `LOG-RES-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      date: 'Today',
      actor: '[EXECUTIVE_AUTHORITY]',
      text: `Blocker ${blockerId} Fast-Tracked: ${actionName} applied. Inter-agency NOC released.`,
      tag: 'Blocker Resolved',
      tagClass: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      category: 'action'
    };
    setFeedItems(prev => [newEntry, ...prev]);
  };

  const handleAddDirective = (e) => {
    e.preventDefault();
    if (!newDirectiveText.trim()) return;
    const newEntry = {
      id: `LOG-DIR-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      date: 'Today',
      actor: '[DISTRICT_COLLECTOR]',
      text: newDirectiveText.trim(),
      tag: 'Executive Note',
      tagClass: 'text-blue-700 bg-blue-50 border-blue-200',
      category: 'action'
    };
    setFeedItems(prev => [newEntry, ...prev]);
    setNewDirectiveText('');
    showToast('Executive Directive logged to audit trail.', 'success');
  };

  const handleExportCSV = () => {
    const headers = 'Log ID,Timestamp,Date,Actor,Category,Tag,Details\n';
    const rows = feedItems.map(item => 
      `"${item.id}","${item.time}","${item.date}","${item.actor}","${item.category}","${item.tag}","${item.text.replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UNITY_${mission.id}_Activity_Log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Activity log exported for ${mission.name}`, 'success');
  };

  const handleMissionCreated = (name) => {
    showToast(`Mission "${name}" registered successfully.`, 'success');
  };

  // Filtered Feed
  const filteredFeed = useMemo(() => {
    return feedItems.filter(item => {
      const matchesCategory = activityFilter === 'all' || item.category === activityFilter;
      const matchesSearch = searchQuery === '' || 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [feedItems, activityFilter, searchQuery]);

  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-50 font-sans text-slate-800 overflow-hidden">

      {/* Toast Notification */}
      {toast && <Toast key={toast.id} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* New Mission Modal */}
      {showModal && <NewMissionModal onClose={() => setShowModal(false)} onCreated={handleMissionCreated} />}

      {/* ═══ LEFT — Mission Queue (All 8 Projects) ════════════════════════════ */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Active Missions</h3>
            <p className="text-[9px] text-slate-400 font-mono">Bhopal Metro Zone 01 ({missions.length})</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={() => showToast('Filters: All 8 infrastructure missions active.', 'info')}>
            <Filter size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedId(m.id);
              }}
              className={`w-full text-left px-4 py-3 transition-all ${
                selectedId === m.id
                  ? 'bg-blue-50/90 border-l-[3px] border-l-blue-700'
                  : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`text-xs font-bold leading-tight ${selectedId === m.id ? 'text-blue-950 font-black' : 'text-slate-800'}`}>
                  {m.name}
                </span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 ${m.levelClass}`}>
                  {m.level}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin size={9} />
                  <span className="truncate max-w-[100px]">{m.loc}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(m.detailedBlockers?.length || m.blockers) > 0 && (
                    <span className="text-[9px] font-black text-red-600 bg-red-50 border border-red-200 px-1 rounded">
                      {m.detailedBlockers?.length || m.blockers} BLK
                    </span>
                  )}
                  <span className={`font-black font-mono ${m.criColor}`}>CRI {m.cri}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/30">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-slate-300 rounded-lg text-[11px] font-bold text-slate-600 hover:border-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus size={13} />
            Register New Mission
          </button>
        </div>
      </aside>

      {/* ═══ CENTER — Multi-Tab Mission Console ════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">

        {/* Console Header & Tabs Bar */}
        <div className="bg-white border-b border-slate-200 px-5 pt-3 pb-0 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${mission.levelClass}`}>
                  {mission.level} PRIORITY
                </span>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">{mission.name}</h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                <MapPin size={11} className="text-slate-400" /> {mission.loc} · ID: {mission.id.toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/authority/projects/${mission.id}`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Eye size={12} /> View Project Specs
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-[11px] font-bold text-white transition-colors"
              >
                <Download size={12} /> Export Audit Log
              </button>
            </div>
          </div>

          {/* Tab Navigation Navigation Strip */}
          <div className="flex items-center gap-1 border-t border-slate-100 pt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-blue-700 text-blue-900 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Layers size={13} />
              Overview & Timeline
            </button>

            <button
              onClick={() => setActiveTab('blockers')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'blockers'
                  ? 'border-red-600 text-red-700 bg-red-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert size={13} className={activeBlockers.length > 0 ? 'text-red-500' : 'text-slate-400'} />
              Active Blockers & Bottlenecks
              {activeBlockers.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white">
                  {activeBlockers.length}
                </span>
              ) : (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  0
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'border-blue-700 text-blue-900 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Activity size={13} className="text-blue-600" />
              Activity & Decision Audit Log
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                {feedItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('handshake')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'handshake'
                  ? 'border-blue-700 text-blue-900 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Users size={13} />
              Inter-Agency Handshake
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto">

          {/* ═════════════════════════════════════════════════════════════════════
              TAB 1: TIMELINE & GANTT OVERVIEW
             ═════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'timeline' && (
            <div className="p-5 space-y-5">

              {/* Blocked Alert Banner with Direct Tab Jump */}
              {activeBlockers.length > 0 ? (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-red-900 block">
                        C-Lock Warning: Waiting on {activeBlockers.length} active department blocker{activeBlockers.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[10px] text-red-700 font-mono">
                        Daily idle burn penalty: {mission.health.burn} · Stalled delay: {mission.health.delay}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('blockers')}
                    className="flex items-center gap-1 text-xs font-black text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm shrink-0"
                  >
                    View & Resolve Blockers <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">All Interdepartmental Clearances Verified</span>
                      <span className="text-[10px] text-emerald-700 font-mono">C-Lock released · Zero active critical path bottlenecks</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 font-mono bg-emerald-100 px-2 py-1 rounded">
                    100% CLEAR
                  </span>
                </div>
              )}

              {/* Mission Timeline & Stages */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={13} className="text-blue-700" /> Milestone Stage Tracker
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Stage Progress (7 Milestones)</span>
                </div>

                <div className="flex items-start gap-0 overflow-x-auto pb-2">
                  {mission.timeline.map((stage, idx) => (
                    <div key={idx} className="flex items-center flex-1 min-w-[85px]">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                          stage.done   ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : stage.active ? 'bg-amber-500 border-amber-500 text-white shadow-sm ring-4 ring-amber-100'
                          : 'bg-white border-slate-300 text-slate-300'
                        }`}>
                          {stage.done   ? <CheckCircle2 size={15} />
                          : stage.active ? <Clock size={15} />
                          : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 text-center mt-1.5 leading-tight whitespace-pre-line">
                          {stage.label}
                        </p>
                      </div>
                      {idx < mission.timeline.length - 1 && (
                        <div className={`h-0.5 flex-1 -mt-5 transition-all ${stage.done ? 'bg-blue-600' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Gantt View */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gantt Critical Path & Schedule</span>
                    <span className="text-[10px] text-slate-400 font-mono">Red line indicates current day marker</span>
                  </div>
                  <div className="space-y-1.5 relative">
                    <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-red-500 z-10 pointer-events-none" style={{ left: '72%' }}>
                      <span className="absolute -bottom-5 left-1 text-[9px] font-black text-red-600 bg-white border border-red-200 px-1 rounded shadow-xs">Today</span>
                    </div>
                    {mission.gantt.map((row, idx) => {
                      const style = GANTT_BAR_STYLES[row.status] || {};
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-600 font-bold w-32 shrink-0">{row.label}</span>
                          <div className="flex-1 h-5 bg-slate-100 rounded-full relative overflow-hidden">
                            {row.width > 0 && (
                              <div className={`absolute h-full rounded-full ${style.bar} flex items-center px-2 transition-all duration-500`}
                                style={{ left: `${row.left}%`, width: `${row.width}%` }}>
                                <span className="text-[8px] text-white font-bold truncate">{row.dates}</span>
                              </div>
                            )}
                            {row.status === 'waiting' && (
                              <div className="absolute inset-0 flex items-center px-3">
                                <span className="text-[9px] text-slate-400 font-medium">Pending Upstream Clearance</span>
                              </div>
                            )}
                          </div>
                          {row.status === 'blocked'     && <span className="text-[8px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Blocked</span>}
                          {row.status === 'completed'   && <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Done</span>}
                          {row.status === 'in_progress' && <span className="text-[8px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">In Progress</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Split: Quick Blocker Snapshot & Recent Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Blocker & Dependency Quick Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-700" /> Agency Clearances & Bottlenecks
                      </h3>
                      <button
                        onClick={() => setActiveTab('blockers')}
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5"
                      >
                        All Blockers ({activeBlockers.length}) <ChevronRight size={12} />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {mission.dependencies.map((dep, idx) => {
                        const DepIcon = dep.Icon;
                        return (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              dep.status === 'done'    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : dep.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-500'
                              : 'bg-red-50 border-red-200 text-red-500'
                            }`}>
                              <DepIcon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 leading-tight">{dep.name}</p>
                              {dep.sub && <p className="text-[10px] text-slate-400 mt-0.5 truncate">{dep.sub}</p>}
                            </div>
                            <div className="shrink-0">
                              {dep.status === 'done'    && <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">CLEARED</span>}
                              {dep.status === 'pending' && <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">PENDING</span>}
                              {dep.status === 'blocked' && <span className="text-[9px] font-black text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">BLOCKED</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('handshake')}
                    className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    View Inter-Agency Handshake Matrix <ArrowRight size={12} />
                  </button>
                </div>

                {/* Recent Decision Activity Feed */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity size={13} className="text-blue-600" /> Recent Activity & Directives
                      </h3>
                      <button
                        onClick={() => setActiveTab('activity')}
                        className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5"
                      >
                        Full Audit Log ({feedItems.length}) <ChevronRight size={12} />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {feedItems.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-50/60 border border-slate-100 flex items-start gap-2.5 text-xs">
                          <span className="text-[9px] font-mono text-slate-400 w-14 shrink-0 pt-0.5">{item.time}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 font-medium leading-snug">{item.text}</p>
                            <span className="text-[9px] font-mono text-slate-400 mt-0.5 block">{item.actor}</span>
                          </div>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0 ${item.tagClass}`}>
                            {item.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('activity')}
                    className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    Open Live Activity Console & Audit Trail <ArrowRight size={12} />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              TAB 2: ACTIVE BLOCKERS & BOTTLENECKS REGISTER
             ═════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'blockers' && (
            <div className="p-5 space-y-5">
              
              {/* Blocker Stats Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active Mission Blockers</span>
                  <span className="text-2xl font-black text-red-600 font-mono">{activeBlockers.length}</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">Holding work packages</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Delay Accumulated</span>
                  <span className="text-2xl font-black text-slate-800 font-mono">{mission.health.delay}</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">Projected variance</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Idle Machinery Burn</span>
                  <span className="text-2xl font-black text-red-600 font-mono">{mission.health.burn}</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">Public capital exposure</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">C-Lock Clearance State</span>
                  <span className={`text-sm font-black font-mono mt-2 block ${activeBlockers.length === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {activeBlockers.length === 0 ? '✓ NOC CLEAR (RELEASED)' : '🔒 LOCKED (NOC PENDING)'}
                  </span>
                </div>
              </div>

              {/* Blockers Register List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert size={14} className="text-red-600" /> Active Interdepartmental Bottleneck Log
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Detailed clearance hold-ups requiring executive action</p>
                  </div>
                  <button
                    onClick={() => showToast('All department nodal officers pinged with emergency notice.', 'success')}
                    className="flex items-center gap-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    <Bell size={12} /> Broadcast Emergency Notice
                  </button>
                </div>

                {activeBlockers.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">Zero Active Blockers on this Mission</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      All required departmental NOCs, utility shifts, and environmental clearances are 100% verified and active.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {activeBlockers.map((b) => (
                      <div key={b.id} className="p-4 hover:bg-slate-50/50 transition-colors space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black font-mono bg-slate-900 text-white px-2 py-0.5 rounded">
                              {b.id}
                            </span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono ${
                              b.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {b.severity}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{b.title}</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <Clock size={12} /> {b.daysStalled} Days Overdue
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-600 font-bold">{b.dept}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed pl-1">
                          {b.desc}
                        </p>

                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Action Required for NOC Clearance</span>
                            <p className="text-xs font-bold text-slate-800">{b.actionRequired}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleResolveBlocker(b.id, 'Issue 24h DM Directive')}
                              className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors"
                            >
                              Issue 24h DM Directive
                            </button>
                            <button
                              onClick={() => handleResolveBlocker(b.id, 'Grant Emergency NOC Override')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                            >
                              Grant Emergency NOC Override
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              TAB 3: ACTIVITY & DECISION AUDIT LOG
             ═════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'activity' && (
            <div className="p-5 space-y-5">

              {/* Log Action Direct Input */}
              <form onSubmit={handleAddDirective} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-blue-700" /> Log Executive Action / Field Directive
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Appends to permanent public governance audit trail</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDirectiveText}
                    onChange={(e) => setNewDirectiveText(e.target.value)}
                    placeholder="Enter formal directive e.g. 'Convene emergency joint coordination meeting with MPPKVVCL at 17:00 hrs...'"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                  >
                    <Send size={12} /> Record Directive
                  </button>
                </div>
              </form>

              {/* Search & Filter Toolbar */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs by keyword, department, or directive..."
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Events' },
                    { id: 'action', label: 'Directives & Actions' },
                    { id: 'blocker', label: 'Blockers Flagged' },
                    { id: 'ai', label: 'AI Recommendations' },
                    { id: 'citizen', label: 'Citizen Reports' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActivityFilter(filter.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                        activityFilter === filter.id
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Feed Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Audit Trail ({filteredFeed.length} Events)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Timestamped ISO-27001 Certified Log</span>
                </div>

                {filteredFeed.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No matching activity logs found for the selected filter.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredFeed.map((item, idx) => (
                      <div key={item.id || idx} className="p-3.5 hover:bg-slate-50/60 transition-colors flex items-start gap-3">
                        <div className="w-16 shrink-0 pt-0.5">
                          <span className="text-[10px] font-bold font-mono text-slate-800 block">{item.time}</span>
                          <span className="text-[9px] font-mono text-slate-400 block">{item.date}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black font-mono text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                              {item.actor}
                            </span>
                            <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider font-mono ${item.tagClass}`}>
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 leading-snug">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              TAB 4: INTER-AGENCY HANDSHAKE MATRIX
             ═════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'handshake' && (
            <div className="p-5 space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Inter-Agency Handshake & NOC Matrix
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Live departmental synchronization for {mission.name}</p>
                  </div>
                  <button
                    onClick={() => showToast('Syncing real-time clearance states...', 'info')}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg"
                  >
                    <RefreshCw size={12} /> Sync Clearances
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mission.handshake.map((dept, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${dept.dot}`} />
                          <span className="text-xs font-black text-slate-900">{dept.name}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase font-mono ${dept.color}`}>
                          {dept.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between text-slate-500">
                          <span>Nodal Officer:</span>
                          <span className="font-bold text-slate-800">{dept.officer}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Contact Ext:</span>
                          <span className="font-bold text-slate-800">{dept.phone}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => showToast(`Dialing ${dept.officer} at ${dept.phone}...`, 'info')}
                          className="flex-1 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-50 text-center"
                        >
                          Direct Line
                        </button>
                        <button
                          onClick={() => showToast(`Emergency clearance alert sent to ${dept.name}.`, 'success')}
                          className="flex-1 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[10px] font-bold text-center"
                        >
                          Request NOC
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ═══ RIGHT — Mission Health + Actions ═════════════════════════════════ */}
      <aside className="w-60 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">

        <div className="p-4 border-b border-slate-100 space-y-4">
          <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Mission Health</h3>
          <CRIGauge value={mission.cri} />

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Risk Level</span>
              <span className={`font-black text-[11px] tracking-wider ${mission.health.riskColor}`}>{mission.health.risk}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Estimated Delay</span>
              <span className="font-bold text-slate-800">{mission.health.delay}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Cost Burn Rate</span>
              <span className="font-bold text-slate-800">{mission.health.burn}</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">Budget Utilized</span>
                <span className="font-bold text-slate-800">{mission.health.budget}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    mission.health.budget >= 75 ? 'bg-red-500' : mission.health.budget >= 50 ? 'bg-amber-400' : 'bg-blue-500'
                  }`}
                  style={{ width: `${mission.health.budget}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Citizen Complaints</span>
              <span className={`font-bold ${mission.health.complaints > 20 ? 'text-red-500' : 'text-slate-800'}`}>
                {mission.health.complaints}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Pending Approvals</span>
              <span className={`font-bold ${mission.health.approvals > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {mission.health.approvals}
              </span>
            </div>
          </div>
        </div>

        {/* Officer Action Panel */}
        <div className="p-4 flex-1 space-y-2">
          <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3">Officer Action Panel</h3>
          {OFFICER_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] transition-all text-left group"
            >
              <action.Icon size={14} className={`${action.color} shrink-0`} />
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 leading-none flex-1">{action.label}</span>
              <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>

        {/* AI Assistant */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <button
            onClick={() => navigate('/authority/brief')}
            className="w-full flex items-center gap-3 px-3 py-3 bg-blue-950 hover:bg-blue-900 rounded-xl transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center shrink-0">
              <Cpu size={15} className="text-blue-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[11px] font-bold text-white leading-none">AI Assistant</p>
              <p className="text-[9px] text-blue-400 mt-0.5 leading-none">3 suggestions available</p>
            </div>
            <ChevronRight size={13} className="text-blue-400 group-hover:text-blue-200 transition-colors shrink-0" />
          </button>
        </div>

      </aside>
    </div>
  );
}
