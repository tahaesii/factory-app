export const productionOrders = [
  { id: 'PO-2024-0891', product: 'قطعه آلومینیومی A45', quantity: 1200, completed: 1180, status: 'active', line: 'خط ۱', progress: 98 },
  { id: 'PO-2024-0892', product: 'بدنه فولادی B12', quantity: 500, completed: 320, status: 'active', line: 'خط ۲', progress: 64 },
  { id: 'PO-2024-0893', product: 'شفت استیل C78', quantity: 2000, completed: 2000, status: 'completed', line: 'خط ۳', progress: 100 },
  { id: 'PO-2024-0894', product: 'پوشش پلیمری D33', quantity: 800, completed: 0, status: 'planned', line: 'خط ۱', progress: 0 },
  { id: 'PO-2024-0895', product: 'واشر صنعتی E56', quantity: 5000, completed: 3200, status: 'active', line: 'خط ۴', progress: 64 },
  { id: 'PO-2024-0896', product: 'بلبرینگ F90', quantity: 300, completed: 150, status: 'delayed', line: 'خط ۲', progress: 50 },
];

export const assets = [
  { id: 'EQ-001', name: 'دستگاه CNC', location: 'سالن ۱', status: 'running', health: 92, lastMaintenance: '۱۴۰۳/۰۸/۱۵', nextMaintenance: '۱۴۰۳/۱۱/۱۵' },
  { id: 'EQ-002', name: 'پرس هیدرولیک', location: 'سالن ۱', status: 'warning', health: 67, lastMaintenance: '۱۴۰۳/۰۷/۲۰', nextMaintenance: '۱۴۰۳/۱۰/۲۰' },
  { id: 'EQ-003', name: 'کوره ذوب', location: 'سالن ۲', status: 'running', health: 88, lastMaintenance: '۱۴۰۳/۰۹/۰۱', nextMaintenance: '۱۴۰۳/۱۲/۰۱' },
  { id: 'EQ-004', name: 'ربات جوشکاری', location: 'سالن ۲', status: 'running', health: 95, lastMaintenance: '۱۴۰۳/۰۸/۲۵', nextMaintenance: '۱۴۰۳/۱۱/۲۵' },
  { id: 'EQ-005', name: 'پمپ هیدرولیک', location: 'سالن ۳', status: 'stopped', health: 23, lastMaintenance: '۱۴۰۳/۰۶/۱۰', nextMaintenance: 'فوری' },
  { id: 'EQ-006', name: 'کمپرسور باد', location: 'یوتیلیتی', status: 'running', health: 79, lastMaintenance: '۱۴۰۳/۰۸/۰۵', nextMaintenance: '۱۴۰۳/۱۱/۰۵' },
];

export const workOrders = [
  { id: 'WO-001', title: 'تعویض فیلتر روغن پرس', asset: 'پرس هیدرولیک', type: 'preventive', priority: 'medium', status: 'open', assignee: 'حسن کریمی', dueDate: '۱۴۰۳/۱۰/۱۵' },
  { id: 'WO-002', title: 'تعمیر پمپ هیدرولیک', asset: 'پمپ هیدرولیک', type: 'corrective', priority: 'critical', status: 'in-progress', assignee: 'رضا محمدی', dueDate: '۱۴۰۳/۱۰/۰۲' },
  { id: 'WO-003', title: 'کالیبراسیون سنسورها', asset: 'دستگاه CNC', type: 'preventive', priority: 'low', status: 'scheduled', assignee: 'علی رضایی', dueDate: '۱۴۰۳/۱۰/۲۰' },
  { id: 'WO-004', title: 'بازرسی سالانه کوره', asset: 'کوره ذوب', type: 'inspection', priority: 'high', status: 'open', assignee: 'محمد حسینی', dueDate: '۱۴۰۳/۱۰/۱۰' },
];

