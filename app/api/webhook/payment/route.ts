import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 💡 แกะข้อมูลที่ธนาคารส่งมา (โครงสร้างจะขึ้นอยู่กับ Gateway ที่คุณเลือกใช้)
    const gatewayOrderId = payload.order_id; 
    const paymentSuccess = payload.status === "success"; 

    if (paymentSuccess) {
      // 🔥 อัปเดตสถานะใน MySQL จาก PENDING -> PAID
      await prisma.order.update({
        where: { id: gatewayOrderId },
        data: { paymentStatus: "PAID" },
      });

      // ส่ง HTTP 200 ตอบกลับธนาคารว่าเราได้รับข้อมูลเรียบร้อยแล้ว
      return NextResponse.json({ received: true }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}