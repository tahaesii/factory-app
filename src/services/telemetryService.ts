import { api } from "./api";
import type {
  Sensor,
  SensorConfig,
  SensorConfigPayload,
  AlertRule,
  AlertRulePayload,
} from "@/types/phase2";

export type {
  Sensor,
  SensorConfig,
  SensorConfigPayload,
  AlertRule,
  AlertRulePayload,
};

export const telemetryService = {
  // ── Live sensors ──
  async getSensors() {
    const { data } = await api.get<Sensor[]>("/api/telemetry/sensors/");
    return data;
  },

  // ── Readings / Historian ──
  async getReadings(params: {
    sensor: string;
    start?: string;
    stop?: string;
    window?: string;
  }) {
    const { data } = await api.get<{
      sensor: string;
      unit: string;
      points: { time: string; value: number }[];
    }>("/api/telemetry/readings/", { params });
    return data;
  },

  // ── Sensor configs ──
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

  // ── Alert rules ──
  async getAlertRules(sensorId?: string) {
    const params = sensorId ? { sensor_id: sensorId } : undefined;
    const { data } = await api.get<AlertRule[]>("/api/telemetry/alert-rules/", {
      params,
    });
    return data;
  },

  async createAlertRule(payload: AlertRulePayload) {
    const { data } = await api.post<AlertRule>(
      "/api/telemetry/alert-rules/",
      payload,
    );
    return data;
  },

  async updateAlertRule(id: number, payload: AlertRulePayload) {
    const { data } = await api.put<AlertRule>(
      `/api/telemetry/alert-rules/${id}/`,
      payload,
    );
    return data;
  },

  async deleteAlertRule(id: number) {
    await api.delete(`/api/telemetry/alert-rules/${id}/`);
  },
};
