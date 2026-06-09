import { useState } from 'react';
import { Building2, Users, GitBranch, Network, ArrowDown, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import FormModal, { FormField } from '@/components/ui/FormModal';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import { uid } from '@/services/dataService';
import { departments as initialDepts, positions as initialPositions, approvalTrees as initialApprovalTrees, escalationTrees as initialEscalationTrees, users, orgStatistics } from '@/data/phase1Data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Department, Position } from '@/types';

export function OrganizationModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  switch (currentPage) {
    case 'departments': return <DepartmentsPage />;
    case 'positions': return <PositionsPage />;
    case 'chart': return <OrgChartPage />;
    case 'approval': return <ApprovalTreePage />;
    case 'escalation': return <EscalationTreePage />;
    default: return <OrgDashboard onNavigate={setCurrentPage} />;
  }
}

function OrgDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">موتور سازمانی</h1><p className="text-zinc-500">ساختار سازمانی، واحدها، پست‌ها و درخت تأیید</p></div>
      <StatGrid columns={4}>
        <StatCard title="کل کارکنان" value={orgStatistics.totalEmployees} unit="نفر" icon={<Users size={22} />} color="#3b82f6" />
        <StatCard title="واحدها" value={orgStatistics.departments} icon={<Building2 size={22} />} color="#10b981" />
        <StatCard title="پست‌ها" value={orgStatistics.positions} icon={<Network size={22} />} color="#8b5cf6" />
        <StatCard title="میانگین Span" value={orgStatistics.avgSpanOfControl} icon={<GitBranch size={22} />} color="#f59e0b" />
      </StatGrid>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">تعداد کارکنان هر واحد</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={orgStatistics.headcountByDept} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} width={80} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'واحدها', icon: Building2, color: '#3b82f6', page: 'departments' },
          { title: 'پست‌ها', icon: Network, color: '#10b981', page: 'positions' },
          { title: 'چارت سازمانی', icon: GitBranch, color: '#8b5cf6', page: 'chart' },
          { title: 'درخت تأیید', icon: ArrowDown, color: '#f59e0b', page: 'approval' },
          { title: 'درخت اسکالیشن', icon: ArrowDown, color: '#ef4444', page: 'escalation' },
        ].map((item) => (
          <button key={item.page} onClick={() => onNavigate(item.page)}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-center transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <p className="text-white text-sm font-medium">{item.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DepartmentsPage() {
  const [deptList, setDeptList] = useState<Department[]>(initialDepts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const columns: Column<Department>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'name', title: 'نام واحد' },
    { key: 'parentId', title: 'واحد بالادست', render: (v) => { const p = deptList.find(d => d.id === v); return p?.name || '-'; }},
    { key: 'managerId', title: 'مدیر', render: (v) => { const m = users.find(u => u.id === v); return m ? `${m.firstName} ${m.lastName}` : '-'; }},
    { key: 'employeeCount', title: 'تعداد کارکنان' },
    { key: 'level', title: 'سطح' },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs ${v === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{v === 'active' ? 'فعال' : 'غیرفعال'}</span> },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'نام واحد', type: 'text', required: true },
    { name: 'code', label: 'کد', type: 'text', required: true },
    { name: 'parentId', label: 'واحد بالادست', type: 'select', options: deptList.map(d => ({ value: d.id, label: d.name })) },
    { name: 'managerId', label: 'مدیر', type: 'select', options: users.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })) },
    { name: 'description', label: 'توضیحات', type: 'textarea', colSpan: 2 },
    { name: 'level', label: 'سطح', type: 'number' },
    { name: 'status', label: 'وضعیت', type: 'select', options: [{ value: 'active', label: 'فعال' }, { value: 'inactive', label: 'غیرفعال' }] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-white">مدیریت واحدها</h1><p className="text-zinc-500 text-sm">ایجاد و مدیریت واحدهای سازمانی</p></div>
      <DataTable data={deptList} columns={columns} title="واحدهای سازمانی" icon={<Building2 size={18} className="text-blue-500" />}
        onAdd={() => { setEditing(null); setShowModal(true); }} onEdit={(d: Department) => { setEditing(d); setShowModal(true); }} addLabel="واحد جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { if (editing) { setDeptList(prev => prev.map(d => d.id === editing.id ? { ...d, ...data } as Department : d)); } else { setDeptList(prev => [...prev, { id: uid('D-'), ...data, employeeCount: 0 } as unknown as Department]); } setShowModal(false); }}
        title={editing ? 'ویرایش واحد' : 'واحد جدید'} fields={formFields} initialData={editing || {}} size="md" />
    </div>
  );
}

