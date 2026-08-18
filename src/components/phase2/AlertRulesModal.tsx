import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, Save, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { telemetryService, AlertRule } from "@/services/telemetryService";
import { useAuthStore } from "@/store/authStore";
import type { AlertRulePayload } from "@/types/phase2";

// ── Types ──

interface AlertRuleDraft {
  /** present when this row corresponds to an existing server-side rule */
  id?: number;
  min_value: string;
  max_value: string;
  severity: "info" | "warning" | "critical";
  message: string;
  is_active: boolean;
  /** snapshot of original values to detect changes */
  _snapshot?: string;
}

interface AlertRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorId: string;
  sensorName: string;
  sensorUnit: string;
}

// ── Severity options ──

const SEVERITY_OPTIONS: {
  value: AlertRuleDraft["severity"];
  label: string;
  color: string;
}[] = [
  { value: "info", label: "اطلاع", color: "#3b82f6" },
  { value: "warning", label: "هشدار", color: "#f59e0b" },
  { value: "critical", label: "بحرانی", color: "#ef4444" },
];

// ── Helpers ──

function createEmptyRule(): AlertRuleDraft {
  return {
    min_value: "",
    max_value: "",
    severity: "info",
    message: "",
    is_active: true,
  };
}

function draftKey(d: AlertRuleDraft): string {
  return `${d.min_value}|${d.max_value}|${d.severity}|${d.message}|${d.is_active}`;
}

function fromServerRule(r: AlertRule): AlertRuleDraft {
  const d: AlertRuleDraft = {
    id: r.id,
    min_value: r.min_value !== null && r.min_value !== undefined ? String(r.min_value) : "",
    max_value: r.max_value !== null && r.max_value !== undefined ? String(r.max_value) : "",
    severity: r.severity,
    message: r.message,
    is_active: r.is_active,
  };
  d._snapshot = draftKey(d);
  return d;
}

// ── Component ──

