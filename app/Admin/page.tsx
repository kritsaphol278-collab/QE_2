"use client";

import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  // ================= STATES =================
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // State สำหรับเปิด/ปิด Modal
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // ค่าเริ่มต้นของฟอร์ม
  const initialProductForm = {
    id: "", // ใช้สำหรับเช็คว่าเป็นการ Edit หรือ Add
    name: "",
    sku: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    categoryId: "1", 
    universityId: "cu",
    image: "", // เพิ่มฟิลด์สำหรับรูปภาพ
  };

  const [newProductForm, setNewProductForm] = useState(initialProductForm);
  const [products, setProducts] = useState<any[]>([]); // สร้าง State เก็บสินค้า
  const [isLoading, setIsLoading] = useState(false);

  // ================= FETCH PRODUCTS (ดึงข้อมูลเมื่อโหลดหน้าจอ) =================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        // จัดรูปแบบข้อมูลที่ได้จาก DB ก่อนนำไปแสดง
        const formattedProducts = data.map((item: any) => ({
          id: item.id,
          image: item.image || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=150&auto=format&fit=crop&q=80", // ถ้ารูปไม่มีให้ใช้รูป Default
          name: item.name,
          sku: item.sku || "N/A",
          university: item.universityId,
          faculty: `Category ${item.categoryId}`,
          price: `฿${Number(item.price).toFixed(2)}`,
          // เก็บค่าดิบไว้สำหรับตอนกด Edit
          rawPrice: item.price,
          rawCost: item.cost,
          rawStock: item.stock,
          rawCategoryId: item.categoryId,
          rawDescription: item.description,
          orders: 0, 
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= MOCK DATA (สำหรับ Dashboard) =================
  const bestSellers = [
    { id: "#TU-84920155", name: "White Shirt (L)" },
    { id: "#TU-84920156", name: "Pleated Skirt" },
  ];

  const ordersList = [
    {
      id: "#ORD-9421",
      customer: { name: "Somchai Thai", initials: "ST" },
      date: "Oct 24, 2024",
      amount: "฿ 3,250.00",
      status: "PROCESSING",
      statusColor: "bg-blue-50 text-blue-600",
    }
  ];

  const universitiesList = [
    {
      id: 1,
      crest: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80",
      name: "Chulalongkorn University",
      address: "254 Phayathai Rd, Pathum Wan, Bangkok",
      faculties: 18,
    }
  ];

  // ================= FUNCTIONS จัดการสินค้า =================
  
  // เปิด Modal เพื่อ "เพิ่ม" สินค้าใหม่
  const openAddModal = () => {
    setNewProductForm(initialProductForm);
    setIsProductModalOpen(true);
  };

  // เปิด Modal เพื่อ "แก้ไข" สินค้า
  const openEditModal = (product: any) => {
    setNewProductForm({
      id: product.id,
      name: product.name,
      sku: product.sku === "N/A" ? "" : product.sku,
      description: product.rawDescription || "",
      price: product.rawPrice || "",
      cost: product.rawCost || "",
      stock: product.rawStock || "",
      categoryId: String(product.rawCategoryId || "1"),
      universityId: product.university || "cu",
      image: product.image.includes("unsplash") ? "" : product.image, // ถ้าเป็นรูป Default ไม่ต้องดึงมา
    });
    setIsProductModalOpen(true);
  };

  // บันทึกสินค้า (รองรับทั้ง Add ใหม่ และ Edit)
  const handleSaveProduct = async () => {
    if (!newProductForm.name || !newProductForm.price) {
      alert("Please enter Product Name and Price.");
      return;
    }

    // เช็คว่ามี ID ไหม? ถ้ามีแปลว่าอัปเดต (PUT) ถ้าไม่มีแปลว่าสร้างใหม่ (POST)
    const isEditMode = Boolean(newProductForm.id);
    // กรณีแก้ไข อาจจะต้องใช้ URL แบบ `/api/products/${newProductForm.id}` (ขึ้นอยู่กับที่คุณเขียน API ฝั่ง Backend ไว้)
    const apiUrl = isEditMode ? `/api/products?id=${newProductForm.id}` : "/api/products"; 
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditMode && { id: newProductForm.id }), // ส่ง ID ไปด้วยกรณี Edit
          name: newProductForm.name,
          sku: newProductForm.sku || `SKU-${Date.now()}`,
          description: newProductForm.description,
          price: parseFloat(newProductForm.price),
          cost: parseFloat(newProductForm.cost || "0"),
          stock: parseInt(newProductForm.stock || "0"),
          categoryId: String(newProductForm.categoryId),
          universityId: newProductForm.universityId,
          image: newProductForm.image || null, // ส่ง Image URL ไปด้วย
        }),
      });

      if (!response.ok) throw new Error("Failed to save product");

      // โหลดข้อมูลล่าสุดมาใหม่หลังจาก Save สำเร็จ
      await fetchProducts();
      
      setNewProductForm(initialProductForm);
      setIsProductModalOpen(false);
      alert(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);

    } catch (error) {
      console.error(error);
      alert("Error saving product to database.");
    }
  };

  // ลบสินค้า
  const handleDeleteProduct = async (id: string | number) => {
    const isConfirm = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirm) return;

    try {
      // เรียกใช้ API Method DELETE
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      // อัปเดตหน้าจอโดยลบตัวที่ถูกลบออกไป
      setProducts(products.filter(p => p.id !== id));
      alert("Product deleted successfully!");

    } catch (error) {
      console.error(error);
      alert("Error deleting product.");
    }
  };

  // ================= RENDER =================
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans antialiased text-slate-800 relative">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 z-10 hidden md:flex">
        <div>
          <div className="text-xl font-bold text-[#0f172a] tracking-tight mb-10 pl-2">
            Nisit Shop
          </div>
          <nav className="space-y-1">
            {["Dashboard", "Products", "Orders", "Universities"].map((name) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-100 text-[#0f172a] font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-8 flex flex-col">
          
          {/* ----- VIEW: PRODUCTS ----- */}
          {activeTab === "Products" && (
            <div className="fade-in flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-xl font-bold text-[#0f172a]">Product Management</h1>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Catalog, inventory, and detailed product control.</p>
                </div>
                <button 
                  onClick={openAddModal}
                  className="bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add New Product
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
                {/* Table Header */}
                <div className="grid grid-cols-[80px_2.5fr_1.5fr_1fr_1fr_100px] gap-4 bg-slate-50/80 px-6 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider items-center hidden md:grid">
                  <div>Image</div>
                  <div>Details</div>
                  <div>University</div>
                  <div>Price</div>
                  <div className="text-center">Orders</div>
                  <div className="text-right">Actions</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-slate-100 relative">
                  {isLoading ? (
                    <div className="p-8 text-center text-sm text-slate-500">Loading products...</div>
                  ) : products.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500 font-medium">No products found in the database.</div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="grid grid-cols-1 md:grid-cols-[80px_2.5fr_1.5fr_1fr_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                        <div className="w-14 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 hidden md:block">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#0f172a]">{product.name}</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-0.5">SKU: {product.sku}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-700 uppercase">{product.university}</div>
                          <div className="text-[10px] font-medium text-slate-400">{product.faculty}</div>
                        </div>
                        <div className="text-xs font-bold text-[#0f172a]">{product.price}</div>
                        <div className="text-xs font-bold text-[#0f172a] md:text-center">{product.orders} <span className="md:hidden text-slate-400 font-normal">Orders</span></div>
                        
                        {/* ================= ACTIONS BUTTONS (แก้ไข / ลบ) ================= */}
                        <div className="flex items-center md:justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ----- OTHER VIEWS (ละไว้เพื่อความกระชับ สามารถใช้โค้ด Dashboard/Orders อันเก่ามาต่อได้) ----- */}
          {activeTab !== "Products" && (
            <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-xl shadow-sm border border-slate-100">
               Viewing {activeTab} Section (Content from previous file goes here)
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0f172a]">
                {newProductForm.id ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                
                {/* ข้อมูลพื้นฐาน */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>

                {/* ===== เพิ่มช่องใส่รูปภาพ ===== */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Image URL (ลิงก์รูปภาพ)</label>
                  <input 
                    type="text" 
                    value={newProductForm.image}
                    onChange={(e) => setNewProductForm({...newProductForm, image: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors" 
                    placeholder="https://..." 
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({...newProductForm, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors resize-none" 
                    rows={2}
                  />
                </div>
                
                {/* ราคา และ ต้นทุน */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Price (ราคาขาย) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({...newProductForm, price: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cost (ต้นทุน)</label>
                  <input 
                    type="number" 
                    value={newProductForm.cost}
                    onChange={(e) => setNewProductForm({...newProductForm, cost: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>

                {/* SKU และ สต๊อก */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">SKU (รหัสสินค้า)</label>
                  <input 
                    type="text" 
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({...newProductForm, sku: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Stock (จำนวนสต๊อก)</label>
                  <input 
                    type="number" 
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({...newProductForm, stock: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>

                {/* ความเชื่อมโยง (Relations) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">University</label>
                  <select 
                    value={newProductForm.universityId}
                    onChange={(e) => setNewProductForm({...newProductForm, universityId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="cu">Chulalongkorn (cu)</option>
                    <option value="tu">Thammasat (tu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                  <select 
                    value={newProductForm.categoryId}
                    onChange={(e) => setNewProductForm({...newProductForm, categoryId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="1">Category 1</option>
                    <option value="2">Category 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
              <button 
                onClick={handleSaveProduct}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                {newProductForm.id ? "Save Changes" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}