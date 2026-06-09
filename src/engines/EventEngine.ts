export type EventCategory = 'production' | 'warehouse' | 'maintenance' | 'quality' | 'hse' | 'hr' | 'system' | 'alert' | 'workflow';
export type EventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface SystemEvent {
  id: string; type: string; category: EventCategory; severity: EventSeverity;
  source: { module: string; entityType: string; entityId: string };
  data: Record<string, any>; metadata?: Record<string, any>;
  timestamp: string;
}

let listeners: Array<(event: SystemEvent) => void> = [];
let eventHistory: SystemEvent[] = [];

export function createEvent(event: Omit<SystemEvent, 'id' | 'timestamp'>): SystemEvent {
  const evt: SystemEvent = { ...event, id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, timestamp: new Date().toISOString() };
  eventHistory.unshift(evt);
  if (eventHistory.length > 100) eventHistory.pop();
  listeners.forEach((l) => l(evt));
  return evt;
}

export function onEvent(callback: (event: SystemEvent) => void) { listeners.push(callback); return () => { listeners = listeners.filter((l) => l !== callback); }; }

export function getEventHistory(limit = 50): SystemEvent[] { return eventHistory.slice(0, limit); }

export function clearHistory() { eventHistory = []; }
