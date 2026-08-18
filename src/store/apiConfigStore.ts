import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SENSOR_ALERT_ENDPOINTS } from "@/services/sensorAlertEndpoints";

/** Default REST base URL — uses the same backend as the main app (VITE_API_URL) */
const DEFAULT_REST_URL =
  import.meta.env.VITE_API_URL || "http://87.107.146.212:8000";

/** Derive a WebSocket URL from a REST URL (http→ws, https→wss, then append path) */
export function deriveWsUrl(restUrl: string): string {
  const normalized = restUrl.replace(/\/+$/, "");
  const wsUrl = normalized
    .replace(/^https:\/\//i, "wss://")
    .replace(/^http:\/\//i, "ws://");
  return `${wsUrl}${SENSOR_ALERT_ENDPOINTS.WEBSOCKET}`;
}

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

interface ApiConfigState {
  /** Base URL for the Sensor Alert REST API (e.g. http://host:port) */
  sensorAlertApiBaseUrl: string;
  /** WebSocket URL for the Sensor Alert API (e.g. ws://host:port/ws/telemetry/alerts/) */
  sensorAlertWebSocketUrl: string;
  /** Human-readable connection health for the WebSocket */
  wsConnectionStatus: ConnectionStatus;

  /* setters */
  setSensorAlertApiBaseUrl: (url: string) => void;
  setSensorAlertWebSocketUrl: (url: string) => void;
  setWsConnectionStatus: (status: ConnectionStatus) => void;
  /** Persist both URLs at once / reset to defaults */
  saveConfiguration: (restUrl: string, wsUrl: string) => void;
  resetToDefaults: () => void;
}

export const useApiConfigStore = create<ApiConfigState>()(
  persist(
    (set) => ({
      sensorAlertApiBaseUrl: DEFAULT_REST_URL,
      sensorAlertWebSocketUrl: deriveWsUrl(DEFAULT_REST_URL),
      wsConnectionStatus: "disconnected",

      setSensorAlertApiBaseUrl: (url) =>
        set({
          sensorAlertApiBaseUrl: url,
          sensorAlertWebSocketUrl: deriveWsUrl(url),
        }),

      setSensorAlertWebSocketUrl: (url) => set({ sensorAlertWebSocketUrl: url }),

      setWsConnectionStatus: (status) => set({ wsConnectionStatus: status }),

      saveConfiguration: (restUrl, wsUrl) =>
        set({
          sensorAlertApiBaseUrl: restUrl,
          sensorAlertWebSocketUrl: wsUrl,
          wsConnectionStatus: "disconnected",
        }),

      resetToDefaults: () =>
        set({
          sensorAlertApiBaseUrl: DEFAULT_REST_URL,
          sensorAlertWebSocketUrl: deriveWsUrl(DEFAULT_REST_URL),
          wsConnectionStatus: "disconnected",
        }),
    }),
    {
      name: "api-config-storage",
      partialize: (state) => ({
        sensorAlertApiBaseUrl: state.sensorAlertApiBaseUrl,
        sensorAlertWebSocketUrl: state.sensorAlertWebSocketUrl,
      }),
    },
  ),
);
