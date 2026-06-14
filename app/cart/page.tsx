import { PrismaClient } from "@prisma/client";
import CartPageClient from "./CartPageClient"; // เปลี่ยนชื่อตัวลูกเล็กน้อยให้สื่อสารชัดเจนว่าเป็น Client

// ประกาศสร้าง Prisma Client สไตล์เดียวกับ ProductDetailPage
const prisma = new PrismaClient();

export default async function Page() {
  // 1. ดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล พร้อมผูกตาราง category มาด้วย
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  // 2. ส่งข้อมูลสินค้าที่ดึงจาก Database ทั้งหมดส่งต่อไปยัง Client Component
  return <CartPageClient products={allProducts} />;
}