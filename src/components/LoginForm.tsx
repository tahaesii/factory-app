import { useState, useRef } from "react";
import { LogIn, IdCard, Phone } from "lucide-react";
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

// Function to convert English numbers to Persian numbers
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

interface LoginFormProps {
  onSuccess?: (
    phoneNumber: string,
    nationalCode: string,
    rememberMe: boolean,
  ) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isChecked, setIsChecked] = useState(false);
  const { sendOtp, loading } = useAuthStore();

  const nationalCodeRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const handleNationalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let newValue = allowOnlyNumbers(value);
    if (newValue.length <= 10) {
      if (nationalCodeRef.current) {
        nationalCodeRef.current.value = newValue;
      }
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let newValue = allowOnlyNumbers(value);
    if (newValue.length <= 11) {
      if (phoneNumberRef.current) {
        phoneNumberRef.current.value = newValue;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nationalCodePersian = nationalCodeRef.current?.value || "";
    const phoneNumberPersian = phoneNumberRef.current?.value || "";

    const nationalCode = convertPersianToEnglish(nationalCodePersian);
    const phoneNumber = convertPersianToEnglish(phoneNumberPersian);

    if (nationalCode.length !== 10) {
      toast.error("کد ملی باید ۱۰ رقم باشد");
      return;
    }

    if (phoneNumber.length !== 11) {
      toast.error("شماره تلفن باید ۱۱ رقم باشد");
      return;
    }

    const result = await sendOtp(nationalCode, phoneNumber);

    if (result.success) {
      toast.success("کد تایید برای شما ارسال شد");
      if (onSuccess) {
        const persianPhoneNumber = convertEnglishToPersian(phoneNumber);

        onSuccess(persianPhoneNumber, nationalCode, isChecked);
      }
    } else {
      toast.error(result.error);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   await login(username, password);
  // };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--color-text)" }}
          >
            ورود به سیستم
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            اطلاعات حساب کاربری خود را وارد کنید
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                کد ملی <span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  placeholder="کد ملی خود را وارد کنید"
                  type="text"
                  ref={nationalCodeRef}
                  onChange={handleNationalCodeChange}
                  maxLength={10}
                  className="input-field"
                  dir="rtl"
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                شماره تلفن <span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="شماره موبایل خود را وارد کنید"
                  ref={phoneNumberRef}
                  onChange={handlePhoneNumberChange}
                  maxLength={11}
                  className="input-field pl-11"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#00C2FF" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  مرا به خاطر بسپار
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-[#00C2FF] text-[#020817] shadow-[0_4px_16px_#00C2FF25] hover:bg-[#00a6d6] cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#02081730] border-t-[#020817] rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  ورود
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
