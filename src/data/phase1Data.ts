import type {
  User, Role, AuditLog, Notification, FileRecord, ThemeSettings,
  Tenant, License, SystemHealth,
  Department, Position, ApprovalTree, EscalationTree,
  Workflow, WorkflowInstance, Task, ApprovalRequest,
  Dashboard, DashboardTemplate, Shift
} from '@/types';

// ==========================================
// CORE PLATFORM DATA
// ==========================================

export const shifts: Shift[] = [
  { id: 'morning', name: 'شیفت صبح', code: 'MORNING', startTime: '06:00', endTime: '14:00', breakMinutes: 60, workingDays: [6, 0, 1, 2, 3, 4], status: 'active' },
  { id: 'afternoon', name: 'شیفت عصر', code: 'EVENING', startTime: '14:00', endTime: '22:00', breakMinutes: 60, workingDays: [6, 0, 1, 2, 3, 4], status: 'active' },
  { id: 'night', name: 'شیفت شب', code: 'NIGHT', startTime: '22:00', endTime: '06:00', breakMinutes: 60, workingDays: [6, 0, 1, 2, 3, 4], status: 'active' },
  { id: 'full_day', name: 'شیفت روزانه', code: 'DAY', startTime: '08:00', endTime: '17:00', breakMinutes: 60, workingDays: [6, 0, 1, 2, 3], status: 'active' },
];

export const roles: Role[] = [
  { id: 'super_admin', name: 'مدیر سیستم', nameEn: 'Super Admin', description: 'دسترسی کامل به تمام بخش‌ها', level: 1, permissions: [], isSystem: true, createdAt: '1403/01/01' },
  { id: 'factory_owner', name: 'مالک کارخانه', nameEn: 'Factory Owner', description: 'مالک و تصمیم‌گیرنده نهایی', level: 2, permissions: [], isSystem: true, createdAt: '1403/01/01' },
  { id: 'factory_ceo', name: 'مدیرعامل', nameEn: 'CEO', description: 'مدیریت اجرایی کل کارخانه', level: 3, permissions: [], isSystem: true, createdAt: '1403/01/01' },
  { id: 'factory_admin', name: 'مدیر کارخانه', nameEn: 'Plant Manager', description: 'مدیریت عملیات کارخانه', level: 4, permissions: [], isSystem: true, createdAt: '1403/01/01' },
  { id: 'unit_manager', name: 'مدیر واحد', nameEn: 'Department Manager', description: 'مدیریت یک واحد سازمانی', level: 5, permissions: [], isSystem: true, createdAt: '1403/01/01' },
  { id: 'supervisor', name: 'سرپرست', nameEn: 'Supervisor', description: 'سرپرستی تیم یا خط تولید', level: 6, permissions: [], isSystem: true, createdAt: '1403/01/01' },
  { id: 'operator', name: 'اپراتور', nameEn: 'Operator', description: 'اپراتور خط تولید', level: 7, permissions: [], isSystem: false, createdAt: '1403/01/01' },
  { id: 'warehouse_user', name: 'کاربر انبار', nameEn: 'Warehouse User', description: 'کاربر عملیات انبار', level: 7, permissions: [], isSystem: false, createdAt: '1403/01/01' },
  { id: 'network_user', name: 'کاربر نت', nameEn: 'Maintenance User', description: 'تکنسین نگهداری و تعمیرات', level: 7, permissions: [], isSystem: false, createdAt: '1403/01/01' },
  { id: 'hse_user', name: 'کاربر HSE', nameEn: 'HSE User', description: 'کارشناس ایمنی و بهداشت', level: 7, permissions: [], isSystem: false, createdAt: '1403/01/01' },
  { id: 'hr_user', name: 'کاربر HR', nameEn: 'HR User', description: 'کارشناس منابع انسانی', level: 7, permissions: [], isSystem: false, createdAt: '1403/01/01' },
  { id: 'guest', name: 'مهمان', nameEn: 'Guest', description: 'دسترسی فقط خواندن', level: 10, permissions: [], isSystem: true, createdAt: '1403/01/01' },
];

export const users: User[] = [
  { id: 'U-001', firstName: 'امیر', lastName: 'احمدی', nationalCode: '0012345678', employeeCode: 'EMP-001', mobile: '09121234567', email: 'admin@factoryos.ir', departmentId: 'D-001', positionId: 'P-001', shiftId: 'SH-004', employmentType: 'full-time', status: 'active', roleId: 'R-001', createdAt: '1403/01/01', updatedAt: '1403/10/01' },
  { id: 'U-002', firstName: 'علی', lastName: 'رضایی', nationalCode: '0023456789', employeeCode: 'EMP-002', mobile: '09122345678', email: 'ali@factoryos.ir', departmentId: 'D-002', positionId: 'P-003', shiftId: 'SH-004', employmentType: 'full-time', status: 'active', roleId: 'R-004', createdAt: '1403/02/01', updatedAt: '1403/10/01' },
  { id: 'U-003', firstName: 'محمد', lastName: 'کریمی', nationalCode: '0034567890', employeeCode: 'EMP-003', mobile: '09123456789', email: 'mohammad@factoryos.ir', departmentId: 'D-003', positionId: 'P-005', shiftId: 'SH-001', employmentType: 'full-time', status: 'active', roleId: 'R-005', createdAt: '1403/02/15', updatedAt: '1403/10/01' },
  { id: 'U-004', firstName: 'حسن', lastName: 'موسوی', nationalCode: '0045678901', employeeCode: 'EMP-004', mobile: '09124567890', email: 'hasan@factoryos.ir', departmentId: 'D-003', positionId: 'P-006', shiftId: 'SH-001', employmentType: 'full-time', status: 'active', roleId: 'R-006', createdAt: '1403/03/01', updatedAt: '1403/10/01' },
  { id: 'U-005', firstName: 'رضا', lastName: 'حسینی', nationalCode: '0056789012', employeeCode: 'EMP-005', mobile: '09125678901', email: 'reza@factoryos.ir', departmentId: 'D-003', positionId: 'P-007', shiftId: 'SH-001', employmentType: 'full-time', status: 'active', roleId: 'R-007', createdAt: '1403/03/15', updatedAt: '1403/10/01' },
  { id: 'U-006', firstName: 'فاطمه', lastName: 'نوری', nationalCode: '0067890123', employeeCode: 'EMP-006', mobile: '09126789012', email: 'fatemeh@factoryos.ir', departmentId: 'D-005', positionId: 'P-010', shiftId: 'SH-004', employmentType: 'full-time', status: 'active', roleId: 'R-011', createdAt: '1403/04/01', updatedAt: '1403/10/01' },
  { id: 'U-007', firstName: 'سعید', lastName: 'جعفری', nationalCode: '0078901234', employeeCode: 'EMP-007', mobile: '09127890123', email: 'saeed@factoryos.ir', departmentId: 'D-004', positionId: 'P-008', shiftId: 'SH-001', employmentType: 'full-time', status: 'active', roleId: 'R-008', createdAt: '1403/04/15', updatedAt: '1403/10/01' },
  { id: 'U-008', firstName: 'مهدی', lastName: 'صادقی', nationalCode: '0089012345', employeeCode: 'EMP-008', mobile: '09128901234', email: 'mehdi@factoryos.ir', departmentId: 'D-006', positionId: 'P-011', shiftId: 'SH-001', employmentType: 'full-time', status: 'active', roleId: 'R-009', createdAt: '1403/05/01', updatedAt: '1403/10/01' },
  { id: 'U-009', firstName: 'زهرا', lastName: 'محمدی', nationalCode: '0090123456', employeeCode: 'EMP-009', mobile: '09129012345', email: 'zahra@factoryos.ir', departmentId: 'D-007', positionId: 'P-012', shiftId: 'SH-004', employmentType: 'full-time', status: 'active', roleId: 'R-010', createdAt: '1403/05/15', updatedAt: '1403/10/01' },
  { id: 'U-010', firstName: 'حمید', lastName: 'اکبری', nationalCode: '0001234567', employeeCode: 'EMP-010', mobile: '09120123456', email: 'hamid@factoryos.ir', departmentId: 'D-003', positionId: 'P-007', shiftId: 'SH-002', employmentType: 'full-time', status: 'active', roleId: 'R-007', createdAt: '1403/06/01', updatedAt: '1403/10/01' },
];

