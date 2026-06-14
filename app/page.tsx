"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
//import RegionFilter from "@/components/home/RegionFilter";
import UniversityGrid from "@/components/home/UniversityGrid";
import LoadMoreButton from "@/components/home/LoadMoreButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 🧭 แถบเมนูด้านบน (รวมระบบรูปโปรไฟล์และปุ่มล็อกเอาต์แล้ว) */}
      <Navbar />
      
      {/* 📺 ส่วนค้นหา 16:9 ที่ดึงภาพพื้นหลังจากโฟลเดอร์ public มาโชว์ */}
      <HeroSection />

      {/* ตารางรายชื่อมหาวิทยาลัย */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <UniversityGrid />

        <div className="mt-10 flex justify-center">
          <LoadMoreButton />
        </div>
      </section>

      <Footer />
    </main>
  );
}