import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();

// เรียกใช้งานระบบ Resend ผ่าน API Key ใน .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "กรุณาระบุอีเมล" }, { status: 400 });

    // 1. เคลียร์รหัส OTP เก่าของผู้ใช้นี้ทิ้งก่อน
    await prisma.verificationToken.deleteMany({ where: { email } });

    // 2. สุ่มเลขรหัส 6 ตัว และตั้งเวลาหมดอายุไปอีก 10 นาที
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // 3. บันทึกลงตารางใน MySQL
    await prisma.verificationToken.create({
      data: { email, token: otp, expires }
    });

    // 4. สั่งส่งอีเมลจริงผ่านระบบ Resend ไปยังอีเมลปลายทาง
    await resend.emails.send({
      from: "ThaiUni Support <onboarding@resend.dev>", // ใช้เมลส่งฟรีที่ระบบเตรียมไว้ให้ได้เลย
      to: email, // อีเมลจริงของผู้ใช้ที่พิมพ์เข้ามาหน้าบ้าน
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; margin: 0 auto; background-color: #ffffff;">
          <h2 style="color: #0B2D5C; margin-top: 0; margin-bottom: 8px; font-size: 22px; font-weight: 8px;">Reset Your Password</h2>
          <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">Here is your 6-digit verification code to process your request:</p>
          
          <div style="background: #F0F5FA; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
            <strong style="font-size: 36px; letter-spacing: 8px; color: #0B2D5C; font-family: monospace;">${otp}</strong>
          </div>
          
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
            This code will expire in 10 minutes.<br />
            If you didn't make this request, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    // ในไฟล์ app/api/auth/send-otp/route.ts

      await resend.emails.send({
          // 🌟 เปลี่ยนตรงนี้! จากเดิมที่เป็น onboarding@resend.dev 
          // ให้เปลี่ยนเป็นอีเมลภายใต้โดเมนที่คุณยืนยันแล้ว เช่น:
          from: "ThaiUni Support <support@yourdomain.com>",

          to: email, // คราวนี้ตัวแปร email ตรงนี้จะเป็นของใครก็ได้บนโลกนี้แล้วครับ ส่งผ่าน 100%
          subject: "Your OTP for Password Reset",
          html: `...`
      });

    return NextResponse.json({ message: "ส่งรหัส OTP เข้าอีเมลจริงสำเร็จ" });
  } catch (error) {
    console.error("RESEND SMTP ERROR:", error);
    return NextResponse.json({ error: "ระบบส่งอีเมลขัดข้อง กรุณาเช็ก RESEND_API_KEY ใน .env" }, { status: 500 });
  }
}