function PositionsPage() {
  const [posList, setPosList] = useState<Position[]>(initialPositions);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [deptList] = useState<Department[]>(initialDepts);

  const columns: Column<Position>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'name', title: 'عنوان پست' },
    { key: 'departmentId', title: 'واحد', render: (v) => { const d = deptList.find(d => d.id === v); return d?.name || v; }},
    { key: 'grade', title: 'گرید' },
    { key: 'authorityLevel', title: 'سطح اختیار', render: (v) => ({ executive: 'اجرایی', management: 'مدیریتی', supervisory: 'سرپرستی', operational: 'عملیاتی', entry: 'ورودی' })[v] || v },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs ${v === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{v === 'active' ? 'فعال' : 'غیرفعال'}</span> },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'عنوان پست', type: 'text', required: true },
    { name: 'code', label: 'کد', type: 'text', required: true },
    { name: 'departmentId', label: 'واحد', type: 'select', required: true, options: deptList.map(d => ({ value: d.id, label: d.name })) },
    { name: 'grade', label: 'گرید', type: 'text', required: true },
    { name: 'authorityLevel', label: 'سطح اختیار', type: 'select', options: [{ value: 'entry', label: 'ورودی' },{ value: 'operational', label: 'عملیاتی' },{ value: 'supervisory', label: 'سرپرستی' },{ value: 'management', label: 'مدیریتی' },{ value: 'executive', label: 'اجرایی' }] },
    { name: 'description', label: 'توضیحات', type: 'textarea', colSpan: 2 },
    { name: 'status', label: 'وضعیت', type: 'select', options: [{ value: 'active', label: 'فعال' },{ value: 'inactive', label: 'غیرفعال' }] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={posList} columns={columns} title={`پست‌های سازمانی (${posList.length})`} icon={<Network size={18} className="text-green-500" />}
        onAdd={() => { setEditing(null); setShowModal(true); }} onEdit={(p: Position) => { setEditing(p); setShowModal(true); }} addLabel="پست جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { if (editing) { setPosList(prev => prev.map(p => p.id === editing.id ? { ...p, ...data } as Position : p)); } else { setPosList(prev => [...prev, { id: uid('POS-'), ...data } as unknown as Position]); } setShowModal(false); }}
        title={editing ? 'ویرایش پست' : 'پست جدید'} fields={formFields} size="md" initialData={editing || {}} />
    </div>
  );
}