export const auditLogs: AuditLog[] = [
  { id: 'AL-001', userId: 'U-001', userName: 'امیر احمدی', timestamp: '1403/10/02 08:30:15', ip: '192.168.1.100', location: 'دفتر مرکزی', userAgent: 'Chrome 120/Windows', module: 'Auth', action: 'login', entityType: 'session', entityId: 'S-001', status: 'success' },
  { id: 'AL-002', userId: 'U-002', userName: 'علی رضایی', timestamp: '1403/10/02 08:35:22', ip: '192.168.1.105', location: 'سالن تولید', userAgent: 'Edge/Windows', module: 'MES', action: 'create', entityType: 'production_order', entityId: 'PO-896', newValue: { product: 'قطعه A45', quantity: 1000, line: 'خط ۱' }, status: 'success' },
  { id: 'AL-003', userId: 'U-004', userName: 'حسن موسوی', timestamp: '1403/10/02 08:40:10', ip: '192.168.1.110', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'CMMS', action: 'update', entityType: 'work_order', entityId: 'WO-002', oldValue: { status: 'باز' }, newValue: { status: 'در حال انجام', assignee: 'مهدی صادقی' }, status: 'success' },
  { id: 'AL-004', userId: 'U-005', userName: 'رضا حسینی', timestamp: '1403/10/02 08:45:33', ip: '192.168.1.115', location: 'سالن ۱', userAgent: 'Firefox/Windows', module: 'Incidents', action: 'create', entityType: 'incident', entityId: 'INC-001', newValue: { title: 'خرابی پمپ هیدرولیک', severity: 'high', line: 'خط ۳' }, status: 'success' },
  { id: 'AL-005', userId: 'U-007', userName: 'سعید جعفری', timestamp: '1403/10/02 08:50:45', ip: '192.168.1.120', location: 'انبار', userAgent: 'Chrome/Windows', module: 'WMS', action: 'create', entityType: 'receiving', entityId: 'RCV-234', newValue: { supplier: 'فولاد البرز', items: 'میلگرد A3 - ۵۰۰۰ کیلو' }, status: 'success' },
  { id: 'AL-006', userId: 'U-001', userName: 'امیر احمدی', timestamp: '1403/10/02 09:00:00', ip: '192.168.1.100', location: 'دفتر مرکزی', userAgent: 'Chrome 120/Windows', module: 'Settings', action: 'update', entityType: 'settings', entityId: 'notifications', oldValue: { sms: false, email: true }, newValue: { sms: true, email: true }, status: 'success' },
  { id: 'AL-007', userId: 'U-003', userName: 'محمد کریمی', timestamp: '1403/10/02 09:15:20', ip: '192.168.1.108', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'QMS', action: 'approve', entityType: 'inspection', entityId: 'QC-001', newValue: { result: 'قبول', inspector: 'محمد کریمی' }, status: 'success' },
  { id: 'AL-008', userId: 'U-006', userName: 'فاطمه نوری', timestamp: '1403/10/02 09:30:55', ip: '192.168.1.125', location: 'دفتر HR', userAgent: 'Chrome/Windows', module: 'HRM', action: 'update', entityType: 'employee', entityId: 'U-010', oldValue: { shift: 'صبح', department: 'تولید' }, newValue: { shift: 'عصر', department: 'تولید' }, status: 'success' },
  { id: 'AL-009', userId: 'U-003', userName: 'محمد کریمی', timestamp: '1403/10/02 09:45:10', ip: '192.168.1.108', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'MES', action: 'update', entityType: 'production_order', entityId: 'PO-896', oldValue: { status: 'برنامه‌ریزی' }, newValue: { status: 'در حال تولید', startTime: '09:45' }, status: 'success' },
  { id: 'AL-010', userId: 'U-008', userName: 'مهدی صادقی', timestamp: '1403/10/02 09:50:30', ip: '192.168.1.130', location: 'تعمیرگاه', userAgent: 'Firefox/Windows', module: 'CMMS', action: 'start', entityType: 'work_order', entityId: 'WO-002', newValue: { startedAt: '09:50', estimatedHours: 4 }, status: 'success' },
  { id: 'AL-011', userId: 'U-009', userName: 'زهرا محمدی', timestamp: '1403/10/02 10:00:00', ip: '192.168.1.135', location: 'دفتر HSE', userAgent: 'Chrome/Windows', module: 'HSE', action: 'create', entityType: 'permit', entityId: 'PT-001', newValue: { type: 'کار گرم', location: 'سالن ۲', validUntil: '1403/10/02 18:00' }, status: 'success' },
  { id: 'AL-012', userId: 'U-005', userName: 'رضا حسینی', timestamp: '1403/10/02 10:15:45', ip: '192.168.1.115', location: 'سالن ۱', userAgent: 'Firefox/Windows', module: 'MES', action: 'create', entityType: 'scrap', entityId: 'SCR-001', newValue: { product: 'قطعه A45', quantity: 12, reason: 'انحراف ابعادی', line: 'خط ۱' }, status: 'success' },
  { id: 'AL-013', userId: 'U-007', userName: 'سعید جعفری', timestamp: '1403/10/02 10:30:00', ip: '192.168.1.120', location: 'انبار', userAgent: 'Chrome/Windows', module: 'WMS', action: 'issue', entityType: 'material', entityId: 'ISS-001', newValue: { item: 'روغن هیدرولیک', quantity: 50, unit: 'لیتر', requester: 'خط ۳' }, status: 'success' },
  { id: 'AL-014', userId: 'U-004', userName: 'حسن موسوی', timestamp: '1403/10/02 10:45:20', ip: '192.168.1.110', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'Incidents', action: 'update', entityType: 'incident', entityId: 'INC-001', oldValue: { status: 'گزارش شده' }, newValue: { status: 'در حال بررسی', assignee: 'مهدی صادقی' }, status: 'success' },
  { id: 'AL-015', userId: 'U-001', userName: 'امیر احمدی', timestamp: '1403/10/02 11:00:10', ip: '192.168.1.100', location: 'دفتر مرکزی', userAgent: 'Chrome 120/Windows', module: 'Core', action: 'create', entityType: 'user', entityId: 'U-011', newValue: { name: 'احمد کاظمی', role: 'اپراتور', department: 'تولید' }, status: 'success' },
  { id: 'AL-016', userId: 'U-002', userName: 'علی رضایی', timestamp: '1403/10/02 11:15:33', ip: '192.168.1.105', location: 'سالن تولید', userAgent: 'Edge/Windows', module: 'Dashboard', action: 'update', entityType: 'dashboard', entityId: 'DB-001', newValue: { widget: 'نمودار OEE' }, status: 'success' },
  { id: 'AL-017', userId: 'U-003', userName: 'محمد کریمی', timestamp: '1403/10/02 11:30:55', ip: '192.168.1.108', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'QMS', action: 'reject', entityType: 'inspection', entityId: 'QC-002', newValue: { result: 'رد', reason: 'انحراف از استاندارد', severity: 'major' }, status: 'success' },
  { id: 'AL-018', userId: 'U-006', userName: 'فاطمه نوری', timestamp: '1403/10/02 12:00:00', ip: '192.168.1.125', location: 'دفتر HR', userAgent: 'Chrome/Windows', module: 'HRM', action: 'create', entityType: 'leave_request', entityId: 'LV-003', newValue: { employee: 'رضا حسینی', type: 'مرخصی استعلاجی', days: 2 }, status: 'success' },
  { id: 'AL-019', userId: 'U-002', userName: 'علی رضایی', timestamp: '1403/10/02 12:30:22', ip: '192.168.1.105', location: 'سالن تولید', userAgent: 'Edge/Windows', module: 'MES', action: 'approve', entityType: 'production_plan', entityId: 'PLN-001', newValue: { shiftA: '۵۰۰۰ قطعه', shiftB: '۴۸۰۰ قطعه' }, status: 'success' },
  { id: 'AL-020', userId: 'U-009', userName: 'زهرا محمدی', timestamp: '1403/10/02 13:00:45', ip: '192.168.1.135', location: 'دفتر HSE', userAgent: 'Chrome/Windows', module: 'HSE', action: 'create', entityType: 'incident_report', entityId: 'HSE-INC-002', newValue: { type: 'Near Miss', location: 'انبار', description: 'سقوط جعبه از قفسه' }, status: 'success' },
  { id: 'AL-021', userId: 'U-001', userName: 'امیر احمدی', timestamp: '1403/10/02 13:30:10', ip: '192.168.1.100', location: 'دفتر مرکزی', userAgent: 'Chrome 120/Windows', module: 'Settings', action: 'update', entityType: 'role', entityId: 'R-007', oldValue: { permissions: ['read'] }, newValue: { permissions: ['read', 'create', 'update'] }, status: 'success' },
  { id: 'AL-022', userId: 'U-003', userName: 'محمد کریمی', timestamp: '1403/10/02 14:00:00', ip: '192.168.1.108', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'MES', action: 'update', entityType: 'shift_schedule', entityId: 'SH-002', oldValue: { operator: 'U-010' }, newValue: { operator: 'U-005' }, status: 'success' },
  { id: 'AL-023', userId: 'U-007', userName: 'سعید جعفری', timestamp: '1403/10/02 14:20:33', ip: '192.168.1.120', location: 'انبار', userAgent: 'Chrome/Windows', module: 'WMS', action: 'update', entityType: 'inventory', entityId: 'INV-045', oldValue: { quantity: 120 }, newValue: { quantity: 85 }, status: 'success' },
  { id: 'AL-024', userId: 'U-008', userName: 'مهدی صادقی', timestamp: '1403/10/02 15:00:00', ip: '192.168.1.130', location: 'تعمیرگاه', userAgent: 'Firefox/Windows', module: 'CMMS', action: 'complete', entityType: 'work_order', entityId: 'WO-002', newValue: { completedAt: '15:00', actualHours: 3.5, status: 'completed' }, status: 'success' },
  { id: 'AL-025', userId: 'U-005', userName: 'رضا حسینی', timestamp: '1403/10/02 15:30:15', ip: '192.168.1.115', location: 'سالن ۱', userAgent: 'Firefox/Windows', module: 'MES', action: 'create', entityType: 'downtime', entityId: 'DT-001', newValue: { reason: 'تعمیر پمپ', duration: '۴۵ دقیقه', line: 'خط ۳' }, status: 'success' },
  { id: 'AL-026', userId: 'U-002', userName: 'علی رضایی', timestamp: '1403/10/02 16:00:00', ip: '192.168.1.105', location: 'اتاق جلسات', userAgent: 'Edge/Windows', module: 'Auth', action: 'logout', entityType: 'session', entityId: 'S-002', status: 'success' },
  { id: 'AL-027', userId: 'U-010', userName: 'حمید اکبری', timestamp: '1403/10/02 16:05:22', ip: '192.168.1.140', location: 'سالن ۲', userAgent: 'Chrome/Android', module: 'MES', action: 'create', entityType: 'production_entry', entityId: 'ENT-001', newValue: { product: 'قطعه B12', quantity: 150, shift: 'عصر', line: 'خط ۲' }, status: 'success' },
  { id: 'AL-028', userId: 'U-010', userName: 'حمید اکبری', timestamp: '1403/10/02 16:06:10', ip: '192.168.1.140', location: 'سالن ۲', userAgent: 'Chrome/Android', module: 'MES', action: 'create', entityType: 'production_entry', entityId: 'ENT-002', newValue: { product: 'قطعه C34', quantity: 80, shift: 'عصر', line: 'خط ۲' }, status: 'failed', oldValue: { error: 'مواد اولیه کافی نیست' } },
  { id: 'AL-029', userId: 'U-001', userName: 'امیر احمدی', timestamp: '1403/10/02 17:00:00', ip: '192.168.1.100', location: 'دفتر مرکزی', userAgent: 'Chrome 120/Windows', module: 'Core', action: 'create', entityType: 'notification', entityId: 'N-006', newValue: { title: 'توقف خط ۳', broadcast: true }, status: 'success' },
  { id: 'AL-030', userId: 'U-004', userName: 'حسن موسوی', timestamp: '1403/10/02 17:30:45', ip: '192.168.1.110', location: 'سالن تولید', userAgent: 'Chrome/Windows', module: 'Alerts', action: 'update', entityType: 'alert_rule', entityId: 'AR-002', oldValue: { threshold: 80 }, newValue: { threshold: 85, notify: ['sms', 'email'] }, status: 'success' },
];

