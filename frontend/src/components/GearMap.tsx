import type { TelemetryPoint } from "../api/client";

interface GearMapProps {
  data: TelemetryPoint[];
  driver: string;
  color: string;
}

const GEAR_COLORS: Record<number, string> = {
  1: "#9b1c1c",
  2: "#c05621",
  3: "#d97706",
  4: "#65a30d",
  5: "#0891b2",
  6: "#1d4ed8",
  7: "#7c3aed",
  8: "#be185d",
};

export function GearMap({ data, driver, color }: GearMapProps) {
  if (!data.length) return null;

  const sample = data.filter((_, i) => i % 20 === 0);
  const maxDist = data[data.length - 1].Distance;

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-widest text-[#888] font-medium">
          Gear Map
        </h3>
        <span className="text-xs font-bold" style={{ color }}>{driver}</span>
      </div>
      <div className="flex h-6 w-full rounded overflow-hidden gap-px">
        {sample.map((point, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              background: GEAR_COLORS[point.nGear] ?? "#333",
              opacity: 0.85,
            }}
            title={`Gear ${point.nGear} @ ${Math.round(point.Distance)}m`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-[#555] mt-1">
        <span>0m</span>
        <span>{Math.round(maxDist)}m</span>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        {Object.entries(GEAR_COLORS).map(([g, c]) => (
          <div key={g} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            <span className="text-[9px] text-[#666]">G{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