export const inventoryItems = [
  { id: 'INV-001', name: 'ورق آلومینیوم ۲mm', category: 'مواد اولیه', quantity: 450, unit: 'کیلوگرم', minStock: 200, location: 'A-01-03', status: 'normal' },
  { id: 'INV-002', name: 'میلگرد فولادی ۱۲mm', category: 'مواد اولیه', quantity: 120, unit: 'شاخه', minStock: 150, location: 'B-02-01', status: 'low' },
  { id: 'INV-003', name: 'بلبرینگ 6205', category: 'قطعات یدکی', quantity: 85, unit: 'عدد', minStock: 50, location: 'C-01-05', status: 'normal' },
  { id: 'INV-004', name: 'روغن هیدرولیک ISO 46', category: 'مصرفی', quantity: 30, unit: 'لیتر', minStock: 100, location: 'D-03-02', status: 'critical' },
  { id: 'INV-005', name: 'محصول نهایی A45', category: 'محصول نهایی', quantity: 2400, unit: 'عدد', minStock: 500, location: 'E-01-01', status: 'normal' },
  { id: 'INV-006', name: 'فیلتر روغن', category: 'قطعات یدکی', quantity: 12, unit: 'عدد', minStock: 20, location: 'C-02-08', status: 'low' },
];

export const employees = [
  { id: 'EMP-001', name: 'علی احمدی', department: 'تولید', position: 'سرپرست خط', shift: 'صبح', status: 'present', phone: '۰۹۱۲۱۲۳۴۵۶۷' },
  { id: 'EMP-002', name: 'رضا موسوی', department: 'تولید', position: 'اپراتور CNC', shift: 'صبح', status: 'present', phone: '۰۹۱۲۲۳۴۵۶۷۸' },
  { id: 'EMP-003', name: 'حسن کریمی', department: 'نگهداری', position: 'تکنسین مکانیک', shift: 'صبح', status: 'present', phone: '۰۹۱۲۳۴۵۶۷۸۹' },
  { id: 'EMP-004', name: 'محمد حسینی', department: 'کیفیت', position: 'بازرس کیفیت', shift: 'عصر', status: 'absent', phone: '۰۹۱۲۴۵۶۷۸۹۰' },
  { id: 'EMP-005', name: 'فاطمه رضایی', department: 'آزمایشگاه', position: 'تحلیلگر', shift: 'صبح', status: 'present', phone: '۰۹۱۲۵۶۷۸۹۰۱' },
  { id: 'EMP-006', name: 'سعید نوری', department: 'انبار', position: 'انباردار', shift: 'صبح', status: 'leave', phone: '۰۹۱۲۶۷۸۹۰۱۲' },
];

export const qualityInspections = [
  { id: 'QC-001', type: 'ورودی', batch: 'B-2024-112', product: 'ورق آلومینیوم', result: 'تأیید', defects: 0, inspector: 'محمد حسینی', date: '۱۴۰۳/۱۰/۰۱' },
  { id: 'QC-002', type: 'حین تولید', batch: 'B-2024-113', product: 'قطعه A45', result: 'مشروط', defects: 3, inspector: 'محمد حسینی', date: '۱۴۰۳/۱۰/۰۱' },
  { id: 'QC-003', type: 'نهایی', batch: 'B-2024-110', product: 'شفت C78', result: 'تأیید', defects: 0, inspector: 'زهرا کمالی', date: '۱۴۰۳/۰۹/۳۰' },
  { id: 'QC-004', type: 'ورودی', batch: 'B-2024-114', product: 'میلگرد فولادی', result: 'رد', defects: 12, inspector: 'محمد حسینی', date: '۱۴۰۳/۱۰/۰۲' },
];

export const suppliers = [
  { id: 'SUP-001', name: 'فولاد مبارکه', category: 'مواد اولیه', rating: 4.5, orders: 45, onTime: 92, quality: 97 },
  { id: 'SUP-002', name: 'آلومینیوم ایران', category: 'مواد اولیه', rating: 4.2, orders: 32, onTime: 88, quality: 95 },
  { id: 'SUP-003', name: 'قطعات صنعتی پارس', category: 'قطعات', rating: 3.8, orders: 67, onTime: 78, quality: 90 },
  { id: 'SUP-004', name: 'شیمیایی ایران', category: 'مصرفی', rating: 4.0, orders: 23, onTime: 85, quality: 93 },
];

