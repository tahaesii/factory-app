import { useState } from 'react';
import { FlaskConical, ClipboardList, CheckCircle2, XCircle, BarChart3, FileText, Plus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import { samples, spcData } from '@/data/phase3Data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Sample } from '@/types/phase3';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { uid } from '@/services/dataService';

const sourceLabels: Record<string,string> = {raw_material:'مواد اولیه',production:'تولید',finished:'محصول نهایی',warehouse:'انبار',supplier:'تأمین‌کننده',customer:'مشتری'};
const statusColors: Record<string,string> = {pass:'bg-green-500/10 text-green-500',fail:'bg-red-500/10 text-red-500',pending:'bg-zinc-500/10 text-zinc-400',in_progress:'bg-blue-500/10 text-blue-500',registered:'bg-indigo-500/10 text-indigo-500',completed:'bg-green-500/10 text-green-500',approved:'bg-green-500/10 text-green-500',rejected:'bg-red-500/10 text-red-500'};
const statusLabels: Record<string,string> = {pass:'تأیید',fail:'رد',pending:'در انتظار',in_progress:'در حال آزمایش',registered:'ثبت شده',completed:'تکمیل',approved:'تأیید شده',rejected:'رد شده'};

export function LIMSModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'samples': return <SamplesPage />;
    case 'spc': return <SPCPage />;
    case 'coa': return <COAPage />;
    default: return <LIMSDashboard />;
  }
}

function LIMSDashboard() {
  const passRate = samples.filter(s=>s.overallResult==='pass').length;
  const totalTests = samples.reduce((s,sm)=>s+sm.tests.length,0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">مدیریت آزمایشگاه (LIMS)</h1><p className="text-zinc-500">مدیریت نمونه‌ها، آزمون‌ها، SPC و صدور COA</p></div>
      <StatGrid columns={4}>
        <StatCard title="نمونه‌های ثبت شده" value={samples.length} icon={<FlaskConical size={22} />} color="#8b5cf6" />
        <StatCard title="آزمون‌های انجام شده" value={totalTests} icon={<ClipboardList size={22} />} color="#3b82f6" />
        <StatCard title="نرخ تأیید" value={`${passRate}/${samples.length}`} icon={<CheckCircle2 size={22} />} color="#10b981" />
        <StatCard title="COA صادر شده" value={samples.filter(s=>s.coaGenerated).length} icon={<FileText size={22} />} color="#f59e0b" />
      </StatGrid>

      {/* Samples */}
      <div className="space-y-4">
        {samples.map(sample => (
          <div key={sample.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2"><span className="font-mono text-blue-400">{sample.sampleNumber}</span><span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{sourceLabels[sample.source]}</span></div>
                <h3 className="text-white font-bold">{sample.productName}</h3>
                <p className="text-zinc-500 text-xs">بچ: {sample.batchNumber} • {sample.collectionDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[sample.overallResult]}`}>{statusLabels[sample.overallResult]}</span>
                {sample.coaGenerated && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">COA ✓</span>}
              </div>
            </div>

            {/* Tests */}
            <table className="w-full text-sm">
              <thead><tr className="border-b border-zinc-800">
                {['آزمون','روش','واحد','مشخصه','نتیجه','وضعیت'].map(h=><th key={h} className="text-right text-xs text-zinc-500 px-2 py-2">{h}</th>)}
              </tr></thead>
              <tbody>{sample.tests.map(test => (
                <tr key={test.id} className="border-b border-zinc-800/50">
                  <td className="px-2 py-2 text-white">{test.testName}</td>
                  <td className="px-2 py-2 text-zinc-400">{test.method}</td>
                  <td className="px-2 py-2 text-zinc-400">{test.unit}</td>
                  <td className="px-2 py-2 text-zinc-400">{test.specification.min !== undefined ? `${test.specification.min}-${test.specification.max}` : '-'}</td>
                  <td className="px-2 py-2">
                    {test.result !== undefined ? (
                      <span className={`font-bold ${test.pass ? 'text-green-400' : test.pass === false ? 'text-red-400' : 'text-white'}`}>{String(test.result)} {test.unit}</span>
                    ) : <span className="text-zinc-500">-</span>}
                  </td>
                  <td className="px-2 py-2"><span className={`px-2 py-0.5 rounded text-[10px] ${statusColors[test.status]}`}>{statusLabels[test.status]}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

function SamplesPage() {
  const [localData, setLocalData] = useState(samples);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'sampleNumber',label:'شماره نمونه',type:'text',required:true},
    {name:'batchNumber',label:'بچ',type:'text',required:true},
    {name:'productName',label:'محصول/ماده',type:'text',required:true},
    {name:'source',label:'منبع',type:'select',required:true,options:[{value:'raw_material',label:'مواد اولیه'},{value:'production',label:'تولید'},{value:'finished',label:'محصول نهایی'},{value:'warehouse',label:'انبار'},{value:'supplier',label:'تأمین‌کننده'},{value:'customer',label:'مشتری'}]},
    {name:'collectorName',label:'نمونه‌بردار',type:'text',required:true},
    {name:'collectionDate',label:'تاریخ نمونه‌برداری',type:'date',required:true},
  ];
  const columns: Column<Sample>[] = [
    {key:'sampleNumber',title:'شماره نمونه',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'productName',title:'محصول/ماده'},{key:'batchNumber',title:'بچ'},
    {key:'source',title:'منبع',render:(v)=><span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{sourceLabels[v]}</span>},
    {key:'collectorName',title:'نمونه‌بردار'},
    {key:'tests',title:'آزمون‌ها',render:(_,row)=>{const done=row.tests.filter(t=>t.status==='completed').length;return `${done}/${row.tests.length}`}},
    {key:'overallResult',title:'نتیجه',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs ${statusColors[v]}`}>{statusLabels[v]}</span>},
    {key:'coaGenerated',title:'COA',render:(v)=>v?<CheckCircle2 size={14} className="text-green-500" />:<span className="text-zinc-500">-</span>},
    {key:'collectionDate',title:'تاریخ'},
  ];
  return <div className="space-y-6 animate-fade-in">
    <DataTable data={localData} columns={columns} title="نمونه‌ها" icon={<FlaskConical size={18} className="text-purple-500" />} onAdd={()=>setShowModal(true)} addLabel="ثبت نمونه" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d,collectorId:'',tests:[],overallResult:'pending',coaGenerated:false,coaNumber:'',status:'registered'}]);setShowModal(false)}} title="ثبت نمونه" fields={formFields} size="lg" />
  </div>;
}

