"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserNav from "@/components/UserNav";

// 1. โครงสร้างข้อมูลสินค้าในตะกร้า
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

// 2. โครงสร้างข้อมูลสินค้าจริงที่ส่งมาจาก Database ผ่าน Props
interface ProductFromDB {
  id: string;
  name: string;
  price: number | any; // รองรับกรณี Prisma คืนค่าเป็น Decimal หรือทศนิยม
  image: string | null; // 🔥 แก้ตรงนี้: เพิ่ม | null เข้าไปเพื่อแก้ Error ts(2322)
  category?: { name: string } | null; // 🔥 เพิ่ม | null เผื่อสินค้าบางชิ้นไม่มีหมวดหมู่
}

interface CartPageClientProps {
  products: ProductFromDB[];
}

export default function CartPageClient({ products = [] }: CartPageClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductFromDB[]>([]);

  // 🔄 ส่วนที่ 1: ดึงข้อมูลจาก localStorage เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 🔄 ส่วนที่ 2: บันทึกข้อมูลลง localStorage เสมอเมื่อมีการเปลี่ยนแปลง และส่ง Event อัปเดตเมนู
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cartItems, isLoaded]);

  // 🎯 ส่วนที่ 3: ระบบสุ่มเลือกสินค้า (ถ้า DB ว่าง จะสลับไปใช้ระบบสำรองทันทีเพื่อให้หน้าเว็บไม่โล่ง)
  useEffect(() => {
    const cartItemIds = cartItems.map(item => item.id);

    // เคสที่ 1: มีข้อมูลสินค้าจริงส่งมาจาก Database
    if (products && products.length > 0) {
      const availableSuggestions = products.filter(p => !cartItemIds.includes(p.id));
      if (availableSuggestions.length > 0) {
        const shuffled = [...availableSuggestions].sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 3));
        return;
      }
    }

    // เคสที่ 2: ดึงข้อมูลจาก DB ไม่สำเร็จ/ไม่มีข้อมูล ส่งข้อมูลชุดสำรอง (Fallback) ขึ้นมาแสดงแทน
    const fallbackMockups: ProductFromDB[] = [
      { 
        id: "suggest-1", 
        name: "Official Crest Pin", 
        price: 120, 
        image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=300",
        category: { name: "Accessories" }
      },
      { 
        id: "suggest-2", 
        name: "Leather Uniform Belt", 
        price: 280, 
        image: "https://images.unsplash.com/photo-1624222247344-550fb8ecf582?w=300",
        category: { name: "Accessories" }
      },
      { 
        id: "suggest-3", 
        name: "Premium Sock Pack", 
        price: 150, 
        image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=300",
        category: { name: "Uniform" }
      },
    ];

    const availableFallbacks = fallbackMockups.filter(p => !cartItemIds.includes(p.id));
    setSuggestedProducts(availableFallbacks.slice(0, 3));

  }, [products, cartItems]);

  // ฟังก์ชันเพิ่ม/ลด จำนวนสินค้า
  const updateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.size === size) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  // ฟังก์ชันลบสินค้าออกจากตะกร้า
  const removeItem = (id: string, size: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.size === size)));
  };

  // ฟังก์ชันกดเพิ่มสินค้าแนะนำเข้าตะกร้าได้ทันที
  const addSuggestedToCart = (product: ProductFromDB) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id && item.size === "Free Size");
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=300",
          size: "Free Size",
          quantity: 1,
          university: product.category?.name || "Official",
          tag: "Recommended"
        },
      ];
    });
  };

  // 💰 คำนวณราคาสุทธิ
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f172a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-10">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm px-6 md:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight">
          Nisit Shop Direct
        </Link>
        <div className="flex items-center gap-4 md:gap-8 text-gray-600 text-sm font-medium">
          <Link href="/cart" className="flex items-center gap-2 hover:text-blue-900 transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <div className="pl-2 border-l border-gray-200 flex items-center">
            <UserNav />
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full mx-auto px-6 md:px-12 max-w-[1400px] mt-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* รายการสินค้าในรถเข็น */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 mb-4 text-lg">Your cart is currently empty.</p>
                <Link href="/" className="inline-block bg-[#0F2241] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{item.name}</h3>
                      <div className="flex gap-2 my-1">
                        {item.university && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{item.university}</span>
                        )}
                        {item.tag && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.tag}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Size: <span className="font-semibold text-slate-800">{item.size}</span></p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col justify-between items-end mt-4 sm:mt-0">
                    <span className="font-bold text-xl text-slate-900">฿{(item.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-3 mt-2 border border-gray-200 rounded-lg p-1 bg-white select-none">
                      <button onClick={() => updateQuantity(item.id, item.size, -1)} className="px-2 text-gray-500 hover:text-slate-900 font-bold">-</button>
                      <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, 1)} className="px-2 text-gray-500 hover:text-slate-900 font-bold">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id, item.size)} className="text-xs text-red-500 mt-3 hover:underline flex items-center gap-1">
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* --- Frequently Bought Together --- */}
            {suggestedProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-slate-800 text-lg mb-4">Frequently Bought Together</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {suggestedProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm text-center flex flex-col justify-between group hover:shadow-md transition-shadow">
                      <div className="w-full aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden">
                        <img src={product.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=300"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.name} />
                      </div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{product.name}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">฿{Number(product.price).toFixed(2)}</p>
                      <button 
                        onClick={() => addSuggestedToCart(product)}
                        className="mt-2 text-xs bg-blue-50 text-blue-700 font-bold py-1.5 rounded-lg hover:bg-blue-100 transition-colors w-full cursor-pointer"
                      >
                        + Add Item
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="bg-blue-50/60 border border-blue-100/80 p-6 rounded-3xl lg:sticky lg:top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Cart Summary</h3>
            <div className="flex flex-col gap-4 text-sm text-gray-600 border-b border-blue-200/50 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-800">฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-extrabold text-slate-900">฿{total.toFixed(2)}</span>
            </div>

            <Link 
              href={cartItems.length > 0 ? "/bill" : "#"} 
              className={`w-full py-4 rounded-xl font-bold text-center transition-colors mb-4 flex justify-center items-center gap-2 ${
                cartItems.length > 0 
                  ? "bg-[#0F2241] text-white hover:bg-slate-800" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={(e) => cartItems.length === 0 && e.preventDefault()}
            >
              Proceed to Checkout &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}