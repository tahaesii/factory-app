import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import LoginBranding from "@/components/LoginBranding";
import {
  Cpu,
  Shield,
  Zap,
  Database,
  Globe,
  BarChart3,
  Cog,
  Layers,
} from "lucide-react";
import OTPPage from "./OtpPage";

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

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [nationalCode, setNationalCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSuccess = (
    phone: string,
    nationalCode: string,
    rememberMe: boolean,
  ) => {
    setPhoneNumber(phone);
    setNationalCode(nationalCode);
    setRememberMe(rememberMe);
    setShowOtp(true);
  };
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
      <LoginBranding
        title="تحول‌آفرین در صنعت"
        subtitle="صنعت ۴.۰"
        brandName="FACTORY OS X PRO"
        brandDescription="پلتفرم نسل آینده"
        features={feat.slice(0, 8)}
      />
      <div className="w-full lg:w-1/2 items-center justify-center relative z-10">
        {showOtp ? (
          <OTPPage
            phoneNumber={phoneNumber}
            nationalCode={nationalCode}
            rememberMe={rememberMe}
            onBack={() => setShowOtp(false)}
          />
        ) : (
          <LoginForm onSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}