function SPCPage() {
  const [localData, setLocalData] = useState(spcData);
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'sample',label:'شماره نمونه',type:'number',required:true},
    {name:'value',label:'مقدار',type:'number',required:true},
    {name:'ucl',label:'UCL',type:'number',required:true},
    {name:'lcl',label:'LCL',type:'number',required:true},
    {name:'cl',label:'CL',type:'number',required:true},
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">کنترل فرآیند آماری (SPC)</h1><p className="text-zinc-500">نمودار X-Bar — پارامتر: ابعاد طول قطعه A45</p></div>
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> داده جدید</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Cp" value="۱.۶۵" icon={<BarChart3 size={22} />} color="#10b981" />
        <StatCard title="Cpk" value="۱.۴۵" icon={<BarChart3 size={22} />} color="#3b82f6" />
        <StatCard title="خارج از کنترل" value={localData.filter(d=>d.value>d.ucl||d.value<d.lcl).length} unit="نقطه" icon={<XCircle size={22} />} color="#ef4444" />
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">نمودار X-Bar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={localData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="sample" tick={{fill:'#71717a',fontSize:11}} label={{value:'نمونه',fill:'#71717a',fontSize:11}} />
            <YAxis tick={{fill:'#71717a',fontSize:11}} domain={[99,101]} />
            <Tooltip contentStyle={{backgroundColor:'#18181b',border:'1px solid #27272a',borderRadius:'12px',fontSize:'12px'}} />
            <ReferenceLine y={100.5} stroke="#ef4444" strokeDasharray="5 5" label={{value:'UCL',fill:'#ef4444',fontSize:10}} />
            <ReferenceLine y={99.5} stroke="#ef4444" strokeDasharray="5 5" label={{value:'LCL',fill:'#ef4444',fontSize:10}} />
            <ReferenceLine y={100.0} stroke="#10b981" strokeDasharray="3 3" label={{value:'CL',fill:'#10b981',fontSize:10}} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={(props: any)=>{const{cx,cy,value}=props;const ooc=value>100.5||value<99.5;return <circle cx={cx} cy={cy} r={ooc?6:4} fill={ooc?'#ef4444':'#3b82f6'} stroke={ooc?'#ef4444':'#3b82f6'} />}} name="مقدار" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-zinc-500 text-xs mt-2">⚠️ نمونه ۱۲ خارج از حد کنترل بالا (UCL) — نیاز به بررسی علت</p>
      </div>
      <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{...d,sample:Number(d.sample),value:Number(d.value),ucl:Number(d.ucl),lcl:Number(d.lcl),cl:Number(d.cl)}]);setShowModal(false)}} title="داده SPC جدید" fields={formFields} />
    </div>
  );
}

function COAPage() {
  const [localData, setLocalData] = useState(samples.filter(s=>s.coaGenerated));
  const [showModal, setShowModal] = useState(false);
  const formFields: FormField[] = [
    {name:'coaNumber',label:'شماره COA',type:'text',required:true},
    {name:'sampleNumber',label:'شماره نمونه',type:'text',required:true},
    {name:'productName',label:'محصول/ماده',type:'text',required:true},
    {name:'status',label:'وضعیت',type:'select',required:true,options:[{value:'registered',label:'ثبت شده'},{value:'pending',label:'در انتظار'},{value:'completed',label:'تکمیل'},{value:'approved',label:'تأیید شده'},{value:'rejected',label:'رد شده'}]},
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-white">گواهینامه تحلیل (COA)</h1>
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"><Plus size={16} /> COA جدید</button>
      </div>
      <div className="space-y-3">
        {localData.map((item: any) => (
          <div key={item.id} className="bg-zinc-900 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-white font-medium">{item.productName}{item.batchNumber?` — بچ ${item.batchNumber}`:''}</p>
              <p className="text-zinc-500 text-xs">COA: {item.coaNumber} • {item.collectionDate || item.sampleNumber}</p></div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg">دانلود PDF</button>
            </div>
          </div>
        ))}
      </div>
      <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalData(prev=>[...prev,{id:uid(),...d}]);setShowModal(false)}} title="COA جدید" fields={formFields} />
    </div>
  );
}
