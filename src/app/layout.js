// app/layout.js or app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NextAuthProvider from "@/Providers/NextAuthProvider";
import { CartProvider } from "./context/CartContext";
import { Sora } from 'next/font/google';
import Script from 'next/script';
import Footer from "./components/Footer/Footer";


const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Your Website Title',
  description: 'Best iPhone Covers for Women',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.className}>
      <body>
        {/* ✅ Cloudinary Widget Script */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="beforeInteractive"
        />
        
        <CartProvider>
          <NextAuthProvider>
            <Navbar />
            
            {children}
              <Footer></Footer>
          </NextAuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
