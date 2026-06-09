import {
  Activity, TriangleAlert, BarChart3, CheckCircle2,
  Clock, Factory, Gauge, Package, Shield, Users, Wrench, Zap, TrendingUp, TrendingDown
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { chartData, productionOrders, assets } from '@/data/mockData';
import { useAppStore } from '@/store/appStore';

function KPICard({ title, value, unit, change, changeType, icon: Icon, color }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{title}</p>
          <p className="text-2xl font-black text-white mt-1">{value}<span className="text-sm text-zinc-500 font-normal mr-1">{unit}</span></p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {changeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`} style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function LiveAlert({ title, message, type, time }: any) {
  const colors: Record<string, string> = {
    warning: 'border-amber-500/30 bg-amber-500/5',
    error: 'border-red-500/30 bg-red-500/5',
    success: 'border-green-500/30 bg-green-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
  };
  const icons: Record<string, any> = {
    warning: <TriangleAlert size={14} className="text-amber-500" />,
    error: <TriangleAlert size={14} className="text-red-500" />,
    success: <CheckCircle2 size={14} className="text-green-500" />,
    info: <Activity size={14} className="text-blue-500" />,
  };
  return (
    <div className={`border rounded-xl px-4 py-3 ${colors[type]}`}>
      <div className="flex items-center gap-2">
        {icons[type]}
        <span className="text-sm font-medium text-white flex-1">{title}</span>
        <span className="text-[10px] text-zinc-600">{time}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1 mr-6">{message}</p>
    </div>
  );
}

export function CommandCenterDashboard() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'kpis') return <KPIsPage />;
  if (currentPage === 'alerts') return <AlertsPage />;
  if (currentPage === 'monitoring') return <MonitoringPage />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="OEE کل" value="۸۶.۴" unit="%" change="+۲.۱٪ نسبت به هفته قبل" changeType="up" icon={Gauge} color="#3b82f6" />
        <KPICard title="نرخ تولید" value="۴,۸۵۰" unit="قطعه/روز" change="+۵.۳٪" changeType="up" icon={Factory} color="#10b981" />
        <KPICard title="توقفات" value="۲.۳" unit="ساعت" change="-۱۲٪" changeType="up" icon={Clock} color="#f59e0b" />
        <KPICard title="نرخ کیفیت" value="۹۶.۲" unit="%" change="+۰.۸٪" changeType="up" icon={Shield} color="#22c55e" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="دستور کار باز" value="۱۲" unit="" change="" changeType="" icon={Wrench} color="#ef4444" />
        <KPICard title="موجودی بحرانی" value="۳" unit="قلم" change="" changeType="" icon={Package} color="#f97316" />
        <KPICard title="حضور امروز" value="۸۵" unit="نفر" change="" changeType="" icon={Users} color="#ec4899" />
        <KPICard title="حوادث فعال" value="۲" unit="" change="" changeType="" icon={TriangleAlert} color="#ef4444" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Production Trend */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" /> روند تولید ماهانه
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData.productionTrend}>
              <defs>
                <linearGradient id="gradPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="planned" stroke="#3b82f6" fill="url(#gradPlanned)" name="برنامه‌ریزی" />
              <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#gradActual)" name="واقعی" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Downtime Pie */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" /> علل توقفات
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData.downtimeByReason} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" stroke="none">
                {chartData.downtimeByReason.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {chartData.downtimeByReason.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-400">{item.name}</span>
                </div>
                <span className="text-zinc-500">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OEE Chart + Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Gauge size={16} className="text-green-500" /> OEE هفتگی
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.oeeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="availability" fill="#3b82f6" name="دسترسی" radius={[4, 4, 0, 0]} />
              <Bar dataKey="performance" fill="#10b981" name="عملکرد" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quality" fill="#f59e0b" name="کیفیت" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Zap size={16} className="text-red-500" /> هشدارهای زنده
          </h3>
          <div className="space-y-3">
            <LiveAlert title="پمپ هیدرولیک از کار افتاد" message="سالن ۳ - نیاز به تعمیر فوری" type="error" time="۲ دقیقه پیش" />
            <LiveAlert title="دمای کوره بالا" message="دمای کوره ۲ به ۸۵۰°C رسید" type="warning" time="۵ دقیقه پیش" />
            <LiveAlert title="سفارش تکمیل شد" message="PO-2024-0891 - قطعه آلومینیومی" type="success" time="۱۵ دقیقه پیش" />
            <LiveAlert title="موجودی بحرانی" message="روغن هیدرولیک ISO 46 - ۳۰ لیتر" type="warning" time="۳۰ دقیقه پیش" />
          </div>
        </div>
      </div>

      {/* Production Orders + Equipment */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Factory size={16} className="text-green-500" /> سفارشات تولید فعال
          </h3>
          <div className="space-y-3">
            {productionOrders.filter((o) => o.status === 'active').map((order) => (
              <div key={order.id} className="bg-zinc-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{order.product}</span>
                  <span className="text-xs text-zinc-500 font-mono">{order.id}</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-1.5">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${order.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{order.completed.toLocaleString()} / {order.quantity.toLocaleString()}</span>
                  <span>{order.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Wrench size={16} className="text-red-500" /> وضعیت تجهیزات
          </h3>
          <div className="space-y-3">
            {assets.map((asset) => {
              const statusBg = asset.status === 'running' ? 'bg-green-500' : asset.status === 'warning' ? 'bg-amber-500' : 'bg-red-500';
              const healthColor = asset.health > 80 ? 'bg-green-500' : asset.health > 50 ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div key={asset.id} className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusBg} ${asset.status === 'running' ? 'animate-pulse' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{asset.name}</p>
                    <p className="text-xs text-zinc-500">{asset.location}</p>
                  </div>
                  <div className="text-left w-16">
                    <div className="w-full bg-zinc-700 rounded-full h-1.5">
                      <div className={`${healthColor} h-1.5 rounded-full`} style={{ width: `${asset.health}%` }} />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{asset.health}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white">شاخص‌های کلیدی عملکرد (KPI)</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="OEE" value="۸۶.۴" unit="%" change="+۲.۱٪" changeType="up" icon={Gauge} color="#3b82f6" />
        <KPICard title="دسترسی" value="۹۱.۲" unit="%" change="+۱.۵٪" changeType="up" icon={Activity} color="#10b981" />
        <KPICard title="عملکرد" value="۸۸.۷" unit="%" change="+۳.۲٪" changeType="up" icon={Zap} color="#f59e0b" />
        <KPICard title="کیفیت" value="۹۶.۲" unit="%" change="+۰.۸٪" changeType="up" icon={Shield} color="#22c55e" />
        <KPICard title="MTBF" value="۱۲۰" unit="ساعت" change="+۸ ساعت" changeType="up" icon={Wrench} color="#8b5cf6" />
        <KPICard title="MTTR" value="۲.۵" unit="ساعت" change="-۳۰ دقیقه" changeType="up" icon={Clock} color="#ef4444" />
        <KPICard title="نرخ ضایعات" value="۱.۸" unit="%" change="-۰.۳٪" changeType="up" icon={TriangleAlert} color="#f97316" />
        <KPICard title="بهره‌وری نیروی کار" value="۹۲.۵" unit="%" change="+۱.۲٪" changeType="up" icon={Users} color="#ec4899" />
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-4">روند OEE ماهانه</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData.oeeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} domain={[60, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Legend />
            <Line type="monotone" dataKey="availability" stroke="#3b82f6" strokeWidth={2} name="دسترسی" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} name="عملکرد" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="quality" stroke="#f59e0b" strokeWidth={2} name="کیفیت" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AlertsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">هشدارها و اعلان‌ها</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium">بحرانی (۱)</button>
          <button className="px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-sm font-medium">هشدار (۲)</button>
          <button className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium">اطلاعاتی (۱)</button>
        </div>
      </div>
      <div className="space-y-3">
        <LiveAlert title="پمپ هیدرولیک از کار افتاد" message="سالن ۳ - پمپ هیدرولیک خط ۳ از کار افتاده و نیاز به تعمیر فوری دارد" type="error" time="۲ دقیقه پیش" />
        <LiveAlert title="دمای کوره بالا" message="دمای کوره ۲ به ۸۵۰°C رسید - آستانه هشدار ۸۰۰°C" type="warning" time="۵ دقیقه پیش" />
        <LiveAlert title="موجودی بحرانی روغن" message="موجودی روغن هیدرولیک ISO 46 به ۳۰ لیتر رسید - حداقل: ۱۰۰ لیتر" type="warning" time="۳۰ دقیقه پیش" />
        <LiveAlert title="سفارش تولید PO-2024-0891 تکمیل شد" message="قطعه آلومینیومی A45 - ۱۱۸۰ عدد تولید شد" type="success" time="۱ ساعت پیش" />
        <LiveAlert title="بازرسی ورودی محموله M-2233" message="نتیجه: تأیید - بدون عیب" type="info" time="۲ ساعت پیش" />
      </div>
    </div>
  );
}

function MonitoringPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white">مانیتورینگ زنده</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const borderColor = asset.status === 'running' ? 'border-green-500/30' : asset.status === 'warning' ? 'border-amber-500/30' : 'border-red-500/30';
          const statusBg = asset.status === 'running' ? 'bg-green-500' : asset.status === 'warning' ? 'bg-amber-500' : 'bg-red-500';
          const statusText = asset.status === 'running' ? 'در حال کار' : asset.status === 'warning' ? 'هشدار' : 'متوقف';
          return (
            <div key={asset.id} className={`bg-zinc-900 border ${borderColor} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">{asset.name}</h3>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg}/10`}>
                  <div className={`w-2 h-2 rounded-full ${statusBg} ${asset.status === 'running' ? 'animate-pulse' : ''}`} />
                  <span className={asset.status === 'running' ? 'text-green-500' : asset.status === 'warning' ? 'text-amber-500' : 'text-red-500'}>{statusText}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-zinc-500">سلامت</p>
                  <p className="text-lg font-bold text-white">{asset.health}%</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-zinc-500">مکان</p>
                  <p className="text-sm font-medium text-white">{asset.location}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                آخرین نت: {asset.lastMaintenance}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
