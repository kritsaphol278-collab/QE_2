"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft } from "lucide-react";

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Header */}
      <header className="px-8 py-6 bg-white w-full">
        <h1 className="text-xl font-extrabold text-[#0B2D5C]">ThaiUniform Direct</h1>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto bg-white shadow-sm">
        
        {/* ฝั่งซ้าย - รูปภาพและข้อความ */}
        <div 
          className="hidden lg:flex w-1/2 relative bg-cover bg-center items-center justify-center min-h-[600px]" 
          style={{ backgroundImage: 'url("/assets/images/university-building.jpg")' }} // เปลี่ยน path รูปของคุณตรงนี้
        >
          <div className="absolute inset-0 bg-[#0B2D5C]/70 mix-blend-multiply"></div>
          <div className="relative z-10 text-center text-white px-12">
            <h2 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              Upholding the Legacy of<br />Excellence
            </h2>
            <div className="w-16 h-1 bg-white/70 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* ฝั่งขวา - ข้อความสำเร็จ */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 min-h-[600px]">
          <div className="flex flex-col items-center text-center w-full max-w-sm">
            
            {/* กล่องไอคอนติ๊กถูก */}
            <div className="bg-[#0B2D5C] p-4 rounded-2xl text-white mb-8 shadow-md">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-extrabold text-[#0B2D5C] mb-12">
              Password Reset Successful
            </h3>

            {/* ปุ่มกลับไปหน้า Login */}
            <Link 
              href="/signin" 
              className="flex items-center gap-2 text-sm font-bold text-[#0B2D5C] hover:underline mb-16"
            >
              <ChevronLeft size={16} strokeWidth={3} /> Back to Sign In
            </Link>

            {/* เส้นคั่นและข้อความล่างสุด */}
            <div className="w-full border-t border-slate-200 pt-8 mt-4">
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Official University Licensed Provider
              </p>
            </div>
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
        <div className="text-lg font-extrabold text-[#0B2D5C]">
          ThaiUniform<br />Direct
        </div>
        <div className="text-center md:text-left">
          © 2024 ThaiUniform Direct. All rights reserved. Official University Licensed Provider.
        </div>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-[#0B2D5C]">Terms of Service</Link>
          <Link href="#" className="hover:text-[#0B2D5C]">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#0B2D5C]">Help Center</Link>
        </div>
      </footer>

    </div>
  );
}