export const chartData = {
  productionTrend: [
    { name: 'فروردین', planned: 4000, actual: 3800 },
    { name: 'اردیبهشت', planned: 4200, actual: 4100 },
    { name: 'خرداد', planned: 4500, actual: 4300 },
    { name: 'تیر', planned: 4100, actual: 3900 },
    { name: 'مرداد', planned: 4600, actual: 4500 },
    { name: 'شهریور', planned: 4800, actual: 4700 },
    { name: 'مهر', planned: 5000, actual: 4850 },
    { name: 'آبان', planned: 5200, actual: 5100 },
    { name: 'آذر', planned: 5400, actual: 5250 },
    { name: 'دی', planned: 5100, actual: 4950 },
  ],
  oeeData: [
    { name: 'شنبه', availability: 92, performance: 87, quality: 96 },
    { name: 'یکشنبه', availability: 88, performance: 85, quality: 94 },
    { name: 'دوشنبه', availability: 91, performance: 89, quality: 97 },
    { name: 'سه‌شنبه', availability: 85, performance: 82, quality: 93 },
    { name: 'چهارشنبه', availability: 93, performance: 90, quality: 98 },
    { name: 'پنجشنبه', availability: 90, performance: 88, quality: 95 },
    { name: 'جمعه', availability: 78, performance: 75, quality: 91 },
  ],
  downtimeByReason: [
    { name: 'خرابی مکانیکی', value: 35, color: '#ef4444' },
    { name: 'تغییر قالب', value: 25, color: '#f59e0b' },
    { name: 'کمبود مواد', value: 15, color: '#3b82f6' },
    { name: 'خرابی الکتریکی', value: 12, color: '#8b5cf6' },
    { name: 'تنظیمات', value: 8, color: '#10b981' },
    { name: 'سایر', value: 5, color: '#6b7280' },
  ],
  energyConsumption: [
    { name: 'فروردین', electricity: 12000, gas: 8000, water: 3000 },
    { name: 'اردیبهشت', electricity: 13500, gas: 7500, water: 3200 },
    { name: 'خرداد', electricity: 15000, gas: 6000, water: 3500 },
    { name: 'تیر', electricity: 16500, gas: 5500, water: 4000 },
    { name: 'مرداد', electricity: 17000, gas: 5000, water: 4500 },
    { name: 'شهریور', electricity: 16000, gas: 5500, water: 4200 },
  ],
};

export const incidents = [
  { id: 'INC-001', title: 'نشت روغن هیدرولیک', severity: 'high', status: 'open', area: 'سالن ۱', reportedBy: 'رضا موسوی', date: '۱۴۰۳/۱۰/۰۲', description: 'نشت روغن از سیلندر پرس هیدرولیک مشاهده شده' },
  { id: 'INC-002', title: 'صدای غیرعادی CNC', severity: 'medium', status: 'investigating', area: 'سالن ۱', reportedBy: 'علی احمدی', date: '۱۴۰۳/۱۰/۰۱', description: 'صدای غیرعادی از اسپیندل دستگاه CNC شنیده می‌شود' },
  { id: 'INC-003', title: 'قطعی برق لحظه‌ای', severity: 'critical', status: 'resolved', area: 'کل کارخانه', reportedBy: 'حسن کریمی', date: '۱۴۰۳/۰۹/۲۸', description: 'قطعی برق به مدت ۱۵ ثانیه' },
];

export const purchaseRequests = [
  { id: 'PR-445', title: 'خرید روغن هیدرولیک', requester: 'حسن کریمی', department: 'نگهداری', amount: '۴۵,۰۰۰,۰۰۰ ریال', status: 'pending', date: '۱۴۰۳/۱۰/۰۱', priority: 'high' },
  { id: 'PR-446', title: 'خرید فیلتر روغن', requester: 'حسن کریمی', department: 'نگهداری', amount: '۱۲,۰۰۰,۰۰۰ ریال', status: 'approved', date: '۱۴۰۳/۰۹/۳۰', priority: 'medium' },
  { id: 'PR-447', title: 'خرید ورق آلومینیوم', requester: 'سعید نوری', department: 'انبار', amount: '۲۸۰,۰۰۰,۰۰۰ ریال', status: 'pending', date: '۱۴۰۳/۱۰/۰۲', priority: 'high' },
];
