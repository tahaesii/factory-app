import { useState } from 'react';
import { LogIn, AlertCircle, IdCard, Phone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function LoginForm() {
  const [username, setUsername] = useState('amir');
  const [password, setPassword] = useState('123456');
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px]" />

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
              <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="input-field" dir="rtl" placeholder="username" />
                </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>شماره تلفن</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11" dir="rtl" placeholder="09*********" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" style={{ accentColor: '#00C2FF' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>مرا به خاطر بسپار</span>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-[#00C2FF] text-[#020817] shadow-[0_4px_16px_#00C2FF25] hover:bg-[#00a6d6] cursor-pointer">
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
