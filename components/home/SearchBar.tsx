"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ universities: any[]; products: any[] }>({
    universities: [],
    products: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // ระบบหน่วงเวลา (Debounce): รอให้พิมพ์เสร็จ 0.3 วินาที ค่อยยิง API
  useEffect(() => {
    if (!query.trim()) {
      setResults({ universities: [], products: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // ดีเลย์ 300ms

    return () => clearTimeout(timer);
  }, [query]);

  // ปิด Dropdown เมื่อคลิกที่อื่นบนหน้าจอ
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      {/* --- ช่อง Input --- */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && (results.universities.length > 0 || results.products.length > 0)) {
              setIsOpen(true);
            }
          }}
          placeholder="Search university or products..."
          className="w-full rounded-2xl border border-gray-300 bg-white pl-12 pr-6 py-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
        />
        {/* ไอคอนค้นหาด้านซ้าย */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        {/* Loading Spinner ด้านขวา (แสดงตอนกำลังดึงข้อมูล) */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* --- Dropdown Results (ดัน z-index ให้สูงสุด) --- */}
      {isOpen && (results.universities.length > 0 || results.products.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[9999]">
          <div className="max-h-[400px] overflow-y-auto p-2">
            
            {/* หมวดหมู่: มหาวิทยาลัย */}
            {results.universities.length > 0 && (
              <div className="mb-2">
                <h3 className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Universities
                </h3>
                {results.universities.map((uni) => (
                  <Link
                    key={uni.id}
                    href={`/university/${uni.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                      {uni.name.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{uni.name}</p>
                      <p className="text-xs text-gray-500">Official Shop</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* หมวดหมู่: สินค้า */}
            {results.products.length > 0 && (
              <div>
                <h3 className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100 mt-2 pt-4">
                  Products
                </h3>
                {results.products.map((product) => {
                  const displayPrice = product.price ? Number(product.price).toFixed(2) : "0.00";
                  
                  return (
                    <Link
                      key={product.id}
                      href={`/university/${product.universityId}/product/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={product.image || "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=100&q=60"} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-blue-600 font-semibold">{product.university?.name || "General Item"}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 ml-2 whitespace-nowrap">
                        ฿{displayPrice}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

          </div>
          
          {/* Footer ของ Dropdown */}
          <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500">Press enter to see all results</span>
          </div>
        </div>
      )}
    </div>
  );
}