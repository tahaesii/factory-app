import { X, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "password"
    | "select"
    | "textarea"
    | "date"
    | "time"
    | "checkbox"
    | "radio"
    | "file"
    | "color";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  disabled?: boolean;
  min?: number;
  max?: number;
  rows?: number;
  colSpan?: 1 | 2;
  validation?: (value: any) => string | null;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  initialData?: Record<string, any>;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  submitLabel = "ذخیره",
  cancelLabel = "انصراف",
  loading = false,
  initialData = {},
  size = "md",
}: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = initialData[f.name] ?? f.defaultValue ?? "";
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = "این فیلد الزامی است";
      }
      if (field.validation) {
        const error = field.validation(formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const baseInputClass = `w-full bg-card border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted outline-none transition-all ${
      errors[field.name]
        ? "border-red-500"
        : "border-default focus:border-blue-500"
    } ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`;

    switch (field.type) {
      case "select":
        return (
          <select
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={baseInputClass}
            disabled={field.disabled}
          >
            <option value="">{field.placeholder || "انتخاب کنید..."}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={baseInputClass}
            disabled={field.disabled}
          />
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
              disabled={field.disabled}
            />
            <span className="text-primary text-sm">{field.placeholder}</span>
          </label>
        );

      case "radio":
        return (
          <div className="flex flex-wrap gap-4">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={formData[field.name] === opt.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-4 h-4 bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
                  disabled={field.disabled}
                />
                <span className="text-primary text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "color":
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData[field.name] || "#3b82f6"}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-10 h-10 rounded-lg border-none cursor-pointer"
              disabled={field.disabled}
            />
            <input
              type="text"
              value={formData[field.name] || "#3b82f6"}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`${baseInputClass} font-mono text-sm`}
              dir="ltr"
              disabled={field.disabled}
            />
          </div>
        );
      case "date":
        return (
          <DatePicker
            value={formData[field.name]}
            onChange={(date) =>
              handleChange(field.name, date ? date.format("YYYY/MM/DD") : "")
            }
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            calendarPosition="bottom-right"
            inputClass={baseInputClass}
            containerClassName="w-full"
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={formData[field.name]}
            onChange={(e) =>
              handleChange(
                field.name,
                field.type === "number"
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className={baseInputClass}
            dir={
              field.type === "email" || field.type === "tel" ? "ltr" : undefined
            }
            disabled={field.disabled}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-card border border-default rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-slide-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default">
          <h3 className="text-lg font-bold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-primary hover:bg-card rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]"
        >
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.colSpan === 2 ? "col-span-2" : ""}
              >
                <label className="block text-secondary text-sm mb-1.5">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 mr-1">*</span>
                  )}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-default">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-secondary hover:text-primary hover:bg-card rounded-xl transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
