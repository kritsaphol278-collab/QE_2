"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserNav from "@/components/UserNav";

// กำหนด Interface ให้ตรงกับโครงสร้างตะกร้าสินค้า
interface CartItem {
  id: string;
  quantity: number;
}

export default function Navbar() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // ฟังก์ชันคำนวณจำนวนสินค้าทั้งหมดในตะกร้า
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const items: CartItem[] = JSON.parse(savedCart);
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (e) {
          console.error("Error parsing cart localStorage:", e);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    // 1. เรียกใช้งานทันทีเมื่อโหลดหน้าเว็บ
    updateCartCount();

    // 2. ดักฟัง Event "storage" (กรณีมีการแก้ไขตะกร้าจาก Tab อื่น)
    window.addEventListener("storage", updateCartCount);

    // 3. ดักฟัง Custom Event "cart-updated" (เกิดจากการกดสั่งซื้อในหน้าเดียวกัน)
    window.addEventListener("cart-updated", updateCartCount);

    // ล้าง Event เมื่อ Component ถูกทำลาย
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm px-6 md:px-12 py-4 flex justify-between items-center">
      
      {/* ฝั่งซ้าย: โลโก้แอปพลิเคชัน */}
      <Link href="/" className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight hover:opacity-80 transition-opacity">
        Nisit Shop Direct
      </Link>

      {/* ฝั่งขวา: ตะกร้าสินค้า และ โปรไฟล์ */}
      <div className="flex items-center gap-4 md:gap-8 text-gray-600 text-sm font-medium">
        
        {/* ปุ่มตะกร้าสินค้า */}
        <Link href="/cart" className="flex items-center gap-2 hover:text-blue-900 transition-colors">
          <div className="relative p-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            
            {/* 🔴 ตัวเลขแจ้งเตือนแบบ Realtime (ซ่อนอัตโนมัติถ้าไม่มีสินค้า) */}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Cart</span>
        </Link>
        
        {/* ⚙️ ปุ่มโปรไฟล์ / เข้าสู่ระบบ */}
        <div className="pl-2 border-l border-gray-200 flex items-center">
          <UserNav />
        </div>
        
      </div>
    </nav>
  );
}