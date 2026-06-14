"use client";

import React, { useState, useEffect } from "react"; // ✅ เพิ่ม useEffect
import Link from "next/link";
import UserNav from "@/components/UserNav";

interface ShopClientProps {
  university: any;
  products: any[];
  uniId: string;
}

// กำหนด Interface สำหรับสินค้าในตะกร้า
interface CartItem {
  id: string;
  quantity: number;
}

export default function ShopClient({ university, products, uniId }: ShopClientProps) {
  // สร้าง State เก็บหมวดหมู่ที่ถูกเลือก (ค่าเริ่มต้นคือ All Items)
  const [activeCategory, setActiveCategory] = useState("All Items");
  
  // 🛒 เพิ่ม State สำหรับนับจำนวนสินค้าในตะกร้าแบบ Realtime
  const [cartCount, setCartCount] = useState<number>(0);

  const categories = ["All Items", "Shirts & Polos", "Pants & Skirts", "Insignia & Accessories", "Shoes"];

  // 🔄 ลอจิกดักฟังและอัปเดตจำนวนสินค้าในตะกร้าแบบ Realtime
  useEffect(() => {
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

    // เรียกใช้งานทันทีเมื่อเข้าหน้าเว็บ
    updateCartCount();

    // ดักฟังการเปลี่ยนค่าตะกร้าสินค้า
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  // ✅ ระบบกรองสินค้าตาม Tag (อัปเดตใช้ categoryId ตาม Database ใหม่)
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "All Items") return true;
    
    if (activeCategory === "Shirts & Polos") {
      return product.categoryId === "1"; // หมวดเสื้อ
    }
    
    if (activeCategory === "Pants & Skirts") {
      return product.categoryId === "4"; // หมวดกางเกงและกระโปรง
    }
    
    if (activeCategory === "Insignia & Accessories") {
      return product.categoryId === "2"; // หมวดเครื่องประดับ
    }
    
    if (activeCategory === "Shoes") {
      return product.categoryId === "3"; // หมวดรองเท้า
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* --- NAVBAR SECTION --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm px-6 md:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight hover:opacity-80 transition-opacity">
          Nisit Shop Direct
        </Link>

        <div className="flex items-center gap-4 md:gap-8 text-gray-600 text-sm font-medium">
          
          {/* ปุ่มตะกร้าสินค้า พร้อมแจ้งเตือนแบบ Realtime */}
          <Link href="/cart" className="flex items-center gap-2 hover:text-blue-900 transition-colors">
            <div className="relative p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              
              {/* 🔴 ตัวเลขแจ้งเตือนวงกลมสีแดง (จะแสดงผลเฉพาะเมื่อมีสินค้าจริง) */}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
          
          {/* ✅ ปุ่มโปรไฟล์ / เข้าสู่ระบบ */}
          <div className="pl-2 border-l border-gray-200 flex items-center">
            <UserNav />
          </div>

        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col justify-center h-[400px] bg-slate-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${university.banner || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80"}')` }}
        />
        <div className="relative z-10 w-full mx-auto px-6 md:px-12 text-white max-w-[1600px]">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider bg-blue-600 rounded-md mb-4 uppercase">
            Official Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            {university.name} <br />
            Official Collection
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-100 drop-shadow-sm">
            Excellence in every stitch. Explore the premium selection of official uniforms, accessories, and faculty-specific apparel.
          </p>
        </div>
      </section>

      {/* --- CATEGORY FILTERS --- */}
      <section className="w-full mx-auto px-6 md:px-12 max-w-[1600px] mt-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- PRODUCT GRID SECTION --- */}
      <section className="w-full mx-auto px-6 md:px-12 max-w-[1600px] mt-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No products match this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => {
              const displayPrice = product.price ? Number(product.price).toFixed(2) : "0.00";

              return (
                <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
                  
                  <Link href={`/university/${uniId}/product/${product.id}`} className="block cursor-pointer">
                    <div className="relative h-64 mb-4 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&auto=format&fit=crop&q=60"}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <p className="text-[10px] text-blue-600 font-bold tracking-wider mb-1 uppercase">
                      {product.category?.name || "General Item"}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800 h-10 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex justify-between items-center mt-auto pt-2">
                    <span className="font-bold text-lg text-slate-900">
                      ฿ {displayPrice}
                    </span>
                    <button className="bg-blue-900 text-white p-2.5 rounded-full hover:bg-blue-800 transition-colors shadow-sm cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}