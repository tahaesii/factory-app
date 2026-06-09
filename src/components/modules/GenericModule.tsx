import { useState } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Download,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { modules } from '@/data/modules';
import {
  productionOrders, assets, workOrders, inventoryItems,
  employees, qualityInspections, suppliers, purchaseRequests, incidents
} from '@/data/mockData';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500',
    completed: 'bg-blue-500/10 text-blue-500',
    planned: 'bg-zinc-500/10 text-zinc-400',
    delayed: 'bg-red-500/10 text-red-500',
    running: 'bg-green-500/10 text-green-500',
    warning: 'bg-amber-500/10 text-amber-500',
    stopped: 'bg-red-500/10 text-red-500',
    open: 'bg-blue-500/10 text-blue-500',
    'in-progress': 'bg-amber-500/10 text-amber-500',
    scheduled: 'bg-indigo-500/10 text-indigo-500',
    normal: 'bg-green-500/10 text-green-500',
    low: 'bg-amber-500/10 text-amber-500',
    critical: 'bg-red-500/10 text-red-500',
    present: 'bg-green-500/10 text-green-500',
    absent: 'bg-red-500/10 text-red-500',
    leave: 'bg-amber-500/10 text-amber-500',
    pending: 'bg-amber-500/10 text-amber-500',
    approved: 'bg-green-500/10 text-green-500',
    investigating: 'bg-indigo-500/10 text-indigo-500',
    resolved: 'bg-green-500/10 text-green-500',
  };
  const labels: Record<string, string> = {
    active: 'فعال', completed: 'تکمیل', planned: 'برنامه‌ریزی', delayed: 'تأخیر',
    running: 'در حال کار', warning: 'هشدار', stopped: 'متوقف',
    open: 'باز', 'in-progress': 'در حال انجام', scheduled: 'زمانبندی',
    normal: 'عادی', low: 'کم', critical: 'بحرانی',
    present: 'حاضر', absent: 'غایب', leave: 'مرخصی',
    pending: 'در انتظار', approved: 'تأیید شده',
    investigating: 'در حال بررسی', resolved: 'حل شده',
    preventive: 'پیشگیرانه', corrective: 'اصلاحی', inspection: 'بازرسی',
    high: 'بالا', medium: 'متوسط',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${styles[status] || 'bg-zinc-500/10 text-zinc-400'}`}>
      {labels[status] || status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-500',
    high: 'bg-orange-500/10 text-orange-500',
    medium: 'bg-amber-500/10 text-amber-500',
    low: 'bg-blue-500/10 text-blue-500',
  };
  const labels: Record<string, string> = {
    critical: 'بحرانی', high: 'بالا', medium: 'متوسط', low: 'پایین',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${styles[priority] || 'bg-zinc-500/10 text-zinc-400'}`}>
      {labels[priority] || priority}
    </span>
  );
}

interface DataTableProps {
  columns: { key: string; title: string; render?: (value: any, row: any) => any }[];
  data: any[];
  title: string;
  icon?: any;
}

function DataTable({ columns, data, title, icon: Icon }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-blue-500" />}
          <h3 className="text-white font-bold">{title}</h3>
          <span className="bg-zinc-800 text-zinc-500 text-xs px-2 py-0.5 rounded-full">{data.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-800 rounded-xl px-3">
            <Search size={14} className="text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو..."
              className="bg-transparent border-none outline-none text-sm text-white py-2 px-2 w-40"
            />
          </div>
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
            <Filter size={16} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
            <Download size={16} />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            <Plus size={16} /> جدید
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="p-4 border-b border-zinc-800 bg-zinc-800/30 animate-slide-up">
          <div className="flex items-center gap-3 flex-wrap">
            {columns.slice(0, 4).map((col) => (
              <input
                key={col.key}
                placeholder={col.title}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 outline-none"
              />
            ))}
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition-all">ذخیره</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-zinc-700 text-white text-sm rounded-xl transition-all">انصراف</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {columns.map((col) => (
                <th key={col.key} className="text-right text-xs font-medium text-zinc-500 px-4 py-3 whitespace-nowrap">{col.title}</th>
              ))}
              <th className="text-right text-xs font-medium text-zinc-500 px-4 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-zinc-300 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><Eye size={14} /></button>
                    <button className="p-1.5 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><Edit size={14} /></button>
                    <button className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <span>نمایش ۱ تا {data.length} از {data.length} مورد</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-zinc-800 rounded"><ChevronRight size={14} /></button>
          <span className="px-2 py-1 bg-blue-600 text-white rounded">۱</span>
          <button className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// === MES Module ===
export function MESModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'orders') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="سفارشات تولید"
          data={productionOrders}
          columns={[
            { key: 'id', title: 'شماره سفارش', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'product', title: 'محصول' },
            { key: 'quantity', title: 'تعداد', render: (v: number) => v.toLocaleString() },
            { key: 'completed', title: 'تولید شده', render: (v: number) => v.toLocaleString() },
            { key: 'line', title: 'خط' },
            { key: 'progress', title: 'پیشرفت', render: (v: number) => (
              <div className="flex items-center gap-2">
                <div className="w-20 bg-zinc-700 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${v}%` }} />
                </div>
                <span className="text-xs">{v}%</span>
              </div>
            )},
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
          ]}
        />
      </div>
    );
  }

  if (currentPage === 'oee') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-blue-500 mb-1">۸۶.۴%</div>
            <div className="text-zinc-500 text-sm">OEE کل</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-green-500 mb-1">۹۱.۲%</div>
            <div className="text-zinc-500 text-sm">دسترسی</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-amber-500 mb-1">۹۶.۲%</div>
            <div className="text-zinc-500 text-sm">کیفیت</div>
          </div>
        </div>
      </div>
    );
  }

  return <ModuleDashboard moduleId="mes" />;
}

