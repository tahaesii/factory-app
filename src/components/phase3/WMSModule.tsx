import { useState, useEffect, useRef } from 'react';
import { uid } from '@/services/dataService';
import { Warehouse, Package, ArrowDownToLine, ArrowUpFromLine, TriangleAlert, MapPin, QrCode, ScanLine, History, Layers, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import FormModal, { FormField } from '@/components/ui/FormModal';
import { items as initialItems, grns as initialGrns, stockIssues as initialIssues, phase3Charts } from '@/data/phase3Data';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Item, StockIssue, GRN, TraceEntry, ItemGrade, ItemSource } from '@/types/phase3';

const catLabels: Record<string,string> = {raw_material:'مواد اولیه',semi_finished:'نیمه‌ساخته',finished_goods:'محصول نهایی',spare_parts:'قطعات یدکی',consumables:'مصرفی',tools:'ابزار',chemicals:'شیمیایی',safety_equipment:'ایمنی'};
const statusLabels: Record<string,string> = {active:'فعال',inactive:'غیرفعال',blocked:'مسدود',near_expiry:'نزدیک انقضا',expired:'منقضی',pending_qc:'در انتظار QC',approved:'تأیید',rejected:'رد',partial:'ناقص',pending:'در انتظار',issued:'صادر شده'};
const statusColors: Record<string,string> = {active:'bg-green-500/10 text-green-500',near_expiry:'bg-amber-500/10 text-amber-500',expired:'bg-red-500/10 text-red-500',blocked:'bg-red-500/10 text-red-500',pending_qc:'bg-blue-500/10 text-blue-500',approved:'bg-green-500/10 text-green-500',rejected:'bg-red-500/10 text-red-500',pending:'bg-amber-500/10 text-amber-500',issued:'bg-green-500/10 text-green-500'};
const gradeColors: Record<ItemGrade,string> = {'A+':'bg-yellow-500/20 text-yellow-400 border-yellow-600/30','A':'bg-green-500/20 text-green-400 border-green-600/30','B':'bg-blue-500/20 text-blue-400 border-blue-600/30','C':'bg-amber-500/20 text-amber-400 border-amber-600/30','D':'bg-red-500/20 text-red-400 border-red-600/30','E':'bg-zinc-500/20 text-zinc-400 border-zinc-600/30'};
const sourceLabels: Record<ItemSource,string> = {purchased:'خرید خارجی',production:'تولید داخلی',depot_transfer:'انتقال از دپو'};
const sourceColors: Record<ItemSource,string> = {purchased:'bg-blue-500/10 text-blue-400',production:'bg-green-500/10 text-green-400',depot_transfer:'bg-purple-500/10 text-purple-400'};
const actionLabels: Record<string,string> = {receive:'دریافت',issue:'صدور',transfer:'انتقال',qc_pass:'QC قبول',qc_reject:'QC رد',adjust:'تعدیل',produce:'تولید'};

function QrImg({ data, size=48 }: { data: string; size?: number }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let cancelled = false;
    import('qrcode').then(mod => {
      if (!cancelled) mod.default.toDataURL(data, { width: size*2, margin: 1, color: { dark: '#fff', light: '#18181b' } }).then(setSrc);
    });
    return () => { cancelled = true; };
  }, [data, size]);
  if (!src) return <div className="w-10 h-10 rounded bg-zinc-800 animate-pulse mx-auto" />;
  return <img src={src} alt="QR" className="mx-auto" style={{width:size,height:size}} />;
}

export function WMSModuleFull() {
  const currentPage = useAppStore((s) => s.currentPage);
  switch(currentPage) {
    case 'items': return <ItemsPage />;
    case 'receiving': return <ReceivingPage />;
    case 'issue': return <IssuePage />;
    case 'locations': return <LocationsPage />;
    case 'expiry': return <ExpiryPage />;
    case 'qrscanner': return <QrScannerPage />;
    case 'traceability': return <TraceabilityPage />;
    default: return <WMSDashboard />;
  }
}

