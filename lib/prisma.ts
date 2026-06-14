import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ใช้ instance เดิมถ้ามีอยู่แล้ว หรือสร้างใหม่ถ้ายังไม่มี (ช่วยป้องกัน connection เต็มบน Dev mode)
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;