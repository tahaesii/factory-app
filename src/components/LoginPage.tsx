import LoginForm from "@/components/LoginForm";
import LoginBranding from "@/components/LoginBranding";
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
  { icon: Cpu, label: "AI-Powered Analytics" },
  { icon: Shield, label: "Military-Grade Security" },
  { icon: Zap, label: "Real-Time IoT" },
  { icon: Database, label: "Enterprise ERP" },
  { icon: Globe, label: "Multi-Tenant SaaS" },
  { icon: BarChart3, label: "Advanced Visualization" },
  { icon: Cog, label: "MES Integration" },
  { icon: Layers, label: "No-Code Platform" },
];

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.3) 1px, transparent 0)`,
      }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" />
      </div>

      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="w-full lg:w-1/2 items-center justify-center relative z-10">
        <LoginForm />
      </div>
      <LoginBranding
        title="Revolutionizing"
        subtitle="Industry 4.0"
        brandName="FACTORY OS X PRO"
        brandDescription="Next-Gen Platform"
        features={feat.slice(0, 8)}
      />
    </div>
  );
}
