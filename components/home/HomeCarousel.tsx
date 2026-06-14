"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react"; // อย่าลืมลง lucide-react หรือใช้ไอคอนที่คุณมีอยู่แล้ว

export default function Navbar() {
  const { data: session, status } = useSession();

  // ฟังก์ชันสุ่มตัวอักษรแรกสีพาสเทล กรณีผู้ใช้งานไม่มีรูปโปรไฟล์ในฐานข้อมูล
  const getInitials = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm px-8">
      {/* ฝั่งซ้าย: โลโก้เว็บของคุณ */}
      <div className="font-extrabold text-[#0B2D5C] tracking-wider text-xl">
        THAIUNIFORM <span className="text-blue-500">DIRECT</span>
      </div>

      {/* ฝั่งขวา: ระบบตรวจสอบการล็อกอินและรูปโปรไฟล์ Dynamic */}
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          // สถานะกำลังโหลดข้อมูลเซสชัน
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0B2D5C] border-t-transparent"></div>
        ) : session ? (
          /* ========================================================
             🔓 เคสที่ 1: ล็อกอินสำเร็จแล้ว -> แสดงชื่อ รูปโปรไฟล์ และปุ่มออก
             ======================================================== */
          <div className="flex items-center gap-3 animate-in fade-in duration-200">
            {/* แสดงชื่อและสิทธิ์ผู้ใช้ */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{session.user?.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                {((session.user as any)?.role) || "USER"}
              </p>
            </div>

            {/* รูปโปรไฟล์อัจฉริยะ (Fallback Avatar) */}
            <div className="relative h-10 w-10">
              {session.user?.image ? (
                // ถ้าใน DB มีรูป ให้ดึงรูปมาโชว์
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-full w-full rounded-xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                // ถ้าไม่มีรูป ให้สุ่มดึงตัวแรกของชื่อมาทำตรายาง Gradient สวยๆ
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B2D5C] to-blue-600 font-black text-white shadow-md text-sm">
                  {getInitials(session.user?.name)}
                </div>
              )}
            </div>

            {/* ปุ่มออกจากระบบ (Sign Out) ดีไซน์มินิมอล */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })} // คลิกแล้วระบบจะเคลียร์เซสชัน และรีเฟรชกลับมาหน้าหลัก
              className="ml-2 p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition active:scale-95"
              title="ออกจากระบบ"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          /* ========================================================
             🔒 เคสที่ 2: ยังไม่ได้ล็อกอิน -> แสดงปุ่มสีน้ำเงินกรมท่าเดิม
             ======================================================== */
          <Link
            href="/signin"
            className="rounded-xl bg-[#0B2D5C] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#123A70] active:scale-[0.98] shadow-md shadow-blue-900/10"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}