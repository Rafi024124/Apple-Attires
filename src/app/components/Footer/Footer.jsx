"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + Brand */}
        <div className="flex items-center space-x-3">
          <Image
            src="/appleLogo.jpg"
            alt="Apple Attires Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h2 className="text-2xl font-bold text-orange-500">
            Apple Attires
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:justify-center gap-4 text-sm font-medium">
          <Link href="/About" className="hover:text-orange-500 transition-colors">
            About
          </Link>
          <Link href="/Delivery" className="hover:text-orange-500 transition-colors">
            Delivery
          </Link>
          <Link href="/PrivacyPolicy" className="hover:text-orange-500 transition-colors">
            Privacy
          </Link>
          <Link href="/Terms" className="hover:text-orange-500 transition-colors">
            Terms
          </Link>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-start md:justify-end">
          <p className="text-xs md:text-sm text-gray-400">
            © {new Date().getFullYear()} Apple Attires. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
