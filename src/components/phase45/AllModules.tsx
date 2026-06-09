import { useState } from 'react';
import {
  HardHat, TriangleAlert, Shield, FileText, Users, DollarSign, BarChart3,
  Brain, Bot, Activity, CheckCircle2, XCircle, Clock, Plus,
  TrendingUp, TrendingDown, Zap, Globe, Database
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import {
  hseIncidents, riskAssessments, permits, ppeRecords, hseKPIs,
  employees, trainings, competencyMatrix, hrKPIs,
  documents, letters,
  accounts, payables, receivables, budgets, financeKPIs,
  aiAgents, aiPromptTemplates, marketplaceItems,
  formTemplates, formComponents, reportTemplates
} from '@/data/phase45Data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { uid } from '@/services/dataService';

// ==========================================
// HSE MODULE
// ==========================================
export function HSEModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'incidents': return <HSEIncidentsPage />;
    case 'risks': return <RiskPage />;
    case 'permits': return <PermitsPage />;
    case 'ppe': return <PPEPage />;
    default: return <HSEDashboard />;
  }
}

function HSEDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">ایمنی، بهداشت و محیط زیست (HSE)</h1></div>
      <StatGrid columns={5}>
        <StatCard title="LTIFR" value={hseKPIs.ltifr} icon={<HardHat size={22} />} color="#ef4444" />
        <StatCard title="TRIR" value={hseKPIs.trir} icon={<TriangleAlert size={22} />} color="#f59e0b" />
        <StatCard title="Near Miss" value={hseKPIs.nearMiss} icon={<Shield size={22} />} color="#8b5cf6" />
        <StatCard title="PPE انطباق" value={`${hseKPIs.ppeCompliance}%`} icon={<CheckCircle2 size={22} />} color="#10b981" />
        <StatCard title="Audit Score" value={`${hseKPIs.auditScore}%`} icon={<BarChart3 size={22} />} color="#3b82f6" />
      </StatGrid>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">ارزیابی ریسک</h3>
          <div className="space-y-2">{riskAssessments.map(ra => (
            <div key={ra.id} className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${ra.riskLevel==='بالا'?'bg-red-600':ra.riskLevel==='متوسط'?'bg-amber-600':'bg-green-600'}`}>{ra.severity*ra.probability}</div>
              <div className="flex-1"><p className="text-white text-sm">{ra.hazard}</p><p className="text-zinc-500 text-xs">کنترل: {ra.controlMeasure}</p></div>
              <span className={`text-xs px-2 py-0.5 rounded ${ra.riskLevel==='بالا'?'bg-red-500/10 text-red-500':'bg-amber-500/10 text-amber-500'}`}>{ra.riskLevel}</span>
            </div>
          ))}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">PPE کارکنان</h3>
          <div className="space-y-2">{ppeRecords.map(ppe => (
            <div key={ppe.id} className="flex items-center justify-between bg-zinc-800/50 rounded-xl p-3">
              <div><p className="text-white text-sm">{ppe.employee}</p><p className="text-zinc-500 text-xs">{ppe.type}</p></div>
              <span className={`text-xs px-2 py-0.5 rounded ${ppe.status==='valid'?'bg-green-500/10 text-green-500':ppe.status==='near_expiry'?'bg-amber-500/10 text-amber-500':'bg-red-500/10 text-red-500'}`}>
                {ppe.status==='valid'?'معتبر':ppe.status==='near_expiry'?'نزدیک انقضا':'منقضی'} — {ppe.expiryDate}
              </span>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

function HSEIncidentsPage() {
  const [localData, setLocalData] = useState(hseIncidents);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'title',label:'عنوان',type:'text',required:true},
    {name:'description',label:'شرح',type:'textarea',colSpan:2,required:true},
    {name:'location',label:'مکان',type:'text',required:true},
    {name:'reporter',label:'گزارش‌دهنده',type:'text',required:true},
    {name:'severity',label:'شدت',type:'select',required:true,options:[{value:'low',label:'کم'},{value:'medium',label:'متوسط'},{value:'high',label:'زیاد'},{value:'critical',label:'بحرانی'}]},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'near_miss',label:'نزدیک به حادثه'},{value:'unsafe_condition',label:'شرایط ناایمن'},{value:'injury',label:'آسیب'},{value:'environmental',label:'محیط زیست'}]},
    {name:'date',label:'تاریخ',type:'date',required:true},
    {name:'correctiveAction',label:'اقدام اصلاحی',type:'text',colSpan:2},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">حوادث HSE</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> حادثه جدید</button>
    </div>
    <div className="space-y-3">{localData.map(inc => (
      <div key={inc.id} className={`bg-zinc-900 border rounded-2xl p-5 ${(inc.severity as string)==='high'||(inc.severity as string)==='critical'?'border-red-500/30':'border-zinc-800'}`}>
        <div className="flex justify-between mb-2"><div className="flex items-center gap-2"><span className="font-mono text-blue-400">{inc.id}</span><span className={`text-xs px-2 py-0.5 rounded ${inc.status==='open' as any?'bg-red-500/10 text-red-500':'bg-green-500/10 text-green-500'}`}>{inc.status==='open'?'باز':'بسته'}</span></div><span className="text-zinc-500 text-xs">{inc.date} {inc.time}</span></div>
        <h3 className="text-white font-bold">{inc.title}</h3><p className="text-zinc-400 text-sm mt-1">{inc.description}</p>
        <div className="flex gap-4 mt-3 text-xs text-zinc-500"><span>📍 {inc.location}</span><span>👤 {inc.reporter}</span><span>🔧 اقدام: {inc.correctiveAction}</span></div>
      </div>
    ))}</div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,time:new Date().toLocaleTimeString('fa-IR'),department:'',rootCause:'',status:'open'}]);setShowModal(false)}} title="حادثه جدید" fields={formFields} size="lg" />
  </div>;
}

function RiskPage() {
  const [localData, setLocalData] = useState(riskAssessments);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'hazard',label:'خطر',type:'text',required:true},
    {name:'severity',label:'شدت',type:'number',required:true},
    {name:'probability',label:'احتمال',type:'number',required:true},
    {name:'controlMeasure',label:'اقدام کنترلی',type:'text',colSpan:2,required:true},
    {name:'residualRisk',label:'ریسک باقی‌مانده',type:'text'},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">ارزیابی ریسک</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> ریسک جدید</button>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm"><thead><tr className="border-b border-zinc-800">{['خطر','شدت','احتمال','ریسک','اقدام کنترلی','ریسک باقی‌مانده'].map(h=><th key={h} className="text-right text-xs text-zinc-500 px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{localData.map(ra => (
          <tr key={ra.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30"><td className="px-4 py-3 text-white">{ra.hazard}</td><td className="px-4 py-3">{ra.severity}</td><td className="px-4 py-3">{ra.probability}</td>
            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${ra.riskLevel==='بالا'?'bg-red-500/10 text-red-500':'bg-amber-500/10 text-amber-500'}`}>{ra.riskLevel}</span></td>
            <td className="px-4 py-3 text-zinc-400">{ra.controlMeasure}</td><td className="px-4 py-3">{ra.residualRisk}</td></tr>
        ))}</tbody>
      </table>
    </div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{const sev=Number(d.severity);const prob=Number(d.probability);const score=sev*prob;const level=score>=15?'بالا':score>=8?'متوسط':'پایین';setLocalData(prev=>[...prev,{id:uid(),...d,severity:sev,probability:prob,riskLevel:level,status:'active'}]);setShowModal(false)}} title="ریسک جدید" fields={formFields} />
  </div>;
}

function PermitsPage() {
  const [localData, setLocalData] = useState(permits);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'title',label:'عنوان',type:'text',required:true},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'hot_work',label:'کار گرم'},{value:'confined_space',label:'فضای بسته'},{value:'height_work',label:'کار در ارتفاع'},{value:'electrical',label:'برق'},{value:'excavation',label:'حفاری'}]},
    {name:'location',label:'مکان',type:'text',required:true},
    {name:'requestedBy',label:'درخواست‌دهنده',type:'text',required:true},
    {name:'startDate',label:'تاریخ شروع',type:'text',required:true},
    {name:'endDate',label:'تاریخ پایان',type:'text',required:true},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">مجوز کار (PTW)</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> مجوز جدید</button>
    </div>
    <div className="space-y-3">{localData.map(p => (
      <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex justify-between mb-3"><div><span className="font-mono text-blue-400">{p.id}</span><span className="text-xs bg-zinc-800 px-2 py-0.5 rounded mx-2">{p.type.replace('_',' ')}</span></div>
          <span className={`px-3 py-1 rounded-full text-xs ${p.status==='approved'?'bg-green-500/10 text-green-500':'bg-amber-500/10 text-amber-500'}`}>{p.status==='approved'?'تأیید شده':'در انتظار'}</span></div>
        <h3 className="text-white font-bold">{p.title}</h3>
        <p className="text-zinc-500 text-xs mt-1">📍 {p.location} • {p.startDate} تا {p.endDate}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{p.checklist.map((c,i)=><span key={i} className="text-xs bg-zinc-800 px-2 py-0.5 rounded">☑ {c}</span>)}</div>
      </div>
    ))}</div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,approvedBy:'',checklist:[],status:'pending'}]);setShowModal(false)}} title="مجوز جدید" fields={formFields} size="lg" />
  </div>;
}

