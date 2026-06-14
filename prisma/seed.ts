//seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // User
  const admin = await prisma.user.create({
    data: {
      email: "admin@thaiuniform.com",
      password: "123456",
      name: "Admin",
      role: "admin",
    },
  });

  // Categories
  const categories = await prisma.category.createMany({
    data: [
      {
        name: "ชุดนักเรียน",
        slug: "student-uniform",
        description: "ชุดนักเรียนทุกระดับ",
      },
      {
        name: "ชุดกีฬา",
        slug: "sportswear",
        description: "ชุดกีฬาโรงเรียน",
      },
      {
        name: "ชุดลูกเสือ",
        slug: "scout-uniform",
        description: "ชุดลูกเสือและเนตรนารี",
      },
    ],
  });

  const studentCategory = await prisma.category.findFirst({
    where: { slug: "student-uniform" },
  });

  // Products
  const shirt = await prisma.product.create({
    data: {
      name: "เสื้อนักเรียนชาย",
      sku: "UNI-001",
      description: "เสื้อนักเรียนชายแขนสั้น",
      price: 250,
      cost: 180,
      stock: 120,
      image: "/products/shirt.jpg",
      categoryId: studentCategory?.id,
    },
  });

  const pants = await prisma.product.create({
    data: {
      name: "กางเกงนักเรียนชาย",
      sku: "UNI-002",
      description: "กางเกงนักเรียนสีดำ",
      price: 350,
      cost: 250,
      stock: 80,
      image: "/products/pants.jpg",
      categoryId: studentCategory?.id,
    },
  });

  // Inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: shirt.id,
        quantity: 120,
        reserved: 10,
        available: 110,
        location: "Warehouse A",
      },
      {
        productId: pants.id,
        quantity: 80,
        reserved: 5,
        available: 75,
        location: "Warehouse A",
      },
    ],
  });

  // Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: "สมชาย ใจดี",
      email: "somchai@example.com",
      phone: "0812345678",
      city: "กรุงเทพ",
      country: "Thailand",
      segment: "VIP",
      totalSpent: 4500,
      orderCount: 5,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "สมหญิง รักดี",
      email: "somying@example.com",
      phone: "0898765432",
      city: "เชียงใหม่",
      country: "Thailand",
      segment: "Regular",
      totalSpent: 1200,
      orderCount: 2,
    },
  });

  // Coupon
  const coupon = await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      description: "ส่วนลด 10%",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 500,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
    },
  });

  // Orders
  const order1 = await prisma.order.create({
    data: {
      orderId: "ORD-2026001",
      customerId: customer1.id,
      customerName: customer1.name,
      email: customer1.email,
      phone: customer1.phone,
      amount: 850,
      discount: 85,
      tax: 53,
      total: 818,
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: "PromptPay",
      couponId: coupon.id,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderId: "ORD-2026002",
      customerId: customer2.id,
      customerName: customer2.name,
      email: customer2.email,
      phone: customer2.phone,
      amount: 350,
      tax: 24.5,
      total: 374.5,
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
    },
  });

  // Order Items
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: shirt.id,
        quantity: 2,
        price: 250,
        total: 500,
      },
      {
        orderId: order1.id,
        productId: pants.id,
        quantity: 1,
        price: 350,
        total: 350,
      },
      {
        orderId: order2.id,
        productId: pants.id,
        quantity: 1,
        price: 350,
        total: 350,
      },
    ],
  });

  // Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: shirt.id,
        customerName: "สมชาย ใจดี",
        rating: 5,
        comment: "คุณภาพดีมาก",
        status: "approved",
      },
      {
        productId: pants.id,
        customerName: "สมหญิง รักดี",
        rating: 4,
        comment: "ผ้าดี ใส่สบาย",
        status: "approved",
      },
    ],
  });

  // Inventory Movement
  await prisma.inventoryMovement.createMany({
    data: [
      {
        productId: shirt.id,
        type: "in",
        quantity: 120,
        reason: "Initial Stock",
      },
      {
        productId: pants.id,
        type: "in",
        quantity: 80,
        reason: "Initial Stock",
      },
    ],
  });

  console.log("🌱 Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });