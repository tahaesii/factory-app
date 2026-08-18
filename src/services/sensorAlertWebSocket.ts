import { useApiConfigStore } from "@/store/apiConfigStore";
import { useAuthStore } from "@/store/authStore";

export type WsConnectionState = "connecting" | "connected" | "disconnected";

export interface WsEventPayload {
  type: "triggered" | "resolved" | "reviewed";
  data: any;
}

type WsEventHandler = (payload: WsEventPayload) => void;

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY = 1000; // ms
const EVENT_DEBOUNCE_MS = 500; // ms

/**
 * Lightweight, singleton WebSocket client for the Sensor Alert API.
 *
 * - Reads the WebSocket URL and auth token from their respective Zustand
 *   stores at connect-time (no prop drilling).
 * - Reconnects with exponential backoff (max 5 attempts).
 * - Deduplicates events within a 500 ms window to suppress duplicate pushes.
 * - Exposes a simple subscribe/unsubscribe API so React components can
 *   hook into live event updates.
 */
class SensorAlertWebSocket {
  private ws: WebSocket | null = null;
  private _state: WsConnectionState = "disconnected";
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private handlers = new Set<WsEventHandler>();
  private lastEventId: string | null = null;
  private lastEventTime = 0;

  /* ── Public API ────────────────────── */

  get state(): WsConnectionState {
    return this._state;
  }

  connect() {
    // Guard: don't open a second connection if one is already alive.
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const wsUrl = useApiConfigStore.getState().sensorAlertWebSocketUrl;
    const token = useAuthStore.getState().token;

    if (!wsUrl) {
      this.setState("disconnected");
      return;
    }

    this.setState("connecting");

    // Build URL with token query param if available.
    const separator = wsUrl.includes("?") ? "&" : "?";
    const url = token
      ? `${wsUrl}${separator}token=${token}`
      : wsUrl;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.setState("connected");
      this.reconnectAttempts = 0;
      useApiConfigStore.getState().setWsConnectionStatus("connected");
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onclose = () => {
      this.setState("disconnected");
      useApiConfigStore.getState().setWsConnectionStatus("disconnected");

      if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay =
          RECONNECT_BASE_DELAY * Math.pow(2, this.reconnectAttempts);
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => this.connect(), delay);
      }
    };

    this.ws.onerror = (error) => {
      console.error("[SensorAlertWS] WebSocket error:", error);
      useApiConfigStore.getState().setWsConnectionStatus("error");
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.setState("disconnected");
    useApiConfigStore.getState().setWsConnectionStatus("disconnected");
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(handler: WsEventHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /* ── Private helpers ──────────────── */

  private setState(next: WsConnectionState) {
    this._state = next;
  }

  private handleMessage(raw: string) {
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    // Dedup: if the same event arrives twice within EVENT_DEBOUNCE_MS, skip.
    const eventId = parsed?.id ?? parsed?.event_id ?? JSON.stringify(parsed);
    const now = Date.now();
    if (eventId === this.lastEventId && now - this.lastEventTime < EVENT_DEBOUNCE_MS) {
      return;
    }
    this.lastEventId = eventId;
    this.lastEventTime = now;

    const payload: WsEventPayload = {
      type: parsed.type ?? "triggered",
      data: parsed,
    };

    for (const handler of this.handlers) {
      handler(payload);
    }
  }
}

/** Module-level singleton instance */
export const sensorAlertWebSocket = new SensorAlertWebSocket();
