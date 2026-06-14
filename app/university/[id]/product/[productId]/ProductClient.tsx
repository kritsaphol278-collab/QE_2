"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserNav from "@/components/UserNav"; // ✅ เพิ่มการนำเข้า UserNav

interface ProductClientProps {
  uniId: string;
  university: any;
  product: any;
  relatedProducts: any[];
}

// กำหนด Interface ให้ตรงกับโครงสร้างตะกร้าสินค้า
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  university?: string;
  tag?: string;
}

export default function ProductClient({ uniId, university, product, relatedProducts }: ProductClientProps) {
  const router = useRouter();
  const inStock = product.stock > 0;
  const displayPrice = product.price ? Number(product.price).toFixed(2) : "0.00";

  // --- ระบบจัดการรูปภาพ (แกลลอรี่) ---
  const [allImages, setAllImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const primaryImg = product.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80";
    let additional: string[] = [];

    if (product.images) {
      try {
        if (typeof product.images === 'string' && product.images.startsWith('[')) {
          additional = JSON.parse(product.images);
        } else if (Array.isArray(product.images)) {
          additional = product.images;
        } else if (typeof product.images === 'string') {
          additional = product.images.split(',').map((s: string) => s.trim());
        }
      } catch (e) {
        additional = [product.images];
      }
    }

    const combinedImages = Array.from(new Set([primaryImg, ...additional].filter(Boolean)));
    setAllImages(combinedImages);
    setMainImage(combinedImages[0]); 
  }, [product]);


  // --- State สำหรับระบบคำนวณไซส์และการเลือกไซส์ ---
  const [chest, setChest] = useState<string>("38");
  const [waist, setWaist] = useState<string>("32");
  const [sleeve, setSleeve] = useState<string>("33");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M"); // ลบช่องว่างออกเพื่อให้ข้อมูลคลีน
  const [cartCount, setCartCount] = useState<number>(0);

  // ดึงจำนวนสินค้าในตะกร้าปัจจุบันมาแสดงบน Navbar
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const items: CartItem[] = JSON.parse(savedCart);
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (e) {
          console.error(e);
        }
      }
    };
    updateCartCount();
    // ดักฟัง Event หากมีการเปิดหลาย Tab หรืออัปเดตข้อมูล
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount); // รองรับ Event จากหน้าอื่น
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleCalculateSize = () => {
    const chestSize = parseFloat(chest);
    if (isNaN(chestSize)) return;

    let calcSize = "M";
    if (chestSize < 36) {
      calcSize = "S";
    } else if (chestSize >= 36 && chestSize <= 38) {
      calcSize = "M";
    } else if (chestSize >= 39 && chestSize <= 41) {
      calcSize = "L";
    } else if (chestSize >= 42 && chestSize <= 44) {
      calcSize = "XL";
    } else if (chestSize > 44) {
      calcSize = "XXL";
    }

    setRecommendedSize(calcSize);
    setSelectedSize(calcSize);
  };

  // --- ฟังก์ชันหลัก: ระบบเพิ่มสินค้าจริงเข้าตะกร้า ---
  const handleAddToCart = () => {
    if (!inStock) return;

    // 1. ดึงข้อมูลตะกร้าเดิมที่มีอยู่
    const savedCart = localStorage.getItem("cart");
    let currentCart: CartItem[] = [];
    
    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart);
      } catch (e) {
        currentCart = [];
      }
    }

    // 2. ตรวจสอบว่ามีสินค้ารหัสนี้และ "ไซส์นี้" อยู่ในตะกร้าแล้วหรือยัง
    const cleanSize = selectedSize.trim();
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id && item.size === cleanSize
    );

    if (existingItemIndex > -1) {
      // ถ้ามีอยู่แล้วให้บวกจำนวนชิ้นเพิ่มเข้าไป 1 ชิ้น
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // ถ้ายังไม่มี ให้สร้าง Object สินค้าใหม่ส่งเข้าไป
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: mainImage || product.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=300",
        size: cleanSize,
        quantity: 1,
        university: university?.name || "General Approved",
        tag: product.category?.name || `SKU: ${product.sku}`
      };
      currentCart.push(newItem);
    }

    // 3. บันทึกกลับลงใน localStorage และส่งสัญญาณอัปเดต
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cart-updated"));

    // 4. วิ่งข้ามไปหน้าสรุปตะกร้าสินค้าทันที
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-10">
      
      {/* --- NAVBAR SECTION (Updated) --- */}
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
              
              {/* ตัวเลขแจ้งเตือนวงกลมสีแดง */}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
          
          {/* ปุ่มโปรไฟล์ / เข้าสู่ระบบ */}
          <div className="pl-2 border-l border-gray-200 flex items-center">
            <UserNav />
          </div>

        </div>
      </nav>

      {/* --- MAIN CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <div className="flex gap-2 items-center">
            <Link href={`/university/${uniId}`} className="hover:text-blue-900 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/xl" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              {university?.name || "University"}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.category?.name || "Product"}</span>
          </div>
        </div>

        {/* --- PRODUCT DETAIL SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
          
          {/* Left: Images */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden group">
              <div className="absolute top-4 left-4 z-10 bg-[#0f172a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                Official Licensed
              </div>
              {mainImage && (
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-center transition-opacity duration-300" />
              )}
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${mainImage === img ? 'border-blue-900' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`detail-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col pt-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {university?.name || "University"} Approved
              </span>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight mb-2">
              {product.name}
            </h1>

            {product.description && <p className="text-sm text-gray-600 mb-4">{product.description}</p>}

            <p className="text-2xl font-bold text-[#0f172a] mb-8">฿{displayPrice}</p>

            {/* Size Calculator Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4 font-bold text-[#0f172a]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900"><path d="M21 21H3V3"></path><path d="M21 9H7"></path><path d="M21 15H7"></path><path d="M11 3v18"></path><path d="M15 3v18"></path><path d="M19 3v18"></path></svg>
                Find Your Size
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Chest (Inches)</label>
                  <input type="number" value={chest} onChange={(e) => setChest(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-semibold outline-none focus:border-blue-900 bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Waist (Inches)</label>
                  <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-semibold outline-none focus:border-blue-900 bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sleeve (Inches)</label>
                  <input type="number" value={sleeve} onChange={(e) => setSleeve(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-semibold outline-none focus:border-blue-900 bg-white" />
                </div>
              </div>
              <button onClick={handleCalculateSize} className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-bold py-3 rounded-xl transition-colors">
                Calculate Recommendation
              </button>

              {recommendedSize && (
                <div className="mt-4 p-3 bg-green-100/50 border border-green-200 text-green-700 text-xl font-bold text-center rounded-xl flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Recommended: {recommendedSize}
                </div>
              )}
            </div>

            {/* Select Size & Gender */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Size</label>
                <div className="relative">
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full appearance-none border border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-[#0f172a] bg-white outline-none focus:border-blue-900"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Gender</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button className="flex-1 bg-white text-[#0f172a] text-sm font-bold py-2.5 rounded-lg shadow-sm">Men</button>
                  <button className="flex-1 text-gray-500 text-sm font-bold py-2.5 rounded-lg hover:text-[#0f172a]">Women</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6 mt-auto">
              {inStock ? (
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md text-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  Add to Cart
                </button>
              ) : (
                <button className="flex-1 py-4 rounded-2xl text-lg font-bold bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
                  Out of Stock
                </button>
              )}
              <button className="w-14 border border-gray-200 hover:border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>

            {/* Info Text */}
            <div className="flex justify-between text-[11px] font-semibold text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                Stock: {product.stock} items
              </div>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Secure Student Checkout
              </div>
            </div>

          </div>
        </div>

        {/* --- COMPLETE YOUR LOOK SECTION --- */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 mb-12">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6">Complete Your Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link href={`/university/${uniId}/product/${item.id}`} key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm group block hover:shadow-md transition-shadow">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <img src={item.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=60"} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0f172a] line-clamp-1">{item.name}</h3>
                  <p className="text-sm font-semibold text-gray-500 mt-1">฿{item.price ? Number(item.price).toFixed(2) : "0.00"}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-200 mt-12 pt-12 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <p className="text-[10px] text-gray-400 text-center">© 2026 Nisit Shop Direct. Official University Licensed Distributor. All rights reserved.</p>
      </footer>
    </div>
  );
}