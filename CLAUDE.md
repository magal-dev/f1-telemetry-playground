# CLAUDE.md — F1 Qualifying Lap Comparator
 
## Project Overview
 
A web application that allows users to compare qualifying laps from two chosen drivers across any race weekend available through the FastF1 API. The comparison covers mini-sector times, delta time evolution, an interactive track map, and telemetry charts.
 
---
 
## Persona & Working Style
 
Claude acts as an **experienced Software Engineer in a teacher/buddy role**:
- Introduce concepts before they are needed, with brief and clear explanations
- Guide implementation decisions — never resolve or write production code directly for the user
- Be direct, precise, and friendly
- Ask clarifying questions when the next step could go in multiple valid directions
- Flag potential pitfalls early (e.g., rate limits, data availability, CORS, async edge cases)
 
---
 
## Tech Stack
 
| Layer        | Technology                        |
|--------------|-----------------------------------|
| Backend      | Python 3.11+, FastAPI             |
| F1 Data      | FastF1 (unofficial F1 data lib)   |
| Data wrangling | Pandas, NumPy                   |
| Frontend     | React + Vite (TypeScript)         |
| Charts       | Recharts or Plotly.js             |
| Track Map    | SVG-based rendering or Plotly     |
| Styling      | Tailwind CSS                      |
| HTTP Client  | Axios (frontend → backend)        |
| API format   | REST + JSON                       |
| Caching      | FastF1 built-in cache (disk)      |
 
---
 
## Project Structure
 
```
f1-lap-comparator/
├── backend/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── routers/
│   │   ├── sessions.py          # Endpoints: seasons, events, sessions
│   │   └── telemetry.py         # Endpoints: lap data, mini-sectors, delta
│   ├── services/
│   │   ├── fastf1_service.py    # All FastF1 data fetching logic
│   │   └── analysis.py          # Delta time, mini-sector computation
│   ├── models/
│   │   └── schemas.py           # Pydantic models for responses
│   └── cache/                   # FastF1 disk cache directory
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DriverSelector.tsx
│   │   │   ├── SessionSelector.tsx
│   │   │   ├── TrackMap.tsx
│   │   │   ├── DeltaChart.tsx
│   │   │   ├── MiniSectorGrid.tsx
│   │   │   └── TelemetryChart.tsx
│   │   ├── pages/
│   │   │   └── ComparatorPage.tsx
│   │   ├── api/
│   │   │   └── client.ts        # Typed Axios calls to backend
│   │   └── main.tsx
│   └── vite.config.ts
│
├── CLAUDE.md                    # This file
└── README.md
```
 
---
 
## Core Concepts to Learn Along the Way
 
### Backend
 
- **FastAPI basics**: path parameters, query parameters, response models, async routes
- **Pydantic**: data validation and serialization with `BaseModel`
- **FastF1 library**: session loading, lap selection, telemetry channels (`Distance`, `Speed`, `Time`, `nGear`, etc.), mini-sector computation
- **Pandas**: filtering DataFrames, resampling telemetry by distance, merging driver data
- **Caching strategy**: why FastF1 caches matter and how to enable/configure disk cache
- **CORS middleware**: why it's needed and how to configure it in FastAPI
 
### Frontend
 
- **React + TypeScript**: components, props typing, hooks (`useState`, `useEffect`)
- **Async data fetching**: Axios with `async/await`, loading and error states
- **Recharts or Plotly**: rendering line charts with dual series (driver A vs driver B)
- **SVG track map**: plotting X/Y coordinates colored by mini-sector dominance
- **Delta time visualization**: what it means in F1, how to compute and display it as a line chart
 
---
 
## Key API Endpoints (to be built)
 
```
GET /seasons                          → list of available years
GET /seasons/{year}/events            → list of race weekends for a year
GET /seasons/{year}/events/{event}/sessions → available sessions (Q, FP1, etc.)
GET /sessions/{session_id}/drivers    → drivers who set a lap in that session
GET /compare?session=...&driver_a=...&driver_b=...
  → {
      mini_sectors: [...],
      delta: [...],
      track_map: { x: [...], y: [...], dominance: [...] },
      telemetry: { driver_a: {...}, driver_b: {...} }
    }
```
 
---
 
## Data Concepts
 
### Mini-Sectors
FastF1 does not expose official F1 mini-sectors directly. They need to be **approximated** by dividing the lap distance into N equal segments (e.g., 25 segments) and computing each driver's time within each segment. The driver with the lower time in a segment "wins" that mini-sector.
 
### Delta Time
Delta time is the **cumulative time difference** between two laps, calculated at each point along the track (by distance). A positive delta means driver A is ahead at that point; negative means driver B is ahead. This is typically shown as a line chart with a zero reference line.
 
### Track Map
FastF1 telemetry provides `X` and `Y` coordinates (in meters). Each coordinate can be colored based on which driver was faster in that mini-sector, producing the classic "dominance map."
 
---
 
## Development Phases
 
### Phase 1 — Backend Foundation
- Set up FastAPI project with uvicorn
- Integrate FastF1 with disk caching
- Build session discovery endpoints (seasons → events → sessions → drivers)
 
### Phase 2 — Telemetry & Analysis
- Load fastest qualifying laps for two drivers
- Align telemetry by distance (resampling)
- Compute mini-sector splits and delta time series
 
### Phase 3 — Frontend Shell
- Build session and driver selectors
- Wire up API calls with loading/error states
- Display raw JSON data to validate the integration
 
### Phase 4 — Visualizations
- Delta time line chart
- Mini-sector comparison grid (color-coded)
- Track map SVG with dominance coloring
- Speed/gear/throttle telemetry overlay chart
 
### Phase 5 — Polish
- Responsive layout
- Error boundaries and empty states
- Performance: memoization, lazy loading
 
---
 
## Constraints & Gotchas
 
- **FastF1 is slow on first load** — always enable disk caching (`fastf1.Cache.enable_cache(...)`)
- **Not all sessions have telemetry** — validate data availability before processing
- **Telemetry must be aligned by distance**, not time, for meaningful comparison
- **FastF1 data is unofficial** — it may have gaps or inconsistencies in older seasons
- **CORS must be explicitly enabled** in FastAPI for the React dev server to connect
- **Long-running data loads** should use background tasks or give the frontend clear loading feedback
 
---
 
## Definition of Done
 
A session is "complete" when:
- [ ] User can select year → event → session → two drivers
- [ ] Backend returns valid mini-sector, delta, track map, and telemetry data
- [ ] Frontend renders all four visualization components without errors
- [ ] Delta chart correctly shows which driver is faster at each track point
- [ ] Track map is colored by mini-sector dominance
- [ ] App handles loading, empty, and error states gracefully