// === CMMS Module ===
export function CMMSModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'assets') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="ثبت تجهیزات"
          data={assets}
          columns={[
            { key: 'id', title: 'کد', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'name', title: 'نام تجهیز' },
            { key: 'location', title: 'مکان' },
            { key: 'health', title: 'سلامت', render: (v: number) => {
              const color = v > 80 ? 'bg-green-500' : v > 50 ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-zinc-700 rounded-full h-1.5">
                    <div className={`${color} h-1.5 rounded-full`} style={{ width: `${v}%` }} />
                  </div>
                  <span className="text-xs">{v}%</span>
                </div>
              );
            }},
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
            { key: 'nextMaintenance', title: 'نت بعدی' },
          ]}
        />
      </div>
    );
  }

  if (currentPage === 'workorders') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="دستور کار"
          data={workOrders}
          columns={[
            { key: 'id', title: 'شماره', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'title', title: 'عنوان' },
            { key: 'asset', title: 'تجهیز' },
            { key: 'type', title: 'نوع', render: (v: string) => <StatusBadge status={v} /> },
            { key: 'priority', title: 'اولویت', render: (v: string) => <PriorityBadge priority={v} /> },
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
            { key: 'assignee', title: 'مسئول' },
            { key: 'dueDate', title: 'مهلت' },
          ]}
        />
      </div>
    );
  }

  return <ModuleDashboard moduleId="cmms" />;
}

// === WMS Module ===
export function WMSModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'inventory') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="موجودی انبار"
          data={inventoryItems}
          columns={[
            { key: 'id', title: 'کد', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'name', title: 'نام کالا' },
            { key: 'category', title: 'دسته' },
            { key: 'quantity', title: 'موجودی', render: (v: number, row: any) => (
              <span className={v <= row.minStock ? 'text-red-500 font-bold' : ''}>{v} {row.unit}</span>
            )},
            { key: 'minStock', title: 'حداقل', render: (v: number, row: any) => `${v} ${row.unit}` },
            { key: 'location', title: 'مکان', render: (v: string) => <span className="font-mono text-xs bg-zinc-800 px-2 py-0.5 rounded">{v}</span> },
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
          ]}
        />
      </div>
    );
  }

  return <ModuleDashboard moduleId="wms" />;
}

// === HRM Module ===
export function HRMModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'employees') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="کارکنان"
          data={employees}
          columns={[
            { key: 'id', title: 'کد', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'name', title: 'نام' },
            { key: 'department', title: 'واحد' },
            { key: 'position', title: 'سمت' },
            { key: 'shift', title: 'شیفت' },
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
          ]}
        />
      </div>
    );
  }

  return <ModuleDashboard moduleId="hrm" />;
}

// === QMS Module ===
export function QMSModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'inspections') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="بازرسی‌های کیفیت"
          data={qualityInspections}
          columns={[
            { key: 'id', title: 'کد', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'type', title: 'نوع' },
            { key: 'batch', title: 'بچ' },
            { key: 'product', title: 'محصول' },
            { key: 'result', title: 'نتیجه', render: (v: string) => {
              const color = v === 'تأیید' ? 'text-green-500' : v === 'رد' ? 'text-red-500' : 'text-amber-500';
              return <span className={`font-bold ${color}`}>{v}</span>;
            }},
            { key: 'defects', title: 'عیب' },
            { key: 'inspector', title: 'بازرس' },
            { key: 'date', title: 'تاریخ' },
          ]}
        />
      </div>
    );
  }

  return <ModuleDashboard moduleId="qms" />;
}

