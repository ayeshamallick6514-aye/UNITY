"""
Generates the official 10-slide PowerPoint presentation (.pptx)
for MP Online Idea and Innovation Hackathon 2026 - PS-5.
"""
import sys
try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    print("python-pptx not yet installed. Run 'pip install python-pptx'")
    sys.exit(1)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette
NAVY = RGBColor(11, 27, 61)        # #0B1B3D
DARK_SLATE = RGBColor(15, 23, 42)  # #0F172A
GOLD = RGBColor(245, 158, 11)      # #F59E0B
LIGHT_BG = RGBColor(248, 250, 252) # #F8FAFC
TEXT_DARK = RGBColor(30, 41, 59)   # #1E293B
MUTED = RGBColor(100, 116, 139)    # #64748B
WHITE = RGBColor(255, 255, 255)
GREEN = RGBColor(16, 149, 106)
RED = RGBColor(220, 38, 38)

blank_slide_layout = prs.slide_layouts[6]

def set_slide_background(slide, color):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = color

# Slide 1: Cover
slide1 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(slide1, NAVY)

txBox = slide1.shapes.add_textbox(Inches(1), Inches(1), Inches(11.333), Inches(5.5))
tf = txBox.text_frame
tf.word_wrap = True

p1 = tf.paragraphs[0]
p1.text = "MP ONLINE IDEA & INNOVATION HACKATHON 2026"
p1.font.bold = True
p1.font.size = Pt(13)
p1.font.color.rgb = GOLD

p2 = tf.add_paragraph()
p2.text = "Problem Statement 5 (PS-5) · GovTech | Artificial Intelligence | Digital Public Services"
p2.font.size = Pt(12)
p2.font.color.rgb = WHITE
p2.space_after = Pt(24)

p3 = tf.add_paragraph()
p3.text = "Project UNITY"
p3.font.bold = True
p3.font.size = Pt(44)
p3.font.color.rgb = WHITE

p4 = tf.add_paragraph()
p4.text = "Unified Nodal Interface for Tactical Infrastructure Yield & Governance"
p4.font.size = Pt(20)
p4.font.color.rgb = GOLD
p4.space_after = Pt(20)

p5 = tf.add_paragraph()
p5.text = "An AI-powered inter-departmental infrastructure coordination platform and citizen-centric governance portal preventing redundant road excavation and authenticating public grievances for Madhya Pradesh."
p5.font.size = Pt(14)
p5.font.color.rgb = WHITE
p5.space_after = Pt(36)

p6 = tf.add_paragraph()
p6.text = "Team: HackHer Squad  |  Prototype Status: 100% Functional & Cloud-Deployed"
p6.font.bold = True
p6.font.size = Pt(13)
p6.font.color.rgb = GOLD

# Helper function to create content slides
def create_content_slide(title, pillar_subtitle, items):
    slide = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide, LIGHT_BG)
    
    # Header Box
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.2))
    htf = header_box.text_frame
    htf.word_wrap = True
    
    sub_p = htf.paragraphs[0]
    sub_p.text = pillar_subtitle.upper()
    sub_p.font.bold = True
    sub_p.font.size = Pt(11)
    sub_p.font.color.rgb = GOLD
    
    title_p = htf.add_paragraph()
    title_p.text = title
    title_p.font.bold = True
    title_p.font.size = Pt(24)
    title_p.font.color.rgb = NAVY
    
    # Body Box
    body_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    btf = body_box.text_frame
    btf.word_wrap = True
    
    for heading, desc in items:
        hp = btf.add_paragraph()
        hp.text = f"• {heading}"
        hp.font.bold = True
        hp.font.size = Pt(14)
        hp.font.color.rgb = NAVY
        hp.space_before = Pt(10)
        
        dp = btf.add_paragraph()
        dp.text = f"   {desc}"
        dp.font.size = Pt(12)
        dp.font.color.rgb = TEXT_DARK
        dp.space_after = Pt(8)
        
    return slide

# Slide 2: Pillar 1 - Concept
create_content_slide(
    "The Administrative Problem & The UNITY Concept",
    "Pillar 1: Concept Evaluation",
    [
        ("Administrative Silos in Madhya Pradesh", "Departments (PWD, MP Jal Nigam, Discoms, Municipalities) plan excavations independently without a shared spatial-temporal calendar."),
        ("Infrastructure Destruction Cycle", "Freshly carpeted roads are re-excavated within weeks for underground pipelines and power cables, creating public disruption and asset damage."),
        ("Unstructured Citizen Grievance Flood", "Helplines receive unverified, out-of-ward submissions, creating manual triaging delays and duplicate work orders."),
        ("The Project UNITY Concept", "A unified geospatial engine that proactively detects and halts overlapping excavation schedules before permits are issued, while verifying citizen reports via on-device Tesseract.js OCR.")
    ]
)

