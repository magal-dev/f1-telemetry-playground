import type { TelemetryPoint } from "./client";

function generateLap(seed: number): TelemetryPoint[] {
  const LAP_DIST = 5793; // Monza lap distance (m)
  const points: TelemetryPoint[] = [];

  // Monza corner profile: speed dips at corners, high on straights
  const profile = [
    { at: 0, spd: 80, gear: 2 },
    { at: 100, spd: 200, gear: 5 },
    { at: 400, spd: 310, gear: 8 },  // main straight
    { at: 800, spd: 80, gear: 1 },   // T1 chicane brake
    { at: 950, spd: 130, gear: 3 },
    { at: 1200, spd: 290, gear: 7 },
    { at: 1600, spd: 70, gear: 1 },  // Curva Grande brake
    { at: 1750, spd: 160, gear: 4 },
    { at: 2100, spd: 300, gear: 7 },
    { at: 2500, spd: 80, gear: 2 },  // Lesmo 1
    { at: 2700, spd: 115, gear: 3 },
    { at: 2900, spd: 200, gear: 5 },
    { at: 3100, spd: 95, gear: 2 },  // Lesmo 2
    { at: 3300, spd: 145, gear: 4 },
    { at: 3700, spd: 290, gear: 7 }, // Serraglio straight
    { at: 4000, spd: 65, gear: 1 },  // Variante Ascari
    { at: 4200, spd: 120, gear: 3 },
    { at: 4500, spd: 295, gear: 7 }, // back straight
    { at: 5200, spd: 75, gear: 1 },  // Parabolica
    { at: 5500, spd: 165, gear: 4 },
    { at: 5793, spd: 310, gear: 8 },
  ];

  const STEP = 10;
  const s = seed; // small bias per driver

  for (let d = 0; d <= LAP_DIST; d += STEP) {
    // interpolate speed from profile
    let lo = profile[0], hi = profile[profile.length - 1];
    for (let i = 0; i < profile.length - 1; i++) {
      if (profile[i].at <= d && profile[i + 1].at >= d) {
        lo = profile[i]; hi = profile[i + 1]; break;
      }
    }
    const t = hi.at === lo.at ? 0 : (d - lo.at) / (hi.at - lo.at);
    const baseSpd = lo.spd + (hi.spd - lo.spd) * t;
    const baseGear = Math.round(lo.gear + (hi.gear - lo.gear) * t);

    // add driver-specific variation
    const noise = Math.sin(d * 0.05 + s) * 3 + Math.sin(d * 0.13 + s * 2) * 2;
    const speed = Math.max(60, Math.min(340, baseSpd + noise + s * 0.8));
    const gear = Math.max(1, Math.min(8, baseGear));
    const rpm = 6000 + (speed / 340) * 9000 + Math.sin(d * 0.07) * 300;
    const throttle = speed < 150 ? Math.max(0, speed - 60) / 90 * 40 : 95 + noise;

    points.push({
      Distance: d,
      Speed: parseFloat(speed.toFixed(1)),
      RPM: Math.round(rpm),
      nGear: gear,
      Throttle: Math.max(0, Math.min(100, parseFloat(throttle.toFixed(1)))),
      Brake: speed < 100 && baseSpd < 150,
      DRS: speed > 250 ? 1 : 0,
      Time: `0:0${Math.floor(d / 100)}.000`,
    });
  }
  return points;
}

export const MOCK_RESPONSE = {
  driver1: "VER",
  driver2: "NOR",
  race: "Monza",
  year: 2024,
  data: {
    driver1: generateLap(1.2),
    driver2: generateLap(-0.8),
  },
};
