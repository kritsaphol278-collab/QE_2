"use client";

import React, { useState, useEffect } from "react";
// 👇 อย่าลืม import SearchBar เข้ามา (แก้ path ให้ตรงกับโฟลเดอร์ของคุณ เช่น "@/components/SearchBar")
import SearchBar from "./SearchBar"; 

const carouselImages = [
  "/Carousel/1.jpg", 
  "/Carousel/2.png", 
  "/Carousel/3.jpg"  
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full animate-in fade-in duration-700">
      {/* ⚠️ ลบ overflow-hidden ออกจาก div หลัก เพื่อให้ Dropdown ของ SearchBar ทะลุกรอบออกมาได้ */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-950 flex flex-col items-center justify-center text-center px-6">
        
        {/* ================= LAYER 1: CAROUSEL IMAGES ================= 
            ย้าย overflow-hidden มาไว้ที่กล่องครอบรูปภาพแทน เพื่อไม่ให้รูปสไลด์ล้นจอ
        */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-105"
              }`}
              style={{ 
                backgroundImage: `url('${image}')`,
                imageRendering: "-webkit-optimize-contrast"
              }} 
            />
          ))}
          
          {/* ================= 🌑 NEW LAYER: DARK NAVY OVERLAY ================= */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/60 to-[#0B2D5C]/40 backdrop-blur-[0.5px]"></div>
        </div>

        {/* จุดกลมๆ Indicator บอกตำแหน่งสไลด์ */}
        <div className="absolute bottom-6 flex gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-blue-400" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* ================= LAYER 2: STATIC CONTENT CONTAINER ================= */}
        <div className="relative z-30 max-w-2xl w-full flex flex-col items-center">
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-md">
            University
          </h1>
          
          <span className="block mt-1 text-5xl sm:text-6xl md:text-7xl font-black text-blue-400 tracking-tight leading-none drop-shadow-md">
            Directory
          </span>

          {/* 👇 แทนที่ช่อง input เดิมด้วย Component SearchBar ของเรา */}
          <div className="mt-8 md:mt-10 w-full drop-shadow-2xl">
            <SearchBar />
          </div>
          
        </div>

      </div>
    </div>
  );
}