// ==========================================
// HSE DATA
// ==========================================
export const hseIncidents = [
  { id:'HSE-001', date:'1403/10/01', time:'09:30', location:'سالن ۱', department:'تولید', reporter:'رضا حسینی', severity:'medium' as const, type:'near_miss', title:'لغزش روی سطح روغنی', description:'کارگر در نزدیکی پرس هیدرولیک لغزید', rootCause:'نشتی روغن', correctiveAction:'نصب سینی زیر پرس', status:'closed' as const },
  { id:'HSE-002', date:'1403/09/28', time:'14:15', location:'انبار', department:'انبار', reporter:'سعید جعفری', severity:'low' as const, type:'unsafe_condition', title:'قفسه ناایمن', description:'قفسه B-03 کج شده و خطر واژگونی دارد', rootCause:'بار اضافه', correctiveAction:'تقویت قفسه و محدودیت بار', status:'open' as const },
];

export const riskAssessments = [
  { id:'RA-001', hazard:'کار در ارتفاع - سالن ۲', severity:4, probability:3, riskLevel:'بالا', controlMeasure:'هارنس + نرده حفاظ + آموزش', residualRisk:'متوسط', status:'active' },
  { id:'RA-002', hazard:'مواد شیمیایی - آزمایشگاه', severity:5, probability:2, riskLevel:'بالا', controlMeasure:'PPE مناسب + تهویه + برچسب MSDS', residualRisk:'پایین', status:'active' },
  { id:'RA-003', hazard:'صدای بالا - سالن ۱', severity:3, probability:5, riskLevel:'بالا', controlMeasure:'گوشی حفاظتی + کاهش صدا', residualRisk:'متوسط', status:'active' },
  { id:'RA-004', hazard:'سقوط اجسام - خط ۳', severity:4, probability:2, riskLevel:'متوسط', controlMeasure:'کلاه ایمنی + توری حفاظ', residualRisk:'پایین', status:'active' },
];

export const permits = [
  { id:'PTW-001', type:'hot_work', title:'جوشکاری مخزن سالن ۲', requestedBy:'مهدی صادقی', approvedBy:'حسن موسوی', location:'سالن ۲', startDate:'1403/10/03 08:00', endDate:'1403/10/03 14:00', status:'approved', checklist:['آتش‌نشانی مطلع','کپسول آماده','منطقه پاکسازی'] },
  { id:'PTW-002', type:'confined_space', title:'ورود به مخزن ذخیره', requestedBy:'رضا حسینی', location:'یوتیلیتی', startDate:'1403/10/04 10:00', endDate:'1403/10/04 16:00', status:'pending', checklist:['گاز سنجی','نفر ناظر','تجهیزات نجات'] },
];

export const ppeRecords = [
  { id:'PPE-001', employee:'رضا حسینی', type:'کلاه ایمنی', issueDate:'1403/07/01', expiryDate:'1404/07/01', status:'valid' },
  { id:'PPE-002', employee:'رضا حسینی', type:'دستکش ضد حرارت', issueDate:'1403/08/15', expiryDate:'1403/11/15', status:'valid' },
  { id:'PPE-003', employee:'حمید اکبری', type:'گوشی حفاظتی', issueDate:'1403/06/01', expiryDate:'1403/12/01', status:'near_expiry' },
  { id:'PPE-004', employee:'مهدی صادقی', type:'عینک ایمنی', issueDate:'1403/05/01', expiryDate:'1403/11/01', status:'expired' },
];

export const hseKPIs = { ltifr: 0.8, trir: 1.2, nearMiss: 5, ppeCompliance: 92, auditScore: 88 };

