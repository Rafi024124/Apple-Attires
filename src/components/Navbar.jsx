'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  // You can replace this with your actual user data from session if needed
  const user = null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/trainers", label: "All Trainers" },
    { href: "/allClasses", label: "All Classes" },
    { href: "/forums", label: "Community" },
  ];

  const navItems = navLinks.map(({ href, label }) => {
    const isActive = false;

    return (
      <li key={href}>
        <Link
          href={href}
          className={`relative inline-block px-2 py-1 transition duration-300 glow-link ${
            isActive ? "text-[#a259ff] font-bold neon-text" : "group"
          }`}
        >
          <span
            className={`after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 after:bg-gradient-to-r from-[#a259ff] to-[#00f0ff] after:transition-all after:duration-300 group-hover:after:w-full group-hover:after:shadow-glow`}
          >
            {label}
          </span>
        </Link>
      </li>
    );
  });

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="navbar bg-dark-brown text-[#F2F2F2] shadow-md px-6 max-w-7xl mx-auto rounded-full">
      <div className="navbar-start">
        <div className="dropdown relative">
          <div
            role="button"
            className="lg:hidden text-accent p-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <HiOutlineMenu className="text-2xl text-soft-white hover:neon-icon" />
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <Motion.ul
                key="dropdown"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute left-0 mt-3 p-2 w-48 shadow rounded-box z-[999] bg-brown"
              >
                {user && (
                  <div className="mt-3 flex gap-2 mb-2 items-center bg-black p-1 rounded-t-2xl">
                    <img
                      src={user?.photoURL || "/default-profile.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-cyan-300 shadow-[0_0_10px_#A259FF]"
                    />
                    <h1 className="text-[12px] text-white">{user?.displayName}</h1>
                  </div>
                )}
                {navItems}
              </Motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20">
            <Image
              src="/appleAttiresLogo.jpg"
              alt="Logo"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2 text-[#E9DCCF] ">{navItems}</ul>
      </div>

      <div className="navbar-end flex items-center space-x-3">
        {/* Cart Icon with badge */}
        <Link href="/cart" className="relative text-2xl text-white hover:text-cyan-400">
          <FiShoppingCart />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold text-white">
              {totalQuantity}
            </span>
          )}
        </Link>

        {/* Login / Logout buttons */}
        {status === "authenticated" ? (
          <Link href="/logout" onClick={() => signOut()}>
            <NetflixButton text="Logout" />
          </Link>
        ) : (
          <Link href="/login">
            <NetflixButton text="Login" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
