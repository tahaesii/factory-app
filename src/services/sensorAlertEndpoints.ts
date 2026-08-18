/**
 * Centralized endpoint path constants for the Sensor Alert API.
 * The base URL (host + port) is configurable via the Settings page,
 * but the path segments below are fixed and should never be changed
 * by the user.
 */
export const SENSOR_ALERT_ENDPOINTS = {
  /** REST: alert rules collection */
  ALERT_RULES: "/api/telemetry/alert-rules/",
  /** REST: alert events collection */
  ALERT_EVENTS: "/api/telemetry/alert-events/",
  /** WebSocket: live sensor alert push */
  WEBSOCKET: "/ws/telemetry/alerts/",
} as const;

/**
 * Extract the last path segment from an ID (e.g. 42 → "42").
 * Kept here so all path construction goes through one file.
 */
export function alertEventPath(id: string | number): string {
  return `${SENSOR_ALERT_ENDPOINTS.ALERT_EVENTS}${id}/`;
}
