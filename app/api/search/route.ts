// app/api/search/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // รับคำค้นหา (query) จาก URL เช่น /api/search?q=เสื้อ
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ universities: [], products: [] });
  }

  try {
    // 1. ค้นหามหาวิทยาลัย (หาจากชื่อที่คล้ายคำค้นหา) จำกัด 3 อัน
    const universities = await prisma.university.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      take: 3, 
    });

    // 2. ค้นหาสินค้า (หาจากชื่อที่คล้ายคำค้นหา) จำกัด 5 อัน
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      // include มหาวิทยาลัยมาด้วย เพื่อเอาชื่อไปแสดงในผลลัพธ์สินค้า
      include: {
        university: true,
      },
      take: 5,
    });

    return NextResponse.json({ universities, products });
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}