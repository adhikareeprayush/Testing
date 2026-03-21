"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/actions/auth.actions";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blogs", label: "Blogs" },
  { href: "/farmers-stories", label: "Farmers Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-100 bg-background/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-[1700px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Farm Commerce"
            width={44}
            height={44}
            className="object-contain"
          />
          <span className="font-serif text-xl text-dark font-semibold hidden sm:block">
            Farm Commerce
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-700 ${
                  pathname === href
                    ? "text-primary-700 border-b-2 border-primary-700 pb-0.5"
                    : "text-dark"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart — hidden for farmers (they don&apos;t purchase) */}
          {session?.user?.role !== "FARMER" && (
            <Link
              href="/cart"
              className="bg-primary-700 relative p-2 hover:bg-primary-900 rounded-full transition-colors"
            >
              <Image
                src="/assets/Resuable/cart.svg"
                alt="Cart"
                width={20}
                height={20}
              />
              {itemCount > 0 && session?.user?.role === "USER" && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-dark max-w-[100px] truncate">
                  {session.user.name}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  {session.user.role === "USER" && (
                    <>
                      <Link
                        href="/user/dashboard"
                        className="block px-4 py-2.5 text-sm text-dark hover:bg-primary-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/user/orders"
                        className="block px-4 py-2.5 text-sm text-dark hover:bg-primary-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  )}
                  {session.user.role === "FARMER" && (
                    <Link
                      href="/farmer/dashboard"
                      className="block px-4 py-2.5 text-sm text-dark hover:bg-primary-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Farmer dashboard
                    </Link>
                  )}
                  {(session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN") && (
                    <Link
                      href="/super-admin"
                      className="block px-4 py-2.5 text-sm text-dark hover:bg-primary-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Super admin
                    </Link>
                  )}
                  {(session.user.role === "SUPER_ADMIN" ||
                    session.user.role === "ADMIN" ||
                    session.user.role === "FARMER") && (
                    <Link
                      href="/admin/upload"
                      className="block px-4 py-2.5 text-sm text-dark hover:bg-primary-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Image upload
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Hamburger */}
          <button
            id="hamburger"
            className={`lg:hidden flex flex-col gap-1.5 p-2 ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="flex flex-col px-6 pb-4 gap-1 bg-white border-t border-gray-100">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === href
                    ? "bg-primary-100 text-primary-700"
                    : "text-dark hover:bg-gray-50"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          {!session?.user && (
            <li className="pt-2">
              <Link
                href="/login"
                className="block py-2.5 px-3 text-sm font-medium bg-primary-700 text-white rounded-lg text-center"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
