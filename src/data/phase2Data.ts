import type {
  Device, PLC, Tag, IDPEvent, Formula,
  ProductionLine, ProductionOrder, DowntimeRecord, ScrapRecord, OEECalculation, Shift,
  AlertTemplate, Alert, EscalationRule,
  IncidentTemplate, Incident,
  FactorySnapshot, ExecutiveReport
} from '@/types/phase2';

// ==========================================
// IDP DATA
// ==========================================

export const devices: Device[] = [
  { id: 'DEV-001', name: 'PLC خط ۱', type: 'plc', brand: 'Siemens', model: 'S7-1500', serialNumber: 'SN-001', ipAddress: '192.168.10.10', macAddress: '00:1A:2B:3C:4D:5E', protocol: 'opcua', departmentId: 'D-003', lineId: 'L-001', status: 'online', lastSeen: '1403/10/02 10:00:05', tagCount: 42, firmwareVersion: 'V2.8', installDate: '1402/03/01' },
  { id: 'DEV-002', name: 'PLC خط ۲', type: 'plc', brand: 'Mitsubishi', model: 'Q06UDVCPU', serialNumber: 'SN-002', ipAddress: '192.168.10.11', macAddress: '00:1A:2B:3C:4D:5F', protocol: 'modbus_tcp', departmentId: 'D-003', lineId: 'L-002', status: 'online', lastSeen: '1403/10/02 10:00:03', tagCount: 38, installDate: '1402/04/15' },
  { id: 'DEV-003', name: 'سنسور دمای کوره', type: 'sensor', brand: 'Endress+Hauser', model: 'TM411', serialNumber: 'SN-003', ipAddress: '192.168.10.20', macAddress: '00:1A:2B:3C:4D:60', protocol: 'modbus_rtu', departmentId: 'D-003', lineId: 'L-002', status: 'online', lastSeen: '1403/10/02 10:00:01', tagCount: 4, installDate: '1402/05/01' },
  { id: 'DEV-004', name: 'اینورتر پمپ', type: 'drive', brand: 'ABB', model: 'ACS880', serialNumber: 'SN-004', ipAddress: '192.168.10.30', macAddress: '00:1A:2B:3C:4D:61', protocol: 'modbus_tcp', departmentId: 'D-003', lineId: 'L-003', status: 'warning', lastSeen: '1403/10/02 09:58:00', tagCount: 12, installDate: '1402/06/01' },
  { id: 'DEV-005', name: 'کنتور برق سالن ۱', type: 'meter', brand: 'Schneider', model: 'PM5110', serialNumber: 'SN-005', ipAddress: '192.168.10.40', macAddress: '00:1A:2B:3C:4D:62', protocol: 'modbus_tcp', departmentId: 'D-003', lineId: 'L-001', status: 'online', lastSeen: '1403/10/02 10:00:00', tagCount: 8, installDate: '1402/07/01' },
  { id: 'DEV-006', name: 'PLC خط ۳', type: 'plc', brand: 'Delta', model: 'DVP28SV', serialNumber: 'SN-006', ipAddress: '192.168.10.12', macAddress: '00:1A:2B:3C:4D:63', protocol: 'modbus_tcp', departmentId: 'D-003', lineId: 'L-003', status: 'offline', lastSeen: '1403/10/02 08:30:00', tagCount: 28, installDate: '1402/08/01' },
];

export const plcs: PLC[] = [
  { id: 'PLC-001', name: 'Siemens S7-1500 خط ۱', brand: 'siemens', model: 'S7-1500 CPU 1516-3 PN', ipAddress: '192.168.10.10', rack: 0, slot: 1, protocol: 'OPC-UA', scanRate: 100, status: 'connected', tagCount: 42, lineId: 'L-001', departmentId: 'D-003', lastConnected: '1403/10/02 10:00:05' },
  { id: 'PLC-002', name: 'Mitsubishi Q06 خط ۲', brand: 'mitsubishi', model: 'Q06UDVCPU', ipAddress: '192.168.10.11', rack: 0, slot: 0, protocol: 'Modbus TCP', scanRate: 200, status: 'connected', tagCount: 38, lineId: 'L-002', departmentId: 'D-003', lastConnected: '1403/10/02 10:00:03' },
  { id: 'PLC-003', name: 'Delta DVP خط ۳', brand: 'delta', model: 'DVP28SV', ipAddress: '192.168.10.12', rack: 0, slot: 0, protocol: 'Modbus RTU', scanRate: 500, status: 'disconnected', tagCount: 28, lineId: 'L-003', departmentId: 'D-003', lastConnected: '1403/10/02 08:30:00' },
];

