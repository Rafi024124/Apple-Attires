'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiOutlineMenu } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import NetflixButton from "@/app/components/NetflixButton/NetflixButton";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { totalQuantity } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const user = session?.user || null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/IphoneCases", label: "Iphone Cases" },
    { href: "/samsungCases", label: "Samsung Cases" },
    { href: "/admin/add-product", label: "Add Products" },
    { href: "/admin/all-products", label: "All Products" },
    { href: "/admin/orders", label: "Orders" },
  ];

  const navItems = navLinks.map(({ href, label }) => {
    const isActive = pathname === href;

    return (
      <li key={href}>
        <Link
          href={href}
          className={`
            relative inline-block px-2 py-1 transition duration-300 
            ${isActive 
              ? "text-orange-500 font-bold after:w-full" 
              : "text-orange-300 group"}  /* default text is now orange */
            after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 
            after:bg-orange-500 after:transition-all after:duration-300 
            group-hover:after:w-full
          `}
        >
          {label}
        </Link>
      </li>
    );
  });

  return (
    <div className="navbar bg-white text-white shadow-md px-6 max-w-7xl mx-auto rounded-full sticky top-0 z-10 mb-4">
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
                className="absolute left-0 mt-3 p-2 w-48 shadow rounded-box z-[999] bg-black/80 backdrop-blur-md"
              >
                {user && (
                  <div className="mt-3 flex gap-2 mb-2 items-center bg-black p-1 rounded-t-2xl">
                    <img
                      src={user?.image || "/default-profile.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-[0_0_10px_#F97316]"
                    />
                    <h1 className="text-[12px] text-white">{user?.name}</h1>
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
                className="rounded-full object-cover"
                priority
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">{navItems}</ul>
      </div>

      <div className="navbar-end flex items-center space-x-3">
        {/* Cart Icon with badge */}
        <Link href="/cart" className="relative text-2xl text-white hover:text-orange-500 transition">
          <FiShoppingCart />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold text-white">
              {totalQuantity}
            </span>
          )}
        </Link>

        {/* Login / Logout buttons */}
        {status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white font-semibold transition"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white font-semibold transition">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