// ==========================================
// HRM DATA
// ==========================================
export const employees = [
  { id:'E-001', code:'EMP-001', name:'امیر احمدی', department:'مدیریت', position:'مدیر سیستم', shift:'روزانه', type:'full-time', status:'present', attendance:98, productivity:95 },
  { id:'E-002', code:'EMP-002', name:'علی رضایی', department:'مدیریت کارخانه', position:'مدیر کارخانه', shift:'روزانه', type:'full-time', status:'present', attendance:97, productivity:93 },
  { id:'E-003', code:'EMP-003', name:'محمد کریمی', department:'تولید', position:'مدیر تولید', shift:'صبح', type:'full-time', status:'present', attendance:95, productivity:91 },
  { id:'E-004', code:'EMP-004', name:'حسن موسوی', department:'تولید', position:'سرپرست خط', shift:'صبح', type:'full-time', status:'present', attendance:96, productivity:94 },
  { id:'E-005', code:'EMP-005', name:'رضا حسینی', department:'تولید', position:'اپراتور', shift:'صبح', type:'full-time', status:'present', attendance:92, productivity:88 },
  { id:'E-006', code:'EMP-006', name:'فاطمه نوری', department:'HR', position:'کارشناس HR', shift:'روزانه', type:'full-time', status:'on_leave', attendance:94, productivity:90 },
  { id:'E-007', code:'EMP-007', name:'سعید جعفری', department:'انبار', position:'انباردار', shift:'صبح', type:'full-time', status:'present', attendance:91, productivity:87 },
  { id:'E-008', code:'EMP-008', name:'مهدی صادقی', department:'نگهداری', position:'تکنسین', shift:'صبح', type:'full-time', status:'present', attendance:93, productivity:89 },
  { id:'E-009', code:'EMP-009', name:'زهرا محمدی', department:'HSE', position:'کارشناس HSE', shift:'روزانه', type:'full-time', status:'present', attendance:96, productivity:92 },
  { id:'E-010', code:'EMP-010', name:'حمید اکبری', department:'تولید', position:'اپراتور', shift:'عصر', type:'full-time', status:'absent', attendance:85, productivity:82 },
];

export const trainings = [
  { id:'TR-001', course:'ایمنی عمومی کارخانه', trainer:'زهرا محمدی', participants:12, score:88, date:'1403/09/15', certificate:true, expiry:'1404/09/15' },
  { id:'TR-002', course:'کار با دستگاه CNC', trainer:'مدرس خارجی', participants:5, score:92, date:'1403/08/20', certificate:true, expiry:'1405/08/20' },
  { id:'TR-003', course:'کنترل کیفیت پیشرفته', trainer:'محمد کریمی', participants:8, score:85, date:'1403/10/01', certificate:false },
];

export const competencyMatrix = [
  { employee:'رضا حسینی', skills:[{name:'CNC',current:4,required:4},{name:'جوشکاری',current:2,required:3},{name:'ایمنی',current:3,required:3}] },
  { employee:'حمید اکبری', skills:[{name:'CNC',current:3,required:4},{name:'جوشکاری',current:3,required:3},{name:'ایمنی',current:2,required:3}] },
  { employee:'مهدی صادقی', skills:[{name:'مکانیک',current:5,required:4},{name:'هیدرولیک',current:4,required:4},{name:'PLC',current:3,required:3}] },
];

export const hrKPIs = { turnover:5.2, absenteeism:3.8, overtime:12, trainingHours:24, productivity:89 };

// ==========================================
// DMS DATA
// ==========================================
export const documents = [
  { id:'DOC-001', number:'SOP-PRD-001', title:'SOP خط تولید ۱', category:'SOP', version:'3.2', owner:'محمد کریمی', department:'تولید', status:'approved', lastReview:'1403/09/01', nextReview:'1404/03/01' },
  { id:'DOC-002', number:'WI-MNT-005', title:'دستورالعمل تعویض فیلتر', category:'Work Instruction', version:'1.5', owner:'مهدی صادقی', department:'نگهداری', status:'approved', lastReview:'1403/08/15', nextReview:'1404/02/15' },
  { id:'DOC-003', number:'POL-HSE-002', title:'خط‌مشی ایمنی', category:'Policy', version:'2.0', owner:'زهرا محمدی', department:'HSE', status:'under_review', lastReview:'1403/07/01', nextReview:'1403/10/01' },
  { id:'DOC-004', number:'FRM-QMS-010', title:'فرم بازرسی ورودی', category:'Form', version:'4.1', owner:'محمد کریمی', department:'کیفیت', status:'approved', lastReview:'1403/09/15', nextReview:'1404/03/15' },
  { id:'DOC-005', number:'MAN-EQP-001', title:'راهنمای دستگاه CNC', category:'Manual', version:'1.0', owner:'مهدی صادقی', department:'نگهداری', status:'approved', lastReview:'1402/06/01', nextReview:'1404/06/01' },
];