function PPEPage() {
  const [localData, setLocalData] = useState(ppeRecords);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'employee',label:'کارمند',type:'text',required:true},
    {name:'type',label:'نوع PPE',type:'text',required:true},
    {name:'issueDate',label:'تاریخ صدور',type:'text',required:true},
    {name:'expiryDate',label:'تاریخ انقضا',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'valid',label:'معتبر'},{value:'near_expiry',label:'نزدیک انقضا'},{value:'expired',label:'منقضی'}]},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">تجهیزات حفاظت فردی (PPE)</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> PPE جدید</button>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm"><thead><tr className="border-b border-zinc-800">{['کارمند','نوع PPE','تاریخ صدور','انقضا','وضعیت'].map(h=><th key={h} className="text-right text-xs text-zinc-500 px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{localData.map(p => (
          <tr key={p.id} className="border-b border-zinc-800/50"><td className="px-4 py-3 text-white">{p.employee}</td><td className="px-4 py-3">{p.type}</td><td className="px-4 py-3">{p.issueDate}</td><td className="px-4 py-3">{p.expiryDate}</td>
            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-lg text-xs ${p.status==='valid'?'bg-green-500/10 text-green-500':p.status==='near_expiry'?'bg-amber-500/10 text-amber-500':'bg-red-500/10 text-red-500'}`}>{p.status==='valid'?'معتبر':p.status==='near_expiry'?'نزدیک انقضا':'منقضی'}</span></td></tr>
        ))}</tbody>
      </table>
    </div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d}]);setShowModal(false)}} title="PPE جدید" fields={formFields} />
  </div>;
}

// ==========================================
// HRM MODULE
// ==========================================
export function HRMModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'employees': return <EmployeesPage />;
    case 'attendance': return <AttendancePage />;
    case 'training': return <TrainingPage />;
    case 'competency': return <CompetencyPage />;
    default: return <HRMDashboard />;
  }
}

function HRMDashboard() {
  const present = employees.filter(e=>e.status==='present').length;
  const absent = employees.filter(e=>e.status==='absent').length;
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">منابع انسانی (HRM)</h1></div>
      <StatGrid columns={5}>
        <StatCard title="کل کارکنان" value={employees.length} icon={<Users size={22} />} color="#3b82f6" />
        <StatCard title="حاضر امروز" value={present} icon={<CheckCircle2 size={22} />} color="#10b981" />
        <StatCard title="غایب" value={absent} icon={<XCircle size={22} />} color="#ef4444" />
        <StatCard title="نرخ ترک خدمت" value={`${hrKPIs.turnover}%`} icon={<TrendingDown size={22} />} color="#f59e0b" />
        <StatCard title="بهره‌وری" value={`${hrKPIs.productivity}%`} icon={<Activity size={22} />} color="#8b5cf6" />
      </StatGrid>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">حضور و عملکرد کارکنان</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={employees.slice(0,8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="name" tick={{fill:'#71717a',fontSize:10}} /><YAxis tick={{fill:'#71717a',fontSize:11}} domain={[70,100]} />
            <Tooltip contentStyle={{backgroundColor:'#18181b',border:'1px solid #27272a',borderRadius:'12px',fontSize:'12px'}} />
            <Bar dataKey="attendance" fill="#3b82f6" name="حضور (%)" radius={[4,4,0,0]} /><Bar dataKey="productivity" fill="#10b981" name="بهره‌وری (%)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EmployeesPage() {
  const [localData, setLocalData] = useState(employees);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState<string | null>(null);
  const [photoMap, setPhotoMap] = useState<Record<string,string>>({});

  const takePhoto = (id:string) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.capture = 'user';
    input.onchange = (e:any) => {
      const file = e.target.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { setPhotoMap(p=>({...p, [id]: reader.result as string})); setShowCamera(null); };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const formFields: FormField[] = [
    {name:'code',label:'کد کارمند',type:'text',required:true},
    {name:'name',label:'نام',type:'text',required:true},
    {name:'department',label:'واحد',type:'text',required:true},
    {name:'position',label:'سمت',type:'text',required:true},
    {name:'mobile',label:'موبایل',type:'tel'},
    {name:'shift',label:'شیفت',type:'select',required:true,options:[{value:'روزانه',label:'روزانه'},{value:'صبح',label:'صبح'},{value:'عصر',label:'عصر'},{value:'شب',label:'شب'}]},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'full-time',label:'تمام‌وقت'},{value:'contract',label:'قراردادی'},{value:'intern',label:'کارآموز'}]},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'present',label:'حاضر'},{value:'absent',label:'غایب'},{value:'on_leave',label:'مرخصی'}]},
  ];
  return <div className="space-y-6 animate-fade-in">
    <DataTable data={localData} columns={[
      {key:'code',title:'کد',render:(v:any)=><span className="font-mono text-blue-400">{v}</span>},
      {key:'name',title:'نام',render:(v:any,row:any)=><div className="flex items-center gap-2">
        {photoMap[row.id] ? <img src={photoMap[row.id]} className="w-8 h-8 rounded-lg object-cover" alt="face" /> : <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500 text-xs font-bold">{(v as string).charAt(0)}</div>}
        <div><p className="text-white">{v}</p><p className="text-zinc-500 text-xs">{row.position}</p></div>
      </div>},
      {key:'department',title:'واحد'},{key:'shift',title:'شیفت'},{key:'type',title:'نوع',render:(v:any)=>v==='full-time'?'تمام‌وقت':v==='contract'?'قراردادی':'کارآموز'},
      {key:'mobile',title:'موبایل',render:(v:any)=>v?<span dir="ltr" className="text-xs text-zinc-400">{v}</span>:<span className="text-zinc-600">-</span>},
      {key:'status',title:'وضعیت',render:(v:any)=><span className={`px-2 py-0.5 rounded-lg text-xs ${v==='present'?'bg-green-500/10 text-green-500':v==='absent'?'bg-red-500/10 text-red-500':'bg-amber-500/10 text-amber-500'}`}>{v==='present'?'حاضر':v==='absent'?'غایب':'مرخصی'}</span>},
      {key:'attendance',title:'حضور',render:(v:any)=>`${v}%`},
    ]} title="لیست کارکنان" icon={<Users size={18} className="text-blue-500" />}
      onAdd={()=>setShowModal(true)} addLabel="کارمند جدید" selectable
      onEdit={(row)=>{takePhoto(row.id)}} />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,attendance:100,productivity:100}]);setShowModal(false)}} title="کارمند جدید" fields={formFields} size="lg" />
  </div>;
}

function AttendancePage() {
  const [localData, setLocalData] = useState(employees);
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState<{lat:number;lng:number;address:string} | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [clockStatus, setClockStatus] = useState<'in'|'out'|null>(null);
  const [todayLog, setTodayLog] = useState<Array<{employee:string;time:string;method:string;location:string;photo?:string}>>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const getLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) { setLocation({lat:0,lng:0,address:'مرورگر از موقعیت یابی پشتیبانی نمی‌کند'}); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=fa`);
          const data = await res.json();
          setLocation({lat:pos.coords.latitude, lng:pos.coords.longitude, address: data.display_name || 'موقعیت نامشخص'});
        } catch { setLocation({lat:pos.coords.latitude, lng:pos.coords.longitude, address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`}); }
        setLocLoading(false);
      },
      () => { setLocation({lat:0,lng:0,address:'دسترسی به موقعیت رد شد'}); setLocLoading(false); },
      {enableHighAccuracy:true}
    );
  };

  const capturePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'user';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { setPhotoBase64(reader.result as string); setCameraMode(false); };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const clockIn = () => {
    if (!selectedEmployee) return;
    getLocation();
    setTimeout(() => {
      const emp = localData.find(e => e.id === selectedEmployee);
      const entry = {employee: emp?.name || '', time: new Date().toLocaleTimeString('fa-IR'), method: location ? 'حضور فیزیکی + موقعیت' : 'حضور فیزیکی', location: location?.address || 'نامشخص', photo: photoBase64 || undefined};
      setTodayLog(prev => [entry, ...prev]);
      setLocalData(prev => prev.map(e => e.id === selectedEmployee ? {...e, status: 'present' as const} : e));
      setClockStatus('in');
      setSelectedEmployee('');
      setPhotoBase64(null);
    }, 1000);
  };

  const clockOut = () => {
    setTodayLog(prev => prev.length > 0 ? [{...prev[0], time: `${prev[0].time} → ${new Date().toLocaleTimeString('fa-IR')}`}, ...prev.slice(1)] : prev);
    setClockStatus(null);
  };

  const formFields: FormField[] = [
    {name:'name',label:'نام کارمند',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'present',label:'حاضر'},{value:'absent',label:'غایب'},{value:'on_leave',label:'مرخصی'}]},
    {name:'date',label:'تاریخ',type:'date',required:true},
    {name:'notes',label:'توضیحات',type:'textarea',colSpan:2},
  ];

  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">حضور و غیاب هوشمند</h1>
      <div className="flex gap-2">
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded-xl hover:bg-zinc-700"><Plus size={16} /> ثبت دستی</button>
      </div>
    </div>

    {/* روش‌های ثبت حضور */}
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <div onClick={()=>{if(location){setLocation(null)}else{getLocation()}}} className={`bg-zinc-900 border rounded-xl p-4 text-center cursor-pointer transition-all hover:border-blue-500/30 ${location?'border-green-500/50 bg-green-500/5':''}`}>
        <span className="text-2xl block mb-1">{locLoading?'⏳':location?'✅':'📍'}</span>
        <p className={`text-xs font-medium ${location?'text-green-400':'text-zinc-400'}`}>Geo Location</p>
        {location && <p className="text-[9px] text-zinc-500 mt-1 truncate">{location.address.substring(0,30)}...</p>}
      </div>
      <div onClick={()=>{setCameraMode(!cameraMode); if(!cameraMode) capturePhoto();}} className={`bg-zinc-900 border rounded-xl p-4 text-center cursor-pointer transition-all hover:border-blue-500/30 ${photoBase64?'border-green-500/50 bg-green-500/5':''}`}>
        <span className="text-2xl block mb-1">{photoBase64?'✅':'🤳'}</span>
        <p className={`text-xs font-medium ${photoBase64?'text-green-400':'text-zinc-400'}`}>تشخیص چهره</p>
        {photoBase64 && <p className="text-[9px] text-green-500 mt-1">✓ عکس گرفته شد</p>}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"><span className="text-2xl block mb-1">👆</span><p className="text-xs text-zinc-400">اثر انگشت</p><p className="text-[9px] text-zinc-600 mt-1">سخت‌افزار</p></div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"><span className="text-2xl block mb-1">📱</span><p className="text-xs text-zinc-400">QR Code</p><p className="text-[9px] text-zinc-600 mt-1">اسکنر</p></div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"><span className="text-2xl block mb-1">📶</span><p className="text-xs text-zinc-400">NFC</p><p className="text-[9px] text-zinc-600 mt-1">کارت</p></div>
    </div>

    {/* انتخاب کارمند و ثبت */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="text-zinc-500 text-xs mb-1.5 block">انتخاب کارمند</label>
          <select value={selectedEmployee} onChange={e=>setSelectedEmployee(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500">
            <option value="">انتخاب کنید...</option>
            {localData.map(e=><option key={e.id} value={e.id}>{e.name} — {e.department} ({e.status==='present'?'✅حاضر':e.status==='absent'?'❌غایب':'🔵مرخصی'})</option>)}
          </select>
        </div>
        {location && <div className="text-[10px] text-zinc-500 pb-1 flex-1"><span>📍 {location.address}</span></div>}
        {photoBase64 && <div className="pb-1"><img src={photoBase64} className="w-10 h-10 rounded-lg object-cover border border-green-500/30" alt="face" /></div>}
        <div className="flex gap-2">
          <button onClick={clockIn} disabled={!selectedEmployee} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all text-sm">✅ ثبت ورود</button>
          <button onClick={clockOut} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all text-sm">⏹ ثبت خروج</button>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-zinc-600">
        <span className={location?'text-green-500':'text-zinc-600'}>📍 موقعیت: {location?'ثبت شد':'ثبت نشده'}</span>
        <span className={photoBase64?'text-green-500':'text-zinc-600'}>🤳 چهره: {photoBase64?'ثبت شد':'ثبت نشده'}</span>
      </div>
    </div>

    {/* وضعیت امروز */}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-green-500/10 rounded-xl p-4 text-center"><p className="text-3xl font-black text-green-400">{localData.filter(e=>e.status==='present').length}</p><p className="text-zinc-500 text-xs">حاضر</p></div>
      <div className="bg-red-500/10 rounded-xl p-4 text-center"><p className="text-3xl font-black text-red-400">{localData.filter(e=>e.status==='absent').length}</p><p className="text-zinc-500 text-xs">غایب</p></div>
      <div className="bg-amber-500/10 rounded-xl p-4 text-center"><p className="text-3xl font-black text-amber-400">{localData.filter(e=>e.status==='on_leave').length}</p><p className="text-zinc-500 text-xs">مرخصی</p></div>
    </div>

    {/* log امروز */}
    {todayLog.length > 0 && <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800"><h3 className="text-white font-bold">لاگ امروز</h3></div>
      <div className="divide-y divide-zinc-800">{todayLog.map((log,i)=>(
        <div key={i} className="px-4 py-3 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${log.method.includes('موقعیت')?'bg-green-500':'bg-blue-500'}`} />
          <div className="flex-1">
            <p className="text-white text-sm">{log.employee}</p>
            <p className="text-zinc-500 text-xs">{log.time} • {log.method}{log.location!=='نامشخص'&&` • ${log.location.substring(0,25)}`}</p>
          </div>
          {log.photo && <img src={log.photo} className="w-8 h-8 rounded-lg object-cover" alt="face-log" />}
          <span className="text-green-500 text-xs">✓ ثبت شد</span>
        </div>
      ))}</div>
    </div>}

    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,code:'',department:'',position:'',shift:'',type:'full-time',attendance:100,productivity:100}]);setShowModal(false)}} title="ثبت حضور دستی" fields={formFields} />
  </div>;
}

