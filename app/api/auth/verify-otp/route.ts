import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });

    // ค้นหารหัสในฐานข้อมูล
    const record = await prisma.verificationToken.findFirst({
      where: { email, token: otp },
    });

    if (!record) return NextResponse.json({ error: "รหัส OTP ไม่ถูกต้อง" }, { status: 400 });
    if (record.expires < new Date()) return NextResponse.json({ error: "รหัส OTP หมดอายุแล้ว" }, { status: 400 });

    // ตรวจสอบผ่านแล้ว ให้ลบ OTP นี้ทิ้งทันทีเพื่อป้องกันการใช้งานซ้ำ
    await prisma.verificationToken.delete({ where: { id: record.id } });

    return NextResponse.json({ message: "ยืนยัน OTP สำเร็จ" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการตรวจสอบรหัส" }, { status: 500 });
  }
}