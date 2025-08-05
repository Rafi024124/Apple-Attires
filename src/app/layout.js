import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NextAuthProvider from "@/Providers/NextAuthProvider";
import { CartProvider } from "./context/CartContext";
import { Sora } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap', // optional
  weight: ['400', '600', '700'], // choose what you need
});
export const metadata = {
  title: 'Your Website Title',
  description: 'Best iPhone Covers for Women',
};


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.className}>
      <body
        
      >
        <CartProvider>
          <NextAuthProvider>
        <Navbar></Navbar>
        {children}
        </NextAuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
