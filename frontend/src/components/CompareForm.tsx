import { useState } from "react";

interface CompareFormProps {
  onSubmit: (year: number, race: string, d1: string, d2: string) => void;
  loading: boolean;
}

const DRIVER_PRESETS = ["VER", "NOR", "LEC", "HAM", "RUS", "SAI", "ALO", "STR", "PIA", "GAS"];

const RACE_PRESETS = [
  "Bahrain", "Saudi Arabia", "Australia", "Japan", "China",
  "Miami", "Emilia Romagna", "Monaco", "Canada", "Spain",
  "Austria", "Great Britain", "Hungary", "Belgium",
  "Netherlands", "Monza", "Azerbaijan", "Singapore",
  "United States", "Mexico City", "São Paulo",
  "Las Vegas", "Qatar", "Abu Dhabi",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

export function CompareForm({ onSubmit, loading }: CompareFormProps) {
  const [year, setYear] = useState(2024);
  const [race, setRace] = useState("Monza");
  const [driver1, setDriver1] = useState("VER");
  const [driver2, setDriver2] = useState("NOR");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (driver1 === driver2) return;
    onSubmit(year, race, driver1, driver2);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Year + Race row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5 font-medium">
            Season
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#e10600] transition-colors appearance-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5 font-medium">
            Race
          </label>
          <select
            value={race}
            onChange={(e) => setRace(e.target.value)}
            className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#e10600] transition-colors appearance-none"
          >
            {RACE_PRESETS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Drivers */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="mx-3 text-[10px] text-[#555] uppercase tracking-widest">vs</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>
        <div className="relative grid grid-cols-2 gap-3 pt-4">
          <DriverPicker label="Driver 1" value={driver1} onChange={setDriver1} color="#e10600" presets={DRIVER_PRESETS} />
          <DriverPicker label="Driver 2" value={driver2} onChange={setDriver2} color="#0080ff" presets={DRIVER_PRESETS} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || driver1 === driver2}
        className="w-full py-3 bg-[#e10600] text-white font-bold tracking-widest uppercase text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Loading Telemetry...
          </span>
        ) : (
          "Compare Laps"
        )}
      </button>

      {driver1 === driver2 && (
        <p className="text-center text-xs text-[#e10600]">Select two different drivers</p>
      )}
    </form>
  );
}

function DriverPicker({
  label, value, onChange, color, presets,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  color: string;
  presets: string[];
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest mb-1.5 font-medium" style={{ color }}>
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ background: color }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg pl-3 pr-2 py-2.5 text-sm font-bold tracking-wider focus:outline-none transition-colors appearance-none"
          style={{ borderLeftColor: color, borderLeftWidth: 2 }}
        >
          {presets.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
