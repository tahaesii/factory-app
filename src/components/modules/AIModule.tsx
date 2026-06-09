import { useState } from 'react';
import { Bot, Send, Brain, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  time: string;
}

const defaultMessages: Message[] = [
  { id: 1, role: 'ai', content: 'سلام! من دستیار هوشمند FactoryOS هستم. چطور می‌توانم کمکتان کنم؟ می‌توانم در تحلیل داده‌های تولید، پیش‌بینی خرابی تجهیزات، بهینه‌سازی فرآیندها و پاسخ به سؤالات شما کمک کنم.', time: '۱۰:۰۰' },
];

const quickSuggestions = [
  'وضعیت OEE امروز چطور است؟',
  'تجهیزاتی که نیاز به تعمیر فوری دارند کدامند؟',
  'پیش‌بینی تولید ماه آینده را نشان بده',
  'علت اصلی توقفات این هفته چیست؟',
];

const aiResponses: Record<string, string> = {
  'وضعیت OEE امروز چطور است؟': 'OEE کل کارخانه امروز ۸۶.۴٪ است که نسبت به دیروز ۱.۲٪ بهبود داشته. دسترسی: ۹۱.۲٪ | عملکرد: ۸۸.۷٪ | کیفیت: ۹۶.۲٪. خط ۱ بهترین عملکرد (OEE: ۹۲%) و خط ۳ ضعیف‌ترین (OEE: ۷۸%) را داشته‌اند.',
  'تجهیزاتی که نیاز به تعمیر فوری دارند کدامند؟': '⚠️ ۲ تجهیز نیاز به توجه فوری دارند:\n\n1. **پمپ هیدرولیک** (EQ-005) - سالن ۳\n   سلامت: ۲۳٪ | وضعیت: متوقف | نت بعدی: فوری\n   ⟵ دستور کار WO-002 صادر شده\n\n2. **پرس هیدرولیک** (EQ-002) - سالن ۱\n   سلامت: ۶۷٪ | وضعیت: هشدار | نت بعدی: ۱۴۰۳/۱۰/۲۰\n   ⟵ پیشنهاد: تعویض فیلتر روغن قبل از موعد',
  'پیش‌بینی تولید ماه آینده را نشان بده': 'بر اساس تحلیل داده‌های ۶ ماه اخیر:\n\n📊 پیش‌بینی تولید بهمن ماه: ۵,۳۵۰ قطعه\n📈 رشد مورد انتظار: ۴.۵٪\n⚡ نرخ بهره‌وری پیش‌بینی: ۸۸٪\n\n🔍 عوامل مؤثر:\n- افزایش ظرفیت خط ۴\n- نت پیشگیرانه برنامه‌ریزی شده\n- سفارشات جدید مشتریان',
  'علت اصلی توقفات این هفته چیست؟': 'تحلیل علل توقفات این هفته:\n\n1. 🔧 خرابی مکانیکی: ۳۵٪ (بیشترین)\n   - پمپ هیدرولیک خط ۳\n   - سیلندر پرس\n\n2. 🔄 تغییر قالب: ۲۵٪\n   - پیشنهاد: استفاده از SMED\n\n3. 📦 کمبود مواد: ۱۵٪\n   - روغن هیدرولیک و میلگرد\n\n💡 پیشنهاد: تمرکز بر نت پیشگیرانه و بهبود فرآیند تغییر قالب',
};

