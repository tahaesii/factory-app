import type { Alert } from '@/types/phase2';

type AlertHandler = (alert: Alert) => void;

class AlertEngineClass {
  private handlers: AlertHandler[] = [];
  private alerts: Alert[] = [];

  register(handler: AlertHandler) { this.handlers.push(handler); }

  unregister(handler: AlertHandler) { this.handlers = this.handlers.filter((h) => h !== handler); }

  dispatch(alert: Alert) {
    this.alerts.unshift(alert);
    if (this.alerts.length > 200) this.alerts.pop();
    this.handlers.forEach((h) => h(alert));
  }

  getAlerts(filters?: { severity?: string; status?: string }): Alert[] {
    let result = this.alerts;
    if (filters?.severity) result = result.filter((a) => a.severity === filters.severity);
    if (filters?.status) result = result.filter((a) => a.status === filters.status);
    return result.sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
  }

  getAlertCount() {
    const open = this.alerts.filter((a) => !['resolved', 'closed'].includes(a.status));
    return {
      total: open.length,
      critical: open.filter((a) => a.severity === 'critical' || a.severity === 'emergency').length,
      warning: open.filter((a) => a.severity === 'major' || a.severity === 'warning').length,
      minor: open.filter((a) => a.severity === 'minor' || a.severity === 'info').length,
    };
  }

  clear() { this.alerts = []; }
}

export const AlertEngine = new AlertEngineClass();
