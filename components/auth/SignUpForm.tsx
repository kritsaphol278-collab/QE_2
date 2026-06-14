"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // 🛠️ ส่วนที่แก้ไข: รับค่าเป็น Text ก่อนเพื่อป้องกันแอปพังเวลา API ขัดข้อง
      const textData = await res.text();
      let data;
      
      try {
        data = JSON.parse(textData);
      } catch (parseError) {
        console.error("เซิร์ฟเวอร์ไม่ได้ส่ง JSON กลับมา! ข้อความดิบคือ:", textData);
        throw new Error(`ระบบหลังบ้านขัดข้อง: ${textData.substring(0, 50)}... (กรุณาดูข้อความเต็มใน Console)`);
      }

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }

      setSuccess("สมัครสมาชิกสำเร็จ! กำลังนำคุณไปหน้าเข้าสู่ระบบ...");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-8 bg-[#F5F8FC] min-h-screen w-full">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-[#0B2D5C]">
          Create account
        </h2>

        <p className="mt-2 text-slate-500 text-sm">
          Join the future of academic tradition.
        </p>

        {/* Toggle between sign in and sign up */}
        <div className="mt-8 grid grid-cols-2 rounded-2xl bg-[#EEF2F6] p-1.5 border border-slate-100">
          <Link
            href="/signin"
            className="rounded-xl py-3 text-center text-sm font-semibold text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            Sign In
          </Link>

          <button className="rounded-xl bg-white py-3 text-sm font-extrabold text-[#0B2D5C] shadow-sm">
            Create Account
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-2xl bg-green-50 p-4 text-xs font-semibold text-green-700 border border-green-100">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4.5 py-3 text-sm placeholder-slate-400 outline-none transition focus:border-[#0B2D5C]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.ac.th"
              className="w-full rounded-xl border border-slate-200 bg-white px-4.5 py-3 text-sm placeholder-slate-400 outline-none transition focus:border-[#0B2D5C]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white pl-4.5 pr-12 py-3 text-sm placeholder-slate-400 outline-none transition focus:border-[#0B2D5C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B2D5C] transition"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white pl-4.5 pr-12 py-3 text-sm placeholder-slate-400 outline-none transition focus:border-[#0B2D5C]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B2D5C] transition"
              >
                {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-[#0B2D5C] py-4.5 font-bold text-white text-sm transition hover:bg-[#123A70] active:scale-[0.98] disabled:opacity-55 shadow-lg shadow-blue-900/10"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-10 border-t border-slate-100 pt-8 text-center">
          <p className="text-[10px] font-bold text-slate-400">
            © 2024 ThaiUniform Direct. Official University Licensed Distributor.
          </p>
          <div className="mt-2.5 flex justify-center gap-5 text-xs font-bold text-slate-400">
            <Link href="/help" className="hover:underline hover:text-slate-655">Help Center</Link>
            <Link href="/privacy" className="hover:underline hover:text-slate-655">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}