export const tags: Tag[] = [
  { id: 'TAG-001', name: 'دمای کوره ۱', address: 'DB100.DBD0', dataType: 'float', tagType: 'temperature', unit: '°C', min: 0, max: 1000, deadband: 0.5, scanRate: 1000, description: 'دمای اصلی کوره ذوب ۱', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', currentValue: 847.3, quality: 'good', timestamp: '1403/10/02 10:00:05', alarmEnabled: true, alarmHigh: 900, alarmLow: 600 },
  { id: 'TAG-002', name: 'فشار هیدرولیک', address: 'DB100.DBD4', dataType: 'float', tagType: 'pressure', unit: 'bar', min: 0, max: 300, deadband: 0.1, scanRate: 500, description: 'فشار سیستم هیدرولیک خط ۱', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', currentValue: 185.6, quality: 'good', timestamp: '1403/10/02 10:00:05', alarmEnabled: true, alarmHigh: 250, alarmLow: 50 },
  { id: 'TAG-003', name: 'سرعت موتور اصلی', address: 'DB100.DBD8', dataType: 'float', tagType: 'rpm', unit: 'RPM', min: 0, max: 3000, deadband: 5, scanRate: 500, description: 'سرعت موتور اصلی خط ۱', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', currentValue: 1487.2, quality: 'good', timestamp: '1403/10/02 10:00:05', alarmEnabled: true, alarmHigh: 2800, alarmLow: 0 },
  { id: 'TAG-004', name: 'جریان موتور', address: 'DB100.DBD12', dataType: 'float', tagType: 'current', unit: 'A', min: 0, max: 100, deadband: 0.1, scanRate: 500, description: 'جریان مصرفی موتور', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', currentValue: 45.2, quality: 'good', timestamp: '1403/10/02 10:00:05', alarmEnabled: true, alarmHigh: 90, alarmLow: 0 },
  { id: 'TAG-005', name: 'شمارنده تولید', address: 'DB101.DBD0', dataType: 'int', tagType: 'counter', unit: 'عدد', min: 0, max: 999999, deadband: 0, scanRate: 1000, description: 'تعداد کل قطعات تولید شده', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', currentValue: 3542, quality: 'good', timestamp: '1403/10/02 10:00:05', alarmEnabled: false },
  { id: 'TAG-006', name: 'وضعیت ماشین', address: 'DB100.DBX0.0', dataType: 'bool', tagType: 'status', unit: '', min: 0, max: 1, deadband: 0, scanRate: 200, description: 'وضعیت روشن/خاموش', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', currentValue: true, quality: 'good', timestamp: '1403/10/02 10:00:05', alarmEnabled: false },
  { id: 'TAG-007', name: 'مصرف برق', address: 'D0', dataType: 'float', tagType: 'voltage', unit: 'kWh', min: 0, max: 1000, deadband: 0.5, scanRate: 5000, description: 'مصرف برق لحظه‌ای', deviceId: 'DEV-005', deviceName: 'کنتور برق سالن ۱', currentValue: 287.4, quality: 'good', timestamp: '1403/10/02 10:00:00', alarmEnabled: true, alarmHigh: 800 },
  { id: 'TAG-008', name: 'دمای کوره ۲', address: 'DB200.DBD0', dataType: 'float', tagType: 'temperature', unit: '°C', min: 0, max: 1000, deadband: 0.5, scanRate: 1000, description: 'دمای کوره ذوب ۲', deviceId: 'DEV-002', deviceName: 'PLC خط ۲', currentValue: 862.7, quality: 'good', timestamp: '1403/10/02 10:00:03', alarmEnabled: true, alarmHigh: 900, alarmLow: 600 },
];

export const formulas: Formula[] = [
  { id: 'F-001', name: 'OEE', expression: '(Availability * Performance * Quality) / 10000', unit: '%', description: 'محاسبه OEE کلی', tags: ['Availability', 'Performance', 'Quality'], resultType: 'kpi', lastValue: 86.4, lastCalculated: '1403/10/02 10:00:00' },
  { id: 'F-002', name: 'نرخ بهره‌وری انرژی', expression: 'Output / EnergyConsumption', unit: 'قطعه/kWh', description: 'محصول به ازای هر kWh', tags: ['TAG-005', 'TAG-007'], resultType: 'kpi', lastValue: 12.3, lastCalculated: '1403/10/02 10:00:00' },
  { id: 'F-003', name: 'هزینه ضایعات', expression: 'ScrapQty * UnitCost', unit: 'ریال', description: 'هزینه کل ضایعات', tags: ['ScrapQty', 'UnitCost'], resultType: 'kpi', lastValue: 15400000, lastCalculated: '1403/10/02 09:00:00' },
];

export const idpEvents: IDPEvent[] = [
  { id: 'EV-001', type: 'machine_start', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', message: 'خط تولید ۱ راه‌اندازی شد', timestamp: '1403/10/02 06:00:05', acknowledged: true, acknowledgedBy: 'محمد کریمی', acknowledgedAt: '1403/10/02 06:01:00' },
  { id: 'EV-002', type: 'batch_start', deviceId: 'DEV-001', deviceName: 'PLC خط ۱', message: 'بچ تولید PO-0891 شروع شد', timestamp: '1403/10/02 06:05:00', acknowledged: true },
  { id: 'EV-003', type: 'alarm', deviceId: 'DEV-003', deviceName: 'سنسور دمای کوره', tagId: 'TAG-008', tagName: 'دمای کوره ۲', value: 862.7, message: 'دمای کوره ۲ به ۸۶۲.۷°C رسید (آستانه هشدار: ۸۵۰°C)', timestamp: '1403/10/02 09:45:22', acknowledged: false },
  { id: 'EV-004', type: 'threshold_breach', deviceId: 'DEV-004', deviceName: 'اینورتر پمپ', tagId: 'TAG-002', tagName: 'فشار هیدرولیک', value: 12.3, message: 'فشار هیدرولیک به پایین‌تر از حداقل رسید', timestamp: '1403/10/02 07:30:00', acknowledged: true },
];

// ==========================================
// MES DATA
// ==========================================

export const productionLines: ProductionLine[] = [
  { id: 'L-001', name: 'خط ۱ - آلومینیوم', code: 'LINE-01', departmentId: 'D-003', capacity: 600, capacityUnit: 'قطعه/ساعت', status: 'running', currentOrderId: 'MO-0891', oee: 88.2, availability: 92.5, performance: 91.8, quality: 96.5, todayProduction: 4215, todayTarget: 4800 },
  { id: 'L-002', name: 'خط ۲ - فولاد', code: 'LINE-02', departmentId: 'D-003', capacity: 450, capacityUnit: 'قطعه/ساعت', status: 'running', currentOrderId: 'MO-0892', oee: 79.4, availability: 87.3, performance: 85.6, quality: 93.2, todayProduction: 3120, todayTarget: 3600 },
  { id: 'L-003', name: 'خط ۳ - پلیمر', code: 'LINE-03', departmentId: 'D-003', capacity: 800, capacityUnit: 'قطعه/ساعت', status: 'maintenance', oee: 0, availability: 0, performance: 0, quality: 0, todayProduction: 1200, todayTarget: 6400 },
  { id: 'L-004', name: 'خط ۴ - تجمیع', code: 'LINE-04', departmentId: 'D-003', capacity: 300, capacityUnit: 'قطعه/ساعت', status: 'running', currentOrderId: 'MO-0895', oee: 91.5, availability: 95.2, performance: 93.8, quality: 97.0, todayProduction: 2100, todayTarget: 2400 },
];

export const productionOrders: ProductionOrder[] = [
  { id: 'MO-0891', orderNumber: 'MO-2024-0891', productId: 'P-001', productName: 'قطعه آلومینیومی A45', productCode: 'PROD-A45', customerName: 'شرکت صنایع فلزی پارس', quantity: 5000, completedQty: 4215, rejectedQty: 32, reworkQty: 18, unit: 'عدد', lineId: 'L-001', lineName: 'خط ۱ - آلومینیوم', supervisorId: 'U-004', supervisorName: 'حسن موسوی', plannedStart: '1403/10/01 06:00', plannedEnd: '1403/10/03 14:00', actualStart: '1403/10/01 06:05', priority: 'high', status: 'active', progress: 84, downtime: 45, createdAt: '1403/09/28' },
  { id: 'MO-0892', orderNumber: 'MO-2024-0892', productId: 'P-002', productName: 'بدنه فولادی B12', productCode: 'PROD-B12', quantity: 2000, completedQty: 1040, rejectedQty: 28, reworkQty: 12, unit: 'عدد', lineId: 'L-002', lineName: 'خط ۲ - فولاد', supervisorId: 'U-004', supervisorName: 'حسن موسوی', plannedStart: '1403/10/01 14:00', plannedEnd: '1403/10/04 14:00', actualStart: '1403/10/01 14:15', priority: 'medium', status: 'active', progress: 52, downtime: 90, createdAt: '1403/09/29' },
  { id: 'MO-0893', orderNumber: 'MO-2024-0893', productId: 'P-003', productName: 'شفت استیل C78', productCode: 'PROD-C78', quantity: 800, completedQty: 800, rejectedQty: 5, reworkQty: 3, unit: 'عدد', lineId: 'L-001', lineName: 'خط ۱ - آلومینیوم', supervisorId: 'U-004', supervisorName: 'حسن موسوی', plannedStart: '1403/09/28 06:00', plannedEnd: '1403/09/30 14:00', actualStart: '1403/09/28 06:10', actualEnd: '1403/09/30 13:45', priority: 'low', status: 'completed', progress: 100, downtime: 15, createdAt: '1403/09/25' },
  { id: 'MO-0894', orderNumber: 'MO-2024-0894', productId: 'P-004', productName: 'پوشش پلیمری D33', productCode: 'PROD-D33', quantity: 3000, completedQty: 0, rejectedQty: 0, reworkQty: 0, unit: 'عدد', lineId: 'L-003', lineName: 'خط ۳ - پلیمر', supervisorId: 'U-003', supervisorName: 'محمد کریمی', plannedStart: '1403/10/03 06:00', plannedEnd: '1403/10/05 22:00', priority: 'medium', status: 'planned', progress: 0, downtime: 0, createdAt: '1403/09/30' },
  { id: 'MO-0895', orderNumber: 'MO-2024-0895', productId: 'P-005', productName: 'واشر صنعتی E56', productCode: 'PROD-E56', quantity: 10000, completedQty: 2100, rejectedQty: 45, reworkQty: 20, unit: 'عدد', lineId: 'L-004', lineName: 'خط ۴ - تجمیع', supervisorId: 'U-004', supervisorName: 'حسن موسوی', plannedStart: '1403/09/29 06:00', plannedEnd: '1403/10/05 14:00', actualStart: '1403/09/29 06:00', priority: 'critical', status: 'delayed', progress: 21, downtime: 180, createdAt: '1403/09/27' },
];

export const downtimeRecords: DowntimeRecord[] = [
  { id: 'DT-001', lineId: 'L-002', lineName: 'خط ۲ - فولاد', orderId: 'MO-0892', machineId: 'EQ-002', machineName: 'پرس هیدرولیک', reason: 'شکستن سیل هیدرولیک', category: 'mechanical', startTime: '1403/10/02 08:15', endTime: '1403/10/02 09:45', duration: 90, operatorId: 'U-005', operatorName: 'رضا حسینی', supervisorName: 'حسن موسوی', approved: true, cost: 12500000 },
  { id: 'DT-002', lineId: 'L-001', lineName: 'خط ۱ - آلومینیوم', orderId: 'MO-0891', reason: 'تغییر قالب به محصول جدید', category: 'planned', startTime: '1403/10/02 05:00', endTime: '1403/10/02 06:00', duration: 60, operatorId: 'U-005', operatorName: 'رضا حسینی', supervisorName: 'حسن موسوی', approved: true },
  { id: 'DT-003', lineId: 'L-003', lineName: 'خط ۳ - پلیمر', machineId: 'EQ-005', machineName: 'پمپ هیدرولیک', reason: 'خرابی کامل پمپ', category: 'mechanical', startTime: '1403/10/02 00:30', operatorId: 'U-005', operatorName: 'رضا حسینی', approved: false, cost: 85000000, note: 'نیاز به تعویض پمپ' },
];

export const scrapRecords: ScrapRecord[] = [
  { id: 'SC-001', orderId: 'MO-0891', lineId: 'L-001', productName: 'قطعه آلومینیومی A45', scrapType: 'ابعاد خارج از تلرانس', quantity: 18, unit: 'عدد', reason: 'فرسودگی ابزار برش', cost: 5400000, operatorId: 'U-005', operatorName: 'رضا حسینی', recordedAt: '1403/10/02 08:00' },
  { id: 'SC-002', orderId: 'MO-0892', lineId: 'L-002', productName: 'بدنه فولادی B12', scrapType: 'ترک سطحی', quantity: 12, unit: 'عدد', reason: 'دمای نامناسب', cost: 9600000, operatorId: 'U-010', operatorName: 'حمید اکبری', recordedAt: '1403/10/01 16:30' },
];

export const shifts: Shift[] = [
  { id: 'SHF-001', name: 'شیفت صبح ۱۴۰۳/۱۰/۰۲', code: 'MORNING', startTime: '06:00', endTime: '14:00', breakMinutes: 60, supervisorId: 'U-004', supervisorName: 'حسن موسوی', operatorIds: ['U-005', 'U-010'], lineId: 'L-001', date: '1403/10/02', status: 'completed', targetQty: 4800, actualQty: 4215 },
  { id: 'SHF-002', name: 'شیفت عصر ۱۴۰۳/۱۰/۰۲', code: 'EVENING', startTime: '14:00', endTime: '22:00', breakMinutes: 60, supervisorId: 'U-004', supervisorName: 'حسن موسوی', operatorIds: ['U-005'], lineId: 'L-001', date: '1403/10/02', status: 'active', targetQty: 4800, actualQty: 2100 },
];

export const oeeCalculations: OEECalculation[] = [
  { lineId: 'L-001', lineName: 'خط ۱ - آلومینیوم', date: '1403/10/02', plannedTime: 480, downtime: 45, availableTime: 435, availability: 90.6, idealCycleTime: 6, totalParts: 4215, performance: 96.2, goodParts: 4125, qualityRate: 97.9, oee: 85.2 },
  { lineId: 'L-002', lineName: 'خط ۲ - فولاد', date: '1403/10/02', plannedTime: 480, downtime: 120, availableTime: 360, availability: 75, idealCycleTime: 8, totalParts: 3120, performance: 87.1, goodParts: 2980, qualityRate: 95.5, oee: 62.4 },
  { lineId: 'L-004', lineName: 'خط ۴ - تجمیع', date: '1403/10/02', plannedTime: 480, downtime: 20, availableTime: 460, availability: 95.8, idealCycleTime: 12, totalParts: 2100, performance: 93.3, goodParts: 2045, qualityRate: 97.4, oee: 87.1 },
];

// ==========================================
// ALERT CENTER DATA
// ==========================================

export const alertTemplates: AlertTemplate[] = [
  { id: 'AT-001', code: 'TEMP-HIGH', title: 'دمای بالای کوره', severity: 'major', category: 'فرآیند', departmentId: 'D-003', departmentName: 'تولید', source: 'plc', message: 'دمای کوره از آستانه بحرانی عبور کرد', escalationTreeId: 'ET-001', notificationChannels: ['in_app', 'sms'], autoClose: false, createdAt: '1403/01/01' },
  { id: 'AT-002', code: 'EQUIP-DOWN', title: 'خرابی تجهیز', severity: 'critical', category: 'تجهیزات', departmentId: 'D-006', departmentName: 'نگهداری', source: 'cmms', message: 'تجهیز از کار افتاد', escalationTreeId: 'ET-002', notificationChannels: ['in_app', 'sms', 'email'], autoClose: false, createdAt: '1403/01/01' },
  { id: 'AT-003', code: 'STOCK-LOW', title: 'موجودی بحرانی', severity: 'warning', category: 'انبار', departmentId: 'D-004', departmentName: 'انبار', source: 'warehouse', message: 'موجودی کمتر از حداقل مجاز', notificationChannels: ['in_app', 'email'], autoClose: true, autoCloseMinutes: 1440, createdAt: '1403/01/01' },
  { id: 'AT-004', code: 'PRESSURE-LOW', title: 'افت فشار هیدرولیک', severity: 'major', category: 'فرآیند', departmentId: 'D-003', departmentName: 'تولید', source: 'plc', message: 'فشار هیدرولیک به زیر حداقل رسید', notificationChannels: ['in_app', 'sms'], autoClose: false, createdAt: '1403/01/01' },
  { id: 'AT-005', code: 'QUALITY-FAIL', title: 'شکست کیفیت', severity: 'minor', category: 'کیفیت', departmentId: 'D-008', departmentName: 'کنترل کیفیت', source: 'quality', message: 'نرخ عیب از حد مجاز عبور کرد', notificationChannels: ['in_app'], autoClose: false, createdAt: '1403/01/01' },
];

export const alerts: Alert[] = [
  { id: 'ALM-001', templateId: 'AT-001', code: 'TEMP-HIGH', title: 'دمای بالای کوره ۲', message: 'دمای کوره ۲ به ۸۶۲.۷°C رسید (آستانه: ۸۵۰°C)', severity: 'major', status: 'active', source: 'plc', departmentId: 'D-003', departmentName: 'تولید', deviceId: 'DEV-002', deviceName: 'PLC خط ۲', tagId: 'TAG-008', tagName: 'دمای کوره ۲', value: 862.7, threshold: 850, openedAt: '1403/10/02 09:45:22', escalationLevel: 1, escalatedTo: 'سرپرست تولید', escalatedAt: '1403/10/02 09:50:00' },
  { id: 'ALM-002', templateId: 'AT-002', code: 'EQUIP-DOWN', title: 'خرابی پمپ هیدرولیک', message: 'پمپ هیدرولیک خط ۳ از کار افتاد - وضعیت: FAULT', severity: 'critical', status: 'acknowledged', source: 'cmms', departmentId: 'D-006', departmentName: 'نگهداری', deviceId: 'DEV-004', deviceName: 'اینورتر پمپ', openedAt: '1403/10/02 00:30:00', acknowledgedAt: '1403/10/02 00:35:00', acknowledgedBy: 'مهدی صادقی', escalationLevel: 2, cost: 85000000 },
  { id: 'ALM-003', templateId: 'AT-003', code: 'STOCK-LOW', title: 'موجودی بحرانی روغن', message: 'موجودی روغن هیدرولیک ISO 46 به ۳۰ لیتر رسید (حداقل: ۱۰۰ لیتر)', severity: 'warning', status: 'active', source: 'warehouse', departmentId: 'D-004', departmentName: 'انبار', openedAt: '1403/10/02 07:00:00', escalationLevel: 0 },
  { id: 'ALM-004', code: 'PROD-DELAY', title: 'تأخیر در تولید', message: 'خط ۳ به دلیل توقف اضطراری با تأخیر ۴ ساعته روبرو است', severity: 'major', status: 'resolved', source: 'production', departmentId: 'D-003', departmentName: 'تولید', openedAt: '1403/10/02 01:00:00', resolvedAt: '1403/10/02 05:00:00', resolvedBy: 'محمد کریمی', escalationLevel: 2, duration: 240 },
  { id: 'ALM-005', code: 'OEE-LOW', title: 'OEE پایین خط ۲', message: 'OEE خط ۲ به ۶۲.۴٪ رسید (هدف: ۸۵٪)', severity: 'minor', status: 'active', source: 'production', departmentId: 'D-003', departmentName: 'تولید', openedAt: '1403/10/02 10:00:00', escalationLevel: 0 },
];

export const escalationRules: EscalationRule[] = [
  { id: 'ER-001', alertTemplateId: 'AT-001', level: 1, waitMinutes: 0, notifyUserName: 'سرپرست شیفت', notifyRole: 'supervisor', channels: ['in_app', 'sms'] },
  { id: 'ER-002', alertTemplateId: 'AT-001', level: 2, waitMinutes: 5, notifyUserName: 'مدیر تولید', notifyRole: 'manager', channels: ['in_app', 'sms', 'email'] },
  { id: 'ER-003', alertTemplateId: 'AT-001', level: 3, waitMinutes: 15, notifyUserName: 'مدیر کارخانه', notifyRole: 'plant_manager', channels: ['in_app', 'sms', 'email'] },
  { id: 'ER-004', alertTemplateId: 'AT-002', level: 1, waitMinutes: 0, notifyUserName: 'تکنسین نت', notifyRole: 'maintenance_tech', channels: ['in_app', 'sms'], action: 'create_work_order' },
  { id: 'ER-005', alertTemplateId: 'AT-002', level: 2, waitMinutes: 10, notifyUserName: 'مدیر نت', notifyRole: 'maintenance_manager', channels: ['in_app', 'sms', 'email'] },
  { id: 'ER-006', alertTemplateId: 'AT-002', level: 3, waitMinutes: 30, notifyUserName: 'مدیر کارخانه', notifyRole: 'plant_manager', channels: ['in_app', 'sms', 'email', 'voice'] },
];

// ==========================================
// INCIDENT ENGINE DATA
// ==========================================

export const incidentTemplates: IncidentTemplate[] = [
  {
    id: 'IT-001',
    code: 'MECH-FAIL',
    title: 'خرابی مکانیکی تجهیز',
    departmentId: 'D-006',
    departmentName: 'نگهداری',
    severity: 'high',
    source: 'maintenance',
    checklist: [
      { id: 'CL-001', text: 'خط تولید متوقف شده', required: true, order: 1, type: 'checkbox' },
      { id: 'CL-002', text: 'منطقه ایمن‌سازی شده', required: true, order: 2, type: 'checkbox' },
      { id: 'CL-003', text: 'سرپرست مطلع شده', required: true, order: 3, type: 'checkbox' },
      { id: 'CL-004', text: 'عکس از تجهیز آسیب‌دیده', required: true, order: 4, type: 'photo' },
      { id: 'CL-005', text: 'توضیح علت خرابی', required: true, order: 5, type: 'text' },
      { id: 'CL-006', text: 'امضای سرپرست', required: true, order: 6, type: 'signature' },
    ],
    autoTasks: [
      { type: 'work_order', title: 'تعمیر تجهیز', assignTo: 'maintenance_manager', priority: 'high', dueHours: 4 },
      { type: 'inspection', title: 'بازرسی پس از تعمیر', assignTo: 'quality_inspector', priority: 'medium', dueHours: 8 },
    ],
    screenLock: true,
    requirePhoto: true,
    requireSignature: true,
    requireSupervisorApproval: true,
  },
  {
    id: 'IT-002',
    code: 'SAFETY-INC',
    title: 'حادثه ایمنی',
    departmentId: 'D-007',
    departmentName: 'HSE',
    severity: 'critical',
    source: 'hse',
    checklist: [
      { id: 'CL-010', text: 'مصدوم تحت مراقبت قرار گرفت', required: true, order: 1, type: 'checkbox' },
      { id: 'CL-011', text: 'محل حادثه ایمن‌سازی شد', required: true, order: 2, type: 'checkbox' },
      { id: 'CL-012', text: 'مسئول HSE مطلع شده', required: true, order: 3, type: 'checkbox' },
      { id: 'CL-013', text: 'عکس از صحنه حادثه', required: true, order: 4, type: 'photo' },
      { id: 'CL-014', text: 'گزارش اولیه حادثه', required: true, order: 5, type: 'text' },
    ],
    autoTasks: [
      { type: 'task', title: 'بررسی اولیه حادثه توسط HSE', assignTo: 'hse_manager', priority: 'critical', dueHours: 1 },
      { type: 'task', title: 'گزارش به سازمان تأمین اجتماعی', assignTo: 'hr_manager', priority: 'high', dueHours: 24 },
    ],
    screenLock: true,
    requirePhoto: true,
    requireSignature: true,
    requireSupervisorApproval: true,
  },
];

export const incidents: Incident[] = [
  {
    id: 'INC-001',
    templateId: 'IT-001',
    code: 'INC-2024-001',
    title: 'خرابی پمپ هیدرولیک خط ۳',
    description: 'پمپ هیدرولیک اصلی خط ۳ به طور ناگهانی از کار افتاد. صدای غیرعادی و نشتی روغن مشاهده شده است.',
    severity: 'high',
    status: 'investigating',
    source: 'maintenance',
    departmentId: 'D-006',
    departmentName: 'نگهداری',
    lineId: 'L-003',
    lineName: 'خط ۳ - پلیمر',
    machineId: 'EQ-005',
    machineName: 'پمپ هیدرولیک',
    reportedBy: 'U-005',
    reportedByName: 'رضا حسینی',
    assignedTo: 'U-008',
    assignedToName: 'مهدی صادقی',
    supervisorId: 'U-004',
    supervisorName: 'حسن موسوی',
    openedAt: '1403/10/02 00:30',
    photos: [],
    checklist: [
      { id: 'CL-001', text: 'خط تولید متوقف شده', required: true, order: 1, type: 'checkbox', completed: true, completedBy: 'رضا حسینی', completedAt: '1403/10/02 00:31' },
      { id: 'CL-002', text: 'منطقه ایمن‌سازی شده', required: true, order: 2, type: 'checkbox', completed: true, completedBy: 'رضا حسینی', completedAt: '1403/10/02 00:33' },
      { id: 'CL-003', text: 'سرپرست مطلع شده', required: true, order: 3, type: 'checkbox', completed: true, completedBy: 'رضا حسینی', completedAt: '1403/10/02 00:35' },
      { id: 'CL-004', text: 'عکس از تجهیز آسیب‌دیده', required: true, order: 4, type: 'photo', completed: false },
      { id: 'CL-005', text: 'توضیح علت خرابی', required: true, order: 5, type: 'text', completed: false },
      { id: 'CL-006', text: 'امضای سرپرست', required: true, order: 6, type: 'signature', completed: false },
    ],
    screenLocked: true,
    checklistCompleted: false,
    actions: [
      { id: 'IA-001', type: 'immediate', description: 'قطع تغذیه هیدرولیک و خنثی‌سازی فشار', assignedTo: 'U-008', assignedToName: 'مهدی صادقی', dueDate: '1403/10/02 01:00', status: 'completed', completedAt: '1403/10/02 00:50' },
      { id: 'IA-002', type: 'corrective', description: 'تعمیر یا تعویض پمپ هیدرولیک', assignedTo: 'U-008', assignedToName: 'مهدی صادقی', dueDate: '1403/10/02 12:00', status: 'in_progress' },
    ],
    downtime: 540,
    cost: 85000000,
    alertId: 'ALM-002',
  },
];

// ==========================================
// COMMAND CENTER DATA
// ==========================================

export const factorySnapshot: FactorySnapshot = {
  timestamp: '1403/10/02 10:00:00',
  production: {
    activeOrders: 3,
    totalOutput: 9435,
    target: 16200,
    oee: 78.4,
    downtime: 630,
    efficiency: 82.3,
  },
  maintenance: {
    openWorkOrders: 4,
    criticalWorkOrders: 1,
    equipmentDown: 1,
    plannedMaintenance: 2,
  },
  warehouse: {
    totalItems: 1248,
    lowStock: 3,
    criticalStock: 1,
    totalValue: 4850000000,
  },
  quality: {
    defectRate: 1.8,
    openNCRs: 2,
    pendingInspections: 3,
    cpk: 1.45,
  },
  safety: {
    openIncidents: 1,
    criticalAlerts: 1,
    nearMisses: 0,
    lti: 0,
  },
  hr: {
    presentToday: 85,
    absent: 5,
    onLeave: 8,
    overtime: 12,
  },
  finance: {
    revenueToday: 2150000000,
    costToday: 1420000000,
    downtimeCost: 97500000,
    scrapCost: 15000000,
  },
  alerts: {
    total: 12,
    critical: 1,
    active: 3,
    escalated: 2,
  },
};

export const executiveReports: ExecutiveReport[] = [
  { id: 'RPT-001', type: 'daily', title: 'گزارش روزانه ۱۴۰۳/۱۰/۰۱', period: '1403/10/01', generatedAt: '1403/10/02 06:00', generatedBy: 'سیستم', status: 'sent', sections: ['تولید', 'نت', 'انبار', 'کیفیت', 'ایمنی'] },
  { id: 'RPT-002', type: 'weekly', title: 'گزارش هفتگی هفته ۴۰ - ۱۴۰۳', period: '1403/09/25 تا 1403/10/01', generatedAt: '1403/10/02 07:00', generatedBy: 'امیر احمدی', status: 'approved', sections: ['تولید', 'OEE', 'نت', 'انبار', 'مالی'] },
];

// ==========================================
// CHART DATA
// ==========================================

export const phase2ChartData = {
  tagTrend: [
    { time: '00:00', temp: 820, pressure: 180, rpm: 1450 },
    { time: '02:00', temp: 835, pressure: 182, rpm: 1460 },
    { time: '04:00', temp: 828, pressure: 179, rpm: 1458 },
    { time: '06:00', temp: 832, pressure: 183, rpm: 1462 },
    { time: '08:00', temp: 845, pressure: 185, rpm: 1470 },
    { time: '10:00', temp: 863, pressure: 187, rpm: 1487 },
  ],
  lineProductionToday: [
    { hour: '06', L1: 520, L2: 400, L4: 280 },
    { hour: '08', L1: 510, L2: 0, L4: 290 },
    { hour: '10', L1: 530, L2: 380, L4: 285 },
    { hour: '12', L1: 525, L2: 410, L4: 295 },
    { hour: '14', L1: 515, L2: 395, L4: 270 },
    { hour: '16', L1: 540, L2: 420, L4: 300 },
  ],
  oeeHistory: [
    { date: '۱/۱۰', L1: 88, L2: 72, L4: 91 },
    { date: '۲/۱۰', L1: 85, L2: 62, L4: 87 },
    { date: '۳/۱۰', L1: 91, L2: 78, L4: 92 },
    { date: '۴/۱۰', L1: 87, L2: 80, L4: 89 },
    { date: '۵/۱۰', L1: 90, L2: 75, L4: 93 },
  ],
  downtimeByCategory: [
    { name: 'مکانیکی', value: 38, color: '#ef4444' },
    { name: 'برنامه‌ریزی', value: 22, color: '#3b82f6' },
    { name: 'الکتریکی', value: 15, color: '#f59e0b' },
    { name: 'مواد', value: 12, color: '#8b5cf6' },
    { name: 'اپراتور', value: 8, color: '#10b981' },
    { name: 'سایر', value: 5, color: '#6b7280' },
  ],
  alertsBySeverity: [
    { name: 'اضطراری', value: 0, color: '#7c3aed' },
    { name: 'بحرانی', value: 1, color: '#dc2626' },
    { name: 'ماژور', value: 3, color: '#f97316' },
    { name: 'مینور', value: 2, color: '#eab308' },
    { name: 'هشدار', value: 4, color: '#3b82f6' },
    { name: 'اطلاع', value: 2, color: '#6b7280' },
  ],
  incidentTrend: [
    { month: 'مهر', mechanical: 5, electrical: 2, safety: 1, quality: 3 },
    { month: 'آبان', mechanical: 4, electrical: 3, safety: 0, quality: 4 },
    { month: 'آذر', mechanical: 6, electrical: 1, safety: 2, quality: 2 },
    { month: 'دی', mechanical: 3, electrical: 2, safety: 0, quality: 1 },
  ],
  factoryKPIs: [
    { subject: 'تولید', value: 84 },
    { subject: 'OEE', value: 78 },
    { subject: 'کیفیت', value: 96 },
    { subject: 'ایمنی', value: 92 },
    { subject: 'نت', value: 71 },
    { subject: 'انرژی', value: 68 },
  ],
};
