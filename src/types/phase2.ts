// ==========================================
// IDP - INDUSTRIAL DATA PLATFORM
// ==========================================

export interface Device {
  id: string;
  name: string;
  type: 'plc' | 'sensor' | 'hmi' | 'drive' | 'meter' | 'camera' | 'scale' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  macAddress: string;
  protocol: 'opcua' | 'mqtt' | 'modbus_tcp' | 'modbus_rtu' | 'ethernet_ip' | 'profinet' | 'bacnet' | 'canbus';
  departmentId: string;
  lineId: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastSeen: string;
  tagCount: number;
  firmwareVersion?: string;
  installDate: string;
}

export type PLCBrand = 'siemens' | 'mitsubishi' | 'omron' | 'delta' | 'allen_bradley' | 'ls' | 'fatek' | 'schneider';

export interface PLC {
  id: string;
  name: string;
  brand: PLCBrand;
  model: string;
  ipAddress: string;
  rack: number;
  slot: number;
  protocol: string;
  scanRate: number; // ms
  status: 'connected' | 'disconnected' | 'error';
  tagCount: number;
  lineId: string;
  departmentId: string;
  lastConnected: string;
}

export type TagDataType = 'bool' | 'int' | 'float' | 'double' | 'string' | 'word' | 'dword';
export type TagType = 'temperature' | 'pressure' | 'humidity' | 'speed' | 'rpm' | 'current' | 'voltage' | 'weight' | 'counter' | 'status' | 'alarm';

export interface Tag {
  id: string;
  name: string;
  address: string;
  dataType: TagDataType;
  tagType: TagType;
  unit: string;
  min: number;
  max: number;
  deadband: number;
  scanRate: number;
  description: string;
  deviceId: string;
  deviceName: string;
  currentValue: number | boolean | string;
  quality: 'good' | 'bad' | 'uncertain';
  timestamp: string;
  alarmEnabled: boolean;
  alarmHigh?: number;
  alarmLow?: number;
}

export interface TagHistoryPoint {
  timestamp: string;
  value: number;
  quality: 'good' | 'bad' | 'uncertain';
}

export interface Formula {
  id: string;
  name: string;
  expression: string;
  unit: string;
  description: string;
  tags: string[];
  resultType: 'kpi' | 'calculated';
  lastValue?: number;
  lastCalculated?: string;
}

export interface IDPEvent {
  id: string;
  type: 'machine_start' | 'machine_stop' | 'alarm' | 'operator_login' | 'batch_start' | 'batch_end' | 'threshold_breach';
  deviceId: string;
  deviceName: string;
  tagId?: string;
  tagName?: string;
  value?: any;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// ==========================================
// MES - PRODUCTION CENTER
// ==========================================

export interface ProductionLine {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  capacity: number;
  capacityUnit: string;
  status: 'running' | 'stopped' | 'setup' | 'maintenance' | 'alarm';
  currentShiftId?: string;
  currentOrderId?: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  todayProduction: number;
  todayTarget: number;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productCode: string;
  customerId?: string;
  customerName?: string;
  quantity: number;
  completedQty: number;
  rejectedQty: number;
  reworkQty: number;
  unit: string;
  lineId: string;
  lineName: string;
  machineId?: string;
  shiftId?: string;
  supervisorId: string;
  supervisorName: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled' | 'delayed';
  progress: number;
  downtime: number; // minutes
  notes?: string;
  createdAt: string;
}

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  supervisorId: string;
  supervisorName: string;
  operatorIds: string[];
  lineId: string;
  date: string;
  status: 'planned' | 'active' | 'completed';
  targetQty: number;
  actualQty: number;
}

export interface ProductionEntry {
  id: string;
  orderId: string;
  lineId: string;
  shiftId: string;
  operatorId: string;
  operatorName: string;
  producedQty: number;
  rejectedQty: number;
  reworkQty: number;
  downtime: number;
  comments?: string;
  entryTime: string;
  approvedBy?: string;
}