export const notifications: Notification[] = [
  { id: 'N-001', userId: 'U-001', title: 'هشدار دمای بالا', message: 'دمای کوره ۲ به ۸۵۰°C رسید', type: 'warning', channel: 'in_app', module: 'IDP', entityType: 'alarm', entityId: 'ALM-001', read: false, sentAt: '1403/10/02 08:30' },
  { id: 'N-002', userId: 'U-001', title: 'سفارش تولید تکمیل شد', message: 'سفارش PO-2024-0891 با موفقیت تکمیل شد', type: 'success', channel: 'in_app', module: 'MES', entityType: 'production_order', entityId: 'PO-891', read: false, sentAt: '1403/10/02 08:15' },
  { id: 'N-003', userId: 'U-001', title: 'درخواست خرید جدید', message: 'درخواست خرید PR-445 نیاز به تأیید دارد', type: 'info', channel: 'in_app', module: 'SRM', entityType: 'purchase_request', entityId: 'PR-445', read: true, sentAt: '1403/10/02 07:30' },
  { id: 'N-004', userId: 'U-001', title: 'خرابی ناگهانی', message: 'پمپ هیدرولیک خط ۳ از کار افتاد', type: 'error', channel: 'in_app', module: 'CMMS', entityType: 'incident', entityId: 'INC-001', read: false, sentAt: '1403/10/02 07:45' },
  { id: 'N-005', userId: 'U-001', title: 'بازرسی کیفیت', message: 'بازرسی ورودی محموله M-2233 تکمیل شد', type: 'success', channel: 'in_app', module: 'QMS', entityType: 'inspection', entityId: 'QC-001', read: true, sentAt: '1403/10/02 06:00' },
];

