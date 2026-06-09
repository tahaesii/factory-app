// ==========================================
// CORE PLATFORM TYPES
// ==========================================

// User Management
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  employeeCode: string;
  mobile: string;
  email: string;
  avatar?: string;
  departmentId: string;
  positionId: string;
  shiftId: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  status: 'active' | 'inactive' | 'suspended' | 'terminated';
  roleId: string;
  createdAt: string;
  updatedAt: string;
}

// Role Management
export interface Role {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  level: number; // 1 = highest (Super Admin), 10 = lowest (Guest)
  permissions: Permission[];
  isSystem: boolean; // System roles cannot be deleted
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'export' | 'import' | 'view_cost' | 'view_salary' | 'admin';
  granted: boolean;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ip: string;
  location?: string;
  userAgent?: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  status: 'success' | 'failed';
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  channel: 'in_app' | 'sms' | 'email' | 'telegram' | 'whatsapp' | 'voice';
  module?: string;
  entityType?: string;
  entityId?: string;
  read: boolean;
  sentAt: string;
  readAt?: string;
}

// File Management
export interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  extension: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: string;
  module: string;
  entityType: string;
  entityId: string;
  tags: string[];
  createdAt: string;
}

// Theme Settings
export interface ThemeSettings {
  id: string;
  tenantId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string;
  logoDark?: string;
  favicon?: string;
  fontFamily: string;
  mode: 'dark' | 'light' | 'system';
  customCSS?: string;
}

// ==========================================
// SUPER ADMIN TYPES
// ==========================================

// Tenant (Factory)
export interface Tenant {
  id: string;
  name: string;
  code: string;
  industry: string;
  ownerName: string;
  ownerMobile: string;
  ownerEmail: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  planId: string;
  status: 'active' | 'suspended' | 'trial' | 'expired';
  createdAt: string;
  expiresAt: string;
}

// License
export interface License {
  id: string;
  tenantId: string;
  licenseKey: string;
  planName: string;
  modules: string[];
  userLimit: number;
  storageLimit: number; // in GB
  apiLimit: number; // per day
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
}

// System Health
export interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  database: number;
  apiCalls: number;
  activeUsers: number;
  onlineUsers: number;
  uptime: number;
  lastChecked: string;
}

// ==========================================
// ORGANIZATION ENGINE TYPES
// ==========================================

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  parentId?: string;
  description?: string;
  level: number;
  order: number;
  status: 'active' | 'inactive';
  employeeCount: number;
  createdAt: string;
}

