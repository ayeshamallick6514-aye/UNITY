# UNITY — Project Definition

## One-Line Description
A policy-aware government smart city coordination platform for Bhopal, Madhya Pradesh that enables real-time inter-departmental decision intelligence.

## Problem Statement
Government departments in Bhopal work in isolation. A delay in one department silently cascades into multiple dependent projects — causing cost escalation, missed deadlines, and reduced citizen service delivery. Existing systems show data but provide no actionable intelligence.

## Solution
UNITY creates a centralized operational intelligence layer connecting District Collectors, Engineers, Commissioners, Nodal Officers, and Citizens through three purpose-built workspaces — each tailored to its role's decision-making needs.

## Core Value Propositions
1. **Dependency Intelligence** — detect blocked workflows before they become crises
2. **Ripple Simulation** — simulate how a delay cascades across departments and timelines
3. **Sentinel AI** — policy-aware decision support engine that audits conflicts against government circulars and SOPs
4. **Executive Decision Briefs** — AI-generated situational assessments with recommended directives
5. **Live Citizen Impact** — real-time tracking of how infrastructure projects affect citizens

## Hackathon Context
- Built for: Smart City / GovTech hackathon
- Scope: MVP with working auth, 3 role-based workspaces, 20+ pages, Sentinel AI module
- Deployed: Render (frontend static + backend web service)
- Status: Feature complete, deployment stabilization in progress

## Tech Choices & Rationale
- **React + Vite**: Fast iteration, rich ecosystem
- **Tailwind CSS v4**: Rapid government-style UI without design system overhead
- **Zustand + sessionStorage**: Lightweight auth state — clears on tab close (security)
- **Express + in-memory MongoDB**: Zero-config backend, auto-seeded demo data
- **JWT (access + refresh)**: Stateless auth, role embedded in token payload

## Tagline
> One Government. One Network. One Intelligence Layer.

## Branding Constraints
- Deep Navy (`#070e1b`), Slate, White, Government Blue (`#2563EB`)
- NO neon, NO particles, NO cyberpunk
- Feels like: executive government command center
- City: Bhopal — Bhopal cityscape hero image used on auth screens

## Team
Team UNITY — building the future of intelligent governance.
