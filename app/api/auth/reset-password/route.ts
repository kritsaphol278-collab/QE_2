import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // อย่าลืมติดตั้ง npm install bcryptjs

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // 1. ตรวจสอบว่ามีผู้ใช้นี้ในระบบจริงไหม
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้งานนี้ในระบบ" }, { status: 404 });
    }

    // 2. เข้ารหัสผ่านใหม่ (Hash) เพื่อความปลอดภัยก่อนลง Database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. อัปเดตตาราง User ผ่าน Prisma
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword, // เซฟรหัสที่เข้ารหัสแล้วลงไป
      },
    });

    return NextResponse.json({ message: "อัปเดตรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน" }, { status: 500 });
  }
}