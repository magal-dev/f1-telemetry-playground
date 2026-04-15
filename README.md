# F1 Telemetry Playground

Exploring F1 qualifying telemetry with FastF1, FastAPI & React. Built for fun, learning, and the love of the sport — because motorsport data is just too cool not to dig into.

---

## What is this?

A full-stack web application for comparing qualifying laps between two F1 drivers. Pick a year, a race weekend, and two drivers — then dig into their telemetry: speed traces, gear changes, delta times, mini-sector dominance, and an interactive track map.

This is a personal learning project. The goal is to combine a genuine passion for Formula 1 with hands-on experience building a real full-stack application from scratch.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Python 3.11+, FastAPI               |
| F1 Data     | [FastF1](https://github.com/theOehrly/Fast-F1) |
| Data        | Pandas, NumPy                       |
| Frontend    | React + Vite (TypeScript)           |
| Charts      | Recharts / Plotly.js                |
| Styling     | Tailwind CSS                        |
| HTTP Client | Axios                               |

---

## Current State

The backend foundation is in place:

- `GET /fastest_lap?year=&race=&driver=` — returns full car telemetry for a driver's fastest qualifying lap
- `GET /compare_drivers?year=&race=&driver1=&driver2=` — returns telemetry for both drivers side by side

Example:
```
GET /compare_drivers?year=2023&race=Monza&driver1=LEC&driver2=VER
```

The frontend and visualizations are work in progress.

---

## Roadmap

- [x] FastAPI backend with FastF1 integration
- [x] Fastest lap telemetry endpoint
- [x] Driver comparison endpoint
- [ ] Session discovery endpoints (seasons → events → sessions → drivers)
- [ ] Delta time computation (cumulative gap along track distance)
- [ ] Mini-sector splits (25-segment lap breakdown)
- [ ] React frontend with session and driver selectors
- [ ] Delta time line chart
- [ ] Mini-sector dominance grid
- [ ] Track map colored by dominance
- [ ] Speed / gear / throttle overlay chart

---

## Getting Started

### Backend

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn fastf1 pandas

# Run the API
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs at `http://localhost:8000/docs`.

> **Note:** FastF1 downloads session data on first request and caches it to disk. The first call for any session will be slow — subsequent calls are fast.

---

## About

Built by a Formula 1 enthusiast who wanted to go beyond watching the races and actually understand the data behind them. Every lap time, every braking point, every tenth — there's a story in the telemetry.
