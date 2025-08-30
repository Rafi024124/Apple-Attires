'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiOutlineMenu } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { totalQuantity } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const user = session?.user || null;

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/IphoneCases", label: "Iphone Cases" },
    { href: "/samsungCases", label: "Samsung Cases" },
  ];

  const privateLinks = [
    { href: "/admin/add-product", label: "Add Products" },
    { href: "/admin/all-products", label: "All Products" },
    { href: "/admin/orders", label: "Orders" },
  ];

  const navLinks = session ? [...publicLinks, ...privateLinks] : publicLinks;

  const navItems = navLinks.map(({ href, label }) => {
    const isActive = pathname === href;

    return (
      <li key={href}>
        <Link
          href={href}
          className={`relative inline-block px-3 py-1 font-medium transition-colors duration-300
            ${isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-500"}`}
        >
          {label}
          {/* underline effect */}
          <span
            className={`absolute left-0 -bottom-[2px] h-[2px] bg-orange-500 transition-all duration-300 ease-out
              ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        </Link>
      </li>
    );
  });

  return (
    <div className="navbar bg-white shadow-md px-6 max-w-7xl mx-auto rounded-full sticky top-0 z-10 mb-4">
      {/* Left: mobile menu + logo */}
      <div className="navbar-start">
        <div className="dropdown relative">
          <div
            role="button"
            className="lg:hidden text-orange-500 p-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <HiOutlineMenu className="text-2xl hover:text-orange-600 cursor-pointer" />
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <Motion.ul
                key="dropdown"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute left-0 mt-3 p-3 w-48 shadow rounded-xl z-[999] bg-white border border-orange-100"
              >
                {user && (
                  <div className="mt-2 mb-3 flex gap-2 items-center bg-orange-50 p-2 rounded-lg">
                    <img
                      src={user?.image || "/default-profile.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-sm"
                    />
                    <h1 className="text-sm text-gray-800 font-semibold">{user?.name}</h1>
                  </div>
                )}
                {navItems}
              </Motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 cursor-pointer">
            <Link href="/">
              <Image
                src="/appleAttiresLogo1.jpg"
                alt="Logo"
                fill
                className="rounded-full object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Center: nav items */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex items-center gap-6">{navItems}</ul>
      </div>

      {/* Right: cart + login/logout */}
      <div className="navbar-end flex items-center space-x-4">
        <Link href="/cart" className="relative text-2xl text-orange-500 hover:text-orange-600 transition">
          <FiShoppingCart />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold text-white">
              {totalQuantity}
            </span>
          )}
        </Link>

        {status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white font-semibold transition shadow-sm"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white font-semibold transition shadow-sm">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
