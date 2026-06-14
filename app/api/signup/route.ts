import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 1. เช็กว่าอีเมลซ้ำในระบบไหม
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้มีผู้ใช้งานแล้ว" }, { status: 400 });
    }

    // 2. เข้ารหัสผ่าน (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. บันทึกลงฐานข้อมูล โดยกำหนดให้ role เป็น USER เสมอ
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // 🔒 แก้ไขตรงนี้: ล็อคค่าเป็น USER ไว้เลย ต่อให้หน้าบ้านส่งอะไรมาก็จะเป็น USER เท่านั้น
      },
    });

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ" }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return NextResponse.json({ error: "ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}