export const files: FileRecord[] = [
  { id: 'F-001', name: 'sop_production_line1.pdf', originalName: 'SOP خط تولید ۱.pdf', extension: 'pdf', mimeType: 'application/pdf', size: 2500000, path: '/files/sops/', uploadedBy: 'U-001', module: 'DMS', entityType: 'sop', entityId: 'SOP-001', tags: ['SOP', 'تولید', 'خط ۱'], createdAt: '1403/09/15' },
  { id: 'F-002', name: 'maintenance_manual_cnc.pdf', originalName: 'دفترچه راهنمای CNC.pdf', extension: 'pdf', mimeType: 'application/pdf', size: 5800000, path: '/files/manuals/', uploadedBy: 'U-008', module: 'CMMS', entityType: 'manual', entityId: 'EQ-001', tags: ['راهنما', 'CNC', 'نگهداری'], createdAt: '1403/08/20' },
  { id: 'F-003', name: 'quality_report_oct.xlsx', originalName: 'گزارش کیفیت مهر.xlsx', extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 450000, path: '/files/reports/', uploadedBy: 'U-003', module: 'QMS', entityType: 'report', entityId: 'RPT-001', tags: ['گزارش', 'کیفیت', 'مهر'], createdAt: '1403/07/30' },
];

export const themeSettings: ThemeSettings = {
  id: 'TH-001',
  tenantId: 'T-001',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
  fontFamily: 'system-ui',
  mode: 'dark',
};

// ==========================================
// SUPER ADMIN DATA
// ==========================================

export const tenants: Tenant[] = [
  { id: 'T-001', name: 'فولاد پارس', code: 'FOOLAD-PARS', industry: 'فولاد و فلزات', ownerName: 'محمد رضایی', ownerMobile: '09121111111', ownerEmail: 'owner@fooladpars.ir', address: 'اصفهان، شهرک صنعتی', city: 'اصفهان', province: 'اصفهان', postalCode: '1234567890', planId: 'PL-003', status: 'active', createdAt: '1403/01/01', expiresAt: '1404/12/29' },
  { id: 'T-002', name: 'خودروسازی البرز', code: 'KHODRO-ALBORZ', industry: 'خودروسازی', ownerName: 'علی محمدی', ownerMobile: '09122222222', ownerEmail: 'owner@khodroalborz.ir', address: 'تهران، شهرک صنعتی شمس‌آباد', city: 'تهران', province: 'تهران', postalCode: '2345678901', planId: 'PL-002', status: 'active', createdAt: '1403/03/01', expiresAt: '1404/02/31' },
  { id: 'T-003', name: 'پتروشیمی آریا', code: 'PETRO-ARIA', industry: 'پتروشیمی', ownerName: 'حسین کریمی', ownerMobile: '09123333333', ownerEmail: 'owner@petroaria.ir', address: 'عسلویه، منطقه ویژه', city: 'عسلویه', province: 'بوشهر', postalCode: '3456789012', planId: 'PL-003', status: 'active', createdAt: '1403/04/15', expiresAt: '1405/04/15' },
  { id: 'T-004', name: 'داروسازی سلامت', code: 'DARO-SALAMAT', industry: 'دارویی', ownerName: 'زهرا احمدی', ownerMobile: '09124444444', ownerEmail: 'owner@darosalamati.ir', address: 'کرج، شهرک صنعتی', city: 'کرج', province: 'البرز', postalCode: '4567890123', planId: 'PL-001', status: 'trial', createdAt: '1403/09/01', expiresAt: '1403/10/01' },
];

