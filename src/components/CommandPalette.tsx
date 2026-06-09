import { useState, useEffect, useMemo } from 'react';
import { Search, Command, CornerDownLeft, FileText, Wrench, Factory, TriangleAlert, Warehouse, Shield, Brain } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { modules } from '@/data/modules';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  category: string;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setCurrentModule, setCurrentPage } = useAppStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const allItems: PaletteItem[] = useMemo(() => {
    const items: PaletteItem[] = [];

    // Navigation
    modules.forEach((mod) => {
      items.push({
        id: `nav-${mod.id}`,
        title: mod.title,
        subtitle: mod.titleEn,
        icon: mod.icon,
        category: 'ناوبری',
        action: () => { setCurrentModule(mod.id); setCurrentPage(mod.pages[0]?.id || 'dashboard'); },
      });
      mod.pages.forEach((page) => {
        items.push({
          id: `nav-${mod.id}-${page.id}`,
          title: `${mod.title} → ${page.title}`,
          subtitle: mod.titleEn,
          icon: page.icon,
          category: 'صفحه',
          action: () => { setCurrentModule(mod.id); setCurrentPage(page.id); },
        });
      });
    });

    // Quick Actions
    const quickActions = [
      { title: 'ایجاد حادثه جدید', icon: TriangleAlert, module: 'incidents', page: 'active' },
      { title: 'ایجاد درخواست خرید', icon: FileText, module: 'srm', page: 'requests' },
      { title: 'ایجاد دستور کار', icon: Wrench, module: 'cmms', page: 'workorders' },
      { title: 'ثبت تولید', icon: Factory, module: 'mes', page: 'entry' },
      { title: 'ایجاد سفارش تولید', icon: Factory, module: 'mes', page: 'orders' },
      { title: 'ثبت ورود کالا', icon: Warehouse, module: 'wms', page: 'receiving' },
      { title: 'ثبت بازرسی', icon: Shield, module: 'qms', page: 'inspections' },
      { title: 'تحلیل با AI', icon: Brain, module: 'ai', page: 'dashboard' },
    ];
    quickActions.forEach((a) => {
      items.push({
        id: `action-${a.title}`,
        title: a.title,
        icon: a.icon,
        category: 'اقدام سریع',
        action: () => { setCurrentModule(a.module); setCurrentPage(a.page); },
      });
    });

    return items;
  }, [setCurrentModule, setCurrentPage]);

  const filtered = useMemo(() => {
    if (!query) return allItems.slice(0, 12);
    const q = query.toLowerCase();
    return allItems.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      setOpen(false);
    }
  };

  if (!open) return null;

  const grouped: Record<string, PaletteItem[]> = {};
  filtered.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative flex justify-center pt-[15vh]">
        <div className="w-full max-w-xl bg-card border border-default rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
          {/* Search */}
          <div className="flex items-center gap-3 px-5 border-b border-default">
            <Search size={18} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="جستجو در FactoryOS... (ماژول، صفحه، اقدام)"
              className="flex-1 bg-transparent border-none outline-none text-primary py-4 text-[15px] placeholder:text-secondary"
            />
            <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-secondary bg-card-hover px-2 py-1 rounded-md">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-secondary">
                نتیجه‌ای یافت نشد
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-5 py-1.5 text-[10px] font-bold text-secondary uppercase tracking-wider">
                    {category}
                  </div>
                  {items.map((item) => {
                    const globalIndex = filtered.indexOf(item);
                    const Icon = item.icon;
                    const isSelected = globalIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { item.action(); setOpen(false); }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-right transition-all ${
                          isSelected ? 'bg-[#00C2FF10] text-[#00C2FF]' : 'text-muted hover:bg-card-hover'
                        }`}
                      >
                        <Icon size={16} className={isSelected ? 'text-[#00C2FF]' : 'text-secondary'} />
                        <span className={`flex-1 text-sm ${isSelected ? 'text-primary' : ''}`}>
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-[10px] text-secondary">{item.subtitle}</span>
                        )}
                        {isSelected && <CornerDownLeft size={12} className="text-[#00C2FF]" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 border-t border-default flex items-center justify-between text-[10px] text-secondary">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><kbd className="bg-card-hover px-1.5 py-0.5 rounded">↑↓</kbd> حرکت</span>
              <span className="flex items-center gap-1"><kbd className="bg-card-hover px-1.5 py-0.5 rounded">↵</kbd> انتخاب</span>
            </div>
            <span className="flex items-center gap-1"><Command size={10} /> + K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
