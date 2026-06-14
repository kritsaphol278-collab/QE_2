"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Info, ArrowRight, ChevronLeft, GraduationCap } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) return setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    if (password !== confirmPassword) return setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");

    setLoading(true);
    try {
      // เรียก API ไปอัปเดตฐานข้อมูลผ่าน Prisma
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      // เปลี่ยนหน้าไปหน้า Login หลังจากเปลี่ยนรหัสสำเร็จ (หน่วงเวลา 2 วินาทีให้เห็นข้อความสำเร็จ)
      setTimeout(() => router.push("/signin"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ฝั่งซ้าย - รูปภาพและข้อความ */}
      <div className="hidden lg:flex w-1/2 relative bg-cover bg-center" style={{ backgroundImage: 'url("/assets/images/university-building.jpg")' }}>
        <div className="absolute inset-0 bg-[#0B2D5C]/70 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <div className="bg-[#1A4780]/80 w-fit px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6">
            ACADEMIC LEGACY
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
            Upholding the Legacy<br />of Excellence
          </h1>
          <p className="text-lg font-medium text-white/90 max-w-md">
            Your portal to official academic apparel and university supplies. Secure your account to continue your professional journey.
          </p>
        </div>
      </div>

      {/* ฝั่งขวา - ฟอร์มเปลี่ยนรหัสผ่าน */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#0B2D5C] p-2 rounded-lg text-white">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-extrabold text-[#0B2D5C]">ThaiUni</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#0B2D5C] mb-2">Reset Your Password</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Please enter your new password below. Make sure it's at least 8 characters long.
          </p>

          {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">{error}</div>}
          {success && <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm font-semibold rounded-lg border border-green-100">เปลี่ยนรหัสผ่านสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-[#0B2D5C] mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B2D5C] pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-[#0B2D5C] mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B2D5C] pr-10"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 bg-[#EEF2F6] p-4 rounded-xl border border-blue-100 mt-2">
              <Info className="text-[#0B2D5C] shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-slate-600 leading-relaxed">
                Use a mix of letters, numbers, and symbols for a stronger password.
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || success}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-[#0B2D5C] text-white py-3.5 rounded-lg font-bold text-sm hover:bg-[#123A70] transition disabled:opacity-70"
            >
              {loading ? "Updating..." : "Confirm New Password"} <ArrowRight size={16} />
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-8 flex justify-center">
            <Link href="/signin" className="flex items-center gap-2 text-sm font-bold text-[#0B2D5C] hover:underline">
              <ChevronLeft size={16} /> Back to Sign In
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-16 flex justify-between items-center text-xs text-slate-400 font-medium">
            <div>Need help? <a href="#" className="text-[#0B2D5C] font-bold hover:underline">Contact Support</a></div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#0B2D5C]">Privacy Policy</a>
              <a href="#" className="hover:text-[#0B2D5C]">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}