export const letters = [
  { id:'LTR-001', type:'incoming', number:'LTR-IN-2024-089', subject:'تأیید سفارش فولاد', from:'فولاد مبارکه', date:'1403/10/01', status:'read' },
  { id:'LTR-002', type:'outgoing', number:'LTR-OUT-2024-045', subject:'درخواست ضمانتنامه', to:'بانک صادرات', date:'1403/09/28', status:'sent' },
  { id:'LTR-003', type:'internal', number:'LTR-INT-2024-023', subject:'ابلاغ شیفت جدید', from:'HR', date:'1403/10/02', status:'pending' },
];

// ==========================================
// FINANCE DATA
// ==========================================
export const accounts = [
  { id:'ACC-001', code:'1101', name:'صندوق', type:'asset', balance:250000000 },
  { id:'ACC-002', code:'1201', name:'بانک ملت', type:'asset', balance:4500000000 },
  { id:'ACC-003', code:'2101', name:'حسابهای پرداختنی', type:'liability', balance:1200000000 },
  { id:'ACC-004', code:'3101', name:'سرمایه', type:'equity', balance:15000000000 },
  { id:'ACC-005', code:'4101', name:'فروش', type:'revenue', balance:32000000000 },
  { id:'ACC-006', code:'5101', name:'بهای تمام‌شده', type:'expense', balance:22000000000 },
];

export const payables = [
  { id:'AP-001', supplier:'فولاد مبارکه', invoice:'INV-FM-2024-089', amount:724850000, dueDate:'1403/10/30', status:'pending' },
  { id:'AP-002', supplier:'شیمیایی پارسیان', invoice:'INV-CP-2024-045', amount:54500000, dueDate:'1403/10/15', status:'pending' },
  { id:'AP-003', supplier:'قطعات پارس', invoice:'INV-QP-2024-112', amount:38250000, dueDate:'1403/10/20', status:'paid' },
];

export const receivables = [
  { id:'AR-001', customer:'صنایع فلزی پارس', invoice:'INV-2024-156', amount:1250000000, dueDate:'1403/10/25', status:'pending' },
  { id:'AR-002', customer:'خودروسازی البرز', invoice:'INV-2024-157', amount:850000000, dueDate:'1403/11/01', status:'pending' },
  { id:'AR-003', customer:'شرکت آلفا', invoice:'INV-2024-150', amount:420000000, dueDate:'1403/09/30', status:'overdue' },
];

export const budgets = [
  { department:'تولید', budget:5000000000, actual:4200000000, variance:800000000 },
  { department:'نگهداری', budget:1500000000, actual:1075000000, variance:425000000 },
  { department:'انبار', budget:800000000, actual:650000000, variance:150000000 },
  { department:'کیفیت', budget:600000000, actual:520000000, variance:80000000 },
  { department:'HR', budget:3000000000, actual:2800000000, variance:200000000 },
  { department:'HSE', budget:400000000, actual:350000000, variance:50000000 },
];

export const financeKPIs = { revenue:'32B', cost:'22B', profit:'10B', cashFlow:'4.75B', budgetVariance:'+8%' };

