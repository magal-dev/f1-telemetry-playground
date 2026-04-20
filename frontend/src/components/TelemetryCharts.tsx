import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import type { TelemetryPoint } from "../api/client";

interface ChartProps {
  driver1: string;
  driver2: string;
  data1: TelemetryPoint[];
  data2: TelemetryPoint[];
}

const D1_COLOR = "#e10600";
const D2_COLOR = "#0080ff";

function resample(points: TelemetryPoint[], step = 50): TelemetryPoint[] {
  if (!points.length) return [];
  const maxDist = points[points.length - 1].Distance;
  const result: TelemetryPoint[] = [];
  let j = 0;
  for (let d = 0; d <= maxDist; d += step) {
    while (j < points.length - 1 && points[j + 1].Distance < d) j++;
    result.push({ ...points[j], Distance: Math.round(d) });
  }
  return result;
}

function mergeByDistance(
  data1: TelemetryPoint[],
  data2: TelemetryPoint[],
  field: keyof TelemetryPoint
): { dist: number; d1: number; d2: number }[] {
  const s1 = resample(data1);
  const s2 = resample(data2);
  const len = Math.min(s1.length, s2.length);
  return Array.from({ length: len }, (_, i) => ({
    dist: s1[i].Distance,
    d1: Number(s1[i][field]),
    d2: Number(s2[i][field]),
  }));
}

function buildDelta(data1: TelemetryPoint[], data2: TelemetryPoint[]): { dist: number; delta: number }[] {
  const s1 = resample(data1, 25);
  const s2 = resample(data2, 25);
  const len = Math.min(s1.length, s2.length);
  let cumDelta = 0;
  return Array.from({ length: len }, (_, i) => {
    const segDist = 25;
    const v1 = s1[i].Speed || 1;
    const v2 = s2[i].Speed || 1;
    const t1 = segDist / ((v1 * 1000) / 3600);
    const t2 = segDist / ((v2 * 1000) / 3600);
    cumDelta += t1 - t2;
    return { dist: s1[i].Distance, delta: parseFloat(cumDelta.toFixed(3)) };
  });
}

const tooltipStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "11px",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      <h3 className="text-[10px] uppercase tracking-widest text-[#888] mb-3 font-medium">{title}</h3>
      {children}
    </div>
  );
}

export function SpeedChart({ driver1, driver2, data1, data2 }: ChartProps) {
  const merged = mergeByDistance(data1, data2, "Speed");
  return (
    <ChartCard title="Speed (km/h)">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={merged} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="dist" tick={{ fontSize: 9, fill: "#555" }} tickFormatter={(v) => `${v}m`} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: "#555" }} domain={["auto", "auto"]} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${Number(v)} km/h`, String(name)]} labelFormatter={(l) => `${l}m`} />
          <Legend formatter={(v) => v === "d1" ? driver1 : driver2} wrapperStyle={{ fontSize: "10px" }} />
          <Line type="monotone" dataKey="d1" name="d1" stroke={D1_COLOR} dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="d2" name="d2" stroke={D2_COLOR} dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DeltaChart({ driver1, driver2, data1, data2 }: ChartProps) {
  const delta = buildDelta(data1, data2);
  const maxAbs = Math.max(...delta.map((d) => Math.abs(d.delta)), 0.1);
  return (
    <ChartCard title={`Delta: ${driver1} vs ${driver2}`}>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={delta} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="dist" tick={{ fontSize: 9, fill: "#555" }} tickFormatter={(v) => `${v}m`} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: "#555" }} domain={[-maxAbs, maxAbs]} tickFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}s`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => { const n = Number(v); return [`${n > 0 ? "+" : ""}${n.toFixed(3)}s`, "Delta"]; }} labelFormatter={(l) => `${l}m`} />
          <ReferenceLine y={0} stroke="#444" strokeDasharray="4 2" />
          <Line type="monotone" dataKey="delta" stroke="#f5a623" dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-[9px] text-[#555] mt-1">
        <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#e10600] inline-block" /> {driver1} ahead</span>
        <span className="flex items-center gap-1">{driver2} ahead <span className="w-2 h-0.5 bg-[#0080ff] inline-block" /></span>
      </div>
    </ChartCard>
  );
}

export function RPMChart({ driver1, driver2, data1, data2 }: ChartProps) {
  const merged = mergeByDistance(data1, data2, "RPM");
  return (
    <ChartCard title="Engine RPM">
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={merged} margin={{ top: 0, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="dist" tick={{ fontSize: 9, fill: "#555" }} tickFormatter={(v) => `${v}m`} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: "#555" }} domain={["auto", "auto"]} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${Number(v).toLocaleString()} rpm`, String(name) === "d1" ? driver1 : driver2]} labelFormatter={(l) => `${l}m`} />
          <Line type="monotone" dataKey="d1" stroke={D1_COLOR} dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="d2" stroke={D2_COLOR} dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ThrottleChart({ driver1, driver2, data1, data2 }: ChartProps) {
  const merged = mergeByDistance(data1, data2, "Throttle");
  return (
    <ChartCard title="Throttle (%)">
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={merged} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="dist" tick={{ fontSize: 9, fill: "#555" }} tickFormatter={(v) => `${v}m`} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9, fill: "#555" }} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${Number(v).toFixed(0)}%`, String(name) === "d1" ? driver1 : driver2]} labelFormatter={(l) => `${l}m`} />
          <Line type="monotone" dataKey="d1" stroke={D1_COLOR} dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="d2" stroke={D2_COLOR} dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
