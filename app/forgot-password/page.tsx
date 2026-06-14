"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("กรุณากรอกอีเมล");

    setLoading(true);
    setError("");

    try {
      // 1. ส่งข้อมูลไปที่ API เพื่อสร้าง OTP และส่งอีเมลเบื้องหลัง
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      // 2. ถ้าสำเร็จ พาวิ่งไปหน้ารหัส 6 ตัวทันทีพร้อมแนบอีเมลไปบน URL
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ฝั่งซ้าย - ภาพพื้นหลังดีไซน์หรูหรา */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/university-hall.jpg")' }}>
        <div className="absolute inset-0 bg-[#0B2D5C]/10"></div>
        <div className="flex flex-col justify-end p-20 text-white w-full relative z-10">
          <h1 className="text-5xl font-extrabold leading-tight mb-4 drop-shadow-sm">Upholding the Legacy<br />of Excellence.</h1>
          <p className="text-xl font-medium text-white/90">Premium academic apparel designed for the leaders of tomorrow.</p>
        </div>
      </div>

      {/* ฝั่งขวา - ฟอร์มกรอกข้อมูล */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-sm font-bold text-[#0B2D5C] tracking-wide">THAIUNI UNIFORMS</div>
          <h2 className="text-3xl font-extrabold text-[#0B2D5C] mb-2.5">Forgot Password</h2>
          <p className="text-slate-500 text-sm mb-8">Enter your email to receive an OTP for password reset.</p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-xs font-bold text-[#0B2D5C] uppercase tracking-widest mb-2">University Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.ac.th"
                className="w-full rounded-lg border border-slate-200 bg-[#F0F5FA] pl-4 pr-28 py-3.5 text-sm outline-none transition focus:border-[#0B2D5C]"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-[#0B2D5C] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#123A70] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>

          <Link href="/signin" className="flex items-center gap-1.5 text-sm font-semibold text-[#0B2D5C] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}