export function AIModule() {
  const currentPage = useAppStore((s) => s.currentPage);

  if (currentPage === 'assistant') return <AIAssistant />;
  if (currentPage === 'agents') return <AIAgents />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-500/15">
            <Brain size={28} className="text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">هوش مصنوعی FactoryOS</h2>
            <p className="text-zinc-500">دستیار هوشمند، تحلیل‌گر و پیش‌بینی‌کننده</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {[
          { title: 'دستیار AI', desc: 'گفتگو با هوش مصنوعی', icon: Bot, color: '#d946ef', page: 'assistant' },
          { title: 'تحلیل هوشمند', desc: 'تحلیل خودکار داده‌ها', icon: Activity, color: '#3b82f6', page: 'analytics' },
          { title: 'پیش‌بینی', desc: 'پیش‌بینی تولید و خرابی', icon: TrendingUp, color: '#10b981', page: 'predictions' },
          { title: 'عامل‌های AI', desc: 'مدیران هوشمند کارخانه', icon: Bot, color: '#f59e0b', page: 'agents' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => useAppStore.getState().setCurrentPage(item.page)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 text-right transition-all group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
                <Icon size={22} style={{ color: item.color }} />
              </div>
              <h3 className="text-white font-bold">{item.title}</h3>
              <p className="text-zinc-500 text-sm mt-1">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text, time: 'الان' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || `در حال تحلیل سؤال شما: "${text}"\n\nبر اساس داده‌های موجود در سیستم، این موضوع نیاز به بررسی دقیق‌تر دارد. پیشنهاد می‌کنم از داشبورد مرتبط بازدید کنید یا گزارش تفصیلی درخواست دهید.`;
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', content: response, time: 'الان' };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Bot size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-white font-bold">دستیار هوشمند FactoryOS</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-zinc-500">آنلاین</span>
            </div>
          </div>
          <div className="mr-auto flex items-center gap-1">
            <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full font-medium">GPT-4</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-medium">Claude</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-200'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} className="text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                <p className="text-[10px] mt-1.5 opacity-50">{msg.time}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-end">
              <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded-full transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="سؤال خود را بپرسید..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white py-3"
            />
            <button
              onClick={() => sendMessage(input)}
              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAgents() {
  const agents = [
    { title: 'AI مدیرعامل', desc: 'تصمیم‌گیری استراتژیک و نظارت کلی', icon: '🏢', status: 'فعال', accuracy: '94%' },
    { title: 'AI مدیر تولید', desc: 'بهینه‌سازی خطوط تولید و برنامه‌ریزی', icon: '🏭', status: 'فعال', accuracy: '91%' },
    { title: 'AI مدیر نگهداری', desc: 'پیش‌بینی خرابی و برنامه‌ریزی نت', icon: '🔧', status: 'فعال', accuracy: '89%' },
    { title: 'AI مدیر انبار', desc: 'بهینه‌سازی موجودی و سفارش خودکار', icon: '📦', status: 'فعال', accuracy: '92%' },
    { title: 'AI مدیر خرید', desc: 'تحلیل تأمین‌کنندگان و قیمت‌گذاری', icon: '🛒', status: 'فعال', accuracy: '87%' },
    { title: 'AI مدیر کیفیت', desc: 'تشخیص عیب و تحلیل روند', icon: '🛡️', status: 'آزمایشی', accuracy: '85%' },
    { title: 'AI مدیر ایمنی', desc: 'تحلیل ریسک و پیش‌بینی حوادث', icon: '⚠️', status: 'آزمایشی', accuracy: '83%' },
    { title: 'AI مدیر منابع انسانی', desc: 'تحلیل بهره‌وری و پیشنهاد آموزش', icon: '👥', status: 'غیرفعال', accuracy: '-' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="text-purple-500" /> عامل‌های هوشمند کارخانه (AI Factory Brain)
        </h2>
        <p className="text-zinc-500 mt-1">هر عامل هوشمند مسئول یک حوزه مشخص از کارخانه است</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div key={agent.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
            <div className="text-4xl mb-3">{agent.icon}</div>
            <h3 className="text-white font-bold">{agent.title}</h3>
            <p className="text-zinc-500 text-sm mt-1">{agent.desc}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                agent.status === 'فعال' ? 'bg-green-500/10 text-green-500' :
                agent.status === 'آزمایشی' ? 'bg-amber-500/10 text-amber-500' :
                'bg-zinc-500/10 text-zinc-500'
              }`}>
                {agent.status}
              </span>
              <span className="text-xs text-zinc-500">دقت: {agent.accuracy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
