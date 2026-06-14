// app/tracking/TrackingClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- 🏷️ Interfaces กำหนดโครงสร้างข้อมูลให้ตรงกับหน้า Checkout ---
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface ShippingLocation {
  university?: string;
  faculty?: string;
  recipientName?: string;
  phoneNumber?: string;
  address?: string;
}

interface OrderData {
  userId?: string;
  userEmail?: string;
  items: CartItem[];
  shippingLocation: ShippingLocation;
  summary: {
    subtotal: number;
    total: number;
  };
  paymentStatus: string;
}

export default function TrackingClient() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🪄 จำลองการสร้างรหัสคำสั่งซื้อ (หรือสุ่มแบบคงที่ต่อ Session เท่านั้น)
  const [orderId] = useState(() => `TU-${Math.floor(10000000 + Math.random() * 90000000)}`);
  
  // 📅 ดึงวันที่ ณ เวลาปัจจุบันที่เปิดตรวจสอบสถานะการสั่งซื้อ
  const [orderDate] = useState(() => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  useEffect(() => {
    // 📦 ดึงข้อมูลออเดอร์ที่เซฟลงมาจาก localStorage ตอนกด Confirm Order
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Error parsing order data:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // คำนวณจำนวนชิ้นทั้งหมดที่มีในออเดอร์จริง
  const totalItemsCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2241]"></div>
      </div>
    );
  }

  // 🚨 กรณีไม่พบประวัติการสั่งซื้อล่าสุดใน Browser ตัวเอง
  if (!order || order.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fc] p-6 text-center">
        <h2 className="text-xl font-bold text-[#0F2241] mb-2">No active order found</h2>
        <p className="text-sm text-gray-500 mb-6">Please complete your checkout payment process first.</p>
        <Link href="/" className="bg-[#0F2241] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
          Return to Home
        </Link>
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
          <button className="hover:text-blue-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <Link href="/cart" className="flex items-center gap-2 hover:text-blue-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="hidden sm:inline">Cart</span>
          </Link>
          <button className="flex items-center gap-2 hover:text-blue-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="hidden sm:inline">{order.shippingLocation.recipientName || "Account"}</span>
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full mx-auto px-6 md:px-12 max-w-[1200px] mt-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <p className="text-[11px] font-extrabold tracking-widest text-gray-500 uppercase mb-1">Order Tracking</p>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F2241] tracking-tight">#{orderId}</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Placed on {orderDate} • {totalItemsCount} {totalItemsCount > 1 ? "Items" : "Item"}
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Status: {order.paymentStatus.replace("_", " ")}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 overflow-x-auto">
          <div className="min-w-[600px] flex items-center justify-between relative">
            {/* เส้นเชื่อม Background */}
            <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-gray-100 z-0"></div>
            {/* เส้นเชื่อม Active สัมพันธ์ตามสเตตัสเริ่มต้น */}
            <div className="absolute top-5 left-[5%] right-[75%] h-1 bg-[#0F2241] z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center w-1/5">
              <div className="w-10 h-10 bg-[#0F2241] text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <p className="text-xs font-bold text-[#0F2241]">Order Placed</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-1">Pending Review</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center w-1/5 opacity-40">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <p className="text-xs font-bold text-gray-500">Processing</p>
              <p className="text-[10px] text-gray-400 mt-1">—</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center w-1/5 opacity-40">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <p className="text-xs font-bold text-gray-500">Shipping</p>
              <p className="text-[10px] text-gray-400 mt-1">—</p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center w-1/5 opacity-40">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <p className="text-xs font-bold text-gray-500">Out for Delivery</p>
              <p className="text-[10px] text-gray-400 mt-1">—</p>
            </div>

            {/* Step 5 */}
            <div className="relative z-10 flex flex-col items-center w-1/5 opacity-40">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <p className="text-xs font-bold text-gray-500">Delivered</p>
              <p className="text-[10px] text-gray-400 mt-1">—</p>
            </div>
          </div>
        </div>

        {/* --- GRID แสดงรายละเอียด --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ฝั่งซ้าย: ข้อมูลผู้ส่งและสถานที่รับของจริง */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delivery Information</h3>
                <p className="text-xs text-gray-500">Method: Campus Pickup</p>
              </div>
            </div>
            
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-50 flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Recipient Name</p>
                <p className="text-sm font-bold text-slate-900">{order.shippingLocation.recipientName}</p>
                <p className="text-xs text-gray-600 mt-0.5">{order.shippingLocation.phoneNumber}</p>
              </div>

              <div className="border-t border-blue-100/60 pt-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">University / Faculty</p>
                <p className="text-xs font-bold text-slate-900">{order.shippingLocation.university}</p>
                <p className="text-xs text-gray-600 mt-0.5">{order.shippingLocation.faculty}</p>
              </div>

              <div className="border-t border-blue-100/60 pt-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Detailed Address</p>
                <p className="text-xs text-gray-600 leading-relaxed">{order.shippingLocation.address}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Grand Total</span>
              <span className="text-xl font-black text-[#0F2241]">฿{order.summary.total.toFixed(2)}</span>
            </div>
          </div>

          {/* ฝั่งขวา: รายการสินค้าทั้งหมดแบบ Dynamic วนลูปจากตะกร้าจริง */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Content</h3>
            
            <div className="flex flex-col gap-6">
              {order.items.map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  <div className="flex gap-5 items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover" 
                        alt={item.name} 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Academic Series</p>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Size: {item.size} • Quantity: {item.quantity}</p>
                      <p className="text-lg font-extrabold text-[#0F2241] mt-1">
                        ฿{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ซ่อนเส้นแบ่งพาร์ทสำหรับไอเทมตัวสุดท้ายของอาร์เรย์ */}
                  {index < order.items.length - 1 && (
                    <div className="w-full h-[1px] bg-gray-100 mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}