// ==========================================
// AI DATA
// ==========================================
export const aiAgents = [
  { id:'AI-CEO', title:'AI مدیرعامل', icon:'🏢', status:'active', accuracy:94, decisions:156, description:'تصمیم‌گیری استراتژیک، تحلیل سودآوری و ریسک',
    capabilities:['Factory Health Score','تحلیل سودآوری','شناسایی ریسک','فرصت‌های بهبود','توصیه استراتژیک'] },
  { id:'AI-PROD', title:'AI مدیر تولید', icon:'🏭', status:'active', accuracy:91, decisions:342, description:'بهینه‌سازی خطوط، برنامه‌ریزی ظرفیت',
    capabilities:['برنامه‌ریزی تولید','تشخیص گلوگاه','بهینه‌سازی OEE','پیش‌بینی تقاضا'] },
  { id:'AI-MAINT', title:'AI مدیر نگهداری', icon:'🔧', status:'active', accuracy:89, decisions:215, description:'پیش‌بینی خرابی و بهینه‌سازی PM',
    capabilities:['پیش‌بینی خرابی','بهینه‌سازی PM','تحلیل ارتعاش','آنالیز روغن'] },
  { id:'AI-WH', title:'AI مدیر انبار', icon:'📦', status:'active', accuracy:92, decisions:178, description:'بهینه‌سازی موجودی و پیش‌بینی تقاضا',
    capabilities:['پیش‌بینی مصرف','پیشنهاد سفارش','تشخیص موجودی راکد','بهینه‌سازی چیدمان'] },
  { id:'AI-QM', title:'AI مدیر کیفیت', icon:'🛡️', status:'active', accuracy:87, decisions:134, description:'تحلیل کیفیت و تشخیص عیب',
    capabilities:['تحلیل عیب','پیش‌بینی کیفیت','توصیه CAPA','تحلیل تأمین‌کننده'] },
  { id:'AI-HSE', title:'AI مدیر ایمنی', icon:'⚠️', status:'beta', accuracy:83, decisions:67, description:'پیش‌بینی حوادث و تحلیل ریسک',
    capabilities:['پیش‌بینی ریسک','تحلیل حوادث','پایش انطباق','پیشنهاد اقدام'] },
  { id:'AI-HR', title:'AI مدیر منابع انسانی', icon:'👥', status:'beta', accuracy:81, decisions:45, description:'تحلیل بهره‌وری و پیشنهاد آموزش',
    capabilities:['پیش‌بینی ترک خدمت','تحلیل عملکرد','پیشنهاد آموزش','برنامه‌ریزی نیرو'] },
  { id:'AI-FIN', title:'AI مدیر مالی', icon:'💰', status:'inactive', accuracy:0, decisions:0, description:'تحلیل مالی و پیش‌بینی جریان نقد',
    capabilities:['پیش‌بینی درآمد','تحلیل هزینه','بهینه‌سازی بودجه','مدیریت ریسک مالی'] },
];

export const aiPromptTemplates = [
  { category:'تولید', prompts:['تحلیل OEE خطوط تولید','علل اصلی توقفات','مقایسه عملکرد شیفت‌ها','پیش‌بینی تولید ماه آینده'] },
  { category:'انبار', prompts:['کالاهایی که به زودی تمام می‌شوند','پیشنهاد سفارش خرید','موجودی‌های راکد','تحلیل هزینه نگهداری'] },
  { category:'کیفیت', prompts:['روند نرخ عیب','تحلیل NCR‌های باز','پیشنهاد CAPA','مقایسه کیفیت تأمین‌کنندگان'] },
  { category:'نگهداری', prompts:['تجهیزات پرریسک','پیش‌بینی خرابی','بهینه‌سازی برنامه PM','تحلیل هزینه نت'] },
  { category:'مالی', prompts:['خلاصه مالی این ماه','بودجه vs واقعی','صورتحسابهای معوق','پیش‌بینی جریان نقد'] },
];

