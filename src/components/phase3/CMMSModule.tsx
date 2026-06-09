import { useState } from 'react';
import { uid } from '@/services/dataService';
import { Cpu, ClipboardList, Calendar, Activity, TriangleAlert, Clock, TrendingDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { assets, workOrders, pmSchedules, phase3Charts } from '@/data/phase3Data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Asset, WorkOrder, PMSchedule } from '@/types/phase3';

const woStatusColors: Record<string,string> = {open:'bg-blue-500/10 text-blue-500',assigned:'bg-indigo-500/10 text-indigo-500',in_progress:'bg-amber-500/10 text-amber-500',pending_parts:'bg-purple-500/10 text-purple-500',completed:'bg-green-500/10 text-green-500',cancelled:'bg-red-500/10 text-red-500'};
const woStatusLabels: Record<string,string> = {open:'باز',assigned:'تخصیص',in_progress:'در حال انجام',pending_parts:'انتظار قطعات',completed:'تکمیل',cancelled:'لغو'};
const woPriorityColors: Record<string,string> = {critical:'bg-red-500/10 text-red-500',high:'bg-orange-500/10 text-orange-500',medium:'bg-amber-500/10 text-amber-500',low:'bg-blue-500/10 text-blue-500'};
const typeLabels: Record<string,string> = {preventive:'پیشگیرانه',corrective:'اصلاحی',predictive:'پیش‌بینانه',emergency:'اضطراری',inspection:'بازرسی',calibration:'کالیبراسیون'};

export function CMMSModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'assets': return <AssetsPage />;
    case 'workorders': return <WorkOrdersPage />;
    case 'pm': return <PMPage />;
    case 'kpis': return <CMMSKPIs />;
    default: return <CMMSDashboard />;
  }
}