function TrainingPage() {
  const [localData, setLocalData] = useState(trainings);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'course',label:'دوره',type:'text',required:true},
    {name:'trainer',label:'مدرس',type:'text',required:true},
    {name:'participants',label:'تعداد شرکت‌کنندگان',type:'number',required:true},
    {name:'score',label:'امتیاز',type:'number',required:true},
    {name:'date',label:'تاریخ',type:'date',required:true},
    {name:'certificate',label:'گواهینامه',type:'checkbox'},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">آموزش و دوره‌ها</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> دوره جدید</button>
    </div>
    <div className="space-y-3">{localData.map(t=>(
      <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex justify-between mb-2"><h3 className="text-white font-bold">{t.course}</h3><span className="text-zinc-500 text-xs">{t.date}</span></div>
        <div className="flex gap-4 text-xs text-zinc-400"><span>👨‍🏫 {t.trainer}</span><span>👥 {t.participants} نفر</span><span>📊 امتیاز: {t.score}%</span>
          {t.certificate && <span className="text-green-500">📜 گواهینامه</span>}{t.expiry && <span>انقضا: {t.expiry}</span>}</div>
      </div>
    ))}</div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,participants:Number(d.participants),score:Number(d.score),certificate:Boolean(d.certificate)}]);setShowModal(false)}} title="دوره جدید" fields={formFields} />
  </div>;
}

function CompetencyPage() {
  return <div className="space-y-6 animate-fade-in"><h1 className="text-xl font-bold text-white">ماتریس شایستگی</h1>
    <div className="space-y-4">{competencyMatrix.map((cm,i)=>(
      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">{cm.employee}</h3>
        <div className="space-y-3">{cm.skills.map(skill=>{const gap=skill.required-skill.current;return(
          <div key={skill.name}><div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">{skill.name}</span><span className={gap>0?'text-red-400':'text-green-400'}>{skill.current}/{skill.required} {gap>0?`(شکاف: ${gap})`:''}</span></div>
            <div className="flex gap-1">{Array.from({length:5},(_,j)=><div key={j} className={`flex-1 h-3 rounded ${j<skill.current?'bg-blue-500':j<skill.required?'bg-red-500/30':'bg-zinc-700'}`} />)}</div>
          </div>
        )})}</div>
      </div>
    ))}</div>
  </div>;
}

// ==========================================
// DMS MODULE
// ==========================================
export function DMSModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'documents': return <DocumentsPage />;
    case 'letters': return <LettersPage />;
    default: return <DMSDashboard />;
  }
}

