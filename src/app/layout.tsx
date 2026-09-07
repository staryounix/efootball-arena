import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "eFootball ARENA Morocco | 1 ضد 1 وبطولات برصيد حقيقي",
  description: "المنصة الأولى بالمغرب لـ eFootball لخوض تحديات 1 ضد 1 وبطولات بجوائز نقدية حقيقية. شحن يدوي آمن عبر CIH Bank و Cash Plus مع ضمان مالي Escrow 100%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className="font-sans antialiased bg-[#090b10] text-zinc-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black"
      >
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
