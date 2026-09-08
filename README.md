# AI-Based Real-Time Crowd Management System

An end-to-end, privacy-preserving, real-time crowd density monitoring and analytics platform. The system processes optical person detection crossing events from entry and exit camera streams via YOLO/ByteTrack, stores persistent anonymous event counts in a SQLite database via a FastAPI backend, and delivers a modern control-room dashboard built in React, Vite, and TypeScript.

---

## 🌟 Key Architecture & Privacy

```
Entry/Exit Cameras (YOLO + ByteTrack / Edge Detection)
                     ↓
             Entry / Exit Event
                     ↓
         FastAPI REST Backend (:8000)
                     ↓
             SQLite Database
                     ↓
       Real-Time Polling & Analytics
                     ↓
        React Operator Dashboard (:5173)
```

### 🔒 Strict Privacy Adherence
- **Zero Facial Recognition**: No face identification, face databases, facial embeddings, or biometric tracking.
- **Anonymous Headcounts Only**: The system processes anonymous directional events (`+1 entry`, `-1 exit`) with temporary IDs.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+** (Python 3.14 tested)
- **Node.js 18+** & **npm**

---

### 2. Backend Setup & Run

From the root project directory:

```bash
# Install backend Python dependencies
pip install fastapi uvicorn sqlalchemy pydantic httpx requests

# Start the FastAPI backend server (from backend folder or root)
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

The backend will be live at `http://127.0.0.1:8000`.
- API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

---

### 3. Frontend Dashboard Setup & Run

In a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

---

## 📊 Dashboard Modules & Features

1. **Top Navigation & System Telemetry**:
   - Header with live connection status pill (`SYSTEM LIVE` / `BACKEND OFFLINE`), live seconds clock, and manual sync trigger.
   - Built-in **Event Simulator** modal for operator manual testing and demoing without physical cameras.

2. **Main KPI Metrics**:
   - **CURRENT CROWD**: Primary metric calculated from backend authoritative formula (`Total Entries - Total Exits`).
   - **ENTERED TODAY**: Cumulative unique daily entries.
   - **EXITED TODAY**: Cumulative unique daily exits.
   - **PEAK CROWD TODAY**: Maximum recorded density and peak timestamp.

3. **Live Crowd Status & Capacity Gauge**:
   - Visual SVG gauge with dynamic status thresholds (0%, 25%, 50%, 75%, 100%).
   - Configurable maximum capacity limit, remaining headcount, and load percentage.
   - Dynamic density risk states: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`, `OVER CAPACITY`.

4. **Interactive Recharts Visualizations**:
   - **Hourly Crowd Trend**: Smooth area chart illustrating occupancy progression over time.
   - **Entry vs Exit Flow**: Directional comparison bar chart (green for positive ingress, red for egress).
   - **Daily Attendance Trend**: Aggregated multi-day comparison in Analytics view.

5. **Multi-Gate Ingress/Egress Analytics**:
   - Per-gate breakdown (`GATE_1`, `GATE_2`, `GATE_3`) showing online camera statuses, total entries/exits, and active venue contributions.

6. **Camera Node Health**:
   - Health diagnostics for optical sensor channels (`ENTRY_01`, `EXIT_01`, `GATE_2_ENTRY`, `GATE_2_EXIT`) with last active timestamps.

7. **Live Video Surveillance Feeds**:
   - Privacy-safe monitoring frames with clear diagnostics ("Live camera feed unavailable") avoiding simulated video streams while maintaining real sensor state.

8. **Historical Event Audit Log & Filters**:
   - Paginated table showing anonymous timestamped events with multi-criteria filters (Direction, Gate, Camera, Date range).

9. **Safety & Incident Alerts**:
   - Categorized alerts with priority badges (`INFO`, `WARNING`, `HIGH`, `CRITICAL`) based on capacity thresholds and system health.

10. **Customizable System Settings**:
    - Global venue capacity limits, density risk thresholds, telemetry polling rates (1s to 10s), and critical audio alerts.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend operational health check |
| `GET` | `/crowd/current` | Authoritative current headcount count |
| `GET` | `/crowd/stats` | Today's KPI metrics (entries, exits, peak, average, busiest hour) |
| `GET` | `/crowd/history?period=today` | Time-series trend data for charts |
| `GET` | `/crowd/gates` | Multi-gate ingress/egress breakdown |
| `GET` | `/crowd/cameras` | Camera node health and connectivity statuses |
| `GET` | `/crowd/alerts?capacity=200` | Real-time threshold exceedance alerts |
| `GET` | `/events?skip=0&limit=20` | Paginated anonymous event log with filters |
| `POST` | `/events` | Ingest new camera detection event (`camera_id`, `gate_id`, `direction`, `count`) |