// === SRM Module ===
export function SRMModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'suppliers') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="تأمین‌کنندگان"
          data={suppliers}
          columns={[
            { key: 'id', title: 'کد', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'name', title: 'نام' },
            { key: 'category', title: 'دسته' },
            { key: 'rating', title: 'امتیاز', render: (v: number) => (
              <div className="flex items-center gap-1">
                <span className="text-amber-500">{'★'.repeat(Math.floor(v))}{'☆'.repeat(5 - Math.floor(v))}</span>
                <span className="text-xs text-zinc-500">{v}</span>
              </div>
            )},
            { key: 'orders', title: 'سفارش‌ها' },
            { key: 'onTime', title: 'به‌موقع', render: (v: number) => `${v}%` },
            { key: 'quality', title: 'کیفیت', render: (v: number) => `${v}%` },
          ]}
        />
      </div>
    );
  }

  if (currentPage === 'requests') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="درخواست‌های خرید"
          data={purchaseRequests}
          columns={[
            { key: 'id', title: 'شماره', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'title', title: 'عنوان' },
            { key: 'requester', title: 'درخواست‌کننده' },
            { key: 'department', title: 'واحد' },
            { key: 'amount', title: 'مبلغ' },
            { key: 'priority', title: 'اولویت', render: (v: string) => <PriorityBadge priority={v} /> },
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
            { key: 'date', title: 'تاریخ' },
          ]}
        />
      </div>
    );
  }

  return <ModuleDashboard moduleId="srm" />;
}

// === Incident Module ===
export function IncidentModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'active') {
    return (
      <div className="space-y-6 animate-fade-in">
        <DataTable
          title="حوادث فعال"
          data={incidents}
          columns={[
            { key: 'id', title: 'شماره', render: (v: string) => <span className="font-mono text-blue-400">{v}</span> },
            { key: 'title', title: 'عنوان' },
            { key: 'severity', title: 'شدت', render: (v: string) => <PriorityBadge priority={v} /> },
            { key: 'area', title: 'محل' },
            { key: 'reportedBy', title: 'گزارش‌دهنده' },
            { key: 'status', title: 'وضعیت', render: (v: string) => <StatusBadge status={v} /> },
            { key: 'date', title: 'تاریخ' },
          ]}
        />
      </div>
    );
  }

  return <ModuleDashboard moduleId="incidents" />;
}

// === Generic Dashboard ===
function ModuleDashboard({ moduleId }: { moduleId: string }) {
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) return null;

  const Icon = mod.icon;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${mod.color}15` }}>
            <Icon size={28} style={{ color: mod.color }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{mod.title}</h2>
            <p className="text-zinc-500">{mod.description} — {mod.titleEn}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mod.pages.filter(p => p.id !== 'dashboard').map((page) => {
          const PageIcon = page.icon;
          return (
            <button
              key={page.id}
              onClick={() => useAppStore.getState().setCurrentPage(page.id)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 text-right transition-all group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${mod.color}15` }}>
                <PageIcon size={18} style={{ color: mod.color }} />
              </div>
              <h3 className="text-white font-medium">{page.title}</h3>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">فعالیت اخیر</h3>
          <div className="space-y-3">
            {['ثبت رکورد جدید', 'ویرایش اطلاعات', 'تأیید درخواست', 'گزارش‌گیری', 'به‌روزرسانی وضعیت'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mod.color }} />
                <span className="text-zinc-400">{item}</span>
                <span className="mr-auto text-xs text-zinc-600">{i + 1} ساعت پیش</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">آمار سریع</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">۱۲</div>
              <div className="text-xs text-zinc-500 mt-1">فعال</div>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">۴۵</div>
              <div className="text-xs text-zinc-500 mt-1">تکمیل شده</div>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">۳</div>
              <div className="text-xs text-zinc-500 mt-1">در انتظار</div>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">۹۸%</div>
              <div className="text-xs text-zinc-500 mt-1">عملکرد</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Placeholder Module ===
export function PlaceholderModule({ moduleId }: { moduleId: string }) {
  return <ModuleDashboard moduleId={moduleId} />;
}
