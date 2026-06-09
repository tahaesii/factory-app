import { useState } from 'react';
import { GitBranch, Play, CheckCircle2, XCircle, Clock, Zap, ClipboardList, ArrowRight, Plus, Trash2, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import DataTable, { Column } from '@/components/ui/DataTable';
import FormModal, { FormField } from '@/components/ui/FormModal';
import StatCard, { StatGrid } from '@/components/ui/StatCard';
import { uid } from '@/services/dataService';
import { workflows as initialWorkflows, workflowInstances as initialInstances, tasks as initialTasks, approvalRequests as initialApprovals, workflowStatistics } from '@/data/phase1Data';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Workflow, WorkflowStep, Task, ApprovalRequest } from '@/types';

export function WorkflowModule() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  switch (currentPage) {
    case 'workflows': return <WorkflowsPage />;
    case 'instances': return <InstancesPage />;
    case 'tasks': return <TasksPage />;
    case 'approvals': return <ApprovalsPage />;
    default: return <WorkflowDashboard onNavigate={setCurrentPage} />;
  }
}

function WorkflowDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">موتور گردش کار</h1><p className="text-zinc-500">مدیریت فرآیندها، وظایف و تأییدات</p></div>
      <StatGrid columns={4}>
        <StatCard title="وظایف باز" value={workflowStatistics.openTasks} icon={<ClipboardList size={22} />} color="#3b82f6" />
        <StatCard title="تأییدات در انتظار" value={workflowStatistics.pendingApprovals} icon={<Clock size={22} />} color="#f59e0b" />
        <StatCard title="میانگین زمان" value={workflowStatistics.avgWorkflowDuration} icon={<Zap size={22} />} color="#10b981" />
        <StatCard title="انطباق SLA" value={`${workflowStatistics.slaCompliance}%`} icon={<CheckCircle2 size={22} />} color="#22c55e" />
      </StatGrid>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">وظایف بر اساس وضعیت</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={workflowStatistics.tasksByStatus} cx="50%" cy="50%" outerRadius={60} innerRadius={40} dataKey="value" stroke="none">
                  {workflowStatistics.tasksByStatus.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {workflowStatistics.tasksByStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-zinc-400">{item.name}</span></div>
                  <span className="text-zinc-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">تأییدات بر اساس ماژول</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={workflowStatistics.approvalsByModule}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'گردش کارها', icon: GitBranch, color: '#3b82f6', page: 'workflows', count: initialWorkflows.length },
          { title: 'نمونه‌های فعال', icon: Play, color: '#10b981', page: 'instances', count: initialInstances.length },
          { title: 'وظایف', icon: ClipboardList, color: '#8b5cf6', page: 'tasks', count: initialTasks.length },
          { title: 'تأییدات', icon: CheckCircle2, color: '#f59e0b', page: 'approvals', count: initialApprovals.length },
        ].map((item) => (
          <button key={item.page} onClick={() => onNavigate(item.page)}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-center transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <p className="text-white text-sm font-medium">{item.title}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{item.count}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkflowsPage() {
  const [workflowList, setWorkflowList] = useState<Workflow[]>(initialWorkflows);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Workflow | null>(null);
  const [selectedWf, setSelectedWf] = useState<Workflow>(workflowList[0]);

  const columns: Column<Workflow>[] = [
    { key: 'code', title: 'کد', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'name', title: 'نام گردش کار' },
    { key: 'module', title: 'ماژول', render: (v) => <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{v}</span> },
    { key: 'triggerType', title: 'نوع تریگر', render: (v) => ({ manual: 'دستی', scheduled: 'زمانبندی', plc_event: 'PLC', api_event: 'API', form_submit: 'فرم', alarm: 'هشدار' })[v] || v },
    { key: 'steps', title: 'مراحل', render: (_, row) => row.steps.length },
    { key: 'version', title: 'نسخه' },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs ${v === 'active' ? 'bg-green-500/10 text-green-500' : v === 'draft' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{v === 'active' ? 'فعال' : v === 'draft' ? 'پیش‌نویس' : 'غیرفعال'}</span> },
  ];

  const formFields: FormField[] = [
    { name: 'name', label: 'نام گردش کار', type: 'text', required: true },
    { name: 'code', label: 'کد', type: 'text', required: true },
    { name: 'module', label: 'ماژول', type: 'text', required: true },
    { name: 'triggerType', label: 'نوع تریگر', type: 'select', required: true, options: [
      { value: 'manual', label: 'دستی' }, { value: 'scheduled', label: 'زمانبندی' },
      { value: 'plc_event', label: 'PLC' }, { value: 'form_submit', label: 'فرم' }, { value: 'alarm', label: 'هشدار' },
    ]},
    { name: 'status', label: 'وضعیت', type: 'select', required: true, options: [{ value: 'active', label: 'فعال' }, { value: 'draft', label: 'پیش‌نویس' }] },
  ];

  const handleAdd = (data: any) => {
    const newWf: Workflow = { id: uid('WF-'), code: data.code, name: data.name, module: data.module, triggerType: data.triggerType, version: '1.0', status: data.status, steps: [{ id: uid('STEP-'), name: 'شروع', order: 1, type: 'task' }] };
    setWorkflowList(prev => [...prev, newWf]);
    setSelectedWf(newWf);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={workflowList} columns={columns} title="تعریف گردش کارها" icon={<GitBranch size={18} className="text-blue-500" />}
        onAdd={() => { setEditing(null); setShowModal(true); }} onEdit={(wf: Workflow) => { setEditing(wf); setShowModal(true); }} addLabel="گردش کار جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleAdd}
        title={editing ? 'ویرایش گردش کار' : 'گردش کار جدید'} fields={formFields} initialData={editing || {}} />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">پیش‌نمایش جریان</h3>
          <select value={selectedWf.id} onChange={e => setSelectedWf(workflowList.find(w => w.id === e.target.value) || workflowList[0])}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-white text-sm outline-none">
            {workflowList.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {selectedWf.steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className="bg-zinc-800 rounded-xl p-4 min-w-[160px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{step.order}</div>
                  <span className="text-xs text-zinc-500">{step.type}</span>
                </div>
                <p className="text-white text-sm font-medium">{step.name}</p>
              </div>
              {i < selectedWf.steps.length - 1 && <ArrowRight size={16} className="text-zinc-600 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstancesPage() {
  const [instances, setInstances] = useState(initialInstances);
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-white">نمونه‌های گردش کار فعال</h1><p className="text-zinc-500 text-sm">گردش کارهای در حال اجرا — {instances.length} عدد</p></div>
      <div className="space-y-4">
        {instances.map((instance) => (
          <div key={instance.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-white font-bold">{instance.workflowName}</h3><p className="text-zinc-500 text-sm">{instance.entityType}: {instance.entityId}</p></div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${instance.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : instance.status === 'approved' ? 'bg-green-500/10 text-green-500' : instance.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                {instance.status === 'pending' ? 'در انتظار' : instance.status === 'approved' ? 'تأیید شده' : instance.status === 'rejected' ? 'رد شده' : instance.status}</span>
            </div>
            <div className="flex items-center gap-2 mb-4"><span className="text-zinc-500 text-sm">مرحله فعلی:</span><span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-sm">{instance.currentStepName}</span></div>
            {instance.history.map((h) => (
              <div key={h.stepId + h.timestamp} className="flex items-center gap-3 text-sm py-1">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-white">{h.stepName}</span>
                <span className="text-zinc-500">توسط {h.userName}</span>
                <span className="text-zinc-600 text-xs">{h.timestamp}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksPage() {
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const columns: Column<Task>[] = [
    { key: 'id', title: 'شناسه', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'title', title: 'عنوان' },
    { key: 'module', title: 'ماژول', render: (v) => <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{v}</span> },
    { key: 'assigneeName', title: 'مسئول' },
    { key: 'priority', title: 'اولویت', render: (v) => {
      const c: Record<string,string> = { critical: 'bg-red-500/10 text-red-500', high: 'bg-orange-500/10 text-orange-500', medium: 'bg-amber-500/10 text-amber-500', low: 'bg-blue-500/10 text-blue-500' };
      const l: Record<string,string> = { critical: 'بحرانی', high: 'بالا', medium: 'متوسط', low: 'پایین' };
      return <span className={`px-2 py-0.5 rounded text-xs ${c[v]}`}>{l[v]}</span>;
    }},
    { key: 'dueDate', title: 'مهلت' },
    { key: 'status', title: 'وضعیت', render: (v) => {
      const c: Record<string,string> = { pending: 'bg-amber-500/10 text-amber-500', in_progress: 'bg-blue-500/10 text-blue-500', completed: 'bg-green-500/10 text-green-500', overdue: 'bg-red-500/10 text-red-500' };
      const l: Record<string,string> = { pending: 'در انتظار', in_progress: 'در حال انجام', completed: 'تکمیل', overdue: 'معوق' };
      return <span className={`px-2 py-0.5 rounded-lg text-xs ${c[v]}`}>{l[v]}</span>;
    }},
  ];

  const formFields: FormField[] = [
    { name: 'title', label: 'عنوان وظیفه', type: 'text', required: true },
    { name: 'description', label: 'توضیحات', type: 'textarea', colSpan: 2 },
    { name: 'module', label: 'ماژول', type: 'text', required: true },
    { name: 'assigneeName', label: 'مسئول', type: 'text', required: true },
    { name: 'priority', label: 'اولویت', type: 'select', required: true, options: [{ value: 'low', label: 'پایین' },{ value: 'medium', label: 'متوسط' },{ value: 'high', label: 'بالا' },{ value: 'critical', label: 'بحرانی' }] },
    { name: 'dueDate', label: 'مهلت', type: 'date', required: true },
  ];

  const filtered = selectedStatus ? taskList.filter(t => t.status === selectedStatus) : taskList;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">وظایف</h1>
        <div className="flex gap-2">
          {['', 'pending', 'in_progress', 'completed', 'overdue'].map(s => (
            <button key={s} onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${selectedStatus === s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
              {s === '' ? 'همه' : s === 'pending' ? 'در انتظار' : s === 'in_progress' ? 'در حال' : s === 'completed' ? 'تکمیل' : 'معوق'}
            </button>
          ))}
        </div>
      </div>
      <DataTable data={filtered} columns={columns} title={`وظایف (${filtered.length})`} icon={<ClipboardList size={18} className="text-purple-500" />}
        onAdd={() => setShowModal(true)} addLabel="وظیفه جدید" />
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSubmit={(data: any) => { setTaskList(prev => [...prev, { ...data, id: uid('TASK-'), status: 'pending', workflowId: '', createdAt: new Date().toLocaleString('fa') } as any]); setShowModal(false); }}
        title="وظیفه جدید" fields={formFields} />
    </div>
  );
}

function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(initialApprovals);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action, actedAt: new Date().toLocaleString('fa') } : a));
  };

  const columns: Column<ApprovalRequest>[] = [
    { key: 'id', title: 'شناسه', render: (v) => <span className="font-mono text-blue-400">{v}</span> },
    { key: 'entityTitle', title: 'موضوع' },
    { key: 'requesterName', title: 'درخواست‌کننده' },
    { key: 'requestedAt', title: 'تاریخ' },
    { key: 'dueAt', title: 'مهلت' },
    { key: 'status', title: 'وضعیت', render: (v) => <span className={`px-2 py-0.5 rounded-lg text-xs ${v === 'pending' ? 'bg-amber-500/10 text-amber-500' : v === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{v === 'pending' ? 'در انتظار' : v === 'approved' ? 'تأیید' : 'رد'}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <DataTable data={approvals} columns={columns} title="درخواست‌های تأیید" icon={<CheckCircle2 size={18} className="text-amber-500" />} actions={false} />
      <div className="grid lg:grid-cols-2 gap-4">
        {approvals.filter(a => a.status === 'pending').map(req => (
          <div key={req.id} className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">{req.entityTitle}</h3>
              <Clock size={16} className="text-amber-500" />
            </div>
            <p className="text-zinc-500 text-sm mb-1">درخواست از: {req.requesterName}</p>
            <p className="text-zinc-600 text-xs mb-4">{req.requestedAt} • مهلت: {req.dueAt}</p>
            <div className="flex gap-2">
              <button onClick={() => handleAction(req.id, 'approved')} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1"><CheckCircle2 size={16} /> تأیید</button>
              <button onClick={() => handleAction(req.id, 'rejected')} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1"><XCircle size={16} /> رد</button>
            </div>
          </div>
        ))}
        {approvals.filter(a => a.status === 'pending').length === 0 && (
          <p className="text-zinc-600 text-sm col-span-2 text-center py-8">هیچ تأیید در انتظاری وجود ندارد</p>
        )}
      </div>
      {approvals.some(a => a.status !== 'pending') && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-3 text-sm">تاریخچه تأییدات</h3>
          <div className="space-y-2">
            {approvals.filter(a => a.status !== 'pending').map(req => (
              <div key={req.id} className="flex items-center gap-3 bg-zinc-800/40 rounded-xl p-3">
                {req.status === 'approved' ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                <span className="text-white text-sm flex-1">{req.entityTitle}</span>
                <span className="text-zinc-500 text-xs">{req.requesterName}</span>
                <span className="text-zinc-600 text-xs">{req.actedAt || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