// Position
export interface Position {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  grade: number;
  reportsTo?: string;
  authorityLevel: 'executive' | 'management' | 'supervisory' | 'operational' | 'entry';
  responsibilities: string[];
  requirements: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

// Employee Assignment
export interface EmployeeAssignment {
  id: string;
  employeeId: string;
  departmentId: string;
  positionId: string;
  managerId?: string;
  shiftId: string;
  startDate: string;
  endDate?: string;
  isPrimary: boolean;
  status: 'active' | 'ended';
}

// Org Chart Node
export interface OrgChartNode {
  id: string;
  type: 'department' | 'position' | 'employee';
  entityId: string;
  parentId?: string;
  children: OrgChartNode[];
  x?: number;
  y?: number;
}

// Approval Tree
export interface ApprovalTree {
  id: string;
  name: string;
  module: string;
  steps: ApprovalStep[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  order: number;
  approverType: 'user' | 'position' | 'department' | 'role';
  approverId: string;
  approverName: string;
  condition?: string;
  timeout?: number; // in minutes
  escalateTo?: string;
}

// Escalation Tree
export interface EscalationTree {
  id: string;
  name: string;
  module: string;
  triggerType: string;
  levels: EscalationLevel[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface EscalationLevel {
  id: string;
  level: number;
  notifyType: 'user' | 'position' | 'role' | 'department';
  notifyId: string;
  notifyName: string;
  waitMinutes: number;
  channels: ('in_app' | 'sms' | 'email' | 'telegram' | 'whatsapp' | 'voice')[];
}

// ==========================================
// WORKFLOW ENGINE TYPES
// ==========================================

// Workflow Definition
export interface Workflow {
  id: string;
  name: string;
  code: string;
  module: string;
  description: string;
  triggerType: 'manual' | 'scheduled' | 'plc_event' | 'api_event' | 'form_submit' | 'alarm' | 'condition';
  triggerConfig: Record<string, any>;
  steps: WorkflowStep[];
  sla?: WorkflowSLA;
  status: 'active' | 'inactive' | 'draft';
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  type: 'approval' | 'action' | 'condition' | 'parallel' | 'notification' | 'task';
  config: {
    approvers?: string[];
    action?: string;
    conditions?: WorkflowCondition[];
    notification?: {
      channels: string[];
      template: string;
      recipients: string[];
    };
    task?: {
      title: string;
      assignee: string;
      dueHours: number;
    };
  };
  onApprove?: string; // next step id
  onReject?: string;
  timeout?: number;
}

export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface WorkflowSLA {
  responseTime: number; // minutes
  dueTime: number;
  escalationTime: number;
  escalateTo: string;
}

// Workflow Instance (Running workflow)
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowName: string;
  entityType: string;
  entityId: string;
  currentStepId: string;
  currentStepName: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'escalated';
  startedAt: string;
  completedAt?: string;
  startedBy: string;
  history: WorkflowHistoryItem[];
}

export interface WorkflowHistoryItem {
  stepId: string;
  stepName: string;
  action: string;
  userId: string;
  userName: string;
  comment?: string;
  timestamp: string;
}

// Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  module: string;
  entityType?: string;
  entityId?: string;
  ownerId: string;
  ownerName: string;
  assigneeId: string;
  assigneeName: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  dueDate: string;
  completedAt?: string;
  workflowInstanceId?: string;
  createdAt: string;
}

// Approval Request
export interface ApprovalRequest {
  id: string;
  workflowInstanceId: string;
  stepId: string;
  requesterId: string;
  requesterName: string;
  approverId: string;
  approverName: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  decision?: 'approved' | 'rejected';
  comment?: string;
  requestedAt: string;
  decidedAt?: string;
  dueAt: string;
}

// ==========================================
// DASHBOARD BUILDER TYPES
// ==========================================

// Dashboard
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  module?: string;
  ownerId: string;
  ownerName: string;
  sharing: 'private' | 'department' | 'factory' | 'public';
  sharedWith?: string[];
  template?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  refreshInterval?: number; // seconds
  isDefault: boolean;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'gauge' | 'table' | 'alert' | 'calendar' | 'map' | 'ai' | 'custom';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: WidgetConfig;
  dataSource: WidgetDataSource;
  refreshInterval?: number;
  visible: boolean;
  locked: boolean;
}

export interface WidgetConfig {
  // KPI Widget
  kpiValue?: string;
  kpiTarget?: number;
  kpiUnit?: string;
  kpiTrend?: 'up' | 'down' | 'flat';
  kpiIcon?: string;
  kpiColor?: string;
  
  // Chart Widget
  chartType?: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'heatmap' | 'radar' | 'scatter' | 'treemap';
  chartColors?: string[];
  chartLegend?: boolean;
  chartLabels?: boolean;
  
  // Gauge Widget
  gaugeMin?: number;
  gaugeMax?: number;
  gaugeThresholds?: { value: number; color: string }[];
  
  // Table Widget
  tableColumns?: { key: string; title: string; width?: number }[];
  tableSortable?: boolean;
  tableFilterable?: boolean;
  tablePageSize?: number;
  tableExportable?: boolean;
  
  // Alert Widget
  alertSeverity?: ('critical' | 'high' | 'medium' | 'low')[];
  alertModules?: string[];
  alertLimit?: number;
}

export interface WidgetDataSource {
  type: 'static' | 'api' | 'query' | 'realtime';
  endpoint?: string;
  query?: string;
  params?: Record<string, any>;
  staticData?: any;
}

// Dashboard Template
export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: 'ceo' | 'production' | 'warehouse' | 'maintenance' | 'hse' | 'quality' | 'hr' | 'finance' | 'custom';
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  createdAt: string;
}

// ==========================================
// SHARED TYPES
// ==========================================

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  workingDays: number[];
  status: 'active' | 'inactive';
}

export interface SelectOption {
  value: string;
  label: string;
}

export type SortDirection = 'asc' | 'desc';

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface TableFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
