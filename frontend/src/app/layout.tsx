import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import ClientProviders from "@/components/ClientProviders";

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="bg-brand-bg text-gray-800 antialiased"
      >
        {/* 🔥 CLIENT SIDE STATE BOOTSTRAP */}
        <ClientProviders>
          <AuthBootstrap />
          <Navbar />
          <main className="min-h-screen overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </ClientProviders>
      </body>
    </html>
  );
}