function CMMSDashboard() {
  const openWOs = workOrders.filter(w=>w.status!=='completed'&&w.status!=='cancelled').length;
  const criticalWOs = workOrders.filter(w=>w.priority==='critical').length;
  const stoppedAssets = assets.filter(a=>a.status==='stopped').length;
  const avgHealth = Math.round(assets.reduce((s,a)=>s+a.healthScore,0)/assets.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">نگهداری و تعمیرات (CMMS)</h1><p className="text-zinc-500">مدیریت دارایی‌ها، نت پیشگیرانه و اصلاحی</p></div>
      <StatGrid columns={4}>
        <StatCard title="دستور کار باز" value={openWOs} icon={<ClipboardList size={22} />} color="#3b82f6" />
        <StatCard title="WO بحرانی" value={criticalWOs} icon={<TriangleAlert size={22} />} color="#ef4444" />
        <StatCard title="تجهیز خاموش" value={stoppedAssets} icon={<Cpu size={22} />} color="#f97316" />
        <StatCard title="سلامت میانگین" value={`${avgHealth}%`} icon={<Activity size={22} />} color="#10b981" />
      </StatGrid>

      {/* Assets Health Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {assets.map(asset => {
          const healthColor = asset.healthScore > 80 ? '#10b981' : asset.healthScore > 50 ? '#f59e0b' : '#ef4444';
          return (
            <div key={asset.id} className={`bg-zinc-900 border rounded-2xl p-4 ${asset.status==='stopped'?'border-red-500/30':'border-zinc-800'}`}>
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-white font-bold text-sm">{asset.name}</p><p className="text-zinc-500 text-xs">{asset.lineName || asset.departmentName}</p></div>
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90"><circle cx="18" cy="18" r="14" fill="none" stroke="#27272a" strokeWidth="3" /><circle cx="18" cy="18" r="14" fill="none" stroke={healthColor} strokeWidth="3" strokeDasharray={`${asset.healthScore} ${100-asset.healthScore}`} strokeLinecap="round" /></svg>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-white text-xs font-bold">{asset.healthScore}%</span></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div><p className="text-zinc-500">MTBF</p><p className="text-white">{asset.mtbf}h</p></div>
                <div><p className="text-zinc-500">MTTR</p><p className="text-white">{asset.mttr}h</p></div>
                <div><p className="text-zinc-500">هزینه نت</p><p className="text-white">{(asset.maintenanceCost/1000000).toFixed(0)}M</p></div>
              </div>
              {asset.nextPM && <p className="text-zinc-500 text-[10px] mt-2 pt-2 border-t border-zinc-800">نت بعدی: {asset.nextPM}</p>}
            </div>
          );
        })}
      </div>

      {/* Maintenance Cost Trend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">روند هزینه نگهداری (میلیون ریال)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={phase3Charts.maintenanceCostTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" /><XAxis dataKey="month" tick={{fill:'#71717a',fontSize:11}} /><YAxis tick={{fill:'#71717a',fontSize:11}} />
            <Tooltip contentStyle={{backgroundColor:'#18181b',border:'1px solid #27272a',borderRadius:'12px',fontSize:'12px'}} /><Legend />
            <Bar dataKey="pm" fill="#3b82f6" name="پیشگیرانه" radius={[4,4,0,0]} /><Bar dataKey="cm" fill="#ef4444" name="اصلاحی" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AssetsPage() {
  const [showModal, setShowModal] = useState(false);
  const [localAssets, setLocalAssets] = useState(assets);
  const columns: Column<Asset>[] = [
    {key:'code',title:'کد',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'name',title:'نام تجهیز',render:(v,row)=>(<div><p className="text-white">{v}</p><p className="text-zinc-500 text-xs">{row.manufacturer} {row.model}</p></div>)},
    {key:'category',title:'دسته'},{key:'lineName',title:'خط/مکان',render:(v,row)=>v||row.departmentName},
    {key:'criticality',title:'بحرانیت',render:(v)=><span className={`px-2 py-0.5 rounded text-xs ${woPriorityColors[v]}`}>{v==='critical'?'بحرانی':v==='high'?'بالا':v==='medium'?'متوسط':'پایین'}</span>},
    {key:'healthScore',title:'سلامت',render:(v)=>{const c=v>80?'bg-green-500':v>50?'bg-amber-500':'bg-red-500';return <div className="flex items-center gap-2"><div className="w-14 bg-zinc-700 rounded-full h-1.5"><div className={`${c} h-1.5 rounded-full`} style={{width:`${v}%`}} /></div><span className="text-xs">{v}%</span></div>}},
    {key:'status',title:'وضعیت',render:(v)=>{const c:Record<string,string>={running:'bg-green-500/10 text-green-500',stopped:'bg-red-500/10 text-red-500',maintenance:'bg-amber-500/10 text-amber-500'};const l:Record<string,string>={running:'در حال کار',stopped:'متوقف',maintenance:'نت',decommissioned:'از رده خارج'};return <span className={`px-2 py-0.5 rounded-lg text-xs ${c[v]||'bg-zinc-500/10 text-zinc-400'}`}>{l[v]||v}</span>}},
    {key:'nextPM',title:'نت بعدی'},
  ];
  const formFields: FormField[] = [
    {name:'name',label:'نام تجهیز',type:'text',required:true},{name:'code',label:'کد تجهیز',type:'text',required:true},
    {name:'category',label:'دسته',type:'text'},{name:'manufacturer',label:'سازنده',type:'text'},
    {name:'model',label:'مدل',type:'text'},{name:'serialNumber',label:'سریال نامبر',type:'text'},
    {name:'criticality',label:'بحرانیت',type:'select',options:[{value:'critical',label:'بحرانی'},{value:'high',label:'بالا'},{value:'medium',label:'متوسط'},{value:'low',label:'پایین'}]},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={localAssets} columns={columns} title="ثبت دارایی‌ها" icon={<Cpu size={18} className="text-blue-500" />} onAdd={()=>setShowModal(true)} addLabel="تجهیز جدید" selectable />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalAssets(prev=>[...prev,{id:uid(),...d,departmentId:'',departmentName:'',lineName:'',status:'running',healthScore:100,mtbf:0,mttr:0,totalDowntime:0,maintenanceCost:0,installDate:''}]);setShowModal(false)}} title="تجهیز جدید" fields={formFields} size="lg" /></div>;
}

function WorkOrdersPage() {
  const [showModal, setShowModal] = useState(false);
  const [localWOs, setLocalWOs] = useState(workOrders);
  const columns: Column<WorkOrder>[] = [
    {key:'woNumber',title:'شماره WO',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'title',title:'عنوان'},{key:'assetName',title:'تجهیز'},
    {key:'type',title:'نوع',render:(v)=><span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{typeLabels[v]||v}</span>},
    {key:'priority',title:'اولویت',render:(v)=><span className={`px-2 py-0.5 rounded text-xs ${woPriorityColors[v]}`}>{v==='critical'?'بحرانی':v==='high'?'بالا':v==='medium'?'متوسط':'پایین'}</span>},
    {key:'technicianName',title:'تکنسین',render:(v)=>v||'-'},
    {key:'totalCost',title:'هزینه',render:(v)=>`${((v as number)/1000000).toFixed(1)}M`},
    {key:'status',title:'وضعیت',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs ${woStatusColors[v]}`}>{woStatusLabels[v]}</span>},
    {key:'plannedDate',title:'موعد'},
  ];
  const formFields: FormField[] = [
    {name:'title',label:'عنوان',type:'text',required:true},{name:'assetId',label:'شناسه تجهیز',type:'text'},
    {name:'description',label:'توضیحات',type:'textarea',colSpan:2},{name:'assignedTeam',label:'تیم',type:'text'},
    {name:'type',label:'نوع',type:'select',options:[{value:'preventive',label:'پیشگیرانه'},{value:'corrective',label:'اصلاحی'},{value:'predictive',label:'پیش‌بینانه'},{value:'emergency',label:'اضطراری'},{value:'inspection',label:'بازرسی'},{value:'calibration',label:'کالیبراسیون'}]},
    {name:'priority',label:'اولویت',type:'select',options:[{value:'critical',label:'بحرانی'},{value:'high',label:'بالا'},{value:'medium',label:'متوسط'},{value:'low',label:'پایین'}]},
    {name:'plannedDate',label:'موعد برنامه',type:'text'},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={localWOs} columns={columns} title="دستور کارها" icon={<ClipboardList size={18} className="text-green-500" />} onAdd={()=>setShowModal(true)} addLabel="دستور کار جدید" selectable />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalWOs(prev=>[...prev,{id:uid(),woNumber:`WO-${uid()}`,assetName:'',technicianName:'',estimatedHours:0,laborCost:0,partsCost:0,totalCost:0,status:'open',...d}]);setShowModal(false)}} title="دستور کار جدید" fields={formFields} size="lg" /></div>;
}

function PMPage() {
  const columns: Column<PMSchedule>[] = [
    {key:'assetName',title:'تجهیز'},{key:'frequency',title:'فرکانس'},
    {key:'estimatedTime',title:'زمان تخمینی',render:(v)=>`${v} ساعت`},
    {key:'assignedTeam',title:'تیم'},{key:'lastExecuted',title:'آخرین اجرا',render:(v)=>v||'-'},
    {key:'nextDue',title:'موعد بعدی',render:(v,row)=><span className={row.status==='overdue'?'text-red-400 font-bold':'text-white'}>{v}</span>},
    {key:'status',title:'وضعیت',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs ${v==='active'?'bg-green-500/10 text-green-500':v==='overdue'?'bg-red-500/10 text-red-500':'bg-zinc-500/10 text-zinc-400'}`}>{v==='active'?'فعال':v==='overdue'?'معوق':'غیرفعال'}</span>},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={pmSchedules} columns={columns} title="برنامه نت پیشگیرانه (PM)" icon={<Calendar size={18} className="text-blue-500" />} onAdd={()=>{}} addLabel="PM جدید" /></div>;
}

function CMMSKPIs() {
  return (<div className="space-y-6 animate-fade-in"><h1 className="text-xl font-bold text-white">شاخص‌های نگهداری</h1>
    <StatGrid columns={3}>
      <StatCard title="MTBF میانگین" value={`${Math.round(assets.reduce((s,a)=>s+a.mtbf,0)/assets.length)}`} unit="ساعت" icon={<Activity size={22} />} color="#3b82f6" />
      <StatCard title="MTTR میانگین" value={`${(assets.reduce((s,a)=>s+a.mttr,0)/assets.length).toFixed(1)}`} unit="ساعت" icon={<Clock size={22} />} color="#ef4444" />
      <StatCard title="هزینه کل نت" value={`${(assets.reduce((s,a)=>s+a.maintenanceCost,0)/1000000000).toFixed(1)}B`} unit="ریال" icon={<TrendingDown size={22} />} color="#f59e0b" />
    </StatGrid>
  </div>);
}
