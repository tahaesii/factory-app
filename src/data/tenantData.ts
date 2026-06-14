import type { CustomPage } from "@/types/tenant";

export interface FactoryData {
  id: number;
  code: string;
  name: string;
  ownerName: string;
  industry: string;
  ownerMobile: string;
  ownerEmail: string;
  address: string;
  city: string;
  plan: string;
  status: string;
  expiresAt: string;
  enabledModules: string[];
}

export const customPages: CustomPage[] = [
  {
    id: "CP-001",
    title: "ثبت دمای کوره",
    category: "plc",
    factoryId: "FAC-001",
    schema: [
      {
        name: "temp",
        label: "دما (C°)",
        type: "number",
        required: true,
        placeholder: "۱۵۰۰",
      },
      {
        name: "zone",
        label: "منطقه",
        type: "select",
        required: true,
        options: [
          { value: "zone1", label: "Zone 1" },
          { value: "zone2", label: "Zone 2" },
        ],
      },
    ],
  },
  {
    id: "CP-002",
    title: "آنالیز آزمایشگاهی",
    category: "lab",
    factoryId: "FAC-001",
    schema: [
      { name: "sample_id", label: "کد نمونه", type: "text", required: true },
      { name: "result", label: "نتیجه", type: "textarea", required: true },
    ],
  },
  {
    id: "CP-003",
    title: "گزارش تولید روزانه",
    category: "form",
    factoryId: "FAC-001",
    schema: [
      {
        name: "shift",
        label: "شیفت",
        type: "select",
        required: true,
        options: [
          { value: "morning", label: "صبح" },
          { value: "evening", label: "عصر" },
        ],
      },
      {
        name: "output_qty",
        label: "تعداد تولید",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "CP-004",
    title: "ثبت فشار مخازن",
    category: "plc",
    factoryId: "FAC-002",
    schema: [
      { name: "tank_id", label: "شماره مخزن", type: "text", required: true },
      { name: "pressure", label: "فشار (bar)", type: "number", required: true },
    ],
  },
  {
    id: "CP-005",
    title: "آنالیز مواد پتروشیمی",
    category: "lab",
    factoryId: "FAC-002",
    schema: [
      { name: "material", label: "ماده", type: "text", required: true },
      { name: "purity", label: "خلوص %", type: "number", required: true },
    ],
  },
  {
    id: "CP-006",
    title: "فرم کنترل کیفیت",
    category: "form",
    factoryId: "FAC-003",
    schema: [
      { name: "product", label: "محصول", type: "text", required: true },
      { name: "inspector", label: "بازرس", type: "text", required: true },
      {
        name: "result",
        label: "نتیجه",
        type: "select",
        required: true,
        options: [
          { value: "pass", label: "قبول" },
          { value: "fail", label: "رد" },
        ],
      },
    ],
  },
];
