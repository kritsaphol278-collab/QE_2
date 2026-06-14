"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CheckoutClient() {
  const router = useRouter();
  
  // 🖼️ ตั้งค่าที่อยู่พาธรูปภาพ QR Code ของคุณที่นี่ (ตรวจสอบให้มั่นใจว่าไฟล์อยู่ในโฟลเดอร์ public)
  const qrCodePath = "/test/qr.jpg"; 

  // --- ⏱️ ระบบนับเวลาถอยหลัง 10 นาที ---
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- 👤 ข้อมูลผู้ใช้จริงจาก Database ---
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // --- 🛒 ระบบจัดการตะกร้าสินค้าจริง ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. จำลองการดึงข้อมูล User จาก Database
    setCurrentUser({
      id: "cmqce84os0000pknnb4y3qc2s",
      name: "Isara", 
      email: "isara.pa@ku.th",
      role: "USER"
    });

    // 2. ดึงข้อมูลสินค้าในตะกร้าจาก localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        if (parsedCart.length === 0) router.push("/cart");
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    } else {
      router.push("/cart");
    }
    setIsLoaded(true);
  }, [router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; 
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- 🛠️ ระบบบันทึกข้อมูลก่อนเปลี่ยนหน้า ---
  const handleConfirmOrder = () => {
    const orderData = {
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      items: cartItems,
      shippingLocation: {
        recipientName: currentUser?.name || "Guest User",
        phoneNumber: "+66 81-234-5678",
        address: "123 Sukhumvit Road, Khlong Toei, Bangkok, 10110"
      },
      summary: { subtotal, total },
      paymentStatus: "PENDING_CONFIRMATION"
    };

    // บันทึกลง localStorage เพื่อส่งต่อไปยังหน้า Tracking
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    console.log("Saving Order without VAT:", orderData);
    
    // ล้างตะกร้าสินค้าชั่วคราวออกหลังจากสั่งซื้อเสร็จสิ้นสำเร็จ
    localStorage.removeItem("cart");
    
    // เปลี่ยนหน้า
    router.push("/tracking");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2241]"></div>
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
          <button className="hover:text-blue-900 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <Link href="/cart" className="flex items-center gap-2 hover:text-blue-900 transition-colors relative cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="flex items-center gap-2 hover:text-blue-900 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="hidden sm:inline">{currentUser?.name || "Account"}</span>
          </button>
        </div>
      </nav>

      {/* --- CHECKOUT STEPS --- */}
      <div className="flex justify-center items-start mt-8 mb-10 text-xs font-bold">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-[#0F2241] text-white rounded-full flex items-center justify-center text-sm shadow-sm">1</div>
          <span className="text-[#0F2241]">Delivery</span>
        </div>
        <div className="w-16 h-[1px] bg-gray-300 mt-4 mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-[#0F2241] text-white rounded-full flex items-center justify-center text-sm shadow-sm">2</div>
          <span className="text-[#0F2241]">Payment</span>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ฝั่งซ้าย: ข้อมูลผู้รับจัดส่ง และ QR Code การชำระเงิน */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 🧾 Delivery Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0F2241] flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  Delivery Info
                </h2>
              </div>

              {/* ข้อมูลการจัดส่ง (นำ Dropdown ออกแล้ว) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Recipient Name</p>
                  <p className="text-sm font-bold text-slate-800">{currentUser?.name || "Loading..."}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                  <p className="text-sm font-bold text-slate-800">+66 81-234-5678</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                  <p className="text-sm font-bold text-slate-800">123 Sukhumvit Road, Khlong Toei, Bangkok, 10110</p>
                </div>
              </div>
            </div>

            {/* 💳 Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-[#0F2241] mb-6 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Payment Method
              </h2>
              
              <div className="mb-6">
                <h3 className="font-bold text-[#0F2241]">QR PromptPay</h3>
                <p className="text-xs text-gray-500 mt-1">Scan to pay instantly via any banking app.</p>
              </div>

              <div className="border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center max-w-lg mx-auto">
                <div className="border border-gray-200 rounded-lg p-2 bg-white flex justify-center items-center w-48 h-48 mb-6 shadow-sm">
                  <img 
                    src={qrCodePath} 
                    alt="PromptPay QR Code" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-[#d93826] font-bold text-xs uppercase mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    TIME REMAINING
                  </div>
                  <div className="text-[#d93826] font-bold text-2xl tracking-widest">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: Order Summary */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-xl shadow-sm lg:sticky lg:top-24">
            <h3 className="text-xl font-bold text-[#0F2241] mb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 mb-5 max-h-[240px] overflow-y-auto pr-1">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between gap-3 items-center">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F2241] line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0F2241]">฿{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800">฿{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-bold text-[#0F2241]">Total</span>
              <span className="text-2xl font-black text-[#0F2241]">฿{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleConfirmOrder}
              className="w-full bg-[#0B172E] text-white py-3.5 rounded-lg font-bold text-center hover:bg-slate-800 transition-colors mb-4 text-sm flex justify-center items-center shadow-md cursor-pointer"
            >
              Confirm Order
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Encrypted Secure Payment
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
