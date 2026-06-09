import { useState } from 'react';
import { Shield, ClipboardList, TriangleAlert, CheckCircle2, XCircle, BarChart3, Activity, Plus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import { inspections, ncrs, capas, phase3Charts } from '@/data/phase3Data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Inspection, NCR } from '@/types/phase3';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { uid } from '@/services/dataService';

const resultColors: Record<string,string> = {pass:'bg-green-500/10 text-green-500',fail:'bg-red-500/10 text-red-500',conditional:'bg-amber-500/10 text-amber-500',pending:'bg-zinc-500/10 text-zinc-400'};
const resultLabels: Record<string,string> = {pass:'تأیید',fail:'رد',conditional:'مشروط',pending:'در انتظار'};

export function QMSModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'inspections': return <InspectionsPage />;
    case 'ncr': return <NCRPage />;
    case 'capa': return <CAPAPage />;
    case 'analytics': return <QMSAnalytics />;
    default: return <QMSDashboard />;
  }
}

function QMSDashboard() {
  const passRate = inspections.filter(i=>i.result==='pass').length/inspections.length*100;
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">مدیریت کیفیت (QMS)</h1><p className="text-zinc-500">کنترل کیفیت کل زنجیره تولید — ورودی، حین تولید، نهایی</p></div>
      <StatGrid columns={4}>
        <StatCard title="نرخ تأیید" value={`${passRate.toFixed(0)}%`} icon={<CheckCircle2 size={22} />} color="#10b981" />
        <StatCard title="NCR باز" value={ncrs.filter(n=>n.status!=='closed').length} icon={<TriangleAlert size={22} />} color="#ef4444" />
        <StatCard title="CAPA فعال" value={capas.filter(c=>c.status!=='closed').length} icon={<Activity size={22} />} color="#f59e0b" />
        <StatCard title="PPM" value="۱۸۰۰" icon={<BarChart3 size={22} />} color="#8b5cf6" />
      </StatGrid>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">روند نرخ عیب و ضایعات</h3>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={phase3Charts.qualityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="week" tick={{fill:'#71717a',fontSize:11}} /><YAxis tick={{fill:'#71717a',fontSize:11}} domain={[0,3]} />
            <Tooltip contentStyle={{backgroundColor:'#18181b',border:'1px solid #27272a',borderRadius:'12px',fontSize:'12px'}} />
            <Line type="monotone" dataKey="defect" stroke="#ef4444" strokeWidth={2} name="نرخ عیب (%)" dot={{r:4}} />
            <Line type="monotone" dataKey="scrap" stroke="#f59e0b" strokeWidth={2} name="نرخ ضایعات (%)" dot={{r:4}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function InspectionsPage() {
  const [localData, setLocalData] = useState(inspections);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'inspectionNumber',label:'شماره بازرسی',type:'text',required:true},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'incoming',label:'ورودی'},{value:'in_process',label:'حین تولید'},{value:'final',label:'نهایی'},{value:'supplier',label:'تأمین‌کننده'}]},
    {name:'entityName',label:'محصول/ماده',type:'text',required:true},
    {name:'inspectorName',label:'بازرس',type:'text',required:true},
    {name:'result',label:'نتیجه',type:'select',required:true,options:[{value:'pass',label:'تأیید'},{value:'fail',label:'رد'},{value:'conditional',label:'مشروط'},{value:'pending',label:'در انتظار'}]},
    {name:'inspectionDate',label:'تاریخ',type:'date',required:true},
  ];
  const columns: Column<Inspection>[] = [
    {key:'inspectionNumber',title:'شماره',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'type',title:'نوع',render:(v)=>{const l:Record<string,string>={incoming:'ورودی',in_process:'حین تولید',final:'نهایی',supplier:'تأمین‌کننده'};return <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{l[v]}</span>}},
    {key:'entityName',title:'محصول/ماده'},{key:'batchNumber',title:'بچ'},{key:'inspectorName',title:'بازرس'},
    {key:'totalChecks',title:'بازرسی',render:(_,row)=>`${row.passedChecks}/${row.totalChecks}`},
    {key:'result',title:'نتیجه',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${resultColors[v]}`}>{resultLabels[v]}</span>},
    {key:'inspectionDate',title:'تاریخ'},
  ];
  return <div className="space-y-6 animate-fade-in">
    <DataTable data={localData} columns={columns} title="بازرسی‌ها" icon={<ClipboardList size={18} className="text-green-500" />} onAdd={()=>setShowModal(true)} addLabel="بازرسی جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,entityType:'',entityId:'',batchNumber:'',inspectorId:'',parameters:[],totalChecks:0,passedChecks:0,failedChecks:0,photos:[],notes:''}]);setShowModal(false)}} title="بازرسی جدید" fields={formFields} />
  </div>;
}

function NCRPage() {
  const [localData, setLocalData] = useState(ncrs);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'ncrNumber',label:'شماره NCR',type:'text',required:true},
    {name:'productName',label:'محصول',type:'text',required:true},
    {name:'batchNumber',label:'بچ',type:'text',required:true},
    {name:'defectType',label:'نوع عیب',type:'text',required:true},
    {name:'severity',label:'شدت',type:'select',required:true,options:[{value:'minor',label:'جزئی'},{value:'major',label:'عمده'},{value:'critical',label:'بحرانی'}]},
    {name:'qty',label:'تعداد',type:'number',required:true},
    {name:'description',label:'شرح',type:'textarea',required:true,colSpan:2},
    {name:'reportedBy',label:'گزارش‌دهنده',type:'text',required:true},
    {name:'disposition',label:'اقدام',type:'select',required:true,options:[{value:'rework',label:'دوباره‌کاری'},{value:'scrap',label:'ضایعات'},{value:'use_as_is',label:'استفاده'},{value:'return',label:'مرجوع'},{value:'pending',label:'در انتظار'}]},
  ];
  const columns: Column<NCR>[] = [
    {key:'ncrNumber',title:'شماره NCR',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'productName',title:'محصول'},{key:'batchNumber',title:'بچ'},{key:'defectType',title:'نوع عیب'},
    {key:'severity',title:'شدت',render:(v)=>{const c:Record<string,string>={minor:'bg-amber-500/10 text-amber-500',major:'bg-orange-500/10 text-orange-500',critical:'bg-red-500/10 text-red-500'};return <span className={`px-2 py-0.5 rounded text-xs ${c[v]}`}>{v==='minor'?'جزئی':v==='major'?'عمده':'بحرانی'}</span>}},
    {key:'qty',title:'تعداد'},{key:'disposition',title:'اقدام',render:(v)=>{const l:Record<string,string>={rework:'دوباره‌کاری',scrap:'ضایعات',use_as_is:'استفاده',return:'مرجوع',pending:'در انتظار'};return l[v]||v}},
    {key:'cost',title:'هزینه',render:(v)=>`${((v as number)/1000000).toFixed(1)}M`},
    {key:'status',title:'وضعیت',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs ${v==='open'?'bg-red-500/10 text-red-500':v==='investigating'?'bg-amber-500/10 text-amber-500':'bg-green-500/10 text-green-500'}`}>{v==='open'?'باز':v==='investigating'?'بررسی':'بسته'}</span>},
  ];
  return <div className="space-y-6 animate-fade-in">
    <DataTable data={localData} columns={columns} title="عدم انطباق (NCR)" icon={<XCircle size={18} className="text-red-500" />} onAdd={()=>setShowModal(true)} addLabel="NCR جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,photos:[],reportedDate:new Date().toLocaleDateString('fa-IR'),capaId:'',cost:0,status:'open'}]);setShowModal(false)}} title="NCR جدید" fields={formFields} size="lg" />
  </div>;
}

