import { useState } from 'react';
import { Settings, Eye, EyeOff, LogIn, AlertCircle, Command } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [username, setUsername] = useState('amir');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--color-surface)' }}>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px]" style={{ background: 'radial-gradient(circle, #00C2FF 0%, transparent 70%)', opacity: 0.3 }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: '#00C2FF', opacity: 0.1 }} />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: '#00C2FF', boxShadow: '0 8px 32px #00C2FF30' }}>
            <Settings className="w-9 h-9 text-[#020817] animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-[900]" style={{ color: 'var(--color-text)' }}>
            Factory<span style={{ color: '#00C2FF' }}>OS</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Industrial Operating System</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>ورود به سیستم</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>اطلاعات حساب کاربری خود را وارد کنید</p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm animate-fade-in" style={{ background: '#EF444415', border: '1px solid #EF444430', color: '#EF4444' }}>
              <AlertCircle size={16} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>نام کاربری</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="input-field" dir="ltr" placeholder="username" />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>رمز عبور</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11" dir="ltr" placeholder="رمز عبور" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" style={{ accentColor: '#00C2FF' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>مرا به خاطر بسپار</span>
              </label>
              <button type="button" className="text-sm transition-colors" style={{ color: '#00C2FF' }}>فراموشی رمز؟</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: '#00C2FF', color: '#020817', boxShadow: '0 4px 16px #00C2FF25' }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#02081730] border-t-[#020817] rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} />ورود</>
              )}
            </button>
          </form>
        </div>

        <div className="mt-5 rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--color-card) 50%, transparent)', border: '1px solid var(--color-border)' }}>
          <p className="text-[11px] mb-3" style={{ color: 'var(--color-text-muted)' }}>حساب‌های دمو:</p>
          <div className="space-y-1.5">
            {[
              { username: 'amir', pass: '123456', role: 'مدیر سیستم', icon: '👑', factory: 'FactoryOS Cloud' },
              { username: 'mohammad', pass: '123456', role: 'مدیر تولید', icon: '🏭', factory: 'فولاد مبارکه' },
              { username: 'sara', pass: '123456', role: 'اپراتور', icon: '⚙️', factory: 'خط تولید ۱' },
              { username: 'hasan', pass: '123456', role: 'سرپرست', icon: '🔧', factory: 'تعمیرات' },
              { username: 'reza', pass: '123456', role: 'تکنسین', icon: '🛠️', factory: 'نت' },
              { username: 'mehdi', pass: '123456', role: 'مهندس', icon: '📊', factory: 'فرآیند' },
              { username: 'hamid', pass: '123456', role: 'ناظر', icon: '👁️', factory: 'کیفیت' },
            ].map((acc) => (
              <button key={acc.username} type="button"
                onClick={() => { setUsername(acc.username); setPassword(acc.pass); }}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2 transition-all group"
                style={{ background: 'color-mix(in srgb, var(--color-card) 25%, transparent)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-card)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'color-mix(in srgb, var(--color-card) 25%, transparent)')}>
                <span className="flex items-center gap-2">
                  <span>{acc.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{acc.role}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#00C2FF12', color: '#00C2FF' }}>{acc.factory}</span>
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }} dir="ltr">{acc.username} / {acc.pass}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] mt-6 flex items-center justify-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
          FactoryOS v2.0 — Industrial Operating System
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px]" style={{ background: 'var(--color-card)', color: 'var(--color-text-muted)' }}>
            <Command size={9} />K
          </kbd>
        </p>
      </div>
    </div>
  );
}
