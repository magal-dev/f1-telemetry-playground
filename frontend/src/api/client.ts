import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export interface TelemetryPoint {
  Distance: number;
  Speed: number;
  RPM: number;
  nGear: number;
  Throttle: number;
  Brake: boolean;
  DRS: number;
  Time: string;
}

export interface CompareResponse {
  driver1: string;
  driver2: string;
  race: string;
  year: number;
  data: {
    driver1: TelemetryPoint[];
    driver2: TelemetryPoint[];
  };
}

export async function compareDrivers(
  year: number,
  race: string,
  driver1: string,
  driver2: string
): Promise<CompareResponse> {
  const { data } = await api.get<CompareResponse>("/compare_drivers", {
    params: { year, race, driver1, driver2 },
  });
  return data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await api.get("/");
    return true;
  } catch {
    return false;
  }
}