export interface DowntimeRecord {
  id: string;
  lineId: string;
  lineName: string;
  orderId?: string;
  machineId?: string;
  machineName?: string;
  reason: string;
  category: 'mechanical' | 'electrical' | 'material' | 'operator' | 'quality' | 'utility' | 'planned';
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  operatorId: string;
  operatorName: string;
  supervisorId?: string;
  supervisorName?: string;
  approved: boolean;
  cost?: number;
  note?: string;
}

export interface ScrapRecord {
  id: string;
  orderId: string;
  lineId: string;
  productName: string;
  scrapType: string;
  quantity: number;
  unit: string;
  reason: string;
  cost: number;
  photo?: string;
  operatorId: string;
  operatorName: string;
  recordedAt: string;
}

export interface OEECalculation {
  lineId: string;
  lineName: string;
  date: string;
  shiftId?: string;
  plannedTime: number;
  downtime: number;
  availableTime: number;
  availability: number;
  idealCycleTime: number;
  totalParts: number;
  performance: number;
  goodParts: number;
  qualityRate: number;
  oee: number;
}

// ==========================================
// ALERT CENTER
// ==========================================

export type AlertSeverity = 'info' | 'warning' | 'minor' | 'major' | 'critical' | 'emergency';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'closed' | 'escalated';
export type AlertSource = 'plc' | 'production' | 'warehouse' | 'cmms' | 'hse' | 'quality' | 'hr' | 'manual';

export interface AlertTemplate {
  id: string;
  code: string;
  title: string;
  severity: AlertSeverity;
  category: string;
  departmentId: string;
  departmentName: string;
  source: AlertSource;
  message: string;
  escalationTreeId?: string;
  notificationChannels: string[];
  autoClose: boolean;
  autoCloseMinutes?: number;
  createdAt: string;
}

export interface Alert {
  id: string;
  templateId?: string;
  code: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: AlertSource;
  sourceId?: string;
  departmentId: string;
  departmentName: string;
  deviceId?: string;
  deviceName?: string;
  tagId?: string;
  tagName?: string;
  value?: any;
  threshold?: any;
  openedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  closedAt?: string;
  duration?: number;
  escalationLevel: number;
  escalatedTo?: string;
  escalatedAt?: string;
  cost?: number;
  notes?: string;
}

export interface EscalationRule {
  id: string;
  alertTemplateId: string;
  level: number;
  waitMinutes: number;
  notifyUserId?: string;
  notifyUserName?: string;
  notifyRole?: string;
  channels: ('in_app' | 'sms' | 'email' | 'telegram' | 'whatsapp' | 'voice')[];
  action?: 'notify' | 'create_incident' | 'stop_line' | 'create_work_order';
}

// ==========================================
// INCIDENT ENGINE
// ==========================================

export interface IncidentTemplate {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  checklist: ChecklistItem[];
  escalationTreeId?: string;
  autoTasks: AutoTask[];
  screenLock: boolean;
  requirePhoto: boolean;
  requireSignature: boolean;
  requireSupervisorApproval: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
  order: number;
  type: 'checkbox' | 'photo' | 'text' | 'signature';
  completed?: boolean;
  completedBy?: string;
  completedAt?: string;
  response?: string;
}

export interface AutoTask {
  type: 'task' | 'work_order' | 'inspection' | 'purchase_request';
  title: string;
  assignTo: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueHours: number;
}

export interface Incident {
  id: string;
  templateId?: string;
  code: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'pending_approval' | 'resolved' | 'closed';
  source: string;
  departmentId: string;
  departmentName: string;
  lineId?: string;
  lineName?: string;
  machineId?: string;
  machineName?: string;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  supervisorId?: string;
  supervisorName?: string;
  openedAt: string;
  closedAt?: string;
  photos: string[];
  checklist: ChecklistItem[];
  screenLocked: boolean;
  checklistCompleted: boolean;
  rca?: RCARecord;
  actions: IncidentAction[];
  cost?: number;
  downtime?: number;
  alertId?: string;
}

