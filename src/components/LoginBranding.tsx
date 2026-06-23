import React from "react";
import {
  Factory,
  Cpu,
  Shield,
  Zap,
  Database,
  Globe,
  BarChart3,
  Cog,
  Layers,
} from "lucide-react";

const feat = [
  { icon: Cpu, label: "هوش مصنوعی پیشرفته" },
  { icon: Shield, label: "امنیت سازمانی" },
  { icon: Zap, label: "IoT بلادرنگ" },
  { icon: Database, label: "ERP سازمانی" },
  { icon: Globe, label: "SaaS چندمستاجری" },
  { icon: BarChart3, label: "داشبوردهای تحلیلی" },
  { icon: Cog, label: "یکپارچه‌سازی MES" },
  { icon: Layers, label: "بدون نیاز به کدنویسی" },
];

interface LoginBrandingProps {
  title?: string;
  subtitle?: string;
  brandName?: string;
  brandDescription?: string;
  features?: typeof feat;
}

export default function LoginBranding({
  title = "The Future of",
  subtitle = "Smart Manufacturing",
  brandName = "FACTORY OS X",
  brandDescription = "Industrial Operating System",
  features = feat,
}: LoginBrandingProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
      {/* Header */}
      <div className="relatived">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Factory className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {brandName}
            </h1>
            <p className="text-xs text-navy-300 tracking-widest uppercase">
              {brandDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h2 className="text-5xl font-bold text-white leading-tight mb-6">
          {title}
          <br />
          <span className="gradient-text">{subtitle}</span>
        </h2>
        <p className="text-navy-200 text-lg mb-10 max-w-md leading-relaxed">
          تمام نیازهای عملیاتی، تولیدی و سازمانی خود را با یک پلتفرم صنعتی
          یکپارچه، جایگزین ده‌ها نرم‌افزار مجزا کنید.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5"
            >
              <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-navy-200">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Add gradient-text style if not present globally */}
      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
