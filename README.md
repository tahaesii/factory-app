# 🏭 FactoryOS — سیستم عامل صنعتی

یک SPA (Single Page Application) پیشرفته برای مدیریت کارخانه‌های هوشمند با معماری **Multi-Tenant** و بیش از ۲۴ ماژول صنعتی.

---

## 🚀 شروع سریع (روی سیستم جدید)

### ۱. پیش‌نیازها

| نیازمندی | نسخه حداقل | توضیح |
|----------|-----------|-------|
| **Node.js** | v18+ (پیشنهاد v20 یا v22) | [دانلود](https://nodejs.org/) |
| **npm** | ۹+ (همراه Node.js نصب می‌شود) | |
| **مرورگر** | Chrome / Edge / Firefox (آخرین نسخه) | |

### ۲. نصب

```bash
# ۱. انتقال پوشه پروژه به سیستم مقصد
# (کل پوشه factoryos را کپی کنید)

# ۲. وارد پوشه شوید
cd factoryos

# ۳. نصب وابستگی‌ها
npm install
```

### ۳. اجرا در حالت توسعه (Development)

```bash
npm run dev
```

خروجی:
```
➜ Local:   http://localhost:5173/
```

مرورگر را باز کنید → `http://localhost:5173`

### ۴. بیلد نسخه نهایی (Production)

```bash
npm run build
```

خروجی در `dist/index.html` — یک فایل **تک‌فایل** (Single-File) با تمام JS و CSS درون‌خطی شده.
حجم نهایی: حدود **۱.۲۷ مگابایت** (gzip: ~۳۳۵ کیلوبایت)

برای تست بیلد:

```bash
npm run preview
```

### ۵. انتشار (Deploy)

فقط کافی است فایل **`dist/index.html`** را روی هر هاست استاتیک قرار دهید:

- **Vercel**: `vercel --prod` (خودکار تشخیص می‌دهد)
- **Netlify**: درگ کنید `dist/` یا کانفیگ: `Publish directory = dist`
- **GitHub Pages**: فایل `dist/index.html` را در `docs/` یا `gh-pages` برانچ بگذارید
- **Apache / Nginx**: فقط فایل `index.html` را در روت وب سرور کپی کنید
- **سرویس‌دهنده ایرانی**: هر هاست استاتیک (مثل ابرآروان، لیارا، پارس‌پک) — فقط `index.html`

> توجه: چون برنامه یک فایل Single-File است، **نیازی به سرور Node.js در پروداکشن ندارد**. فقط یک وب‌سرور استاتیک کافی است.

---

## 🧱 معماری و ساختار پروژه

```
factoryos/
├── index.html              # HTML اصلی (RTL, لود فونت Vazirmatn)
├── package.json            # وابستگی‌ها و اسکریپت‌ها
├── vite.config.ts          # کانفیگ Vite (aliases, tailwind, singlefile)
├── tsconfig.json           # تایپ‌اسکریپت کانفیگ
├── dist/                   # خروجی بیلد
│   └── index.html          # ← فایل نهایی (تک‌فایل)
├── public/                 # فایل‌های استاتیک
└── src/
    ├── main.tsx            # نقطه ورود React
    ├── App.tsx             # روت برنامه (Routing داخل‌برنامه‌ای)
    ├── index.css           # Tailwind + متغیرهای CSS (تم dark/light)
    │
    ├── components/
    │   ├── LoginPage.tsx       # صفحه ورود (۷ دمو اکانت)
    │   ├── Layout.tsx          # چیدمان اصلی (TopBar + Sidebar + Content)
    │   ├── TopBar.tsx          # نوار بالایی (پروفایل، نوتیفیکیشن، تنظیمات)
    │   ├── Sidebar.tsx         # نوار کناری (منوی داینامیک بر اساس نقش و کارخانه)
    │   ├── CommandPalette.tsx  # Cmd+K پالت فرمان
    │   │
    │   ├── ui/                 # کامپوننت‌های UI مشترک
    │   │   ├── DataTable.tsx   # جدول قابل تنظیم (مرتب‌سازی، فیلتر، صفحات)
    │   │   ├── FormModal.tsx   # مودال فرم پویا
    │   │   └── StatCard.tsx    # کارت آمار
    │   │
    │   ├── phase1/             # ماژول‌های اصلی
    │   │   ├── CorePlatform.tsx    # هسته پلتفرم
    │   │   ├── SuperAdmin.tsx      # پنل سوپرادمین
    │   │   ├── OrganizationEngine.tsx # ساختار سازمانی
    │   │   ├── WorkflowEngine.tsx  # موتور گردش کار
    │   │   └── DashboardBuilder.tsx # سازنده داشبورد
    │   │
    │   ├── phase2/             # ماژول‌های عملیاتی
    │   │   ├── MESModule.tsx
    │   │   ├── IDPModule.tsx
    │   │   ├── AlertCenter.tsx
    │   │   ├── CommandCenter.tsx
    │   │   └── IncidentEngine.tsx
    │   │
    │   ├── phase3/             # ماژول‌های تخصصی
    │   │   ├── WMSModule.tsx    # انبارداری با QR کد
    │   │   ├── CMMSModule.tsx   # نگهداری و تعمیرات
    │   │   ├── QMSModule.tsx    # کنترل کیفیت
    │   │   ├── SRMModule.tsx    # مدیریت تأمین‌کنندگان
    │   │   └── LIMSModule.tsx   # آزمایشگاه
    │   │
    │   ├── phase45/            # ماژول‌های پیشرفته
    │   │   └── AllModules.tsx   # HRM, HSE, Finance, DMS, ...
    │   │
    │   └── modules/            # ماژول‌های مجزا
    │       ├── SettingsModule.tsx  # تنظیمات
    │       ├── GenericModule.tsx   # ماژول عمومی
    │       ├── CommandCenter.tsx   # مرکز فرماندهی
    │       └── AIModule.tsx        # هوش مصنوعی
    │
    ├── store/                # State Management (Zustand)
    │   ├── authStore.ts      # احراز هویت، نقش‌ها، ماژول‌های کارخانه  <-- مهم
    │   └── appStore.ts       # وضعیت عمومی برنامه
    │
    ├── data/                 # داده‌های نمونه (Mock Data)
    │   ├── modules.ts        # تعریف تمام ماژول‌ها
    │   ├── tenantData.ts     # داده‌های مستاجرها (۳ کارخانه)
    │   ├── phase1Data.ts     # داده‌های Core/Org/Workflow/Dashboard
    │   ├── phase2Data.ts     # داده‌های MES/Incident/...
    │   ├── phase3Data.ts     # داده‌های WMS/CMMS/...
    │   ├── phase45Data.ts    # داده‌های HRM/HSE/...
    │   └── mockData.ts       # داده‌های عمومی
    │
    ├── types/                # تعریف نوع‌های TypeScript
    │   ├── index.ts          # Core + Organization + Workflow + Dashboard types
    │   ├── tenant.ts         # Tenant, CustomPage types
    │   ├── phase2.ts         # MES, Alert, Incident types
    │   └── phase3.ts         # WMS, CMMS, QMS types
    │
    ├── engines/              # موتورهای پردازشی
    │   ├── AlertEngine.ts
    │   └── EventEngine.ts
    │
    ├── services/             # سرویس‌ها
    │   └── dataService.ts    # uid generator
    │
    └── utils/
        └── cn.ts             # کلاس‌نام utility (clsx + tailwind-merge)
```

---

## 📚 کتابخانه‌های استفاده‌شده

| کتابخانه | نسخه | کاربرد |
|----------|------|--------|
| **react** | 19.2.6 | فریم‌ورک اصلی UI |
| **react-dom** | 19.2.6 | رندر DOM |
| **zustand** | ^5.0.14 | State Management (سبک و سریع) |
| **lucide-react** | ^1.17.0 | آیکون‌ها (باز، SVG) |
| **recharts** | ^3.8.1 | نمودارها (Line, Bar, Pie, Area) |
| **qrcode** | ^1.5.4 | تولید QR کد سمت کلاینت |
| **react-hot-toast** | ^2.6.0 | اعلان‌های toast |
| **clsx** | ^2.1.1 | مدیریت کلاس‌های شرطی |
| **tailwind-merge** | ^3.4.0 | ادغام کلاس‌های Tailwind |

### ابزارهای توسعه

| کتابخانه | نسخه | کاربرد |
|----------|------|--------|
| **vite** | 7.3.2 | بیلدر (سریع، مدرن) |
| **@vitejs/plugin-react** | 5.1.1 | پلاگین React برای Vite |
| **vite-plugin-singlefile** | 2.3.0 | خروجی تک‌فایل (همه چیز در index.html) |
| **tailwindcss** | 4.1.17 | فریم‌ورک CSS (utility-first) |
| **@tailwindcss/vite** | 4.1.17 | پلاگین Tailwind برای Vite |
| **typescript** | 5.9.3 | تایپ‌اسکریپت |
| **@types/react** | 19.2.7 | تایپ‌های React |
| **@types/react-dom** | 19.2.3 | تایپ‌های React DOM |
| **@types/node** | 22.19.17 | تایپ‌های Node.js |

---

## 🧑‍💻 دمو اکانت‌ها (ورود به سیستم)

۷ کاربر دمو در ۳ کارخانه:

| ایمیل | پسورد | نقش | کارخانه |
|-------|-------|------|---------|
| `admin@factoryos.ir` | `admin123` | **سوپرادمین** | FactoryOS Cloud |
| `manager@factoryos.ir` | `manager123` | مدیر | فولاد مبارکه |
| `operator@factoryos.ir` | `operator123` | اپراتور | فولاد مبارکه |
| `manager@petro.ir` | `petro123` | مدیر | پتروشیمی پارس |
| `operator@petro.ir` | `petro123` | اپراتور | پتروشیمی پارس |
| `manager@khodro.ir` | `khodro123` | مدیر | خودروسازی سینا |
| `operator@khodro.ir` | `khodro123` | اپراتور | خودروسازی سینا |

> کاربر سوپرادمین تمام ماژول‌ها را می‌بیند. سایر کاربران فقط ماژول‌های مجاز نقش و کارخانه خود را می‌بینند.

---

## 🏗 معماری Multi-Tenant

```
FactoryOS (سوپرادمین)
├── کارخانه ۱: فولاد مبارکه (ماژول‌های فعال: MES, WMS, CMMS, HSE, HRM, ...)
├── کارخانه ۲: پتروشیمی پارس (ماژول‌های فعال: MES, QMS, LIMS, HSE, ...)
└── کارخانه ۳: خودروسازی سینا (ماژول‌های فعال: MES, WMS, HRM, Finance, ...)
```

- **authStore.ts** شامل `ROLE_MODULES` (دسترسی بر اساس نقش) و `FACTORY_MODULES` (دسترسی بر اساس کارخانه)
- **SuperAdminModule** می‌تواند ماژول‌های هر کارخانه را فعال/غیرفعال کند
- سایدبار ماژول‌هایی را نشان می‌دهد که هم نقش کاربر و هم کارخانه مجاز هستند

---

## 🔧 ماژول‌ها (۲۴+ ماژول)

| ماژول | توضیحات |
|-------|---------|
| **Core Platform** | کاربران، نقش‌ها، دسترسی‌ها، لاگ، اعلان‌ها، فایل‌ها، تم |
| **Super Admin** | مدیریت کارخانه‌ها، لایسنس‌ها، سلامت سیستم، ماژول‌ها |
| **Organization Engine** | دپارتمان‌ها، پوزیشن‌ها، چارت سازمانی، درخت تأیید/اسکلیشن |
| **Workflow Engine** | گردش کار، وظایف، تأییدات |
| **Dashboard Builder** | ویجت‌های KPI/چارت/گیج/جدول، تمپلیت، داشبوردهای شخصی |
| **MES** | تولید، سفارشات، OEE، کیفیت، بسته‌بندی |
| **IDP** | دیتا لیک، پروسه‌های صنعتی، مستر دیتا |
| **Alert Center** | هشدارها، کانفیگ آستانه‌ها |
| **Incident Engine** | گزارش حادثه، چک‌لیست، RCA (۵Why/Fishbone/FTA/FMEA) |
| **Command Center** | مرکز فرماندهی لحظه‌ای |
| **WMS** | انبارداری با QR کد (ردیابی، گرید کالا، GRN) |
| **CMMS** | نگهداری و تعمیرات (دستورکارها، قطعات) |
| **QMS** | کنترل کیفیت (بازرسی، انطباق، NC، CAPA) |
| **SRM** | تأمین‌کنندگان (ارزیابی، مناقصه، قرارداد) |
| **LIMS** | آزمایشگاه (نمونه‌ها، تجهیزات، استانداردها) |
| **HRM** | پرسنل، حضور/غیاب (GPS + سلفی) |
| **HSE** | ایمنی، ریسک، حوادث |
| **Finance** | بودجه، فاکتور، هزینه‌ها |
| **DMS** | اسناد، نسخه‌بندی، تگ |
| **AI Copilot** | ۶ ارائه‌دهنده هوش مصنوعی، پرامپت‌های هوشمند |
| **Report Builder** | تولید گزارش، دانلود، ایمیل، تاریخچه |
| **Form Builder** | فرم‌ساز بصری (۱۴ کامپوننت) |
| **Marketplace** | بازارچه ماژول‌ها (نصب/حذف) |
| **No-Code Builder** | پیج‌ساز، داشبوردساز، فرم‌ساز، KPI ساز |
| **Settings** | پروفایل، تم، فعال/غیرفعال‌سازی ماژول‌ها |

---

## 🌐 ویژگی‌های فنی

- **RTL کامل**: تمام رابط کاربری راست‌چین و فارسی
- **تم Dark**: زمینه آبی-مشکی (`#020817`) با المان‌های شیشه‌ای
- **فونت Vazirmatn**: فونت وزیرمتن با ۹ وزن مختلف
- **QR Code**: تولید اسکن و ردیابی کالا با QR
- **GPS + Camera**: حضور و غیاب با موقعیت مکانی و سلفی
- **Single-File Output**: کل اپلیکیشن در یک فایل HTML برای دیپلوی آسان
- **بدون سرور**: کاملاً سمت کلاینت (Client-Side Only)

---

## 📝 کانفیگ Vite

فایل `vite.config.ts`:

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

نکات کلیدی:
- `viteSingleFile()` باعث می‌شود خروجی فقط یک `index.html` باشد
- `@` به `src/` اشاره می‌کند (مثل `import x from '@/store/authStore'`)
- Tailwind CSS v4 به صورت پلاگین Vite اضافه شده

---

## ❓ عیب‌یابی (Troubleshooting)

| مشکل | راه‌حل |
|------|--------|
| `npm install` خطا می‌دهد | Node.js را به v20+ آپدیت کنید |
| `npm run dev` کار نمی‌کند | پورت ۵۱۷۳ ممکن است گرفته باشد → `vite --port 3000` |
| `npm run build` خطا می‌دهد | `node_modules` را پاک کنید: `rm -rf node_modules && npm install` |
| فونت Vazirmatn لود نمی‌شود | اینترنت متصل باشد (فونت از Google Fonts لود می‌شود) |
| موقعیت جغرافیایی کار نمی‌کند | مرورگر باید HTTPS باشد (localhost مجاز است) |
| دوربین کار نمی‌کند | دسترسی مرورگر به دوربین را允许 کنید |
| بعد از تغییرات، Build نماید | مطمئن شوید `noUnusedLocals: true` در tsconfig تخلف ندارد |

---

## 📄 لایسنس

این پروژه یک دمو/نمونه‌سازی (Proof of Concept) است و داده‌های آن همه Mock می‌باشند.

---

> **توسعه‌دهنده:** برای هرگونه سوال یا تغییر، با دقت `authStore.ts` (کاربران و سطح دسترسی) و `modules.ts` (تعریف ماژول‌ها) را بررسی کنید.