export const licenses: License[] = [
  { id: 'L-001', tenantId: 'T-001', licenseKey: 'FOS-ENT-2024-XXXX-XXXX-XXXX', planName: 'Enterprise', modules: ['MES', 'CMMS', 'WMS', 'QMS', 'LIMS', 'HRM', 'HSE', 'DMS', 'Finance', 'AI'], userLimit: 100, storageLimit: 500, apiLimit: 100000, expiryDate: '1404/12/29', status: 'active', createdAt: '1403/01/01' },
  { id: 'L-002', tenantId: 'T-002', licenseKey: 'FOS-PRO-2024-YYYY-YYYY-YYYY', planName: 'Professional', modules: ['MES', 'CMMS', 'WMS', 'QMS', 'HRM'], userLimit: 50, storageLimit: 100, apiLimit: 50000, expiryDate: '1404/02/31', status: 'active', createdAt: '1403/03/01' },
  { id: 'L-003', tenantId: 'T-003', licenseKey: 'FOS-ENT-2024-ZZZZ-ZZZZ-ZZZZ', planName: 'Enterprise', modules: ['MES', 'CMMS', 'WMS', 'QMS', 'LIMS', 'HRM', 'HSE', 'DMS', 'Finance', 'AI'], userLimit: 200, storageLimit: 1000, apiLimit: 200000, expiryDate: '1405/04/15', status: 'active', createdAt: '1403/04/15' },
  { id: 'L-004', tenantId: 'T-004', licenseKey: 'FOS-TRL-2024-AAAA-AAAA-AAAA', planName: 'Trial', modules: ['MES', 'WMS'], userLimit: 5, storageLimit: 5, apiLimit: 1000, expiryDate: '1403/10/01', status: 'active', createdAt: '1403/09/01' },
];

export const systemHealth: SystemHealth = {
  cpu: 45,
  memory: 62,
  disk: 38,
  database: 25,
  apiCalls: 45230,
  activeUsers: 156,
  onlineUsers: 42,
  uptime: 99.98,
  lastChecked: '1403/10/02 10:00:00',
};

// ==========================================
// ORGANIZATION ENGINE DATA
// ==========================================

export const departments: Department[] = [
  { id: 'D-001', name: 'مدیریت ارشد', code: 'EXEC', managerId: 'U-001', parentId: undefined, description: 'هیئت مدیره و مدیریت ارشد', level: 1, order: 1, status: 'active', employeeCount: 3, createdAt: '1403/01/01' },
  { id: 'D-002', name: 'مدیریت کارخانه', code: 'PLANT', managerId: 'U-002', parentId: 'D-001', description: 'مدیریت عملیات کارخانه', level: 2, order: 1, status: 'active', employeeCount: 5, createdAt: '1403/01/01' },
  { id: 'D-003', name: 'تولید', code: 'PROD', managerId: 'U-003', parentId: 'D-002', description: 'واحد تولید و خطوط تولید', level: 3, order: 1, status: 'active', employeeCount: 45, createdAt: '1403/01/01' },
  { id: 'D-004', name: 'انبار و لجستیک', code: 'WH', managerId: 'U-007', parentId: 'D-002', description: 'انبار، دریافت و ارسال', level: 3, order: 2, status: 'active', employeeCount: 12, createdAt: '1403/01/01' },
  { id: 'D-005', name: 'منابع انسانی', code: 'HR', managerId: 'U-006', parentId: 'D-001', description: 'جذب، آموزش، حقوق و دستمزد', level: 2, order: 2, status: 'active', employeeCount: 8, createdAt: '1403/01/01' },
  { id: 'D-006', name: 'نگهداری و تعمیرات', code: 'MAINT', managerId: 'U-008', parentId: 'D-002', description: 'نت پیشگیرانه و اصلاحی', level: 3, order: 3, status: 'active', employeeCount: 15, createdAt: '1403/01/01' },
  { id: 'D-007', name: 'ایمنی و بهداشت', code: 'HSE', managerId: 'U-009', parentId: 'D-002', description: 'ایمنی، بهداشت و محیط زیست', level: 3, order: 4, status: 'active', employeeCount: 6, createdAt: '1403/01/01' },
  { id: 'D-008', name: 'کنترل کیفیت', code: 'QC', managerId: undefined, parentId: 'D-002', description: 'بازرسی و کنترل کیفیت', level: 3, order: 5, status: 'active', employeeCount: 10, createdAt: '1403/01/01' },
  { id: 'D-009', name: 'مالی و حسابداری', code: 'FIN', managerId: undefined, parentId: 'D-001', description: 'امور مالی و حسابداری', level: 2, order: 3, status: 'active', employeeCount: 7, createdAt: '1403/01/01' },
  { id: 'D-010', name: 'خرید و تأمین', code: 'PROC', managerId: undefined, parentId: 'D-001', description: 'تأمین‌کنندگان و خرید', level: 2, order: 4, status: 'active', employeeCount: 5, createdAt: '1403/01/01' },
];