function CAPAPage() {
  const [localData, setLocalData] = useState(capas);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'capaNumber',label:'شماره CAPA',type:'text',required:true},
    {name:'type',label:'نوع',type:'select',required:true,options:[{value:'corrective',label:'اصلاحی'},{value:'preventive',label:'پیشگیرانه'}]},
    {name:'issueDescription',label:'شرح مشکل',type:'textarea',required:true,colSpan:2},
    {name:'rootCause',label:'علت ریشه‌ای',type:'textarea',required:true,colSpan:2},
    {name:'sourceType',label:'منبع',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'open',label:'باز'},{value:'in_progress',label:'در حال انجام'},{value:'verification',label:'تأیید'},{value:'closed',label:'بسته'}]},
  ];
  return (<div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">اقدام اصلاحی/پیشگیرانه (CAPA)</h1>
      <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> CAPA جدید</button>
    </div>
    {localData.map(capa=>(
      <div key={capa.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex justify-between mb-3"><div><span className="font-mono text-blue-400 text-xs">{capa.capaNumber}</span><span className={`text-xs mx-2 px-2 py-0.5 rounded ${capa.type==='corrective'?'bg-amber-500/10 text-amber-500':'bg-blue-500/10 text-blue-500'}`}>{capa.type==='corrective'?'اصلاحی':'پیشگیرانه'}</span></div><span className={`px-2 py-0.5 rounded-lg text-xs ${capa.status==='in_progress'?'bg-amber-500/10 text-amber-500':capa.status==='closed'?'bg-green-500/10 text-green-500':'bg-blue-500/10 text-blue-500'}`}>{capa.status==='in_progress'?'در حال انجام':capa.status==='closed'?'بسته':'باز'}</span></div>
        <p className="text-white font-medium mb-1">{capa.issueDescription}</p>
        <p className="text-zinc-500 text-sm mb-4">علت ریشه‌ای: {capa.rootCause}</p>
        <div className="space-y-2">{capa.actions.map((act,i)=>(
          <div key={i} className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3 text-sm">
            {act.status==='completed'?<CheckCircle2 size={16} className="text-green-500"/>:act.status==='in_progress'?<Activity size={16} className="text-amber-500"/>:<div className="w-4 h-4 border border-zinc-600 rounded-full"/>}
            <span className={`flex-1 ${act.status==='completed'?'text-zinc-400 line-through':'text-white'}`}>{act.description}</span>
            <span className="text-zinc-500 text-xs">{act.owner}</span><span className="text-zinc-600 text-xs">{act.dueDate}</span>
          </div>
        ))}</div>
      </div>
    ))}
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,ncrId:'',actions:[],effectiveness:'',verifiedBy:'',verifiedDate:'',createdDate:new Date().toLocaleDateString('fa-IR')}]);setShowModal(false)}} title="CAPA جدید" fields={formFields} size="lg" />
  </div>);
}

function QMSAnalytics() {
  return (<div className="space-y-6 animate-fade-in"><h1 className="text-xl font-bold text-white">تحلیل کیفیت</h1>
    <StatGrid columns={4}>
      <StatCard title="PPM" value="۱,۸۰۰" icon={<BarChart3 size={22} />} color="#ef4444" />
      <StatCard title="نرخ عیب" value="۱.۸%" icon={<TriangleAlert size={22} />} color="#f59e0b" />
      <StatCard title="نرخ ضایعات" value="۰.۹%" icon={<XCircle size={22} />} color="#ef4444" />
      <StatCard title="Audit Score" value="۹۲%" icon={<Shield size={22} />} color="#10b981" />
    </StatGrid>
  </div>);
}
