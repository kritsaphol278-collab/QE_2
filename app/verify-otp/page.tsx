"use client";

import { useState, useRef, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) return setError("กรุณากรอกรหัสให้ครบ 6 หลัก");

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // ยืนยันผ่านแล้ว ส่งผู้ใช้ไปหน้าเปลี่ยนรหัสผ่านใหม่
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ฝั่งซ้าย - ปูธีมสีน้ำเงินเข้ม */}
      <div className="hidden lg:flex w-1/2 relative bg-cover bg-center items-center justify-center" style={{ backgroundImage: 'url("/assets/images/university-building.jpg")' }}>
        <div className="absolute inset-0 bg-[#0B2D5C]/70 mix-blend-multiply"></div>
        <h1 className="relative z-10 text-5xl font-extrabold text-white text-center leading-tight">Upholding the<br />Legacy of<br />Excellence.</h1>
      </div>

      {/* ฝั่งขวา - ช่องใส่ตัวเลข 6 ตัว */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-[#0B2D5C] mb-3">Verify Your Email</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">We've sent a 6-digit code to <strong>{email}</strong>.<br />Please enter it below to continue.</p>

          {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg text-center border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex justify-between gap-2 w-full mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => { inputRefs.current[index] = el; }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 border border-slate-200 rounded-xl text-center text-2xl font-bold text-[#0B2D5C] focus:border-[#0B2D5C] focus:ring-1 focus:ring-[#0B2D5C] outline-none"
                  maxLength={1}
                />
              ))}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0B2D5C] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#123A70] transition shadow-lg mb-6 disabled:opacity-70">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <Link href="/forgot-password" className="flex items-center gap-2 text-sm font-bold text-[#0B2D5C] hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}