// ==========================================
// MARKETPLACE DATA
// ==========================================
export const marketplaceItems = [
  { id:'MP-001', name:'تم صنعتی آبی', type:'theme', price:'رایگان', rating:4.5, installs:234, installed:true, image:'🎨' },
  { id:'MP-002', name:'ویجت OEE پیشرفته', type:'widget', price:'۵۰۰K تومان', rating:4.8, installs:156, installed:false, image:'📊' },
  { id:'MP-003', name:'پک خودروسازی', type:'industry_pack', price:'۲M تومان', rating:4.3, installs:45, installed:false, image:'🚗' },
  { id:'MP-004', name:'پک فولاد', type:'industry_pack', price:'۲M تومان', rating:4.6, installs:78, installed:true, image:'🔩' },
  { id:'MP-005', name:'پک دارویی', type:'industry_pack', price:'۳M تومان', rating:4.1, installs:23, installed:false, image:'💊' },
  { id:'MP-006', name:'عامل AI تولید v2', type:'ai_agent', price:'۱M تومان', rating:4.7, installs:89, installed:true, image:'🤖' },
  { id:'MP-007', name:'گزارش‌ساز Excel Pro', type:'plugin', price:'۸۰۰K تومان', rating:4.4, installs:167, installed:false, image:'📑' },
  { id:'MP-008', name:'داشبورد مدیرعامل v3', type:'dashboard', price:'رایگان', rating:4.9, installs:312, installed:true, image:'📈' },
  { id:'MP-009', name:'پک غذایی', type:'industry_pack', price:'۲.۵M تومان', rating:4.0, installs:34, installed:false, image:'🍞' },
  { id:'MP-010', name:'ویجت نقشه کارخانه', type:'widget', price:'۱.۲M تومان', rating:4.2, installs:56, installed:false, image:'🗺️' },
];

// ==========================================
// FORM BUILDER DATA
// ==========================================
export const formTemplates = [
  { id:'FT-001', name:'فرم بازرسی ورودی', category:'quality', fields:8, submissions:145, lastUsed:'1403/10/02' },
  { id:'FT-002', name:'چک‌لیست ایمنی روزانه', category:'hse', fields:12, submissions:890, lastUsed:'1403/10/02' },
  { id:'FT-003', name:'فرم درخواست خرید', category:'procurement', fields:6, submissions:234, lastUsed:'1403/10/01' },
  { id:'FT-004', name:'فرم گزارش حادثه', category:'hse', fields:15, submissions:23, lastUsed:'1403/09/28' },
  { id:'FT-005', name:'چک‌لیست PM', category:'maintenance', fields:10, submissions:456, lastUsed:'1403/10/01' },
];

export const formComponents = [
  { icon:'📝', name:'متن', type:'text' },{ icon:'📄', name:'متن بلند', type:'textarea' },
  { icon:'🔢', name:'عدد', type:'number' },{ icon:'📅', name:'تاریخ', type:'date' },
  { icon:'⏰', name:'ساعت', type:'time' },{ icon:'📋', name:'لیست', type:'dropdown' },
  { icon:'☑️', name:'چک‌باکس', type:'checkbox' },{ icon:'🔘', name:'رادیو', type:'radio' },
  { icon:'📎', name:'فایل', type:'file' },{ icon:'📷', name:'تصویر', type:'image' },
  { icon:'✍️', name:'امضا', type:'signature' },{ icon:'📍', name:'موقعیت', type:'location' },
  { icon:'🔲', name:'QR', type:'qr' },{ icon:'📊', name:'بارکد', type:'barcode' },
];

// ==========================================
// REPORT BUILDER DATA
// ==========================================
export const reportTemplates = [
  { id:'RT-001', name:'گزارش تولید روزانه', module:'MES', format:'PDF', schedule:'روزانه ساعت ۶', lastGenerated:'1403/10/02 06:00' },
  { id:'RT-002', name:'گزارش OEE هفتگی', module:'MES', format:'Excel', schedule:'شنبه ساعت ۸', lastGenerated:'1403/09/29 08:00' },
  { id:'RT-003', name:'گزارش موجودی', module:'WMS', format:'Excel', schedule:'روزانه ساعت ۷', lastGenerated:'1403/10/02 07:00' },
  { id:'RT-004', name:'گزارش نت ماهانه', module:'CMMS', format:'PDF', schedule:'ابتدای هر ماه', lastGenerated:'1403/10/01 06:00' },
  { id:'RT-005', name:'گزارش کیفیت', module:'QMS', format:'PDF+Excel', schedule:'هفتگی', lastGenerated:'1403/09/29 08:00' },
  { id:'RT-006', name:'گزارش مالی ماهانه', module:'Finance', format:'PDF', schedule:'ماهانه', lastGenerated:'1403/10/01 10:00' },
];