function DMSDashboard() {
  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">مدیریت اسناد (DMS)</h1><p className="text-zinc-500">کارخانه بدون کاغذ — مستندات، نامه‌ها و امضای الکترونیکی</p></div>
    <StatGrid columns={4}>
      <StatCard title="مستندات فعال" value={documents.length} icon={<FileText size={22} />} color="#3b82f6" />
      <StatCard title="نامه‌ها" value={letters.length} icon={<Globe size={22} />} color="#10b981" />
      <StatCard title="در انتظار بازبینی" value={documents.filter(d=>d.status==='under_review').length} icon={<Clock size={22} />} color="#f59e0b" />
      <StatCard title="دسته‌بندی" value="5" icon={<Database size={22} />} color="#8b5cf6" />
    </StatGrid>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"><div className="p-4 border-b border-zinc-800"><h3 className="text-white font-bold">مستندات اخیر</h3></div>
      <div className="divide-y divide-zinc-800">{documents.map(doc=>(
        <div key={doc.id} className="px-4 py-3 hover:bg-zinc-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="text-2xl">{doc.category==='SOP'?'📋':doc.category==='Work Instruction'?'🔧':doc.category==='Policy'?'📜':doc.category==='Form'?'📝':'📖'}</span>
            <div><p className="text-white font-medium">{doc.title}</p><p className="text-zinc-500 text-xs">{doc.number} • نسخه {doc.version} • {doc.department}</p></div></div>
          <span className={`px-2 py-0.5 rounded-lg text-xs ${doc.status==='approved'?'bg-green-500/10 text-green-500':doc.status==='under_review'?'bg-amber-500/10 text-amber-500':'bg-zinc-500/10 text-zinc-400'}`}>{doc.status==='approved'?'تأیید شده':doc.status==='under_review'?'در بازبینی':'منسوخ'}</span>
        </div>
      ))}</div>
    </div>
  </div>;
}

function DocumentsPage() {
  const [localData, setLocalData] = useState(documents);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'number',label:'شماره سند',type:'text',required:true},
    {name:'title',label:'عنوان',type:'text',required:true},
    {name:'category',label:'دسته',type:'select',required:true,options:[{value:'SOP',label:'SOP'},{value:'Work Instruction',label:'دستورالعمل کار'},{value:'Policy',label:'خط‌مشی'},{value:'Form',label:'فرم'},{value:'Manual',label:'راهنما'}]},
    {name:'version',label:'نسخه',type:'text',required:true},
    {name:'department',label:'واحد',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'approved',label:'تأیید شده'},{value:'under_review',label:'در بازبینی'},{value:'obsolete',label:'منسوخ'}]},
  ];
  return <div className="space-y-6 animate-fade-in">
    <DataTable data={localData} columns={[
      {key:'number',title:'شماره',render:(v:any)=><span className="font-mono text-blue-400">{v}</span>},
      {key:'title',title:'عنوان'},{key:'category',title:'دسته'},{key:'version',title:'نسخه'},{key:'department',title:'واحد'},
      {key:'status',title:'وضعیت',render:(v:any)=><span className={`px-2 py-0.5 rounded-lg text-xs ${v==='approved'?'bg-green-500/10 text-green-500':v==='under_review'?'bg-amber-500/10 text-amber-500':'bg-zinc-500/10 text-zinc-400'}`}>{v==='approved'?'تأیید شده':v==='under_review'?'در بازبینی':'منسوخ'}</span>},
    ]} title="مستندات" icon={<FileText size={18} className="text-blue-500" />} onAdd={()=>setShowModal(true)} addLabel="سند جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,owner:'',lastReview:'',nextReview:''}]);setShowModal(false)}} title="سند جدید" fields={formFields} size="lg" />
  </div>;
}

function LettersPage() {
  const [localData, setLocalData] = useState(letters);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'number',label:'شماره نامه',type:'text',required:true},
    {name:'subject',label:'موضوع',type:'text',required:true},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'incoming',label:'وارده'},{value:'outgoing',label:'صادره'},{value:'internal',label:'داخلی'}]},
    {name:'from',label:'از',type:'text'},
    {name:'to',label:'به',type:'text'},
    {name:'date',label:'تاریخ',type:'date',required:true},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">مدیریت نامه‌ها</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> نامه جدید</button>
    </div>
    <div className="space-y-2">{localData.map(l=>(
      <div key={l.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{l.type==='incoming'?'📥':l.type==='outgoing'?'📤':'📨'}</span>
          <div><p className="text-white">{l.subject}</p><p className="text-zinc-500 text-xs">{l.number} • {l.date}</p></div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${l.type==='incoming'?'bg-blue-500/10 text-blue-500':l.type==='outgoing'?'bg-green-500/10 text-green-500':'bg-purple-500/10 text-purple-500'}`}>{l.type==='incoming'?'وارده':l.type==='outgoing'?'صادره':'داخلی'}</span>
      </div>
    ))}</div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,status:'pending'}]);setShowModal(false)}} title="نامه جدید" fields={formFields} size="lg" />
  </div>;
}

// ==========================================
// FINANCE MODULE
// ==========================================
export function FinanceModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'ledger': return <LedgerPage />;
    case 'payable': return <PayablePage />;
    case 'receivable': return <ReceivablePage />;
    case 'budget': return <BudgetPage />;
    default: return <FinanceDashboard />;
  }
}

function FinanceDashboard() {
  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">مالی (Finance ERP)</h1></div>
    <StatGrid columns={5}>
      <StatCard title="درآمد" value={financeKPIs.revenue} unit="ریال" icon={<TrendingUp size={22} />} color="#10b981" />
      <StatCard title="هزینه" value={financeKPIs.cost} unit="ریال" icon={<TrendingDown size={22} />} color="#ef4444" />
      <StatCard title="سود" value={financeKPIs.profit} unit="ریال" icon={<DollarSign size={22} />} color="#3b82f6" />
      <StatCard title="جریان نقد" value={financeKPIs.cashFlow} unit="ریال" icon={<Activity size={22} />} color="#f59e0b" />
      <StatCard title="انحراف بودجه" value={financeKPIs.budgetVariance} icon={<BarChart3 size={22} />} color="#8b5cf6" />
    </StatGrid>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-bold mb-4">بودجه vs واقعی (میلیارد ریال)</h3>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={budgets}><CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="department" tick={{fill:'#71717a',fontSize:10}} /><YAxis tick={{fill:'#71717a',fontSize:11}} />
          <Tooltip contentStyle={{backgroundColor:'#18181b',border:'1px solid #27272a',borderRadius:'12px',fontSize:'12px'}} formatter={(v:any)=>`${(v/1000000000).toFixed(1)}B`} />
          <Bar dataKey="budget" fill="#3b82f6" name="بودجه" radius={[4,4,0,0]} /><Bar dataKey="actual" fill="#f59e0b" name="واقعی" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>;
}

function LedgerPage() {
  const [localData, setLocalData] = useState(accounts);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'code',label:'کد حساب',type:'text',required:true},
    {name:'name',label:'نام حساب',type:'text',required:true},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'asset',label:'دارایی'},{value:'liability',label:'بدهی'},{value:'equity',label:'سرمایه'},{value:'revenue',label:'درآمد'},{value:'expense',label:'هزینه'}]},
    {name:'balance',label:'مانده (ریال)',type:'number',required:true},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">دفتر کل</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> حساب جدید</button>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm"><thead><tr className="border-b border-zinc-800">{['کد حساب','نام','نوع','مانده (ریال)'].map(h=><th key={h} className="text-right text-xs text-zinc-500 px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{localData.map(a=>(
          <tr key={a.id} className="border-b border-zinc-800/50"><td className="px-4 py-3 font-mono text-blue-400">{a.code}</td><td className="px-4 py-3 text-white">{a.name}</td>
            <td className="px-4 py-3 text-zinc-400">{a.type==='asset'?'دارایی':a.type==='liability'?'بدهی':a.type==='equity'?'سرمایه':a.type==='revenue'?'درآمد':'هزینه'}</td>
            <td className="px-4 py-3 text-white font-bold">{a.balance.toLocaleString()}</td></tr>
        ))}</tbody>
      </table>
    </div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,balance:Number(d.balance)}]);setShowModal(false)}} title="حساب جدید" fields={formFields} />
  </div>;
}

function PayablePage() {
  const [localData, setLocalData] = useState(payables);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'supplier',label:'تأمین‌کننده',type:'text',required:true},
    {name:'invoice',label:'فاکتور',type:'text',required:true},
    {name:'amount',label:'مبلغ (ریال)',type:'number',required:true},
    {name:'dueDate',label:'سررسید',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'pending',label:'در انتظار'},{value:'paid',label:'پرداخت شده'}]},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">حساب‌های پرداختنی</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> پرداختنی جدید</button>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm"><thead><tr className="border-b border-zinc-800">{['تأمین‌کننده','فاکتور','مبلغ','سررسید','وضعیت'].map(h=><th key={h} className="text-right text-xs text-zinc-500 px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{localData.map(p=>(
          <tr key={p.id} className="border-b border-zinc-800/50"><td className="px-4 py-3 text-white">{p.supplier}</td><td className="px-4 py-3 font-mono text-xs">{p.invoice}</td>
            <td className="px-4 py-3 text-white">{p.amount.toLocaleString()}</td><td className="px-4 py-3">{p.dueDate}</td>
            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${p.status==='paid'?'bg-green-500/10 text-green-500':'bg-amber-500/10 text-amber-500'}`}>{p.status==='paid'?'پرداخت شده':'در انتظار'}</span></td></tr>
        ))}</tbody>
      </table>
    </div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,amount:Number(d.amount)}]);setShowModal(false)}} title="پرداختنی جدید" fields={formFields} />
  </div>;
}

