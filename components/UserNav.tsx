"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, CheckCircle2 } from "lucide-react"; // แถมสัญลักษณ์ติ๊กถูกสีเขียวว่าเข้าสู่ระบบแล้ว

export default function UserNav() {
  const { data: session, status } = useSession();

  // ฟังก์ชันสุ่มตัวอักษรแรกของชื่อ กรณีในฐานข้อมูลไม่มีรูปโปรไฟล์
  const getInitials = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // 1. ช่วงกำลังโหลดตรวจสอบสถานะล็อกอิน
  if (status === "loading") {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200"></div>;
  }

  // 2. ล็อกอินสำเร็จแล้ว -> โชว์รูปโปรไฟล์ สัญลักษณ์ติ๊กถูก และปุ่ม Log Out
  if (session) {
    return (
      <div className="flex items-center gap-3 animate-in fade-in duration-300">
        
        {/* รูปโปรไฟล์ พร้อมสัญลักษณ์วงกลมติ๊กถูกสีเขียว (เข้าสู่ระบบแล้ว) */}
        <div className="relative">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#0B2D5C] to-blue-600 font-bold text-white text-sm shadow-sm">
              {getInitials(session.user?.name)}
            </div>
          )}
          
          {/* 🟢 สัญลักษณ์บ่งบอกว่าเข้าสู่ระบบเรียบร้อย (Online Status Icon) */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </span>
        </div>

        {/* ชื่อผู้ใช้และ Badge สถานะความปลอดภัย */}
        <div className="text-left hidden md:block">
          <p className="text-xs font-bold text-slate-800 leading-none">{session.user?.name}</p>
          <p className="text-[9px] font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5 uppercase">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> Authorized
          </p>
        </div>

        {/* ปุ่มออกจากระบบ (Sign Out) */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })} // เมื่อกดจะเคลียร์ข้อมูล แล้วรีเฟรชกลับมาหน้าหลัก
          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition active:scale-95 ml-1"
          title="ออกจากระบบ"
        >
          <LogOut className="h-4 w-4" />
        </button>

      </div>
    );
  }

  // 3. ยังไม่ได้ล็อกอิน -> โชว์ปุ่มสีกรมท่าเดิมของคุณ
  return (
    <Link
      href="/signin"
      className="rounded-xl bg-[#0B2D5C] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#123A70] active:scale-[0.98] shadow-md shadow-blue-900/10"
    >
      Sign In
    </Link>
  );
}