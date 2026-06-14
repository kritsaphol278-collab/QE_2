import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ShopClient from "./ShopClient"; // เรียกใช้ Client Component ที่เราจะสร้าง

const prisma = new PrismaClient();

export default async function UniversityShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const uniId = resolvedParams.id;

  const university = await prisma.university.findUnique({
    where: { id: uniId },
  });

  if (!university) {
    notFound();
  }

  const universityProducts = await prisma.product.findMany({
    where: {
      universityId: uniId,
    },
    include: {
      category: true, 
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // ส่งข้อมูลที่ดึงมาไปให้ ShopClient เพื่อแสดงผลและทำระบบกรอง Tag
  return (
    <ShopClient 
      university={university} 
      products={universityProducts} 
      uniId={uniId} 
    />
  );
}