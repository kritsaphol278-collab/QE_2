import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. ดึงข้อมูลสินค้าทั้งหมด (GET) - ตรงนี้แหละที่จะทำให้เห็นข้อมูลเก่า!
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }, // เรียงลำดับจากสินค้าใหม่ล่าสุดไปเก่า
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. เพิ่มสินค้าใหม่ (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sku, price, description, cost, stock, categoryId, universityId, image } = body;

    const newProduct = await prisma.product.create({
      data: {
        name: name,
        sku: sku,
        description: description || "",
        price: parseFloat(price),
        cost: parseFloat(cost || 0),
        stock: parseInt(stock || 0),
        lowStockThreshold: 10,
        status: "active",
        categoryId: String(categoryId || "1"),
        universityId: String(universityId || "cu"),
        image: image || null, // บันทึกรูปภาพ
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// 3. แก้ไขสินค้า (PUT)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // ค่าที่ได้มาจะเป็น String อยู่แล้ว
    
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { name, sku, price, description, cost, stock, categoryId, universityId, image } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: id }, // ✅ แก้ตรงนี้: ใช้ id ตรงๆ ได้เลย ไม่ต้องครอบด้วย Number()
      data: {
        name: name,
        sku: sku,
        description: description || "",
        price: parseFloat(price),
        cost: parseFloat(cost || 0),
        stock: parseInt(stock || 0),
        categoryId: String(categoryId || "1"),
        universityId: String(universityId || "cu"),
        image: image || null,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// 4. ลบสินค้า (DELETE)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // ค่าที่ได้มาจะเป็น String อยู่แล้ว

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: id }, // ✅ แก้ตรงนี้: ใช้ id ตรงๆ ได้เลย ไม่ต้องครอบด้วย Number()
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}