function WMSDashboard() {
  const totalValue = initialItems.reduce((s,i) => s+i.totalValue,0);
  const lowStock = initialItems.filter(i => i.currentStock <= i.minStock).length;
  const nearExpiry = initialItems.filter(i => i.status === 'near_expiry').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">مدیریت انبار (WMS)</h1><p className="text-zinc-500">ردیابی هوشمند با QR کد — از ورود تا مصرف</p></div>
      <StatGrid columns={4}>
        <StatCard title="ارزش موجودی" value={`${(totalValue/1000000000).toFixed(1)}B`} unit="ریال" icon={<Package size={22} />} color="#3b82f6" />
        <StatCard title="کل اقلام QRدار" value={initialItems.length} icon={<QrCode size={22} />} color="#10b981" />
        <StatCard title="موجودی بحرانی" value={lowStock} icon={<TriangleAlert size={22} />} color="#ef4444" />
        <StatCard title="ردیابی امروز" value={initialItems.flatMap(i=>i.traceLog).filter(t=>t.timestamp.startsWith('1403/10/')).length} icon={<History size={22} />} color="#a855f7" />
      </StatGrid>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">ارزش موجودی بر اساس دسته</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart><Pie data={phase3Charts.stockByCategory} cx="50%" cy="50%" outerRadius={65} innerRadius={40} dataKey="value" stroke="none">
                {phase3Charts.stockByCategory.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {phase3Charts.stockByCategory.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:item.color}} /><span className="text-zinc-400">{item.name}</span></div>
                  <span className="text-zinc-300">{(item.value/1000000).toFixed(0)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">توزیع درجه کیفی اقلام</h3>
          <div className="space-y-2">
            {(['A+','A','B','C','D','E'] as ItemGrade[]).map(g => {
              const count = initialItems.filter(i => i.grade === g).length;
              const pct = Math.round((count/initialItems.length)*100);
              return <div key={g}><div className="flex justify-between text-xs mb-1"><span className={`font-bold ${gradeColors[g].split(' ')[1]}`}>درجه {g}</span><span className="text-zinc-400">{count} قلم ({pct}%)</span></div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:g==='A+'?'#eab308':g==='A'?'#22c55e':g==='B'?'#3b82f6':g==='C'?'#f59e0b':g==='D'?'#ef4444':'#71717a'}} /></div></div>;
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {title:'اقلام',icon:Package,color:'#3b82f6',page:'items'},
          {title:'ورود کالا',icon:ArrowDownToLine,color:'#10b981',page:'receiving'},
          {title:'صدور کالا',icon:ArrowUpFromLine,color:'#f59e0b',page:'issue'},
          {title:'اسکن QR',icon:ScanLine,color:'#a855f7',page:'qrscanner'},
          {title:'ردیابی',icon:History,color:'#ec4899',page:'traceability'},
          {title:'مکان‌ها',icon:MapPin,color:'#8b5cf6',page:'locations'},
          {title:'انقضا',icon:TriangleAlert,color:'#ef4444',page:'expiry'},
        ].map(item => (
          <button key={item.page} onClick={() => useAppStore.getState().setCurrentPage(item.page)} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-center transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform" style={{backgroundColor:`${item.color}15`}}><item.icon size={20} style={{color:item.color}} /></div>
            <p className="text-white text-sm font-medium">{item.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ItemsPage() {
  const [showModal, setShowModal] = useState(false);
  const [localItems, setLocalItems] = useState(initialItems.map(i => ({...i, qrData: i.qrData || `FOS-ITEM-${i.code}-${i.id}`})));
  const columns: Column<Item>[] = [
    {key:'qrData',title:'QR',render:(v) => <QrImg data={v} size={40} />},
    {key:'code',title:'کد',render:(v) => <span className="font-mono text-blue-400">{v}</span>},
    {key:'name',title:'نام کالا',render:(v,row) => (<div><p className="text-white">{v}</p>{row.brand && <p className="text-zinc-500 text-xs">{row.brand} {row.model||''}</p>}</div>)},
    {key:'category',title:'دسته',render:(v) => <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{catLabels[v]}</span>},
    {key:'grade',title:'درجه',render:(v) => <span className={`text-xs px-2 py-0.5 rounded-full border ${gradeColors[v as ItemGrade]}`}>{v}</span>},
    {key:'source',title:'منبع',render:(v) => <span className={`text-xs px-2 py-0.5 rounded ${sourceColors[v as ItemSource]}`}>{sourceLabels[v as ItemSource]}</span>},
    {key:'currentStock',title:'موجودی',render:(v,row) => {const low=v<=row.minStock;return <span className={`font-bold ${low?'text-red-400':'text-white'}`}>{v} {row.unit}</span>}},
    {key:'locationCode',title:'مکان',render:(v) => <span className="font-mono text-xs bg-zinc-800 px-2 py-0.5 rounded">{v}</span>},
    {key:'status',title:'وضعیت',render:(v) => <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[v]||'bg-zinc-500/10 text-zinc-400'}`}>{statusLabels[v]||v}</span>},
    {key:'traceLog',title:'رهگیری',render:(v,row) => <button onClick={() => { useAppStore.getState().setCurrentPage('qrscanner'); }} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"><History size={12} />{v.length} رویداد</button>},
  ];
  const formFields: FormField[] = [
    {name:'code',label:'کد کالا',type:'text',required:true},{name:'name',label:'نام کالا',type:'text',required:true},
    {name:'category',label:'دسته',type:'select',required:true,options:Object.entries(catLabels).map(([v,l])=>({value:v,label:l}))},
    {name:'grade',label:'درجه کیفی',type:'select',required:true,options:[{value:'A+',label:'A+ (ممتاز)'},{value:'A',label:'A (عالی)'},{value:'B',label:'B (خوب)'},{value:'C',label:'C (متوسط)'},{value:'D',label:'D (ضعیف)'},{value:'E',label:'E (بازرسی)'}]},
    {name:'source',label:'منبع',type:'select',required:true,options:[{value:'purchased',label:'خرید خارجی'},{value:'production',label:'تولید داخلی'},{value:'depot_transfer',label:'انتقال از دپو'}]},
    {name:'unit',label:'واحد',type:'select',options:[{value:'عدد',label:'عدد'},{value:'کیلوگرم',label:'کیلوگرم'},{value:'لیتر',label:'لیتر'},{value:'متر',label:'متر'},{value:'شاخه',label:'شاخه'},{value:'جفت',label:'جفت'}]},
    {name:'brand',label:'برند',type:'text'},{name:'partNumber',label:'Part Number',type:'text'},
    {name:'minStock',label:'حداقل موجودی',type:'number'},{name:'maxStock',label:'حداکثر موجودی',type:'number'},
    {name:'reorderPoint',label:'نقطه سفارش',type:'number'},{name:'unitCost',label:'بهای واحد (ریال)',type:'number'},
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={localItems} columns={columns} title="فهرست کالاها (Item Master)" icon={<Package size={18} className="text-blue-500" />}
        onAdd={()=>setShowModal(true)} onEdit={()=>setShowModal(true)} addLabel="کالای جدید" selectable />
      <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{const newId=uid();setLocalItems(prev=>[...prev,{id:newId,...d,subCategory:'',currentStock:0,reservedStock:0,availableStock:0,totalValue:0,warehouseId:'',locationCode:'',status:'active',traceLog:[],qrData:`FOS-ITEM-${d.code}-${newId}`} as unknown as Item]);setShowModal(false)}} title="کالای جدید" fields={formFields} size="lg" />
    </div>
  );
}

function QrScannerPage() {
  const [scanInput, setScanInput] = useState('');
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [issueQty, setIssueQty] = useState(1);
  const [allItems, setAllItems] = useState(initialItems.map(i => ({...i, qrData: i.qrData || `FOS-ITEM-${i.code}-${i.id}`})));
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleScan = (val: string) => {
    setScanInput(val);
    if (!val.trim()) { setFoundItem(null); return; }
    const item = allItems.find(i => i.qrData === val.trim() || i.code === val.trim() || i.id === val.trim() || i.name.includes(val.trim()));
    setFoundItem(item || null);
  };

  const handleIssue = () => {
    if (!foundItem || issueQty < 1 || issueQty > foundItem.currentStock) return;
    const entry: TraceEntry = { id: uid(), itemId: foundItem.id, itemName: foundItem.name, action: 'issue', personName: 'مدیر سیستم', personRole: 'انباردار', timestamp: new Date().toLocaleDateString('fa-IR')+' '+new Date().toLocaleTimeString('fa-IR'), qty: issueQty, balanceAfter: foundItem.currentStock - issueQty, location: foundItem.locationCode, notes: 'صدور با اسکن QR' };
    setAllItems(prev => prev.map(i => i.id === foundItem.id ? {...i, currentStock: i.currentStock - issueQty, traceLog: [...i.traceLog, entry]} as Item : i));
    setFoundItem(prev => prev ? {...prev, currentStock: prev.currentStock - issueQty, traceLog: [...prev.traceLog, entry]} as Item : null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">اسکنر QR کد</h1><p className="text-zinc-500">کد QR کالا را اسکن یا وارد کنید</p></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-bold flex items-center gap-2"><ScanLine size={18} className="text-purple-400" /> اسکن QR</h3>
          <div className="flex gap-2">
            <input value={scanInput} onChange={e => handleScan(e.target.value)} placeholder="کد QR را وارد کنید یا اسکن کنید..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-colors" />
            <button onClick={() => cameraRef.current?.click()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl text-sm transition-colors">دوربین</button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => { handleScan('FOS-ITEM-SCANNED'); };
                reader.readAsDataURL(file);
              }
            }} />
          </div>
          {!foundItem && scanInput && <p className="text-red-400 text-sm">کالایی با این QR یافت نشد</p>}
          {foundItem && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                <QrImg data={foundItem.qrData} size={64} />
                <div><p className="text-white font-bold text-lg">{foundItem.name}</p><p className="text-blue-400 font-mono text-sm">{foundItem.code}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${gradeColors[foundItem.grade]}`}>{foundItem.grade}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${sourceColors[foundItem.source]}`}>{sourceLabels[foundItem.source]}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-zinc-800/50 rounded-xl p-2"><p className="text-zinc-500 text-xs">موجودی</p><p className="text-white font-bold text-lg">{foundItem.currentStock}</p></div>
                <div className="bg-zinc-800/50 rounded-xl p-2"><p className="text-zinc-500 text-xs">واحد</p><p className="text-white font-bold text-lg">{foundItem.unit}</p></div>
                <div className="bg-zinc-800/50 rounded-xl p-2"><p className="text-zinc-500 text-xs">مکان</p><p className="text-white font-bold text-lg font-mono">{foundItem.locationCode}</p></div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-zinc-800 rounded-xl px-3 py-2 flex items-center gap-2">
                  <button onClick={() => setIssueQty(Math.max(1, issueQty-1))} className="text-zinc-400 hover:text-white px-2">-</button>
                  <input type="number" value={issueQty} onChange={e => setIssueQty(Math.max(1, Number(e.target.value)||1))} min={1} max={foundItem.currentStock} className="w-16 bg-transparent text-white text-center outline-none" />
                  <button onClick={() => setIssueQty(Math.min(foundItem.currentStock, issueQty+1))} className="text-zinc-400 hover:text-white px-2">+</button>
                </div>
                <button onClick={handleIssue} disabled={issueQty > foundItem.currentStock} className="bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-5 rounded-xl text-sm font-medium transition-colors">صدور کالا</button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-bold flex items-center gap-2"><History size={18} className="text-purple-400" /> آخرین اسکن‌ها</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allItems.flatMap(i => i.traceLog).sort((a,b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 20).map(t => (
              <div key={t.id} className="flex items-center gap-3 p-2 bg-zinc-800/30 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.action==='receive'?'bg-green-500/20':t.action==='issue'?'bg-amber-500/20':'bg-blue-500/20'}`}>
                  {t.action==='receive'?<ArrowDownToLine size={14} className="text-green-400" />:<ArrowUpFromLine size={14} className="text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{t.itemName}</p><p className="text-zinc-500 text-xs">{t.personName} — {actionLabels[t.action]} {t.qty} عدد</p></div>
                <span className="text-zinc-600 text-xs">{t.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceivingPage() {
  const [showModal, setShowModal] = useState(false);
  const [localGrns, setLocalGrns] = useState(initialGrns);
  const [allItems, setAllItems] = useState(initialItems.map(i => ({...i, qrData: i.qrData || `FOS-ITEM-${i.code}-${i.id}`})));
  const columns: Column<GRN>[] = [
    {key:'grnNumber',title:'شماره',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'supplierName',title:'تأمین‌کننده'},{key:'receivedDate',title:'تاریخ'},
    {key:'status',title:'وضعیت',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[v]||'bg-zinc-500/10 text-zinc-400'}`}>{statusLabels[v]||v}</span>},
  ];
  const formFields: FormField[] = [
    {name:'grnNumber',label:'شماره GRN',type:'text',required:true},{name:'supplierName',label:'تأمین‌کننده',type:'text',required:true},
    {name:'receivedDate',label:'تاریخ دریافت',type:'text'},{name:'poNumber',label:'شماره PO',type:'text'},
    {name:'itemName',label:'نام کالا',type:'text'},{name:'qty',label:'تعداد',type:'number'},
  ];
  return <div className="space-y-6 animate-fade-in">
    <DataTable data={localGrns} columns={columns} title="ورود کالا (GRN)" icon={<ArrowDownToLine size={18} className="text-green-500" />} onAdd={()=>setShowModal(true)} addLabel="GRN جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{
      const newId = uid(); const itemName = d.itemName||'کالای جدید';
      const traceEntry: TraceEntry = { id: uid(), itemId: newId, itemName, action:'receive', personName:'مدیر سیستم', personRole:'انباردار', timestamp: new Date().toLocaleDateString('fa-IR')+' '+new Date().toLocaleTimeString('fa-IR'), qty: Number(d.qty)||0, balanceAfter: Number(d.qty)||0, location:'A-01-01', notes:'GRN: '+d.grnNumber };
      setLocalGrns(prev=>[...prev,{id:newId,...d,supplierId:'',totalItems:Number(d.qty)||0,inspectorId:'',inspectorName:'',items:[{itemId:newId,itemName,orderedQty:Number(d.qty)||0,receivedQty:Number(d.qty)||0,acceptedQty:Number(d.qty)||0,rejectedQty:0,locationCode:'A-01-01'}]}]);
      setAllItems(prev=>[...prev,{id:newId,code:`NEW-${newId.slice(0,6)}`,name:itemName,category:'raw_material',subCategory:'',unit:'عدد',minStock:0,maxStock:0,reorderPoint:0,leadTime:0,currentStock:Number(d.qty)||0,reservedStock:0,availableStock:Number(d.qty)||0,unitCost:0,totalValue:0,warehouseId:'',locationCode:'A-01-01',status:'pending_qc',grade:'C' as ItemGrade,source:'purchased' as ItemSource,qrData:`FOS-ITEM-NEW-${newId}`,traceLog:[traceEntry]}]);
      setShowModal(false);
    }} title="GRN جدید" fields={formFields} /></div>;
}

function IssuePage() {
  const [showModal, setShowModal] = useState(false);
  const [localIssues, setLocalIssues] = useState(initialIssues);
  const columns: Column<StockIssue>[] = [
    {key:'issueNumber',title:'شماره',render:(v)=><span className="font-mono text-blue-400">{v}</span>},
    {key:'requesterName',title:'درخواست‌کننده'},{key:'department',title:'واحد'},{key:'itemName',title:'کالا'},{key:'qty',title:'تعداد'},
    {key:'workOrderId',title:'دستور کار',render:(v)=>v||'-'},
    {key:'status',title:'وضعیت',render:(v)=><span className={`px-2 py-0.5 rounded-lg text-xs ${statusColors[v]}`}>{statusLabels[v]}</span>},
    {key:'requestDate',title:'تاریخ'},
  ];
  const formFields: FormField[] = [
    {name:'itemName',label:'نام کالا',type:'text',required:true},{name:'qty',label:'تعداد',type:'number',required:true},
    {name:'requesterName',label:'درخواست‌کننده',type:'text',required:true},{name:'department',label:'واحد',type:'text'},
    {name:'workOrderId',label:'شماره دستور کار',type:'text'},
  ];
  return <div className="space-y-6 animate-fade-in"><DataTable data={localIssues} columns={columns} title="صدور کالا" icon={<ArrowUpFromLine size={18} className="text-amber-500" />} onAdd={()=>setShowModal(true)} addLabel="صدور جدید" />
    <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalIssues(prev=>[...prev,{id:uid(),issueNumber:`ISS-${uid()}`,requesterId:'',itemId:'',status:'pending',requestDate:new Date().toLocaleDateString('fa-IR'),...d}]);setShowModal(false)}} title="صدور جدید" fields={formFields} /></div>;
}

function LocationsPage() {
  const [showModal, setShowModal] = useState(false);
  const [localLocs, setLocalLocs] = useState([{zone:'A',aisles:3,racks:12,desc:'مواد اولیه'},{zone:'B',aisles:2,racks:8,desc:'فولاد'},{zone:'C',aisles:2,racks:10,desc:'قطعات یدکی'},{zone:'D',aisles:1,racks:6,desc:'مصرفی'},{zone:'E',aisles:2,racks:8,desc:'محصول نهایی - تولید خودمان'},{zone:'F',aisles:1,racks:4,desc:'ایمنی'},{zone:'G',aisles:1,racks:4,desc:'شیمیایی'},{zone:'H',aisles:1,racks:4,desc:'دپو (محصولات نیمه‌ساخته)'}]);
  const formFields: FormField[] = [
    {name:'zone',label:'Zone',type:'text',required:true},{name:'desc',label:'توضیحات',type:'text',required:true},
    {name:'aisles',label:'تعداد راهرو',type:'number'},{name:'racks',label:'تعداد قفسه',type:'number'},
  ];
  return (
    <div className="space-y-6 animate-fade-in"><h1 className="text-xl font-bold text-white">مدیریت مکان‌ها</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {localLocs.map(loc => (
          <div key={loc.zone} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 text-xl font-black mb-3">{loc.zone}</div>
            <h3 className="text-white font-bold">{loc.desc}</h3>
            <p className="text-zinc-500 text-xs">{loc.aisles} راهرو • {loc.racks} قفسه</p>
          </div>
        ))}
      </div>
      <button onClick={()=>setShowModal(true)} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"><MapPin size={24} /></button>
      <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={(d)=>{setLocalLocs(prev=>[...prev,{...d,aisles:Number(d.aisles)||0,racks:Number(d.racks)||0}]);setShowModal(false)}} title="مکان جدید" fields={formFields} /></div>
  );
}

function ExpiryPage() {
  const expiryItems = initialItems.filter(i=>i.expiryDate);
  return (
    <div className="space-y-6 animate-fade-in"><h1 className="text-xl font-bold text-white">کنترل انقضا</h1>
      <div className="space-y-3">
        {expiryItems.map(item => (
          <div key={item.id} className={`bg-zinc-900 border rounded-xl p-4 ${item.status==='near_expiry'?'border-amber-500/30':'border-zinc-800'}`}>
            <div className="flex justify-between"><div><p className="text-white font-medium">{item.name}</p><p className="text-zinc-500 text-xs">{item.code}</p></div>
              <div className="text-right"><p className={`font-bold ${item.status==='near_expiry'?'text-amber-400':'text-zinc-300'}`}>{item.expiryDate}</p><span className={`text-xs px-2 py-0.5 rounded ${statusColors[item.status]}`}>{statusLabels[item.status]}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TraceabilityPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const allItems = initialItems.map(i => ({...i, qrData: i.qrData || `FOS-ITEM-${i.code}-${i.id}`}));
  const allTraces = allItems.flatMap(i => i.traceLog.map(t => ({...t, item: i})));
  const filtered = selectedItem ? allTraces.filter(t => t.itemId === selectedItem.id) : allTraces;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">ردیابی کامل (Traceability)</h1><p className="text-zinc-500">تاریخچه جابجایی هر کالا — بدانید دست کیست</p></div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedItem(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!selectedItem?'bg-purple-600 text-white':'bg-zinc-800 text-zinc-400 hover:text-white'}`}>همه</button>
        {allItems.map(i => (
          <button key={i.id} onClick={() => setSelectedItem(i)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedItem?.id===i.id?'bg-purple-600 text-white':'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{i.name}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.sort((a,b) => b.timestamp.localeCompare(a.timestamp)).map((t, idx) => (
          <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.action==='receive'?'bg-green-500/20':t.action==='issue'?'bg-amber-500/20':t.action==='produce'?'bg-blue-500/20':'bg-purple-500/20'}`}>
                {t.action==='receive'?<ArrowDownToLine size={18} className="text-green-400" />:t.action==='issue'?<ArrowUpFromLine size={18} className="text-amber-400" />:<ShieldCheck size={18} className="text-purple-400" />}
              </div>
              {idx < filtered.length-1 && <div className="w-0.5 flex-1 min-h-[24px] bg-zinc-800" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div><p className="text-white font-medium">{actionLabels[t.action]} — {t.itemName}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{t.personName} ({t.personRole||'-'}) • {t.location}</p></div>
                <span className="text-zinc-600 text-xs whitespace-nowrap">{t.timestamp}</span>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-zinc-400">
                <span>مقدار: <span className="text-white">{t.qty}</span></span>
                <span>مانده: <span className="text-white">{t.balanceAfter}</span></span>
                {t.notes && <span>توضیح: <span className="text-zinc-300">{t.notes}</span></span>}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-zinc-600 text-center py-8">هیچ رویدادی یافت نشد</p>}
      </div>
    </div>
  );
}
