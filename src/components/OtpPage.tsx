import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const convertPersianToEnglish = (str: string): string => {
  const persianNumbers: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return str.replace(/[۰-۹]/g, (char) => persianNumbers[char] || char);
};

const convertEnglishToPersian = (str: string): string => {
  const englishNumbers: Record<string, string> = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹",
  };
  return str.replace(/[0-9]/g, (char) => englishNumbers[char] || char);
};

const allowOnlyNumbers = (value: string): string => {
  const englishValue = convertPersianToEnglish(value);
  const onlyNumbers = englishValue.replace(/[^0-9]/g, "");
  return convertEnglishToPersian(onlyNumbers);
};

interface OTPPageProps {
  phoneNumber: string;
  nationalCode: string;
  rememberMe: boolean;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function OTPPage({
  phoneNumber,
  nationalCode,
  rememberMe,
  onBack,
}: OTPPageProps) {
  const [otpCode, setOtpCode] = useState(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login, sendOtp, loading, error } = useAuthStore();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    const otpValue = otpCode.join("");

    if (
      otpValue.length === 5 &&
      otpCode.every((digit) => digit !== "") &&
      !loading
    ) {
      handleAutoSubmit();
    }
  }, [otpCode]);

  const handleOtpChange = (index: number, value: string) => {
    let newValue = allowOnlyNumbers(value);

    if (newValue.length > 1) {
      newValue = newValue.slice(-1);
    }

    const newOtp = [...otpCode];
    newOtp[index] = newValue;
    setOtpCode(newOtp);

    if (newValue && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otpCode[index]) {
        const newOtp = [...otpCode];
        newOtp[index] = "";
        setOtpCode(newOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");

    const numbers = convertPersianToEnglish(pastedData)
      .replace(/[^0-9]/g, "")
      .slice(0, 5);

    if (numbers.length > 0) {
      const newOtp = ["", "", "", "", ""];

      numbers.split("").forEach((num, index) => {
        newOtp[index] = convertEnglishToPersian(num);
      });

      setOtpCode(newOtp);

      const focusIndex = Math.min(numbers.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleAutoSubmit = async () => {
    const otpValue = otpCode.join("");
    const englishOtp = convertPersianToEnglish(otpValue);

    if (englishOtp.length !== 5) return;

    const success = await login(
      nationalCode,
      convertPersianToEnglish(phoneNumber),
      englishOtp,
      rememberMe,
    );

    if (!success) {
      toast.error(error || "کد تایید نامعتبر است");
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAutoSubmit();
  };
  const handleResendCode = async () => {
    setIsResending(true);

    const result = await sendOtp(nationalCode, phoneNumber);

    if (result.success) {
      toast.success("کد تایید باری دیگر برای شما ارسال شد");
    } else {
      toast.error(result.error);
    }

    setTimeout(() => {
      setTimeLeft(120);
      setIsResending(false);
      toast.success("کد تایید مجدداً ارسال شد");
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${convertEnglishToPersian(mins.toString())}:${convertEnglishToPersian(secs.toString().padStart(2, "0"))}`;
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-1 text-center">
            تایید دو مرحله‌ای
          </h2>

          <p className="text-sm mb-6 text-center">
            کد ارسال شده به شماره موبایل را وارد کنید
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm">کد تایید به شماره زیر ارسال شد</p>

                <p className="font-bold mt-2">{phoneNumber}</p>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  کد تایید <span className="text-red-500">*</span>
                </label>

                <div
                  dir="ltr"
                  className="flex justify-center gap-3 mt-3"
                  onPaste={handlePaste}
                >
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      dir="ltr"
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className="w-14 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all"
                      style={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs mt-3 text-center">کد تایید ۵ رقمی است</p>
              </div>

              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm">
                    زمان باقی‌مانده: {formatTime(timeLeft)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer transition-colors"
                    style={{ color: "#00C2FF" }}
                  >
                    {isResending ? "در حال ارسال..." : "ارسال مجدد کد"}
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="w-1/2 py-3.5 rounded-xl font-bold transition-all cursor-pointer"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    بازگشت
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    onBack ? "w-1/2" : "w-full"
                  } py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-[#00C2FF] text-[#020817] shadow-[0_4px_16px_#00C2FF25] hover:bg-[#00a6d6] cursor-pointer`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#02081730] border-t-[#020817] rounded-full animate-spin" />
                  ) : (
                    "تایید"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
