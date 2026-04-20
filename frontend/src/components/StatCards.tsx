import type { TelemetryPoint } from "../api/client";

interface StatCardsProps {
  driver1: string;
  driver2: string;
  data1: TelemetryPoint[];
  data2: TelemetryPoint[];
}

function maxSpeed(data: TelemetryPoint[]) {
  return Math.max(...data.map((d) => d.Speed), 0);
}

function avgThrottle(data: TelemetryPoint[]) {
  if (!data.length) return 0;
  return data.reduce((s, d) => s + d.Throttle, 0) / data.length;
}

function maxRPM(data: TelemetryPoint[]) {
  return Math.max(...data.map((d) => d.RPM), 0);
}

function StatRow({
  label,
  v1,
  v2,
  unit = "",
  precision = 0,
}: {
  label: string;
  v1: number;
  v2: number;
  unit?: string;
  precision?: number;
}) {
  const d1Wins = v1 > v2;
  const d2Wins = v2 > v1;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#2a2a2a] last:border-0">
      <div className="text-center flex-1">
        <p
          className="text-sm font-bold"
          style={{ color: d1Wins ? "#e10600" : "#666" }}
        >
          {v1.toFixed(precision)}{unit}
        </p>
        {d1Wins && <div className="w-1.5 h-1.5 rounded-full bg-[#e10600] mx-auto mt-0.5" />}
      </div>
      <div className="flex-1 text-center">
        <p className="text-[9px] uppercase tracking-widest text-[#555]">{label}</p>
      </div>
      <div className="text-center flex-1">
        <p
          className="text-sm font-bold"
          style={{ color: d2Wins ? "#0080ff" : "#666" }}
        >
          {v2.toFixed(precision)}{unit}
        </p>
        {d2Wins && <div className="w-1.5 h-1.5 rounded-full bg-[#0080ff] mx-auto mt-0.5" />}
      </div>
    </div>
  );
}

export function StatCards({ driver1, driver2, data1, data2 }: StatCardsProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex justify-between mb-3">
        <span className="text-xs font-bold tracking-wider" style={{ color: "#e10600" }}>
          {driver1}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#555]">Stats</span>
        <span className="text-xs font-bold tracking-wider" style={{ color: "#0080ff" }}>
          {driver2}
        </span>
      </div>

      <StatRow label="Top Speed" v1={maxSpeed(data1)} v2={maxSpeed(data2)} unit=" km/h" />
      <StatRow label="Max RPM" v1={maxRPM(data1)} v2={maxRPM(data2)} />
      <StatRow label="Avg Throttle" v1={avgThrottle(data1)} v2={avgThrottle(data2)} unit="%" precision={1} />
    </div>
  );
}
