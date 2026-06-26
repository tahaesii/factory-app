import { api } from "./api";

export interface Sensor {
  sensor: string;
  source: string;
  unit: string;
  last_value: number;
  last_time: string;
}

export interface ReadingPoint {
  time: string;
  value: number;
}

export interface SensorReadings {
  sensor: string;
  unit: string;
  points: ReadingPoint[];
}

export const telemetryService = {
  async getSensors() {
    const { data } = await api.get<Sensor[]>("/api/telemetry/sensors/");
    return data;
  },

  async getReadings(params: {
    sensor: string;
    start?: string;
    stop?: string;
    window?: string;
  }) {
    const { data } = await api.get<SensorReadings>(
      "/api/telemetry/readings/",
      {
        params,
      }
    );

    return data;
  },
};