import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter, Plus, MapPin, CheckCircle2, Clock, XCircle,
  AlertTriangle, ArrowRight, Bell, Calendar, FileText,
  Users, Zap, Building2, AlertCircle, TrendingUp, Activity,
  ChevronRight, Cpu, X, Check, Send, Download
} from 'lucide-react';

// ─── Per-Mission Master Data ───────────────────────────────────────────────────

const MISSION_DB = {
  aiims: {
    id: 'aiims',
    name: 'AIIMS Pipeline Upgrade',
    loc: 'AIIMS Corridor',
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
    dependencies: [
      { name: 'Public Works Department', sub: 'Cleared',         status: 'done',    Icon: Building2 },
      { name: 'Revenue Department',      sub: 'Pending Approval', status: 'pending', Icon: FileText  },
      { name: 'Traffic Police',          sub: 'Approval Pending', status: 'blocked', Icon: Users     },
      { name: 'Energy Department',       sub: 'Pending',          status: 'pending', Icon: Zap       },
      { name: 'Municipal Corporation',   sub: 'Completed',        status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'PWD',          status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Revenue',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
      { name: 'Traffic',      status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',             dot: 'bg-red-500'     },
      { name: 'Energy',       status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
      { name: 'Municipality', status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '09:41 AM', text: 'Revenue Department requested additional land document',      tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200'           },
      { time: '09:27 AM', text: 'Traffic Police raised concern on peak hour diversion',       tag: 'Pending',         tagClass: 'text-amber-600 bg-amber-50 border-amber-200'     },
      { time: '08:50 AM', text: 'AI Recommendation: Resequence utility shifting activities', tag: 'AI Insight',      tagClass: 'text-blue-600 bg-blue-50 border-blue-200'        },
      { time: '08:11 AM', text: 'Citizen report verified: Water leakage near work zone',      tag: 'Verified',        tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'},
      { time: 'Yesterday', text: 'PWD updated work progress: Excavation 70% complete',       tag: 'Update',          tagClass: 'text-slate-600 bg-slate-100 border-slate-200'    },
    ],
  },

  mpnagar: {
    id: 'mpnagar',
    name: 'MP Nagar Road Widening',
    loc: 'Zone 1, MP Nagar',
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
    dependencies: [
      { name: 'Revenue Department',    sub: 'Land sign-off pending 47 days', status: 'blocked', Icon: FileText  },
      { name: 'Public Works Dept',     sub: 'Cleared',                        status: 'done',    Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Diversion plan submitted',       status: 'pending', Icon: Users     },
      { name: 'MPEB',                  sub: 'Pole relocation pending',        status: 'pending', Icon: Zap       },
      { name: 'Municipal Corporation', sub: 'Completed',                      status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Revenue',  status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',             dot: 'bg-red-500'     },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Traffic',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
      { name: 'MPEB',     status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
      { name: 'BMC',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '10:15 AM', text: 'Revenue Dept: Land compensation file escalated to DM',    tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200'           },
      { time: '09:50 AM', text: 'PWD site engineer confirmed 47-day blockage at Carmel',   tag: 'Update',          tagClass: 'text-slate-600 bg-slate-100 border-slate-200'    },
      { time: '08:30 AM', text: 'AI: Friday penalty trigger in 2 days if unresolved',      tag: 'AI Insight',      tagClass: 'text-blue-600 bg-blue-50 border-blue-200'        },
      { time: '08:00 AM', text: 'Traffic Police: Peak hour concern flagged for MP Nagar',  tag: 'Pending',         tagClass: 'text-amber-600 bg-amber-50 border-amber-200'     },
      { time: 'Yesterday', text: 'Citizen complaint: Road dust affecting school vicinity', tag: 'Verified',        tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'},
    ],
  },

  kolar: {
    id: 'kolar',
    name: 'Kolar Utility Relocation',
    loc: 'Kolar Corridor',
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
    dependencies: [
      { name: 'Energy Department',     sub: 'Pole relocation 19 days stalled', status: 'blocked', Icon: Zap       },
      { name: 'Traffic Cell',          sub: 'Permit cleared',                   status: 'done',    Icon: Users     },
      { name: 'Public Works Dept',     sub: 'Awaiting energy NOC',             status: 'pending', Icon: Building2 },
      { name: 'Revenue Department',    sub: 'Site boundary confirmed',          status: 'done',    Icon: FileText  },
      { name: 'Municipal Corporation', sub: 'Storm drain layout pending',       status: 'pending', Icon: Building2 },
    ],
    handshake: [
      { name: 'Energy',   status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',             dot: 'bg-red-500'     },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'PWD',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
      { name: 'Revenue',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'BMC',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
    ],
    feed: [
      { time: '11:02 AM', text: 'Energy Dept: Pole relocation estimate submitted for review',  tag: 'Update',     tagClass: 'text-slate-600 bg-slate-100 border-slate-200'   },
      { time: '10:30 AM', text: 'AI: Suggest parallel storm drain survey to save 4 days',     tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200'       },
      { time: '09:15 AM', text: 'Traffic Cell permit officially cleared — corridor ready',     tag: 'Verified',   tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'},
      { time: '08:45 AM', text: 'PWD blocked on Energy NOC — escalation requested',           tag: 'Pending',    tagClass: 'text-amber-600 bg-amber-50 border-amber-200'    },
      { time: 'Yesterday', text: 'Revenue Dept confirmed site boundary — cleared for survey', tag: 'Update',     tagClass: 'text-slate-600 bg-slate-100 border-slate-200'   },
    ],
  },

  brts: {
    id: 'brts',
    name: 'BRTS Junction Improvement',
    loc: 'Shyamla Hills',
    level: 'MEDIUM',
    levelClass: 'bg-blue-500 text-white',
    cri: 82,
    criColor: 'text-blue-400',
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
    dependencies: [
      { name: 'Public Works Dept',     sub: 'Cleared',                   status: 'done',    Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Signal plan approved',      status: 'done',    Icon: Users     },
      { name: 'Energy Department',     sub: 'Cleared',                   status: 'done',    Icon: Zap       },
      { name: 'Revenue Department',    sub: 'Pending final NOC',         status: 'pending', Icon: FileText  },
      { name: 'Municipal Corporation', sub: 'Cleared',                   status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Energy',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Revenue',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
      { name: 'BMC',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '12:10 PM', text: 'Construction team confirmed 70% pier foundation complete',   tag: 'Update',     tagClass: 'text-slate-600 bg-slate-100 border-slate-200'    },
      { time: '11:30 AM', text: 'Revenue Dept final NOC expected by tomorrow EOD',            tag: 'Pending',    tagClass: 'text-amber-600 bg-amber-50 border-amber-200'     },
      { time: '10:00 AM', text: 'AI: On-track for 3-day buffer — no escalation needed',      tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200'        },
      { time: '09:00 AM', text: 'Traffic signal plan approved by Traffic Police HQ',          tag: 'Verified',   tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'},
      { time: 'Yesterday', text: 'Joint inspection scheduled for Day 45 of construction',    tag: 'Update',     tagClass: 'text-slate-600 bg-slate-100 border-slate-200'    },
    ],
  },

  smart2: {
    id: 'smart2',
    name: 'Smart Road Package - 2',
    loc: 'Hoshangabad Road',
    level: 'LOW',
    levelClass: 'bg-slate-500 text-white',
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
    dependencies: [
      { name: 'Public Works Dept',     sub: 'Cleared',                status: 'done', Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Cleared',                status: 'done', Icon: Users     },
      { name: 'Energy Department',     sub: 'Cleared',                status: 'done', Icon: Zap       },
      { name: 'Revenue Department',    sub: 'Cleared',                status: 'done', Icon: FileText  },
      { name: 'Municipal Corporation', sub: 'Final sign-off pending', status: 'pending', Icon: Building2 },
    ],
    handshake: [
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Energy',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Revenue',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'BMC',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
    ],
    feed: [
      { time: '01:00 PM', text: 'Inspection team: structural integrity check in progress',     tag: 'Update',     tagClass: 'text-slate-600 bg-slate-100 border-slate-200'    },
      { time: '10:45 AM', text: 'BMC final sign-off to complete upon inspection clearance',    tag: 'Pending',    tagClass: 'text-amber-600 bg-amber-50 border-amber-200'     },
      { time: '09:30 AM', text: 'AI: Completion forecast on schedule — no risk flags',         tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200'        },
      { time: '08:00 AM', text: 'All 5 departments cleared — proceeding to final inspection',  tag: 'Verified',   tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'},
      { time: 'Yesterday', text: 'Road surface QA passed. Marking and signage complete.',     tag: 'Update',     tagClass: 'text-slate-600 bg-slate-100 border-slate-200'    },
    ],
  },

  metro: {
    id: 'metro',
    name: 'Bhopal Metro Orange Line',
    loc: 'Subhash Nagar - Karond Corridor',
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
    dependencies: [
      { name: 'Energy Department',     sub: '33KV line shifting pending', status: 'blocked', Icon: Zap       },
      { name: 'Traffic Police',        sub: 'Peak diversion in review',   status: 'pending', Icon: Users     },
      { name: 'Water Resources',       sub: 'Cleared',                    status: 'done',    Icon: Building2 },
      { name: 'MPMRCL',                sub: 'Pier drawings ready',        status: 'done',    Icon: Building2 },
      { name: 'Public Works Dept',     sub: 'Cleared',                    status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Energy',   status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',       dot: 'bg-red-500'   },
      { name: 'Traffic',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
      { name: 'Water',    status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'MPMRCL',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '02:15 PM', text: 'Discom: 33KV power shutdown schedule submitted for approval', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200' },
      { time: '11:20 AM', text: 'MPMRCL completed soil testing on Subhash Nagar bridge sector', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200' },
      { time: '09:10 AM', text: 'AI: Critical interlock on 33KV grid — convene joint Discom review', tag: 'AI Insight', tagClass: 'text-blue-600 bg-blue-50 border-blue-200' },
    ],
  },

  bhadbhada: {
    id: 'bhadbhada',
    name: 'Bhadbhada Junction Flyover',
    loc: 'Bhadbhada - Kaliasot Axis',
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
    dependencies: [
      { name: 'Revenue / Forest',      sub: 'Tree translocation NOC pending', status: 'blocked', Icon: FileText  },
      { name: 'Public Works Dept',     sub: 'Foundation piling queued',       status: 'pending', Icon: Building2 },
      { name: 'Traffic Police',        sub: 'Cleared',                        status: 'done',    Icon: Users     },
      { name: 'Water Resources',       sub: 'Cleared',                        status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Revenue',  status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',       dot: 'bg-red-500'   },
      { name: 'PWD',      status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
      { name: 'Traffic',  status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'Water',    status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '03:40 PM', text: 'Forest Dept compensatory afforestation plan awaiting Collector seal', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200' },
      { time: '01:15 PM', text: 'Traffic diversion along Kaliasot bypass operational and tested', tag: 'Verified', tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    ],
  },

  lake_stp: {
    id: 'lake_stp',
    name: 'Upper Lake 50 MLD STP',
    loc: 'Bhoj Wetland Catchment',
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
    dependencies: [
      { name: 'MPPCB Pollution Board', sub: 'Consent to Establish pending', status: 'blocked', Icon: Building2 },
      { name: 'Energy Department',     sub: 'Feeder line proposal submitted', status: 'pending', Icon: Zap       },
      { name: 'Public Works Dept',     sub: 'Cleared',                       status: 'done',    Icon: Building2 },
      { name: 'Smart City Mission',    sub: 'Cleared',                       status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'MPPCB',    status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',       dot: 'bg-red-500'   },
      { name: 'Energy',   status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'SmartCity',status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '04:10 PM', text: 'MPPCB: Environmental compliance committee meeting scheduled for Friday', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200' },
      { time: '01:50 PM', text: 'Bhoj Wetland ecological buffer zone demarcated by EPCO survey team', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200' },
    ],
  },

  hamidia: {
    id: 'hamidia',
    name: 'Hamidia Smart Transit Spine',
    loc: 'Old City & Royal Market',
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
    dependencies: [
      { name: 'Revenue Department',    sub: 'Old city encroachment settlement', status: 'blocked', Icon: FileText  },
      { name: 'Traffic Police',        sub: 'Ambulance bay routing in review',  status: 'pending', Icon: Users     },
      { name: 'Energy Department',     sub: 'Cleared',                         status: 'done',    Icon: Zap       },
      { name: 'Public Works Dept',     sub: 'Cleared',                         status: 'done',    Icon: Building2 },
    ],
    handshake: [
      { name: 'Revenue',  status: 'Blocked',  color: 'text-red-600 bg-red-50 border-red-200',       dot: 'bg-red-500'   },
      { name: 'Traffic',  status: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
      { name: 'Energy',   status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
      { name: 'PWD',      status: 'On Track', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    ],
    feed: [
      { time: '05:00 PM', text: 'Collector directive: fast-track Peer Gate commercial compensation', tag: 'Action Required', tagClass: 'text-red-600 bg-red-50 border-red-200' },
      { time: '02:30 PM', text: 'Hamidia emergency ward access maintained via temporary bypass road', tag: 'Update', tagClass: 'text-slate-600 bg-slate-100 border-slate-200' },
    ],
  },
};

const MISSIONS = Object.values(MISSION_DB);

const GANTT_BAR_STYLES = {
  completed:   { bar: 'bg-emerald-500' },
  in_progress: { bar: 'bg-blue-500'   },
  blocked:     { bar: 'bg-amber-400'  },
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
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';
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
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${bg} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl max-w-xs animate-fade-in`}>
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
  const [selectedId, setSelectedId]   = useState('aiims');
  const [toast, setToast]             = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [missions, setMissions]       = useState(MISSIONS);
  const [feedItems, setFeedItems]     = useState([]);

  const mission = MISSION_DB[selectedId] || MISSION_DB['aiims'];

  // Sync feed when mission changes
  useEffect(() => { setFeedItems(mission.feed); }, [selectedId]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const handleAction = (action) => {
    showToast(action.toast, 'success');
    // Add to decision feed
    const newEntry = {
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' AM',
      text: `Officer action: ${action.label} — executed for ${mission.name}`,
      tag: 'Action Taken',
      tagClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    };
    setFeedItems(prev => [newEntry, ...prev.slice(0, 4)]);
  };

  const handleMissionCreated = (name) => {
    showToast(`Mission "${name}" created successfully.`, 'success');
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-50 font-sans text-slate-800 overflow-hidden">

      {/* Toast */}
      {toast && <Toast key={toast.id} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* New Mission Modal */}
      {showModal && <NewMissionModal onClose={() => setShowModal(false)} onCreated={handleMissionCreated} />}

      {/* ═══ LEFT — Mission Queue ═══════════════════════════════════════════ */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Mission Queue</h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={() => showToast('Filter panel coming soon.', 'info')}>
            <Filter size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-all ${
                selectedId === m.id
                  ? 'bg-blue-50 border-l-[3px] border-l-blue-600'
                  : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">{m.name}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 ${m.levelClass}`}>
                  {m.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin size={9} />
                  <span className="truncate max-w-[110px]">{m.loc}</span>
                </div>
                <span className={`text-[10px] font-black ${m.criColor}`}>CRI {m.cri}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-slate-100 shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus size={13} />
            New Mission
          </button>
        </div>
      </aside>

      {/* ═══ CENTER — Timeline + Deps + Feed ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">

        {/* Mission Timeline */}
        <div className="bg-white border-b border-slate-200 p-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Mission Timeline</h3>
            <span className="text-[10px] text-slate-400 font-mono">{mission.name}</span>
          </div>

          {/* Stage Steps */}
          <div className="flex items-start gap-0 mb-5 overflow-x-auto pb-1">
            {mission.timeline.map((stage, idx) => (
              <div key={idx} className="flex items-center flex-1 min-w-[70px]">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                    stage.done   ? 'bg-blue-600 border-blue-600 text-white'
                    : stage.active ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-white border-slate-300 text-slate-300'
                  }`}>
                    {stage.done   ? <CheckCircle2 size={14} />
                    : stage.active ? <Clock size={14} />
                    : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 text-center mt-1.5 leading-tight whitespace-pre-line">
                    {stage.label}
                  </p>
                </div>
                {idx < mission.timeline.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-4 transition-all ${stage.done ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Gantt */}
          <div className="space-y-1.5 relative">
            <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-red-400 z-10 pointer-events-none" style={{ left: '72%' }}>
              <span className="absolute -bottom-5 left-1 text-[9px] font-black text-red-500 bg-white px-1">Today</span>
            </div>
            {mission.gantt.map((row, idx) => {
              const style = GANTT_BAR_STYLES[row.status] || {};
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-medium w-28 shrink-0">{row.label}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full relative overflow-hidden">
                    {row.width > 0 && (
                      <div className={`absolute h-full rounded-full ${style.bar} flex items-center px-2 transition-all duration-500`}
                        style={{ left: `${row.left}%`, width: `${row.width}%` }}>
                        <span className="text-[8px] text-white font-bold truncate">{row.dates}</span>
                      </div>
                    )}
                    {row.status === 'waiting' && (
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-[9px] text-slate-400 font-medium">Waiting</span>
                      </div>
                    )}
                  </div>
                  {row.status === 'blocked'     && <span className="text-[8px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Pending (Blocked)</span>}
                  {row.status === 'completed'   && <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Completed</span>}
                  {row.status === 'in_progress' && <span className="text-[8px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">In Progress</span>}
                </div>
              );
            })}
          </div>

          {/* Blocked Alert — only shown when blockers > 0 */}
          {mission.blockers > 0 && (
            <div className="mt-6 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500 shrink-0" />
                <span className="text-[11px] font-bold text-red-700">
                  Blocked: Waiting for {mission.blockers} department approval{mission.blockers !== 1 ? 's' : ''} to proceed
                </span>
              </div>
              <button
                onClick={() => showToast(`Viewing ${mission.blockers} active blockers for ${mission.name}`, 'info')}
                className="flex items-center gap-0.5 text-[11px] font-black text-red-600 hover:text-red-800 transition-colors whitespace-nowrap ml-4"
              >
                View Blockers <ArrowRight size={12} />
              </button>
            </div>
          )}
          {mission.blockers === 0 && (
            <div className="mt-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-700">All departments cleared — mission on track</span>
            </div>
          )}
        </div>

        {/* Bottom grid: Dependency + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1">

          {/* Dependency Chain + Handshake */}
          <div className="bg-white border-r border-b border-slate-200 p-4 space-y-3 overflow-y-auto">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Dependency Chain</h3>
            {mission.dependencies.map((dep, idx) => {
              const DepIcon = dep.Icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    dep.status === 'done'    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : dep.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-500'
                    : 'bg-red-50 border-red-200 text-red-500'
                  }`}>
                    <DepIcon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-none">{dep.name}</p>
                    {dep.sub && <p className="text-[10px] text-slate-400 mt-0.5 leading-none">{dep.sub}</p>}
                  </div>
                  <div className="shrink-0">
                    {dep.status === 'done'    && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {dep.status === 'pending' && <Clock size={16} className="text-amber-400" />}
                    {dep.status === 'blocked' && <XCircle size={16} className="text-red-500" />}
                  </div>
                </div>
              );
            })}

            {/* Dept Handshake */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Department Handshake</h3>
                <span className="text-[9px] text-slate-400">Real-time coordination</span>
              </div>
              <div className="flex items-end gap-2 overflow-x-auto pb-1">
                {mission.handshake.map((dept, idx) => (
                  <React.Fragment key={dept.name}>
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-black border ${dept.color}`}>
                        {dept.name}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${dept.dot}`} />
                      <span className="text-[8px] font-bold text-slate-500 whitespace-nowrap">{dept.status}</span>
                    </div>
                    {idx < mission.handshake.length - 1 && (
                      <div className="h-px w-4 bg-slate-200 mb-7 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Decision Feed */}
          <div className="bg-white border-b border-slate-200 p-4 flex flex-col overflow-y-auto">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Decision Feed</h3>
            <div className="space-y-2.5 flex-1">
              {feedItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[9px] text-slate-400 font-mono w-16 shrink-0 pt-0.5 leading-tight">{item.time}</span>
                  <p className="text-[11px] text-slate-700 flex-1 leading-snug">{item.text}</p>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider whitespace-nowrap shrink-0 ${item.tagClass}`}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => showToast('Activity log exported successfully.', 'success')}
              className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Activity size={12} />
              View Full Activity Log
            </button>
          </div>

        </div>
      </div>

      {/* ═══ RIGHT — Mission Health + Actions ═════════════════════════════════ */}
      <aside className="w-60 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">

        <div className="p-4 border-b border-slate-100 space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Mission Health</h3>
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
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Officer Action Panel</h3>
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