function OrgChartPage() {
  const [deptList] = useState<Department[]>(initialDepts);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(deptList.filter(d => !d.parentId).map(d => d.id)));
  const [showAdd, setShowAdd] = useState(false);

  const toggleExpand = (id: string) => {
    const s = new Set(expandedDepts);
    if (s.has(id)) s.delete(id); else s.add(id);
    setExpandedDepts(s);
  };

  const renderDept = (dept: Department, level: number = 0) => {
    const children = deptList.filter(d => d.parentId === dept.id);
    const isExpanded = expandedDepts.has(dept.id);
    const manager = users.find(u => u.id === dept.managerId);
    return (
      <div key={dept.id} className="relative">
        <div className={`flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-2 hover:border-zinc-700 transition-all cursor-pointer`}
          style={{ marginRight: level * 24 }} onClick={() => toggleExpand(dept.id)}>
          {children.length > 0 && <button className="text-zinc-500">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>}
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center"><Building2 size={18} className="text-blue-500" /></div>
          <div className="flex-1">
            <p className="text-white font-medium">{dept.name}</p>
            <p className="text-zinc-500 text-xs">{manager ? `${manager.firstName} ${manager.lastName}` : 'بدون مدیر'} • {dept.employeeCount} نفر</p>
          </div>
          <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{dept.code}</span>
        </div>
        {isExpanded && children.map(child => renderDept(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">چارت سازمانی</h1><p className="text-zinc-500 text-sm">نمایش سلسله‌مراتبی ساختار سازمان</p></div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl">
          {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? 'بستن' : 'واحد جدید'}
        </button>
      </div>

      {showAdd && (
        <AddDepartmentForm deptList={deptList} onClose={() => setShowAdd(false)} />
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        {deptList.filter(d => !d.parentId).map(dept => renderDept(dept))}
      </div>
    </div>
  );
}

function AddDepartmentForm({ deptList, onClose }: { deptList: Department[]; onClose: () => void }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [parentId, setParentId] = useState('');
  const [managerId, setManagerId] = useState('');

  const handleSave = () => {
    if (!name.trim() || !code.trim()) return;
    onClose();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-bold mb-4">افزودن واحد سازمانی</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-xs text-zinc-400 mb-1">نام واحد</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50" /></div>
        <div><label className="block text-xs text-zinc-400 mb-1">کد</label>
          <input value={code} onChange={e => setCode(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50" /></div>
        <div><label className="block text-xs text-zinc-400 mb-1">واحد بالادست</label>
          <select value={parentId} onChange={e => setParentId(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none">
            <option value="">بدون بالادست</option>
            {deptList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select></div>
        <div><label className="block text-xs text-zinc-400 mb-1">مدیر</label>
          <select value={managerId} onChange={e => setManagerId(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none">
            <option value="">بدون مدیر</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
          </select></div>
      </div>
      <button onClick={handleSave} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">ذخیره</button>
    </div>
  );
}

function ApprovalTreePage() {
  const [trees, setTrees] = useState(initialApprovalTrees);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">درخت تأیید</h1><p className="text-zinc-500 text-sm">تعریف مسیر تأیید برای هر فرآیند — {trees.length} درخت</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl"><Plus size={16} /> درخت جدید</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {trees.map(tree => (
          <div key={tree.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold">{tree.name}</h3><span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{tree.module}</span></div>
            <div className="space-y-3">
              {tree.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{step.order}</div>
                  <div className="flex-1 bg-zinc-800/50 rounded-xl p-3">
                    <p className="text-white text-sm">{step.approverName}</p>
                    {step.condition && <p className="text-zinc-500 text-xs mt-0.5">شرط: {step.condition}</p>}
                    {step.timeout && <p className="text-zinc-500 text-xs">مهلت: {step.timeout} دقیقه</p>}
                  </div>
                  {i < tree.steps.length - 1 && <ArrowDown size={16} className="text-zinc-600" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={(d) => { setTrees(prev => [...prev, { id: uid('AT-'), name: d.name, module: d.module, steps: [] } as any]); setShowModal(false); }}
        title="درخت تأیید جدید" fields={[{ name: 'name', label: 'نام', type: 'text', required: true }, { name: 'module', label: 'ماژول', type: 'text', required: true }]} />
    </div>
  );
}

function EscalationTreePage() {
  const [trees, setTrees] = useState(initialEscalationTrees);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">درخت اسکالیشن</h1><p className="text-zinc-500 text-sm">تعریف مسیر تشدید هشدارها — {trees.length} درخت</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl"><Plus size={16} /> اسکالیشن جدید</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {trees.map(tree => (
          <div key={tree.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold">{tree.name}</h3><span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded">{tree.triggerType}</span></div>
            <div className="space-y-3">
              {tree.levels.map(level => (
                <div key={level.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">L{level.level}</div>
                  <div className="flex-1 bg-zinc-800/50 rounded-xl p-3">
                    <p className="text-white text-sm">{level.notifyName}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">انتظار: {level.waitMinutes} دقیقه • کانال‌ها: {level.channels.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={(d) => { setTrees(prev => [...prev, { id: uid('ET-'), name: d.name, triggerType: d.triggerType, levels: [] } as any]); setShowModal(false); }}
        title="اسکالیشن جدید" fields={[{ name: 'name', label: 'نام', type: 'text', required: true }, { name: 'triggerType', label: 'نوع تریگر', type: 'text', required: true }]} />
    </div>
  );
}
