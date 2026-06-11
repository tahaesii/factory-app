import { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
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
              <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>کد ملی</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="input-field" dir="ltr" placeholder="username" />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>شماره تلفن</label>
              <div className="relative">
                <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11" dir="ltr" placeholder="09*********" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" style={{ accentColor: '#00C2FF' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>مرا به خاطر بسپار</span>
              </label>
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
      </div>
    </div>
  );
}