export const positions: Position[] = [
  { id: 'P-001', name: 'مدیر سیستم', code: 'SYS-ADMIN', departmentId: 'D-001', grade: 1, reportsTo: undefined, authorityLevel: 'executive', responsibilities: ['مدیریت سیستم', 'کنترل دسترسی'], requirements: ['تخصص IT', 'مدیریت پروژه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-002', name: 'مدیرعامل', code: 'CEO', departmentId: 'D-001', grade: 1, reportsTo: undefined, authorityLevel: 'executive', responsibilities: ['مدیریت کل', 'تصمیم‌گیری استراتژیک'], requirements: ['تجربه مدیریتی', 'MBA'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-003', name: 'مدیر کارخانه', code: 'PLANT-MGR', departmentId: 'D-002', grade: 2, reportsTo: 'P-002', authorityLevel: 'management', responsibilities: ['مدیریت عملیات', 'برنامه‌ریزی تولید'], requirements: ['مهندسی صنایع', '۱۰ سال تجربه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-004', name: 'معاون تولید', code: 'PROD-VP', departmentId: 'D-002', grade: 3, reportsTo: 'P-003', authorityLevel: 'management', responsibilities: ['نظارت بر تولید'], requirements: ['مهندسی', '۵ سال تجربه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-005', name: 'مدیر تولید', code: 'PROD-MGR', departmentId: 'D-003', grade: 4, reportsTo: 'P-003', authorityLevel: 'management', responsibilities: ['برنامه‌ریزی تولید', 'مدیریت خطوط'], requirements: ['مهندسی', '۵ سال تجربه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-006', name: 'سرپرست خط', code: 'LINE-SUP', departmentId: 'D-003', grade: 5, reportsTo: 'P-005', authorityLevel: 'supervisory', responsibilities: ['سرپرستی خط تولید'], requirements: ['دیپلم فنی', '۳ سال تجربه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-007', name: 'اپراتور', code: 'OPERATOR', departmentId: 'D-003', grade: 6, reportsTo: 'P-006', authorityLevel: 'operational', responsibilities: ['کار با دستگاه', 'گزارش تولید'], requirements: ['دیپلم فنی'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-008', name: 'انباردار', code: 'WH-KEEPER', departmentId: 'D-004', grade: 6, reportsTo: undefined, authorityLevel: 'operational', responsibilities: ['مدیریت موجودی', 'ورود و خروج'], requirements: ['دیپلم', 'آشنایی با نرم‌افزار'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-009', name: 'مدیر انبار', code: 'WH-MGR', departmentId: 'D-004', grade: 4, reportsTo: 'P-003', authorityLevel: 'management', responsibilities: ['مدیریت انبار', 'کنترل موجودی'], requirements: ['لیسانس', '۵ سال تجربه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-010', name: 'کارشناس HR', code: 'HR-SPEC', departmentId: 'D-005', grade: 5, reportsTo: undefined, authorityLevel: 'operational', responsibilities: ['جذب و استخدام', 'امور پرسنلی'], requirements: ['لیسانس مدیریت'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-011', name: 'تکنسین نت', code: 'MAINT-TECH', departmentId: 'D-006', grade: 6, reportsTo: undefined, authorityLevel: 'operational', responsibilities: ['تعمیرات', 'سرویس دوره‌ای'], requirements: ['فنی حرفه‌ای', '۲ سال تجربه'], status: 'active', createdAt: '1403/01/01' },
  { id: 'P-012', name: 'کارشناس HSE', code: 'HSE-SPEC', departmentId: 'D-007', grade: 5, reportsTo: undefined, authorityLevel: 'operational', responsibilities: ['بازرسی ایمنی', 'آموزش'], requirements: ['لیسانس بهداشت'], status: 'active', createdAt: '1403/01/01' },
];

export const approvalTrees: ApprovalTree[] = [
  {
    id: 'AT-001',
    name: 'تأیید درخواست خرید',
    module: 'SRM',
    steps: [
      { id: 'ATS-001', order: 1, approverType: 'position', approverId: 'P-006', approverName: 'سرپرست خط', timeout: 60, escalateTo: 'ATS-002' },
      { id: 'ATS-002', order: 2, approverType: 'position', approverId: 'P-005', approverName: 'مدیر تولید', condition: 'amount > 10000000', timeout: 120, escalateTo: 'ATS-003' },
      { id: 'ATS-003', order: 3, approverType: 'position', approverId: 'P-003', approverName: 'مدیر کارخانه', condition: 'amount > 100000000', timeout: 240 },
    ],
    status: 'active',
    createdAt: '1403/01/01',
  },
  {
    id: 'AT-002',
    name: 'تأیید مرخصی',
    module: 'HRM',
    steps: [
      { id: 'ATS-004', order: 1, approverType: 'user', approverId: 'manager', approverName: 'مدیر مستقیم', timeout: 120 },
      { id: 'ATS-005', order: 2, approverType: 'department', approverId: 'D-005', approverName: 'منابع انسانی', condition: 'days > 3', timeout: 240 },
    ],
    status: 'active',
    createdAt: '1403/01/01',
  },
];

export const escalationTrees: EscalationTree[] = [
  {
    id: 'ET-001',
    name: 'اسکالیشن حوادث',
    module: 'Incidents',
    triggerType: 'incident_created',
    levels: [
      { id: 'ETL-001', level: 1, notifyType: 'position', notifyId: 'P-006', notifyName: 'سرپرست خط', waitMinutes: 0, channels: ['in_app', 'sms'] },
      { id: 'ETL-002', level: 2, notifyType: 'position', notifyId: 'P-005', notifyName: 'مدیر تولید', waitMinutes: 5, channels: ['in_app', 'sms', 'email'] },
      { id: 'ETL-003', level: 3, notifyType: 'position', notifyId: 'P-003', notifyName: 'مدیر کارخانه', waitMinutes: 15, channels: ['in_app', 'sms', 'email', 'voice'] },
    ],
    status: 'active',
    createdAt: '1403/01/01',
  },
  {
    id: 'ET-002',
    name: 'اسکالیشن خرابی تجهیزات',
    module: 'CMMS',
    triggerType: 'equipment_down',
    levels: [
      { id: 'ETL-004', level: 1, notifyType: 'position', notifyId: 'P-011', notifyName: 'تکنسین نت', waitMinutes: 0, channels: ['in_app', 'sms'] },
      { id: 'ETL-005', level: 2, notifyType: 'department', notifyId: 'D-006', notifyName: 'مدیر نت', waitMinutes: 10, channels: ['in_app', 'sms', 'email'] },
      { id: 'ETL-006', level: 3, notifyType: 'position', notifyId: 'P-003', notifyName: 'مدیر کارخانه', waitMinutes: 30, channels: ['in_app', 'sms', 'email', 'voice'] },
    ],
    status: 'active',
    createdAt: '1403/01/01',
  },
];

// ==========================================
// WORKFLOW ENGINE DATA
// ==========================================

export const workflows: Workflow[] = [
  {
    id: 'WF-001',
    name: 'گردش کار درخواست خرید',
    code: 'PR-WORKFLOW',
    module: 'SRM',
    description: 'فرآیند تأیید درخواست خرید از ثبت تا صدور سفارش',
    triggerType: 'form_submit',
    triggerConfig: { form: 'purchase_request' },
    steps: [
      { id: 'WFS-001', order: 1, name: 'ثبت درخواست', type: 'task', config: { task: { title: 'بررسی درخواست', assignee: 'requester_manager', dueHours: 24 } }, onApprove: 'WFS-002' },
      { id: 'WFS-002', order: 2, name: 'تأیید سرپرست', type: 'approval', config: { approvers: ['direct_manager'] }, onApprove: 'WFS-003', onReject: 'WFS-006', timeout: 60 },
      { id: 'WFS-003', order: 3, name: 'بررسی مبلغ', type: 'condition', config: { conditions: [{ field: 'amount', operator: 'gt', value: 50000000 }] }, onApprove: 'WFS-004' },
      { id: 'WFS-004', order: 4, name: 'تأیید مدیر', type: 'approval', config: { approvers: ['department_manager'] }, onApprove: 'WFS-005', onReject: 'WFS-006', timeout: 120 },
      { id: 'WFS-005', order: 5, name: 'ارسال به خرید', type: 'notification', config: { notification: { channels: ['in_app', 'email'], template: 'pr_approved', recipients: ['procurement_team'] } } },
      { id: 'WFS-006', order: 6, name: 'اعلام رد', type: 'notification', config: { notification: { channels: ['in_app', 'sms'], template: 'pr_rejected', recipients: ['requester'] } } },
    ],
    sla: { responseTime: 60, dueTime: 480, escalationTime: 240, escalateTo: 'plant_manager' },
    status: 'active',
    version: 1,
    createdBy: 'U-001',
    createdAt: '1403/01/15',
    updatedAt: '1403/09/01',
  },
  {
    id: 'WF-002',
    name: 'گردش کار دستور کار',
    code: 'WO-WORKFLOW',
    module: 'CMMS',
    description: 'فرآیند ثبت، تخصیص و تکمیل دستور کار',
    triggerType: 'manual',
    triggerConfig: {},
    steps: [
      { id: 'WFS-101', order: 1, name: 'ایجاد دستور کار', type: 'task', config: { task: { title: 'تخصیص تکنسین', assignee: 'maintenance_manager', dueHours: 4 } }, onApprove: 'WFS-102' },
      { id: 'WFS-102', order: 2, name: 'اجرای کار', type: 'task', config: { task: { title: 'انجام تعمیرات', assignee: 'assigned_technician', dueHours: 8 } }, onApprove: 'WFS-103' },
      { id: 'WFS-103', order: 3, name: 'تأیید تکمیل', type: 'approval', config: { approvers: ['maintenance_manager'] }, onApprove: 'WFS-104', onReject: 'WFS-102' },
      { id: 'WFS-104', order: 4, name: 'بستن دستور کار', type: 'action', config: { action: 'close_work_order' } },
    ],
    status: 'active',
    version: 2,
    createdBy: 'U-001',
    createdAt: '1403/02/01',
    updatedAt: '1403/08/15',
  },
];

export const workflowInstances: WorkflowInstance[] = [
  {
    id: 'WFI-001',
    workflowId: 'WF-001',
    workflowName: 'گردش کار درخواست خرید',
    entityType: 'purchase_request',
    entityId: 'PR-445',
    currentStepId: 'WFS-002',
    currentStepName: 'تأیید سرپرست',
    status: 'pending',
    startedAt: '1403/10/01 10:30',
    startedBy: 'U-007',
    history: [
      { stepId: 'WFS-001', stepName: 'ثبت درخواست', action: 'completed', userId: 'U-007', userName: 'سعید جعفری', timestamp: '1403/10/01 10:30' },
    ],
  },
  {
    id: 'WFI-002',
    workflowId: 'WF-001',
    workflowName: 'گردش کار درخواست خرید',
    entityType: 'purchase_request',
    entityId: 'PR-446',
    currentStepId: 'WFS-005',
    currentStepName: 'ارسال به خرید',
    status: 'approved',
    startedAt: '1403/09/28 14:00',
    completedAt: '1403/09/30 11:00',
    startedBy: 'U-008',
    history: [
      { stepId: 'WFS-001', stepName: 'ثبت درخواست', action: 'completed', userId: 'U-008', userName: 'مهدی صادقی', timestamp: '1403/09/28 14:00' },
      { stepId: 'WFS-002', stepName: 'تأیید سرپرست', action: 'approved', userId: 'U-004', userName: 'حسن موسوی', comment: 'تأیید شد', timestamp: '1403/09/29 09:00' },
      { stepId: 'WFS-004', stepName: 'تأیید مدیر', action: 'approved', userId: 'U-003', userName: 'محمد کریمی', timestamp: '1403/09/30 11:00' },
    ],
  },
];

export const tasks: Task[] = [
  { id: 'T-001', title: 'بررسی درخواست خرید روغن هیدرولیک', description: 'بررسی و تأیید درخواست PR-445', module: 'SRM', entityType: 'purchase_request', entityId: 'PR-445', ownerId: 'U-007', ownerName: 'سعید جعفری', assigneeId: 'U-004', assigneeName: 'حسن موسوی', priority: 'high', status: 'pending', dueDate: '1403/10/03', workflowInstanceId: 'WFI-001', createdAt: '1403/10/01 10:30' },
  { id: 'T-002', title: 'تعمیر پمپ هیدرولیک', description: 'رفع خرابی پمپ هیدرولیک خط ۳', module: 'CMMS', entityType: 'work_order', entityId: 'WO-002', ownerId: 'U-008', ownerName: 'مهدی صادقی', assigneeId: 'U-008', assigneeName: 'مهدی صادقی', priority: 'critical', status: 'in_progress', dueDate: '1403/10/02', createdAt: '1403/10/02 07:45' },
  { id: 'T-003', title: 'بازرسی ایمنی ماهانه', description: 'انجام بازرسی ایمنی ماهانه سالن ۱', module: 'HSE', entityType: 'inspection', entityId: 'INS-001', ownerId: 'U-009', ownerName: 'زهرا محمدی', assigneeId: 'U-009', assigneeName: 'زهرا محمدی', priority: 'medium', status: 'pending', dueDate: '1403/10/05', createdAt: '1403/10/01 08:00' },
  { id: 'T-004', title: 'تهیه گزارش OEE هفتگی', description: 'جمع‌آوری داده‌ها و تهیه گزارش', module: 'MES', entityType: 'report', entityId: 'RPT-OEE', ownerId: 'U-003', ownerName: 'محمد کریمی', assigneeId: 'U-003', assigneeName: 'محمد کریمی', priority: 'low', status: 'completed', dueDate: '1403/10/01', completedAt: '1403/10/01 16:00', createdAt: '1403/09/28 08:00' },
  { id: 'T-005', title: 'آموزش ایمنی کارکنان جدید', description: 'برگزاری دوره آموزش ایمنی', module: 'HSE', entityType: 'training', entityId: 'TRN-001', ownerId: 'U-009', ownerName: 'زهرا محمدی', assigneeId: 'U-009', assigneeName: 'زهرا محمدی', priority: 'high', status: 'pending', dueDate: '1403/10/10', createdAt: '1403/10/01 09:00' },
];

export const approvalRequests: ApprovalRequest[] = [
  { id: 'AR-001', workflowInstanceId: 'WFI-001', stepId: 'WFS-002', requesterId: 'U-007', requesterName: 'سعید جعفری', approverId: 'U-004', approverName: 'حسن موسوی', entityType: 'purchase_request', entityId: 'PR-445', entityTitle: 'خرید روغن هیدرولیک - ۴۵,۰۰۰,۰۰۰ ریال', status: 'pending', requestedAt: '1403/10/01 10:30', dueAt: '1403/10/01 11:30' },
  { id: 'AR-002', workflowInstanceId: 'WFI-002', stepId: 'WFS-002', requesterId: 'U-008', requesterName: 'مهدی صادقی', approverId: 'U-004', approverName: 'حسن موسوی', entityType: 'purchase_request', entityId: 'PR-446', entityTitle: 'خرید فیلتر روغن - ۱۲,۰۰۰,۰۰۰ ریال', status: 'approved', decision: 'approved', comment: 'تأیید شد', requestedAt: '1403/09/28 14:00', decidedAt: '1403/09/29 09:00', dueAt: '1403/09/28 15:00' },
];

// ==========================================
// DASHBOARD BUILDER DATA
// ==========================================

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'DT-001',
    name: 'داشبورد مدیرعامل',
    description: 'نمای کلی KPI های کارخانه برای مدیریت ارشد',
    category: 'ceo',
    widgets: [],
    layout: { columns: 12, rows: 8, gap: 16 },
    createdAt: '1403/01/01',
  },
  {
    id: 'DT-002',
    name: 'داشبورد تولید',
    description: 'مانیتورینگ زنده خطوط تولید و OEE',
    category: 'production',
    widgets: [],
    layout: { columns: 12, rows: 8, gap: 16 },
    createdAt: '1403/01/01',
  },
  {
    id: 'DT-003',
    name: 'داشبورد انبار',
    description: 'وضعیت موجودی و گردش کالا',
    category: 'warehouse',
    widgets: [],
    layout: { columns: 12, rows: 8, gap: 16 },
    createdAt: '1403/01/01',
  },
  {
    id: 'DT-004',
    name: 'داشبورد نگهداری',
    description: 'وضعیت تجهیزات و دستور کارها',
    category: 'maintenance',
    widgets: [],
    layout: { columns: 12, rows: 8, gap: 16 },
    createdAt: '1403/01/01',
  },
];

export const dashboards: Dashboard[] = [
  {
    id: 'DB-001',
    name: 'داشبورد اصلی من',
    description: 'داشبورد شخصی سازی شده',
    ownerId: 'U-001',
    ownerName: 'امیر احمدی',
    sharing: 'private',
    layout: { columns: 12, rows: 8, gap: 16 },
    widgets: [
      {
        id: 'W-001',
        type: 'kpi',
        title: 'OEE کل',
        position: { x: 0, y: 0, w: 3, h: 2 },
        config: { kpiValue: '86.4', kpiUnit: '%', kpiTarget: 85, kpiTrend: 'up', kpiIcon: 'gauge', kpiColor: '#3b82f6' },
        dataSource: { type: 'api', endpoint: '/api/kpi/oee' },
        visible: true,
        locked: false,
      },
      {
        id: 'W-002',
        type: 'kpi',
        title: 'نرخ تولید',
        position: { x: 3, y: 0, w: 3, h: 2 },
        config: { kpiValue: '4850', kpiUnit: 'قطعه/روز', kpiTarget: 5000, kpiTrend: 'up', kpiIcon: 'factory', kpiColor: '#10b981' },
        dataSource: { type: 'api', endpoint: '/api/kpi/production-rate' },
        visible: true,
        locked: false,
      },
      {
        id: 'W-003',
        type: 'chart',
        title: 'روند تولید هفتگی',
        position: { x: 0, y: 2, w: 8, h: 4 },
        config: { chartType: 'area', chartColors: ['#3b82f6', '#10b981'], chartLegend: true },
        dataSource: { type: 'api', endpoint: '/api/charts/production-trend' },
        visible: true,
        locked: false,
      },
      {
        id: 'W-004',
        type: 'alert',
        title: 'هشدارهای فعال',
        position: { x: 8, y: 2, w: 4, h: 4 },
        config: { alertSeverity: ['critical', 'high'], alertLimit: 5 },
        dataSource: { type: 'realtime', endpoint: '/api/alerts/active' },
        visible: true,
        locked: false,
      },
    ],
    refreshInterval: 60,
    isDefault: true,
    status: 'active',
    createdAt: '1403/09/01',
    updatedAt: '1403/10/01',
  },
];

// ==========================================
// STATISTICS FOR CHARTS
// ==========================================

export const coreStatistics = {
  activeUsers: 156,
  onlineUsers: 42,
  loginTrend: [
    { date: 'شنبه', logins: 145 },
    { date: 'یکشنبه', logins: 152 },
    { date: 'دوشنبه', logins: 168 },
    { date: 'سه‌شنبه', logins: 155 },
    { date: 'چهارشنبه', logins: 162 },
    { date: 'پنجشنبه', logins: 148 },
    { date: 'جمعه', logins: 85 },
  ],
  storageUsage: {
    used: 125,
    total: 500,
    breakdown: [
      { name: 'مستندات', value: 45, color: '#3b82f6' },
      { name: 'گزارشات', value: 30, color: '#10b981' },
      { name: 'پشتیبان', value: 25, color: '#f59e0b' },
      { name: 'تصاویر', value: 15, color: '#8b5cf6' },
      { name: 'سایر', value: 10, color: '#6b7280' },
    ],
  },
  apiUsage: {
    today: 45230,
    limit: 100000,
    trend: [
      { hour: '00', calls: 1200 },
      { hour: '04', calls: 800 },
      { hour: '08', calls: 5500 },
      { hour: '12', calls: 8200 },
      { hour: '16', calls: 7800 },
      { hour: '20', calls: 4500 },
    ],
  },
};

export const superAdminStatistics = {
  totalFactories: 4,
  activeFactories: 3,
  totalRevenue: '۱,۲۵۰,۰۰۰,۰۰۰',
  totalUsers: 312,
  factoriesByIndustry: [
    { name: 'فولاد', value: 1, color: '#3b82f6' },
    { name: 'خودرو', value: 1, color: '#10b981' },
    { name: 'پتروشیمی', value: 1, color: '#f59e0b' },
    { name: 'دارو', value: 1, color: '#8b5cf6' },
  ],
  licenseStatus: [
    { name: 'فعال', value: 3, color: '#10b981' },
    { name: 'آزمایشی', value: 1, color: '#f59e0b' },
    { name: 'منقضی', value: 0, color: '#ef4444' },
  ],
};

export const orgStatistics = {
  totalEmployees: 116,
  departments: 10,
  positions: 12,
  avgSpanOfControl: 5.8,
  headcountByDept: [
    { name: 'تولید', value: 45 },
    { name: 'نت', value: 15 },
    { name: 'انبار', value: 12 },
    { name: 'QC', value: 10 },
    { name: 'HR', value: 8 },
    { name: 'مالی', value: 7 },
    { name: 'HSE', value: 6 },
    { name: 'خرید', value: 5 },
    { name: 'مدیریت', value: 8 },
  ],
};

export const workflowStatistics = {
  openTasks: 12,
  pendingApprovals: 5,
  avgWorkflowDuration: '۴.۵ ساعت',
  slaCompliance: 94,
  tasksByStatus: [
    { name: 'در انتظار', value: 12, color: '#f59e0b' },
    { name: 'در حال انجام', value: 8, color: '#3b82f6' },
    { name: 'تکمیل شده', value: 45, color: '#10b981' },
    { name: 'معوق', value: 3, color: '#ef4444' },
  ],
  approvalsByModule: [
    { name: 'خرید', value: 15 },
    { name: 'HR', value: 8 },
    { name: 'نت', value: 12 },
    { name: 'تولید', value: 5 },
  ],
};
