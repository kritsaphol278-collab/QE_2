import NextAuthProvider from "@/components/provider/NextAuthProvider"; // ✅ นำเข้า Provider
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        {/* ✅ ครอบ children ทั้งหมด เพื่อให้ทุกหน้าดึงข้อมูลรูปโปรไฟล์และสถานะล็อกอินได้ */}
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
