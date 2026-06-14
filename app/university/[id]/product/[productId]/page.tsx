import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

// ประกาศสร้าง Prisma Client
const prisma = new PrismaClient();

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const resolvedParams = await params;
  const uniId = resolvedParams.id;
  const productId = resolvedParams.productId;

  // 1. ดึงข้อมูลมหาวิทยาลัย (เพื่อเอาชื่อไปแสดงใน Breadcrumbs)
  const university = await prisma.university.findUnique({
    where: { id: uniId },
  });

  // 2. ดึงข้อมูลสินค้าที่ตรงกับ productId และเชื่อมโยงหมวดหมู่มาด้วย
  const product = await prisma.product.findUnique({
    where: { 
      id: productId 
    },
    include: {
      category: true, 
    }
  });

  // ถ้าไม่พบข้อมูลมหาวิทยาลัย หรือ ไม่พบสินค้า ให้แสดงหน้า 404
  if (!university || !product) {
    notFound();
  }

  // 3. ดึงข้อมูลสินค้าอื่นๆ ในมหาวิทยาลัยเดียวกันมา 4 ชิ้น (ไม่รวมสินค้าปัจจุบัน)
  const relatedProducts = await prisma.product.findMany({
    where: {
      universityId: uniId,
      id: { not: productId } // ยกเว้นสินค้าที่กำลังเปิดดูอยู่
    },
    take: 4,
  });

  // ส่งข้อมูลทั้งหมดไปให้ Client Component จัดการแสดงผลต่อ
  return (
    <ProductClient 
      uniId={uniId} 
      university={university} 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}