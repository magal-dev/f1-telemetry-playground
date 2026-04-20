import { useState } from "react";
import { compareDrivers, type CompareResponse } from "../api/client";
import { MOCK_RESPONSE } from "../api/mockData";
import { CompareForm } from "../components/CompareForm";
import { SpeedChart, DeltaChart, RPMChart, ThrottleChart } from "../components/TelemetryCharts";
import { StatCards } from "../components/StatCards";
import { GearMap } from "../components/GearMap";

type Tab = "speed" | "delta" | "rpm" | "throttle";

const TABS: { id: Tab; label: string }[] = [
  { id: "speed", label: "Speed" },
  { id: "delta", label: "Delta" },
  { id: "rpm", label: "RPM" },
  { id: "throttle", label: "Throttle" },
];

export function ComparatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("speed");

  function loadDemo() {
    setError(null);
    setResult(MOCK_RESPONSE);
    setActiveTab("speed");
  }

  async function handleCompare(year: number, race: string, d1: string, d2: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await compareDrivers(year, race, d1, d2);
      setResult(data);
      setActiveTab("speed");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Failed to load telemetry data."
          : "Failed to load telemetry data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-8">
      {/* Demo banner */}
      <div className="mx-4 mt-4 flex items-center justify-between bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2.5">
        <p className="text-[10px] text-[#555] uppercase tracking-widest">No backend? Try demo mode</p>
        <button
          onClick={loadDemo}
          className="text-[10px] font-bold tracking-widest uppercase text-[#e10600] border border-[#e10600]/40 px-3 py-1 rounded-lg active:scale-95 transition-all"
        >
          Load Demo
        </button>
      </div>

      {/* Session selector */}
      <div className="px-4 pt-3">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <CompareForm onSubmit={handleCompare} loading={loading} />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mx-4 mt-4 bg-[#1a0000] border border-[#e10600]/40 rounded-xl p-4">
          <p className="text-[#e10600] text-sm font-medium">Error loading data</p>
          <p className="text-[#888] text-xs mt-1">{error}</p>
          <p className="text-[#555] text-xs mt-2">
            Make sure the backend is running: <code className="text-[#e10600]">uvicorn app.main:app</code>
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="px-4 mt-4 space-y-3">
          {[180, 160, 160].map((h, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl animate-pulse"
              style={{ height: h }}
            />
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-4 space-y-3 px-4">
          {/* Race banner */}
          <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#555]">
                {result.year} · Qualifying
              </p>
              <p className="text-base font-bold text-white">{result.race}</p>
            </div>
            <div className="flex items-center gap-2">
              <DriverBadge code={result.driver1} color="#e10600" />
              <span className="text-xs text-[#555]">vs</span>
              <DriverBadge code={result.driver2} color="#0080ff" />
            </div>
          </div>

          {/* Stat summary */}
          <StatCards
            driver1={result.driver1}
            driver2={result.driver2}
            data1={result.data.driver1}
            data2={result.data.driver2}
          />

          {/* Tab nav */}
          <div className="flex bg-[#111] border border-[#2a2a2a] rounded-xl p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-[10px] uppercase tracking-widest rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#e10600] text-white"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart panel */}
          {activeTab === "speed" && (
            <SpeedChart
              driver1={result.driver1}
              driver2={result.driver2}
              data1={result.data.driver1}
              data2={result.data.driver2}
            />
          )}
          {activeTab === "delta" && (
            <DeltaChart
              driver1={result.driver1}
              driver2={result.driver2}
              data1={result.data.driver1}
              data2={result.data.driver2}
            />
          )}
          {activeTab === "rpm" && (
            <RPMChart
              driver1={result.driver1}
              driver2={result.driver2}
              data1={result.data.driver1}
              data2={result.data.driver2}
            />
          )}
          {activeTab === "throttle" && (
            <ThrottleChart
              driver1={result.driver1}
              driver2={result.driver2}
              data1={result.data.driver1}
              data2={result.data.driver2}
            />
          )}

          {/* Gear maps */}
          <GearMap
            data={result.data.driver1}
            driver={result.driver1}
            color="#e10600"
          />
          <GearMap
            data={result.data.driver2}
            driver={result.driver2}
            color="#0080ff"
          />
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="flex flex-col items-center justify-center mt-20 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#333]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <p className="text-[#555] text-sm">Select two drivers and hit</p>
          <p className="text-[#e10600] text-sm font-bold tracking-wider mt-0.5">Compare Laps</p>
        </div>
      )}
    </div>
  );
}

function DriverBadge({ code, color }: { code: string; color: string }) {
  return (
    <div
      className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider text-white"
      style={{ background: color + "22", border: `1px solid ${color}66`, color }}
    >
      {code}
    </div>
  );
}
