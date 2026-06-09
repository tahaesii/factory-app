import { useState } from 'react';
import { uid } from '@/services/dataService';
import { ShoppingCart, Users, FileText, Star, Clock } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { suppliers, purchaseRequests, purchaseOrders, phase3Charts } from '@/data/phase3Data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Supplier, PurchaseRequest, PurchaseOrder } from '@/types/phase3';

export function SRMModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'suppliers': return <SuppliersPage />;
    case 'requests': return <PRPage />;
    case 'orders': return <POPage />;
    case 'evaluation': return <EvaluationPage />;
    default: return <SRMDashboard />;
  }
}

function SRMDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">تأمین و خرید (SRM)</h1><p className="text-zinc-500">مدیریت تأمین‌کنندگان، درخواست‌ها و سفارشات خرید</p></div>
      <StatGrid columns={4}>
        <StatCard title="تأمین‌کنندگان فعال" value={suppliers.filter(s=>s.status==='active').length} icon={<Users size={22} />} color="#3b82f6" />
        <StatCard title="PR در انتظار" value={purchaseRequests.filter(p=>p.status==='pending').length} icon={<Clock size={22} />} color="#f59e0b" />
        <StatCard title="PO فعال" value={purchaseOrders.filter(p=>p.status!=='received'&&p.status!=='cancelled').length} icon={<ShoppingCart size={22} />} color="#10b981" />
        <StatCard title="میانگین امتیاز" value={`${(suppliers.reduce((s,sp)=>s+sp.rating,0)/suppliers.length).toFixed(1)}`} unit="از ۵" icon={<Star size={22} />} color="#f59e0b" />
      </StatGrid>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">عملکرد تأمین‌کنندگان</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={phase3Charts.supplierPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{fill:'#71717a',fontSize:11}} />
            <YAxis tick={{fill:'#71717a',fontSize:11}} domain={[60,100]} />
            <Tooltip contentStyle={{backgroundColor:'#18181b',border:'1px solid #27272a',borderRadius:'12px',fontSize:'12px'}} />
            <Legend />
            <Bar dataKey="quality" fill="#10b981" name="کیفیت" radius={[4,4,0,0]} />
            <Bar dataKey="delivery" fill="#3b82f6" name="تحویل" radius={[4,4,0,0]} />
            <Bar dataKey="price" fill="#f59e0b" name="قیمت" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SuppliersPage() {
  const [showModal, setShowModal] = useState(false);
  const columns: Column<Supplier>[] = [
    {key:'code',title:'کد',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'name',title:'نام تأمین‌کننده'},{key:'category',title:'دسته'},
    {key:'rating',title:'امتیاز',render:(v)=><div className="flex items-center gap-1"><span className="text-amber-500">{'★'.repeat(Math.floor(v as number))}</span><span className="text-xs text-zinc-500">{v}</span></div>},
    {key:'qualityScore',title:'کیفیت',render:(v)=>`${v}%`},{key:'deliveryScore',title:'تحویل',render:(v)=>`${v}%`},
    {key:'onTimeRate',title:'به‌موقع',render:(v)=>`${v}%`},{key:'totalOrders',title:'سفارشات'},
    {key:'status',title:'وضعیت',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs ${v==='active'?'bg-green-500/10 text-green-500':'bg-red-500/10 text-red-500'}`}>{v==='active'?'فعال':'غیرفعال'}</span>},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={suppliers} columns={columns} title="تأمین‌کنندگان" icon={<Users size={18} className="text-blue-500" />} onAdd={()=>setShowModal(true)} addLabel="تأمین‌کننده جدید" selectable /><FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={d=>{console.log(d);setShowModal(false)}} title="تأمین‌کننده جدید" fields={[{name:'name',label:'نام',type:'text',required:true},{name:'code',label:'کد',type:'text',required:true},{name:'contactPerson',label:'نام مسئول',type:'text'},{name:'phone',label:'تلفن',type:'tel'},{name:'email',label:'ایمیل',type:'email'},{name:'category',label:'دسته',type:'text'},{name:'address',label:'آدرس',type:'textarea',colSpan:2}]} size="lg" /></div>;
}

function PRPage() {
  const [showModal, setShowModal] = useState(false);
  const [localPRs, setLocalPRs] = useState(purchaseRequests);
  const columns: Column<PurchaseRequest>[] = [
    {key:'prNumber',title:'شماره PR',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'departmentName',title:'واحد'},{key:'requesterName',title:'درخواست‌کننده'},
    {key:'priority',title:'اولویت',render:(v)=>{const c:Record<string,string>={critical:'bg-red-500/10 text-red-500',high:'bg-orange-500/10 text-orange-500',medium:'bg-amber-500/10 text-amber-500',low:'bg-blue-500/10 text-blue-500'};const l:Record<string,string>={critical:'بحرانی',high:'بالا',medium:'متوسط',low:'پایین'};return <span className={`px-2 py-0.5 rounded text-xs ${c[v]}`}>{l[v]}</span>}},
    {key:'totalEstimate',title:'مبلغ',render:(v)=>`${((v as number)/1000000).toFixed(0)}M ریال`},
    {key:'status',title:'وضعیت',render:(v)=>{const bg:Record<string,string>={pending:'bg-amber-500/10 text-amber-500',approved:'bg-green-500/10 text-green-500',rejected:'bg-red-500/10 text-red-500',ordered:'bg-blue-500/10 text-blue-500',draft:'bg-zinc-500/10 text-zinc-400'};const l:Record<string,string>={pending:'در انتظار',approved:'تأیید',rejected:'رد',ordered:'سفارش شده',draft:'پیش‌نویس'};return <span className={`px-2 py-0.5 rounded-lg text-xs ${bg[v]}`}>{l[v]}</span>}},
    {key:'requestDate',title:'تاریخ'},
  ];
  const formFields: FormField[] = [
    {name:'prNumber',label:'شماره PR',type:'text',required:true},{name:'departmentName',label:'واحد',type:'text'},
    {name:'requesterName',label:'درخواست‌کننده',type:'text',required:true},{name:'totalEstimate',label:'مبلغ تخمینی',type:'number'},
    {name:'priority',label:'اولویت',type:'select',options:[{value:'critical',label:'بحرانی'},{value:'high',label:'بالا'},{value:'medium',label:'متوسط'},{value:'low',label:'پایین'}]},
    {name:'requestDate',label:'تاریخ درخواست',type:'text'},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={localPRs} columns={columns} title="درخواست‌های خرید (PR)" icon={<FileText size={18} className="text-amber-500" />} onAdd={()=>setShowModal(true)} addLabel="درخواست خرید جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalPRs(prev=>[...prev,{id:uid(),...d,departmentId:'',requesterId:'',items:[],status:'draft'}]);setShowModal(false)}} title="درخواست خرید جدید" fields={formFields} /></div>;
}

function POPage() {
  const [showModal, setShowModal] = useState(false);
  const [localPOs, setLocalPOs] = useState(purchaseOrders);
  const columns: Column<PurchaseOrder>[] = [
    {key:'poNumber',title:'شماره PO',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'supplierName',title:'تأمین‌کننده'},
    {key:'totalAmount',title:'مبلغ کل',render:(v)=>`${((v as number)/1000000).toFixed(0)}M ریال`},
    {key:'expectedDelivery',title:'تحویل'},
    {key:'status',title:'وضعیت',render:(v)=>{const bg:Record<string,string>={confirmed:'bg-blue-500/10 text-blue-500',received:'bg-green-500/10 text-green-500',sent:'bg-amber-500/10 text-amber-500',cancelled:'bg-red-500/10 text-red-500'};const l:Record<string,string>={confirmed:'تأیید شده',received:'دریافت شده',sent:'ارسال شده',cancelled:'لغو',draft:'پیش‌نویس',partial_received:'ناقص'};return <span className={`px-2 py-0.5 rounded-lg text-xs ${bg[v]||'bg-zinc-500/10 text-zinc-400'}`}>{l[v]||v}</span>}},
  ];
  const formFields: FormField[] = [
    {name:'poNumber',label:'شماره PO',type:'text',required:true},{name:'supplierName',label:'تأمین‌کننده',type:'text',required:true},
    {name:'totalAmount',label:'مبلغ کل',type:'number'},{name:'expectedDelivery',label:'تاریخ تحویل',type:'text'},
    {name:'status',label:'وضعیت',type:'select',options:[{value:'draft',label:'پیش‌نویس'},{value:'sent',label:'ارسال شده'},{value:'confirmed',label:'تأیید شده'}]},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={localPOs} columns={columns} title="سفارشات خرید (PO)" icon={<ShoppingCart size={18} className="text-green-500" />} onAdd={()=>setShowModal(true)} addLabel="سفارش خرید جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalPOs(prev=>[...prev,{id:uid(),...d,supplierId:'',items:[],subtotal:0,tax:0,discount:0,currency:'ریال',paymentTerms:'',deliveryTerms:'',createdDate:''}]);setShowModal(false)}} title="سفارش خرید جدید" fields={formFields} /></div>;
}

function EvaluationPage() {
  return (<div className="space-y-6 animate-fade-in"><h1 className="text-xl font-bold text-white">ارزیابی تأمین‌کنندگان</h1>
    <div className="grid md:grid-cols-2 gap-4">{suppliers.map(s=>(
      <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-3">{s.name}</h3>
        <div className="space-y-2">{[{label:'کیفیت',value:s.qualityScore,color:'#10b981'},{label:'تحویل',value:s.deliveryScore,color:'#3b82f6'},{label:'قیمت',value:s.priceScore,color:'#f59e0b'}].map(item=>(
          <div key={item.label}><div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">{item.label}</span><span className="text-white">{item.value}%</span></div><div className="w-full bg-zinc-700 rounded-full h-2"><div className="h-2 rounded-full" style={{width:`${item.value}%`,backgroundColor:item.color}} /></div></div>
        ))}</div>
        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between text-xs"><span className="text-zinc-500">امتیاز: <span className="text-amber-400">{s.rating}/5</span></span><span className="text-zinc-500">{s.totalOrders} سفارش</span></div>
      </div>
    ))}</div>
  </div>);
}