function ReceivablePage() {
  const [localData, setLocalData] = useState(receivables);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'customer',label:'مشتری',type:'text',required:true},
    {name:'invoice',label:'فاکتور',type:'text',required:true},
    {name:'amount',label:'مبلغ (ریال)',type:'number',required:true},
    {name:'dueDate',label:'سررسید',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'pending',label:'در انتظار'},{value:'overdue',label:'معوق'}]},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">حساب‌های دریافتنی</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> دریافتنی جدید</button>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm"><thead><tr className="border-b border-zinc-800">{['مشتری','فاکتور','مبلغ','سررسید','وضعیت'].map(h=><th key={h} className="text-right text-xs text-zinc-500 px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{localData.map(r=>(
          <tr key={r.id} className="border-b border-zinc-800/50"><td className="px-4 py-3 text-white">{r.customer}</td><td className="px-4 py-3 font-mono text-xs">{r.invoice}</td>
            <td className="px-4 py-3 text-white">{r.amount.toLocaleString()}</td><td className="px-4 py-3">{r.dueDate}</td>
            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${r.status==='overdue'?'bg-red-500/10 text-red-500':'bg-amber-500/10 text-amber-500'}`}>{r.status==='overdue'?'معوق':'در انتظار'}</span></td></tr>
        ))}</tbody>
      </table>
    </div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,amount:Number(d.amount)}]);setShowModal(false)}} title="دریافتنی جدید" fields={formFields} />
  </div>;
}

function BudgetPage() {
  const [localData, setLocalData] = useState(budgets);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'department',label:'واحد',type:'text',required:true},
    {name:'budget',label:'بودجه (ریال)',type:'number',required:true},
    {name:'actual',label:'واقعی (ریال)',type:'number',required:true},
  ];
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">مدیریت بودجه</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> بودجه جدید</button>
    </div>
    <div className="space-y-3">{localData.map((b: any)=>{const pct=Math.round((b.actual/b.budget)*100);return(
      <div key={b.department} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex justify-between mb-2"><span className="text-white font-medium">{b.department}</span><span className="text-zinc-400 text-xs">{pct}% مصرف</span></div>
        <div className="w-full bg-zinc-700 rounded-full h-3 mb-2"><div className={`h-3 rounded-full ${pct>90?'bg-red-500':pct>75?'bg-amber-500':'bg-blue-500'}`} style={{width:`${pct}%`}} /></div>
        <div className="flex justify-between text-xs text-zinc-500"><span>بودجه: {(b.budget/1000000000).toFixed(1)}B</span><span>واقعی: {(b.actual/1000000000).toFixed(1)}B</span><span className="text-green-500">مانده: {(b.variance/1000000000).toFixed(1)}B</span></div>
      </div>
    )})}</div>
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{const budget=Number(d.budget);const actual=Number(d.actual);setLocalData(prev=>[...prev,{id:uid(),department:d.department,budget,actual,variance:budget-actual}]);setShowModal(false)}} title="بودجه جدید" fields={formFields} />
  </div>;
}

// ==========================================
// REPORT BUILDER
// ==========================================
export function ReportBuilderModule() {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState(reportTemplates);
  const [history, setHistory] = useState<Array<{id:string;reportName:string;format:string;generatedAt:string;size:string;status:'done'|'sending'|'sent'}>>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);

  const generate = (id: string, name: string, format: string) => {
    setGenerating(id);
    setTimeout(() => {
      setHistory(p => [{id:uid('gen_'), reportName: name, format, generatedAt: new Date().toLocaleString('fa-IR'), size: `${(Math.random()*5+0.5).toFixed(1)} MB`, status: 'done'}, ...p]);
      setReports(p => p.map(r => r.id === id ? {...r, lastGenerated: new Date().toLocaleString('fa-IR')} : r));
      setGenerating(null);
    }, 1500);
  };

  const sendEmail = (hId: string) => {
    setSending(hId);
    setTimeout(() => {
      setHistory(p => p.map(h => h.id === hId ? {...h, status: 'sent'} : h));
      setSending(null);
    }, 2000);
  };

  const download = (reportName: string, format: string) => {
    const blob = new Blob([`گزارش: ${reportName}\nفرمت: ${format}\nتولید شده در: ${new Date().toISOString()}\n\nاین یک گزارش آزمایشی است.`], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${reportName}.${format.toLowerCase()}`; a.click();
    URL.revokeObjectURL(url);
  };

  const cols: Column<typeof reports[0]>[] = [
    {key:'name',title:'نام گزارش',render:(v)=><span className="text-white font-medium">{v}</span>},
    {key:'module',title:'ماژول'},
    {key:'format',title:'فرمت'},
    {key:'schedule',title:'زمانبندی'},
    {key:'lastGenerated',title:'آخرین تولید'},
  ];
  const formFields: FormField[] = [
    {name:'name',label:'نام گزارش',type:'text',required:true},
    {name:'module',label:'ماژول',type:'select',required:true,options:[{value:'MES',label:'تولید'},{value:'WMS',label:'انبار'},{value:'CMMS',label:'نت'},{value:'QMS',label:'کیفیت'},{value:'Finance',label:'مالی'}]},
    {name:'format',label:'فرمت خروجی',type:'select',options:[{value:'PDF',label:'PDF'},{value:'Excel',label:'Excel'},{value:'Word',label:'Word'},{value:'CSV',label:'CSV'}]},
    {name:'schedule',label:'زمانبندی',type:'select',options:[{value:'روزانه ساعت ۶',label:'روزانه ساعت ۶'},{value:'شنبه ساعت ۸',label:'شنبه ساعت ۸'},{value:'ماهانه',label:'ماهانه'},{value:'هفتگی',label:'هفتگی'}]},
  ];

  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">گزارش‌ساز (Report Builder)</h1><p className="text-zinc-500">ساخت و زمانبندی گزارش‌ها از تمام ماژول‌ها</p></div>
    <StatGrid columns={4}>
      <StatCard title="قالب گزارش" value={reports.length} icon={<FileText size={22} />} color="#3b82f6" />
      <StatCard title="تولید امروز" value={history.filter(h=>h.status==='done').length} icon={<BarChart3 size={22} />} color="#10b981" />
      <StatCard title="ارسال شده" value={history.filter(h=>h.status==='sent').length} icon={<Globe size={22} />} color="#f59e0b" />
      <StatCard title="زمانبندی فعال" value={reports.length} icon={<Clock size={22} />} color="#8b5cf6" />
    </StatGrid>

    <DataTable data={reports} columns={cols} title="قالب‌های گزارش" icon={<FileText size={18} className="text-blue-500" />}
      onAdd={()=>setShowModal(true)} addLabel="گزارش جدید"
      actions={false} />
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex justify-between"><h3 className="text-white font-bold">عملیات گزارش</h3></div>
      <div className="divide-y divide-zinc-800">{reports.map(r=>(
        <div key={r.id} className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{r.module === 'MES' ? '🏭' : r.module === 'WMS' ? '📦' : r.module === 'CMMS' ? '🔧' : r.module === 'QMS' ? '✅' : '💰'}</span>
            <div><p className="text-white font-medium">{r.name}</p><p className="text-zinc-500 text-xs">{r.module} • {r.format} • {r.schedule}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>download(r.name, r.format)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700 flex items-center gap-1">📥 دانلود</button>
            <button onClick={()=>generate(r.id, r.name, r.format)} disabled={generating===r.id} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1">
              {generating===r.id ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> تولید...</> : <>⚙️ تولید</>}
            </button>
          </div>
        </div>
      ))}</div>
    </div>

    {history.length > 0 && (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800"><h3 className="text-white font-bold">تاریخچه تولید</h3></div>
        <div className="divide-y divide-zinc-800">{history.map(h=>(
          <div key={h.id} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${h.status==='done'?'bg-green-500':h.status==='sent'?'bg-blue-500':'bg-amber-500 animate-pulse'}`} />
              <div><p className="text-white text-sm">{h.reportName}</p><p className="text-zinc-500 text-xs">{h.format} • {h.size} • {h.generatedAt}</p></div>
            </div>
            <div className="flex items-center gap-2">
              {h.status === 'done' && (
                <><button onClick={()=>download(h.reportName, h.format)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700">📥 دانلود</button>
                <button onClick={()=>sendEmail(h.id)} disabled={sending===h.id} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1">
                  {sending===h.id ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> ارسال...</> : '📧 ارسال'}
                </button></>
              )}
              {h.status === 'sent' && <span className="text-green-500 text-xs flex items-center gap-1">✓ ارسال شد</span>}
            </div>
          </div>
        ))}</div>
      </div>
    )}

    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setReports(p=>[...p,{id:uid('RT_'),...d,lastGenerated:'-'}]);setShowModal(false)}} title="گزارش جدید" fields={formFields} />
  </div>;
}

// ==========================================
// FORM BUILDER
// ==========================================
export function FormBuilderModule() {
  const [mode, setMode] = useState<'list' | 'design'>('list');
  const [forms, setForms] = useState(formTemplates);
  const [designFields, setDesignFields] = useState<Array<{type:string;icon:string;name:string;id:string}>>([]);
  const [formName, setFormName] = useState('');
  const [selectedCat, setSelectedCat] = useState('quality');
  const [showModal, setShowModal] = useState(false);

  const addField = (comp: typeof formComponents[0]) => {
    setDesignFields(p => [...p, {...comp, id: uid('fld_')}]);
  };

  const removeField = (id: string) => {
    setDesignFields(p => p.filter(f => f.id !== id));
  };

  const saveForm = () => {
    if (!formName.trim()) return;
    setForms(p => [...p, {id: uid('FT_'), name: formName, category: selectedCat, fields: designFields.length, submissions: 0, lastUsed: new Date().toLocaleDateString('fa-IR')}]);
    setDesignFields([]);
    setFormName('');
    setMode('list');
  };

  const cols: Column<typeof forms[0]>[] = [
    {key:'name',title:'نام فرم',render:(v)=><span className="text-white font-medium">{v}</span>},
    {key:'category',title:'دسته',render:(v)=>{const c:Record<string,string>={quality:'کیفیت',hse:'ایمنی',procurement:'خرید',maintenance:'نت'};return <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{c[v]||v}</span>}},
    {key:'fields',title:'فیلدها'},
    {key:'submissions',title:'پاسخ‌ها'},
    {key:'lastUsed',title:'آخرین استفاده'},
  ];

  if (mode === 'design') {
    return <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={()=>{setMode('list');setDesignFields([]);}} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-xl text-sm hover:bg-zinc-700">بازگشت</button>
        <h1 className="text-2xl font-bold text-white">طراحی فرم</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="نام فرم را وارد کنید..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 outline-none focus:border-blue-500" />
              <select value={selectedCat} onChange={e=>setSelectedCat(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500">
                <option value="quality">کیفیت</option><option value="hse">ایمنی</option><option value="procurement">خرید</option><option value="maintenance">نت</option>
              </select>
            </div>
            {designFields.length === 0 ? (
              <div className="text-center py-16 text-zinc-600">
                <span className="text-5xl block mb-3">📋</span>
                <p>از بخش اجزای فرم، فیلدها را اضافه کنید</p>
              </div>
            ) : (
              <div className="space-y-2">
                {designFields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 group">
                    <span className="text-zinc-500 text-xs w-5">{i+1}</span>
                    <span className="text-xl">{f.icon}</span>
                    <span className="text-white text-sm flex-1">{f.name}</span>
                    <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-400">{f.type}</span>
                    <button onClick={()=>removeField(f.id)} className="p-1 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                  </div>
                ))}
              </div>
            )}
            {designFields.length > 0 && (
              <button onClick={saveForm} className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all">ذخیره فرم ({designFields.length} فیلد)</button>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-fit">
          <h3 className="text-white font-bold mb-4">اجزای فرم</h3>
          <div className="grid grid-cols-2 gap-2">
            {formComponents.map(c => (
              <div key={c.type} onClick={()=>addField(c)} className="bg-zinc-800/50 rounded-xl p-3 text-center cursor-pointer hover:bg-zinc-700 hover:border-blue-500/30 border border-transparent transition-all">
                <span className="text-2xl block mb-1">{c.icon}</span>
                <p className="text-zinc-300 text-[11px]">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>;
  }

  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">فرم‌ساز (Form Builder)</h1><p className="text-zinc-500">ساخت هر فرم بدون برنامه‌نویسی</p></div>
    <DataTable data={forms} columns={cols} title="فرم‌های موجود" icon={<FileText size={18} className="text-green-500" />} onAdd={()=>setMode('design')} addLabel="فرم جدید" />
  </div>;
}

// ==========================================
// MARKETPLACE
// ==========================================
export function MarketplaceModule() {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(marketplaceItems);
  const types = [{id:'all',label:'همه'},{id:'theme',label:'تم'},{id:'widget',label:'ویجت'},{id:'plugin',label:'افزونه'},{id:'industry_pack',label:'پک صنعتی'},{id:'ai_agent',label:'عامل AI'},{id:'dashboard',label:'داشبورد'}];
  const filtered = filter==='all'?items:items.filter(i=>i.type===filter);

  const toggleInstall = (id:string) => {
    setItems(prev => prev.map(i => i.id === id ? {...i, installed: !i.installed, installs: i.installed ? i.installs - 1 : i.installs + 1} : i));
  };

  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">مارکت‌پلیس</h1><p className="text-zinc-500">تم‌ها، افزونه‌ها، پک‌های صنعتی و عامل‌های AI</p></div>
    <div className="flex flex-wrap gap-2">{types.map(t=>(
      <button key={t.id} onClick={()=>setFilter(t.id)} className={`px-4 py-2 rounded-xl text-sm transition-all ${filter===t.id?'bg-blue-600 text-white':'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{t.label}</button>
    ))}</div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{filtered.map(item=>(
      <div key={item.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all">
        <div className="text-4xl mb-3">{item.image}</div>
        <div className="flex items-center gap-2 mb-1"><h3 className="text-white font-bold text-sm">{item.name}</h3>{item.installed && <CheckCircle2 size={14} className="text-green-500" />}</div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3"><span className="text-amber-400">★ {item.rating}</span><span>{item.installs} نصب</span></div>
        <div className="flex items-center justify-between"><span className="text-sm text-zinc-300">{item.price}</span>
          <button onClick={()=>toggleInstall(item.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.installed?'bg-red-600 hover:bg-red-700 text-white':'bg-blue-600 hover:bg-blue-700 text-white'}`}>{item.installed?'حذف':'نصب'}</button>
        </div>
      </div>
    ))}</div>
  </div>;
}

// ==========================================
// NO-CODE BUILDER
// ==========================================
export function NoCodeBuilderModule() {
  const [activeBuilder, setActiveBuilder] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<Array<{id:string;name:string;desc:string;color:string;type:string;createdAt:string}>>([]);

  const builders = [
    {id:'page',name:'Page Builder',icon:'📄',desc:'ساخت صفحات سفارشی',color:'#3b82f6'},
    {id:'dashboard',name:'Dashboard Builder',icon:'📊',desc:'ساخت داشبورد',color:'#10b981'},
    {id:'form',name:'Form Builder',icon:'📋',desc:'ساخت فرم',color:'#f59e0b'},
    {id:'workflow',name:'Workflow Builder',icon:'🔀',desc:'ساخت گردش کار',color:'#8b5cf6'},
    {id:'kpi',name:'KPI Builder',icon:'📈',desc:'ساخت شاخص',color:'#ef4444'},
    {id:'chart',name:'Chart Builder',icon:'📉',desc:'ساخت نمودار',color:'#06b6d4'},
    {id:'module',name:'Module Builder',icon:'🧩',desc:'ساخت ماژول جدید',color:'#ec4899'},
  ];

  const builderFormFields: Record<string, FormField[]> = {
    page: [
      {name:'name',label:'نام صفحه',type:'text',required:true},
      {name:'layout',label:'چیدمان',type:'select',options:[{value:'grid-2',label:'۲ ستونه'},{value:'grid-3',label:'۳ ستونه'},{value:'grid-4',label:'۴ ستونه'},{value:'full',label:'تمام‌صفحه'}]},
    ],
    dashboard: [
      {name:'name',label:'نام داشبورد',type:'text',required:true},
      {name:'type',label:'نوع',type:'select',options:[{value:'operational',label:'عملیاتی'},{value:'executive',label:'اجرایی'},{value:'analytics',label:'تحلیلی'}]},
    ],
    form: [
      {name:'name',label:'نام فرم',type:'text',required:true},
      {name:'fields',label:'تعداد فیلد',type:'number'},
    ],
    workflow: [
      {name:'name',label:'نام گردش کار',type:'text',required:true},
      {name:'steps',label:'تعداد مرحله',type:'number'},
    ],
    kpi: [
      {name:'name',label:'نام شاخص',type:'text',required:true},
      {name:'target',label:'هدف',type:'number'},
      {name:'unit',label:'واحد',type:'text'},
    ],
    chart: [
      {name:'name',label:'نام نمودار',type:'text',required:true},
      {name:'chartType',label:'نوع نمودار',type:'select',options:[{value:'line',label:'خطی'},{value:'bar',label:'میله‌ای'},{value:'pie',label:'دایره‌ای'},{value:'area',label:'مساحت'}]},
    ],
    module: [
      {name:'name',label:'نام ماژول',type:'text',required:true},
      {name:'icon',label:'آیکون (اموجی)',type:'text'},
      {name:'color',label:'رنگ',type:'color'},
    ],
  };

  const activeBuilderName = activeBuilder ? builders.find(b => b.id === activeBuilder)?.name || activeBuilder : '';
  const builderLabel = activeBuilder ? `${activeBuilderName} جدید` : '';

  const filteredItems = activeBuilder ? items.filter(i => i.type === activeBuilder) : [];

  if (activeBuilder) {
    const builderCols: Column<typeof filteredItems[0]>[] = [
      {key:'name',title:'نام',render:(v)=><span className="text-white font-medium">{v}</span>},
      {key:'desc',title:'توضیحات'},
      {key:'createdAt',title:'تاریخ ایجاد'},
    ];
    return <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={()=>setActiveBuilder(null)} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-xl text-sm hover:bg-zinc-700">بازگشت</button>
        <h1 className="text-2xl font-bold text-white">{activeBuilderName}</h1>
      </div>
      <DataTable data={filteredItems} columns={builderCols} title={`${activeBuilderName} - لیست`} icon={<FileText size={18} className="text-blue-500" />}
        onAdd={()=>setShowModal(true)} addLabel={builderLabel} />
      <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setItems(p=>[...p,{id:uid(),...d,type:activeBuilder,createdAt:new Date().toLocaleDateString('fa-IR')}]);setShowModal(false)}}
        title={builderLabel} fields={builderFormFields[activeBuilder] || formComponents.map(c=>({name:c.type,label:c.name,type:'text'}))} />
    </div>;
  }

  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">سازنده بدون کد (No-Code Builder)</h1><p className="text-zinc-500">ساخت نرم‌افزار صنعتی بدون برنامه‌نویسی</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{builders.map(b=>(
      <div key={b.id} onClick={()=>setActiveBuilder(b.id)} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 text-center transition-all cursor-pointer group">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{b.icon}</div>
        <h3 className="text-white font-bold">{b.name}</h3><p className="text-zinc-500 text-xs mt-1">{b.desc}</p>
        <div className="mt-3 text-xs" style={{color:b.color}}>{items.filter(i=>i.type===b.id).length} ساخته شده</div>
      </div>
    ))}</div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-bold mb-4">ماژول‌های نمونه (بدون کدنویسی ساخته شوند)</h3>
      <div className="flex flex-wrap gap-1.5">{['مدیریت ناوگان','ردیابی خودرو','مدیریت انرژی','مدیریت قرارداد','مدیریت بازدیدکنندگان'].map(e=>{
        const count = items.filter(i=>i.name.includes(e)).length;
        return <div key={e} className={`px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${count>0?'bg-green-500/10 text-green-400 border border-green-500/20':'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`} onClick={()=>{setActiveBuilder('module');setItems(p=>[...p,{id:uid(),name:e,desc:'ساخته شده از نمونه',color:'#3b82f6',type:'module',createdAt:new Date().toLocaleDateString('fa-IR')}])}}>{e}{count>0&&` (${count})`}</div>;
      })}</div>
      <p className="text-zinc-600 text-xs mt-3">برای ساخت کلیک کنید</p>
    </div>
  </div>;
}

// ==========================================
// AI COPILOT
// ==========================================
export function AICopilotModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  if (currentPage === 'agents') return <AIAgentsPage />;
  if (currentPage === 'prompts') return <PromptsPage />;
  return <AICopilotDashboard />;
}

const AI_RESPONSES: Record<string, string> = {
  'عملکرد خط تولید': '📊 **تحلیل عملکرد خط تولید:**\n\n• OEE فعلی: ۸۵.۳٪ (هدف: ۹۰٪)\n• راندمان: ۸۷.۱٪ • کیفیت: ۹۸.۲٪ • در دسترس بودن: ۹۷.۵٪\n\n🔴 **هشدار:** خط ۳ با OEE ۶۷٪ نیاز به بررسی فوری دارد\n✅ خط ۱ بهترین عملکرد با OEE ۹۴٪\n\n💡 پیشنهاد: افزایش سرعت خط ۲ به ۱۲۰ واحد/ساعت',
  'شناسایی ضایعات': '♻️ **تحلیل ضایعات:**\n\n• ضایعات امروز: ۲۳۴ کیلوگرم (۱.۲٪ از تولید)\n• مقایسه با دیروز: ۱.۸٪ کاهش\n• بیشترین ضایعات: خط ۲ (۴۵٪ از کل)\n\n💰 هزینه ضایعات امروز: ۱۸.۷ میلیون ریال\n\n🎯 هدف ماهانه: زیر ۱٪ ضایعات\n📉 روند: کاهشی — عملکرد خوب',
  'پیش‌بینی تولید': '🔮 **پیش‌بینی تولید:**\n\n• پیش‌بینی پایان شیفت: ۱۲,۴۵۰ واحد\n• پیش‌بینی پایان روز: ۲۴,۸۰۰ واحد\n• احتمال رسیدن به هدف روزانه: ۸۷٪\n\n⚠️ ریسک: خط ۳ ممکن است ۲ ساعت توقف داشته باشد\n📅 پیش‌بینی فردا: ۲۳,۵۰۰ واحد (بر اساس روند)\n\n✅ اقدام: تأمین مواد اولیه خط ۱ و ۲',
  'برنامه تعمیرات': '🔧 **تحلیل نگهداری و تعمیرات:**\n\n• ۳ دستور کار باز امروز\n• ۱۲ تعمیرات پیشگیرانه برنامه‌ریزی شده این هفته\n• MTBF میانگین: ۲۴۰ ساعت\n• MTTR میانگین: ۱.۵ ساعت\n\n🔴 بحرانی: پمپ هیدرولیک خط ۳ — ۵۰ ساعت کارکرد تا خرابی پیش‌بینی شده\n✅ تیم نت: ۸ نفر در شیفت حاضر',
  'وضعیت انبار': '📦 **تحلیل موجودی انبار:**\n\n• ۱,۲۳۴ قلم کالا در انبار\n• ۱۵ قلم با موجودی بحرانی (کمتر از حداقل)\n• ۸ قلم نزدیک انقضا\n\n💰 ارزش کل موجودی: ۲۳۴ میلیارد ریال\n\n🔴 بحرانی: ورق فولادی ST-37 — ۲ روز باقی‌مانده\n✅ ۱۲ سفارش خرید در حال پیگیری',
  'عملکرد پرسنل': '👥 **تحلیل نیروی انسانی:**\n\n• ۲۳۴ پرسنل فعال امروز\n• ۱۲ نفر غایب (مرخصی: ۷، بیماری: ۳، مأموریت: ۲)\n• اضافه‌کاری امروز: ۴۵ ساعت\n\n📈 بهره‌وری پرسنل: ۸۹٪\n🎓 آموزش‌های امروز: ۳ دوره\n\n💡 پیشنهاد: برنامه‌ریزی شیفت‌های تعطیل',
  'کیفیت محصول': '✅ **تحلیل کیفیت:**\n\n• بازرسی امروز: ۲۴۵ نمونه\n• ۳ مورد عدم انطباق (۱.۲٪)\n• CPK میانگین: ۱.۳۵\n\n📊 توزیع عیوب:\n• ابعادی: ۴۵٪ • سطحی: ۳۰٪ • وزنی: ۱۵٪ • سایر: ۱۰٪\n\n🔴 ۱ مورد CAPA فعال برای خط ۲\n🎯 هدف کیفیت: ۹۹.۵٪',
  'عملکرد مالی': '💰 **تحلیل مالی:**\n\n• درآمد امروز: ۳.۲ میلیارد ریال\n• هزینه امروز: ۲.۱ میلیارد ریال\n• سود ناخالص: ۱.۱ میلیارد ریال\n\n📈 نسبت به دیروز: ۱۲٪ افزایش\n📉 نسبت به بودجه: ۸٪ کمتر از هدف\n\n💡 پیشنهاد: کاهش هزینه‌های سربار با بهینه‌سازی مصرف انرژی',
};

function AICopilotDashboard() {
  const [customInput, setCustomInput] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('OpenAI GPT-4');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{q:string;r:string}>>([]);
  const providers = [
    {name:'OpenAI GPT-4',icon:'🧠',active:true},{name:'Claude',icon:'🤖',active:true},
    {name:'Gemini',icon:'💎',active:true},{name:'DeepSeek',icon:'🔮',active:true},
    {name:'Azure OpenAI',icon:'☁️',active:false},{name:'Local LLM',icon:'🖥️',active:false},
  ];

  const analyze = (prompt: string) => {
    const q = prompt || customInput;
    if (!q.trim()) return;
    setSelectedPrompt(q);
    setCustomInput('');
    setLoading(true);
    setTimeout(() => {
      const found = Object.entries(AI_RESPONSES).find(([k]) => q.includes(k));
      const r = found ? found[1] : `🤖 **تحلیل AI ${selectedProvider}:**\n\nبر اساس تحلیل داده‌های موجود:\n\n📊 "${q}"\n\n• نتیجه اصلی: وضعیت فعلی نیاز به بررسی دارد\n• ۲ عامل کلیدی شناسایی شد\n• ۳ پیشنهاد بهبود قابل اجرا\n• ریسک‌های بالقوه: ۱ مورد\n\n💡 پیشنهاد: برای جزئیات بیشتر، داشبورد مربوطه را بررسی کنید.\n\n⏱ زمان تحلیل: ${(Math.random()*2+0.3).toFixed(1)} ثانیه`;
      setResponse(r);
      setHistory(prev => [{q, r}, ...prev].slice(0, 10));
      setLoading(false);
    }, 1200);
  };

  return <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-bold text-white">دستیار هوشمند (AI Copilot)</h1><p className="text-zinc-500">تحلیل داده‌ها، پیش‌بینی و توصیه‌های هوشمند</p></div>
    <StatGrid columns={4}>
      <StatCard title="ارائه‌دهندگان" value={`${providers.filter(p=>p.active).length}/${providers.length}`} icon={<Brain size={22} />} color="#d946ef" />
      <StatCard title="عامل‌های فعال" value={aiAgents.filter(a=>a.status==='active').length} icon={<Bot size={22} />} color="#10b981" />
      <StatCard title="تحلیل‌های امروز" value={history.length} icon={<Zap size={22} />} color="#3b82f6" />
      <StatCard title="ارائه‌دهنده فعلی" value={selectedProvider} icon={<Brain size={22} />} color="#f59e0b" />
    </StatGrid>

    {/* AI Providers */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-bold mb-4">انتخاب ارائه‌دهنده AI</h3>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">{providers.map(p=>(
        <div key={p.name} onClick={()=>p.active && setSelectedProvider(p.name)}
          className={`p-3 rounded-xl text-center cursor-pointer transition-all ${selectedProvider===p.name?'ring-2 ring-blue-500 bg-blue-500/10':p.active?'bg-zinc-800/50 hover:bg-zinc-800':'bg-zinc-800/30 opacity-50'}`}>
          <span className="text-2xl">{p.icon}</span>
          <p className={`text-xs mt-1 ${selectedProvider===p.name?'text-blue-400':p.active?'text-zinc-400':'text-zinc-600'}`}>{p.name}</p>
        </div>
      ))}</div>
    </div>

    {/* Smart Prompts */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-bold mb-4">تحلیل سریع (Smart Prompt)</h3>
      <div className="space-y-3">{aiPromptTemplates.map(cat=>(
        <div key={cat.category}><p className="text-zinc-500 text-xs mb-2">{cat.category}</p>
          <div className="flex flex-wrap gap-2">{cat.prompts.map(p=>(
            <button key={p} onClick={()=>analyze(p)} className={`px-3 py-1.5 rounded-xl text-sm transition-all ${selectedPrompt===p?'bg-blue-600 text-white':'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}>{p}</button>
          ))}</div>
        </div>
      ))}</div>
    </div>

    {/* Custom Input */}
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-bold mb-4">پرسش دلخواه</h3>
      <div className="flex gap-2">
        <input value={customInput} onChange={e=>setCustomInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&analyze('')} placeholder="سوال خود را بپرسید..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-blue-500" />
        <button onClick={()=>analyze('')} disabled={loading||!customInput.trim()} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center gap-2">
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> تحلیل...</> : '🔍 تحلیل'}
        </button>
      </div>
    </div>

    {/* Response */}
    {(loading || response) && (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        {loading ? (
          <div className="flex items-center gap-3 py-6 text-zinc-400">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span>در حال تحلیل با {selectedProvider}...</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-purple-500" />
              <span className="text-purple-400 text-sm font-bold">تحلیل {selectedProvider}</span>
              <span className="text-zinc-600 text-xs mr-auto">پرسش: {selectedPrompt}</span>
            </div>
            <div className="text-zinc-300 text-sm whitespace-pre-line leading-relaxed">{response}</div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
              <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs rounded-lg hover:bg-zinc-700">📋 کپی</button>
              <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs rounded-lg hover:bg-zinc-700">📥 خروجی</button>
              <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs rounded-lg hover:bg-zinc-700">🔄 تحلیل مجدد</button>
            </div>
          </div>
        )}
      </div>
    )}

    {/* History */}
    {history.length > 1 && (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">تاریخچه تحلیل‌ها</h3>
        <div className="space-y-2">{history.slice(1, 6).map((h,i)=>(
          <div key={i} onClick={()=>{setSelectedPrompt(h.q);setResponse(h.r)}} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 hover:bg-zinc-800 cursor-pointer transition-all">
            <Brain size={14} className="text-purple-500" />
            <span className="text-zinc-300 text-sm flex-1 truncate">{h.q}</span>
            <span className="text-zinc-600 text-xs">نمایش</span>
          </div>
        ))}</div>
      </div>
    )}
  </div>;
}

function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<typeof aiAgents[0] | null>(null);
  const [agentList, setAgentList] = useState(aiAgents);
  const [showModal, setShowModal] = useState(false);

  const formFields: FormField[] = [
    {name:'title',label:'نام عامل',type:'text',required:true},
    {name:'description',label:'توضیحات',type:'textarea'},
    {name:'accuracy',label:'دقت (%)',type:'number'},
    {name:'status',label:'وضعیت',type:'select',options:[{value:'active',label:'فعال'},{value:'beta',label:'آزمایشی'},{value:'inactive',label:'غیرفعال'}]},
  ];

  const toggleAgentStatus = (id: string) => {
    setAgentList(prev => prev.map(a => a.id === id ? {...a, status: a.status === 'active' ? 'inactive' as const : 'active' as const} : a));
  };

  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">عامل‌های هوشمند (AI Agents)</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-all"><Plus size={16} /> عامل جدید</button>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{agentList.map(agent=>(
      <div key={agent.id} onClick={()=>setSelectedAgent(agent)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all cursor-pointer group">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{agent.icon}</div>
        <h3 className="text-white font-bold">{agent.title}</h3>
        <p className="text-zinc-500 text-xs mt-1 mb-3 line-clamp-2">{agent.description}</p>
        <div className="space-y-1 mb-3">{agent.capabilities.slice(0,3).map(c=><div key={c} className="flex items-center gap-1.5 text-xs text-zinc-400"><span className="text-blue-500">•</span>{c}</div>)}</div>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button onClick={(e)=>{e.stopPropagation();toggleAgentStatus(agent.id)}} className={`text-xs px-2.5 py-1 rounded-full transition-all ${agent.status==='active'?'bg-green-500/10 text-green-500 hover:bg-green-500/20':'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20'}`}>
            {agent.status==='active'?'🟢 فعال':'⭕ غیرفعال'}
          </button>
          {agent.accuracy>0 && <span className="text-xs text-zinc-500">دقت: {agent.accuracy}%</span>}
        </div>
      </div>
    ))}</div>

    {selectedAgent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setSelectedAgent(null)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-slide-up" onClick={e=>e.stopPropagation()}>
          <div className="text-5xl mb-4">{selectedAgent.icon}</div>
          <h2 className="text-white text-xl font-bold mb-2">{selectedAgent.title}</h2>
          <p className="text-zinc-400 text-sm mb-4">{selectedAgent.description}</p>
          <div className="space-y-3 mb-4">
            <div><span className="text-zinc-500 text-xs">قابلیت‌ها</span>{selectedAgent.capabilities.map(c=><div key={c} className="text-zinc-300 text-sm flex items-center gap-2 mt-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{c}</div>)}</div>
            {selectedAgent.accuracy>0 && <div><span className="text-zinc-500 text-xs">دقت</span><p className="text-white text-sm">{selectedAgent.accuracy}%</p></div>}
            <div><span className="text-zinc-500 text-xs">وضعیت</span><p className={`text-sm ${selectedAgent.status==='active'?'text-green-500':'text-zinc-500'}`}>{selectedAgent.status==='active'?'فعال':selectedAgent.status==='beta'?'آزمایشی':'غیرفعال'}</p></div>
          </div>
          <button onClick={()=>toggleAgentStatus(selectedAgent.id)} className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${selectedAgent.status==='active'?'bg-red-600 hover:bg-red-700 text-white':'bg-green-600 hover:bg-green-700 text-white'}`}>
            {selectedAgent.status==='active'?'غیرفعال کردن':'فعال کردن'}
          </button>
        </div>
      </div>
    )}

    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setAgentList(p=>[...p,{id:uid('ai_'),...d,icon:'🤖',capabilities:['قابلیت جدید']}]);setShowModal(false)}} title="عامل AI جدید" fields={formFields} />
  </div>;
}

function PromptsPage() {
  const navigate = useAppStore((s) => s.setCurrentPage);
  return <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">قالب‌های تحلیل</h1>
      <button onClick={()=>navigate('dashboard')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-all">رفتن به تحلیل</button>
    </div>
    <div className="space-y-4">{aiPromptTemplates.map(cat=>(
      <div key={cat.category} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-3">{cat.category}</h3>
        <div className="grid grid-cols-2 gap-2">{cat.prompts.map(p=>(
          <button key={p} onClick={()=>navigate('dashboard')} className="text-right bg-zinc-800/50 hover:bg-zinc-800 rounded-xl p-3 text-sm text-zinc-300 transition-all">🧠 {p}</button>
        ))}</div>
      </div>
    ))}</div>
  </div>;
}