export interface RCARecord {
  id: string;
  incidentId: string;
  method: '5why' | 'fishbone' | 'fta' | 'fmea';
  rootCauses: string[];
  contributingFactors: string[];
  immediateActions: string[];
  preventiveActions: string[];
  completedBy: string;
  completedAt: string;
}

export interface IncidentAction {
  id: string;
  type: 'corrective' | 'preventive' | 'immediate';
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
}

// ==========================================
// COMMAND CENTER
// ==========================================

export interface FactorySnapshot {
  timestamp: string;
  production: {
    activeOrders: number;
    totalOutput: number;
    target: number;
    oee: number;
    downtime: number;
    efficiency: number;
  };
  maintenance: {
    openWorkOrders: number;
    criticalWorkOrders: number;
    equipmentDown: number;
    plannedMaintenance: number;
  };
  warehouse: {
    totalItems: number;
    lowStock: number;
    criticalStock: number;
    totalValue: number;
  };
  quality: {
    defectRate: number;
    openNCRs: number;
    pendingInspections: number;
    cpk: number;
  };
  safety: {
    openIncidents: number;
    criticalAlerts: number;
    nearMisses: number;
    lti: number;
  };
  hr: {
    presentToday: number;
    absent: number;
    onLeave: number;
    overtime: number;
  };
  finance: {
    revenueToday: number;
    costToday: number;
    downtimeCost: number;
    scrapCost: number;
  };
  alerts: {
    total: number;
    critical: number;
    active: number;
    escalated: number;
  };
}

export interface ExecutiveReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  title: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  status: 'draft' | 'sent' | 'approved';
  sections: string[];
}

// ==========================================
// TELEMETRY — SENSORS & ALERT RULES
// ==========================================

/** Raw sensor reading — returned by GET /api/telemetry/sensors/ */
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

/** Inline-editing draft for sensor config (no id needed) */
export interface SensorConfigDraft {
  name: string;
  name_en: string;
  unit: string;
  description: string;
  is_active: boolean;
}

/** Merged sensor row combining discovered sensor + config data */
export interface MergedSensorRow {
  sensorId: string;
  hasConfig: boolean;
  configId: number;
  name: string;
  name_en: string;
  unit: string;
  description: string;
  is_active: boolean;
}

/** Alert rule — returned by GET /api/telemetry/alert-rules/ */
export interface AlertRule {
  id: number;
  sensor_id: string;
  name: string;
  min_value: number | null;
  max_value: number | null;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  factory: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Payload for creating / updating an alert rule */
export interface AlertRulePayload {
  sensor_id: string;
  name: string;
  min_value: number | null;
  max_value: number | null;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  factory: number;
  is_active: boolean;
}

// ─────────────────────────────────────────
// SENSOR ALERT EVENTS
// ─────────────────────────────────────────

/** Sensor alert event — returned by GET /api/telemetry/alert-events/ */
export interface SensorAlertEvent {
  id: number;
  rule: number;
  name_rule: string;
  sensor_id: string;
  value: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  triggered_at: string;
  resolved_at: string | null;
  resolved_value: number | null;
  resolved_note: string | null;
  is_active: boolean;
  operator_note: string | null;
  is_reviewed: boolean;
  reviewed_by: string | null;
  reviewed_by_name: string | null;
  reviewed_at: string | null;
}

/** Payload for PATCH/PUT on an alert event (partial update) */
export interface SensorAlertEventPayload {
  operator_note?: string;
  is_reviewed?: boolean;
}

/** Query parameters for GET /api/telemetry/alert-events/ */
export interface AlertEventQueryParams {
  sensor?: string;
  only_active?: boolean;
}