export default function AlertRulesModal({
  isOpen,
  onClose,
  sensorId,
  sensorName,
  sensorUnit,
}: AlertRulesModalProps) {
  const user = useAuthStore((s) => s.user);
  const factoryId = user?.factory ?? 1;

  const [rules, setRules] = useState<AlertRuleDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  /** IDs currently being deleted — used to show inline spinners */
  const [deleting, setDeleting] = useState<Set<number>>(new Set());

  // Fetch existing rules whenever the modal opens
  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await telemetryService.getAlertRules(sensorId);
      if (data.length > 0) {
        setRules(data.map(fromServerRule));
      } else {
        setRules([createEmptyRule()]);
      }
    } catch {
      // If fetch fails, start with a blank rule
      setRules([createEmptyRule()]);
    } finally {
      setLoading(false);
    }
  }, [sensorId]);

  useEffect(() => {
    if (isOpen) {
      fetchRules();
    }
  }, [isOpen, fetchRules]);

  // ── Helpers ──

  const updateRule = (
    index: number,
    field: keyof AlertRuleDraft,
    value: any,
  ) => {
    setRules((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  };

  const addRule = () => {
    setRules((prev) => [...prev, createEmptyRule()]);
  };

  const removeRule = async (index: number) => {
    const rule = rules[index];
    if (!rule) return;
    if (rules.length <= 1 && rule.id === undefined) {
      return;
    }

    if (rule.id === undefined) {
      setRules((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    const ruleId = rule.id;

    if (deleting.has(ruleId)) return;

    setDeleting((prev) => new Set(prev).add(ruleId));

    try {
      await telemetryService.deleteAlertRule(ruleId);
      setRules((prev) => prev.filter((_, i) => i !== index));
      toast.success("قانون اعلان با موفقیت حذف شد");
      
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "خطا در حذف قانون اعلان";
      toast.error(msg);
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(ruleId);
        return next;
      });
    }
  };

  // ── Validation ──

  const validateRules = (): boolean => {
    for (let i = 0; i < rules.length; i++) {
      const r = rules[i];
      const hasMin = r.min_value !== "" && r.min_value !== undefined && r.min_value !== null;
      const hasMax = r.max_value !== "" && r.max_value !== undefined && r.max_value !== null;

      if (!hasMin && !hasMax) {
        toast.error(`حداقل یا حداکثر مقدار برای قانون ${i + 1} باید وارد شود`);
        return false;
      }

      const min = hasMin ? Number(r.min_value) : null;
      const max = hasMax ? Number(r.max_value) : null;

      if (min !== null && isNaN(min)) {
        toast.error(`مقدار حداقل قانون ${i + 1} باید عددی باشد`);
        return false;
      }
      if (max !== null && isNaN(max)) {
        toast.error(`مقدار حداکثر قانون ${i + 1} باید عددی باشد`);
        return false;
      }

      if (min !== null && max !== null && min >= max) {
        toast.error(`در قانون ${i + 1} حداقل باید کوچکتر از حداکثر باشد`);
        return false;
      }
    }
    return true;
  };

  // ── Submit ──

  const toPayload = (r: AlertRuleDraft): AlertRulePayload => ({
    sensor_id: sensorId,
    name: `${sensorName || sensorId} — ${r.min_value || "-"}–${r.max_value || "-"} ${sensorUnit || ""}`,
    min_value: r.min_value !== "" ? Number(r.min_value) : null,
    max_value: r.max_value !== "" ? Number(r.max_value) : null,
    severity: r.severity,
    message:
      r.message.trim() ||
      `مقدار سنسور بین ${r.min_value || "—"} و ${r.max_value || "—"} ${sensorUnit || ""}`,
    factory: factoryId,
    is_active: r.is_active,
  });

  const handleSubmit = async () => {
    if (!validateRules()) return;

    setSaving(true);

    const ops: Promise<any>[] = [];

    for (const r of rules) {
      const currentKey = draftKey(r);
      const payload = toPayload(r);

      if (r.id !== undefined) {
        // Existing rule — only PUT if changed
        if (currentKey !== r._snapshot) {
          ops.push(telemetryService.updateAlertRule(r.id, payload));
        }
        // else unchanged, skip
      } else {
        // New rule — always POST
        ops.push(telemetryService.createAlertRule(payload));
      }
    }

    try {
      await Promise.all(ops);
      const created = ops.filter((_, i) => rules[i].id === undefined).length;
      const updated = ops.filter((_, i) => rules[i].id !== undefined).length;
      const parts: string[] = [];
      if (created > 0) parts.push(`${created} قانون جدید`);
      if (updated > 0) parts.push(`${updated} قانون به‌روزرسانی`);
      toast.success(
        parts.length > 0
          ? `قوانین اعلان با موفقیت ذخیره شدند (${parts.join("، ")})`
          : "قوانین اعلان با موفقیت ذخیره شدند",
      );
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "خطا در ذخیره قوانین اعلان";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Early return ──

  if (!isOpen) return null;

  // ── Render ──

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#ef444420" }}
            >
              <span className="text-red-400 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                قوانین اعلان سنسور
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                تعریف محدوده‌های هشدار برای سنسور
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card)] rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-10rem)] space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-muted" />
            </div>
          )}

          {!loading && (
            <>
              {/* Sensor Info */}
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-[var(--color-text-muted)] text-xs">
                    نام سنسور
                  </span>
                  <p className="text-[var(--color-text)] font-medium mt-0.5">
                    {sensorName || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] text-xs">
                    شناسه سنسور
                  </span>
                  <p className="text-blue-400 font-mono text-xs mt-0.5">
                    {sensorId}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)] text-xs">
                    واحد
                  </span>
                  <p
                    className="text-[var(--color-text)] font-medium mt-0.5"
                    dir="ltr"
                  >
                    {sensorUnit || "—"}
                  </p>
                </div>
              </div>

              {/* Alert Rules */}
              {rules.length === 0 && (
                <p className="text-center text-muted py-6 text-sm">
                  هیچ قانونی تعریف نشده است. با استفاده از دکمه زیر قانون جدید
                  اضافه کنید.
                </p>
              )}

              {rules.map((rule, index) => (
                <div
                  key={rule.id ?? `new-${index}`}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 space-y-3 relative"
                >
                  {/* Rule header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                        قانون {index + 1}
                      </span>
                      {rule.id !== undefined && (
                        <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-card)] px-1.5 py-0.5 rounded">
                          موجود
                        </span>
                      )}
                    </div>
                    {rules.length > 1 && rule.id === undefined && (
                      <button
                        onClick={() => removeRule(index)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={12} />
                        حذف
                      </button>
                    )}
                    {rule.id !== undefined && (
                      <button
                        onClick={() => removeRule(index)}
                        disabled={deleting.has(rule.id) || saving}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-40 transition-colors"
                      >
                        {deleting.has(rule.id) ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        حذف
                      </button>
                    )}
                  </div>

                  {/* Min / Max */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                        حداقل مقدار <span className="text-xs text-[var(--color-text-muted)]">(اختیاری)</span>
                      </label>
                      <input
                        type="number"
                        value={rule.min_value}
                        onChange={(e) =>
                          updateRule(index, "min_value", e.target.value)
                        }
                        placeholder="۰"
                        className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-blue-500 transition-colors"
                        dir="ltr"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                        حداکثر مقدار <span className="text-xs text-[var(--color-text-muted)]">(اختیاری)</span>
                      </label>
                      <input
                        type="number"
                        value={rule.max_value}
                        onChange={(e) =>
                          updateRule(index, "max_value", e.target.value)
                        }
                        placeholder="۱۰۰"
                        className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-blue-500 transition-colors"
                        dir="ltr"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                      سطح اهمیت <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {SEVERITY_OPTIONS.map((opt) => {
                        const isSelected = rule.severity === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              updateRule(index, "severity", opt.value)
                            }
                            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: isSelected
                                ? `${opt.color}20`
                                : "var(--color-card)",
                              color: isSelected
                                ? opt.color
                                : "var(--color-text-muted)",
                              border: `1px solid ${isSelected ? opt.color : "var(--color-border)"}`,
                            }}
                            disabled={saving}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                      پیام هشدار
                    </label>
                    <input
                      type="text"
                      value={rule.message}
                      onChange={(e) =>
                        updateRule(index, "message", e.target.value)
                      }
                      placeholder="مثلاً: دما از حد مجاز عبور کرد"
                      className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-blue-500 transition-colors"
                      disabled={saving}
                    />
                  </div>

                  {/* Active */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.is_active}
                        onChange={(e) =>
                          updateRule(index, "is_active", e.target.checked)
                        }
                        className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
                        disabled={saving}
                      />
                      <span className="text-xs text-[var(--color-text)]">
                        فعال
                      </span>
                    </label>
                  </div>
                </div>
              ))}

              {/* Add Rule Button */}
              <button
                onClick={addRule}
                disabled={saving || deleting.size > 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-[var(--color-border)] hover:border-blue-500/50 text-[var(--color-text-muted)] hover:text-blue-400 rounded-xl text-sm transition-all"
              >
                <Plus size={16} />
                افزودن محدوده اعلان
              </button>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting.size > 0}
              className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-card)] rounded-xl transition-all text-sm"
            >
              انصراف
            </button>
            <button
              onClick={fetchRules}
              disabled={saving || deleting.size > 0}
              className="flex items-center gap-1.5 px-3 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card)] rounded-xl transition-all text-sm"
              title="بروزرسانی"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || deleting.size > 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all text-sm"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              ذخیره همه
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
