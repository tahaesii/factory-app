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

/** Sensor configuration — returned by GET /api/telemetry/config/ */
export interface SensorConfig {
  id: number;
  sensor_id: string;
  sensor?: string;
  name: string;
  name_en: string;
  unit: string;
  description: string;
  factory: number;
  is_active: boolean;
}

/** Payload for creating / updating a sensor config */
export interface SensorConfigPayload {
  sensor_id: string;
  name: string;
  name_en: string;
  unit: string;
  description: string;
  factory: number;
  is_active: boolean;
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
    const { data } = await api.get<SensorReadings>("/api/telemetry/readings/", {
      params,
    });

    return data;
  },

  async getConfigs() {
    const { data } = await api.get<SensorConfig[]>("/api/telemetry/config/");
    return data.map((item) => ({
      ...item,
      sensor_id: item.sensor_id ?? item.sensor,
    }));
  },

  async createConfig(payload: SensorConfigPayload) {
    const { data } = await api.post<SensorConfig>(
      "/api/telemetry/config/",
      payload,
    );
    return data;
  },

  async updateConfig(id: number, payload: SensorConfigPayload) {
    const { data } = await api.put<SensorConfig>(
      `/api/telemetry/config/${id}/`,
      payload,
    );
    return data;
  },
};