# Slide 3: Pillar 2 - Approach & System Architecture
create_content_slide(
    "Dual-Engine Architecture: G2G Coordination + G2C Public Hub",
    "Pillar 2: Technical Approach",
    [
        ("G2C Citizen Portal", "Mobile-first responsive interface with live camera GPS watermarking, browser-native Tesseract.js OCR text extraction, and a universal 4-stage tracking timeline."),
        ("G2G Departmental & Authority Matrix", "Leaflet GIS mapping console for municipal engineers, displaying scheduled works, spatial buffer collision rings, and inter-agency NOC approvals."),
        ("Executive Command Center", "High-level dashboard for District Collectors with live weather integration, escalation triggers, and spatial analytics."),
        ("Open-Standards Stack", "React, Node.js, Express, MongoDB, Leaflet GIS, OpenStreetMap/Nominatim, and Tesseract.js with zero reliance on paid cloud vision APIs.")
    ]
)

# Slide 3B: Technical Approach Architecture & Tech Stack Template
slide_diag = prs.slides.add_slide(blank_slide_layout)
set_slide_background(slide_diag, WHITE)

import os
img_template_path = "hackathon_docs/tech_stack_template.jpg"
if os.path.exists(img_template_path):
    slide_diag.shapes.add_picture(img_template_path, Inches(0.4), Inches(0.3), width=Inches(12.533))



# Slide 4: Pillar 2 - Algorithm & Data Flow
create_content_slide(
    "Intelligent Workflow: From Field Capture to Nodal Resolution",
    "Pillar 2: Technical Approach & Logic",
    [
        ("Proactive Spatial Buffering Algorithm", "When a utility registers an excavation route, the engine projects a spatial buffer. If an overlapping road-laying schedule exists in that time window, permits are automatically blocked pending joint coordination."),
        ("Edge AI Text Extraction (Tesseract.js)", "Citizens upload signboard or grievance photos; Tesseract.js extracts key text on-device, classifying complaint categories without privacy leaks or API costs."),
        ("Automated Municipal Ward Resolution", "Lat/Lng coordinates reverse-geocoded via OpenStreetMap to assign tasks directly to the responsible zonal engineer."),
        ("Universal Complaint Lifecycle", "Status moves transparently through Filed → Assigned → Under Review → Resolved with full public auditability.")
    ]
)

# Slide 5: Pillar 3 - Innovation Highlights
create_content_slide(
    "Novel Technological & Operational Innovations",
    "Pillar 3: Innovation & Uniqueness",
    [
        ("Zero-Cloud-Cost On-Device AI", "Runs Tesseract.js WebAssembly OCR directly in the browser and backend, saving public funds on recurring cloud vision APIs while ensuring data sovereignty."),
        ("Anti-Fraud Live Camera Verification", "HTML5 WebRTC camera mode enforces real-time capture with dynamic GPS and IST timestamp watermarking, barring fake internet downloads."),
        ("Pre-Excavation Spatial Shield", "Pioneers proactive collision prevention rather than reactive post-damage complaint logging."),
        ("Inter-Departmental Consensus Gate", "Enforces cross-agency digital approvals before ground-level road cutting can legally commence.")
    ]
)

# Slide 6: Pillar 4 - Overall Solution Completeness
create_content_slide(
    "Prototype Status & Automated Quality Verification",
    "Pillar 4: Overall Solution & Execution",
    [
        ("Fully Functional Cloud Prototype", "Live, publicly accessible cloud deployment featuring end-to-end frontend/backend integration across all user roles."),
        ("Automated E2E Test Suite", "5/5 Playwright end-to-end automated test suites verified passing, testing everything from citizen grievance filing to departmental map conflict markers."),
        ("Zero 404 Route Integrity", "All 36 application routes pre-compiled to ensure flawless single-page application navigation across hosting providers."),
        ("Multi-Role Ready", "Instant institutional role switching between Citizen, Municipal Engineer, and District Collector for evaluation.")
    ]
)

# Slide 7: Pillar 4 - Scalability & Viksit Bharat Impact
create_content_slide(
    "Governance Scalability & Viksit Bharat 2047 Alignment",
    "Pillar 4: Overall Impact & Scalability",
    [
        ("Preserving Public Infrastructure Assets", "Protects roads, water mains, and optical cables from premature destruction, ensuring tax revenues translate into durable public assets."),
        ("Fostering Civic Trust & Accountability", "Empowers residents of Madhya Pradesh with transparent, trackable civic services, eliminating bureaucratic black boxes."),
        ("Statewide Scalability", "Modular, microservice-ready architecture designed to scale seamlessly across all 55 districts and 413+ Urban Local Bodies of Madhya Pradesh."),
        ("Viksit Bharat 2047 Mandate", "Embodies the national mission for modern, transparent, citizen-centric, technology-powered governance.")
    ]
)

output_path = "hackathon_docs/Project_UNITY_Solution_Presentation.pptx"
prs.save(output_path)
print(f"SUCCESS: Saved presentation to {output_path}")
