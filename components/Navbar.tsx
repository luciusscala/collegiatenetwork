"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

interface NavbarProps {
  navItems?: NavItem[];
  logo?: React.ReactNode;
}

const defaultNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sessions", label: "Sessions" },
  { href: "/teams", label: "Teams" },
  { href: "/players", label: "Players" },
];

const Navbar: React.FC<NavbarProps> = ({ navItems = defaultNavItems, logo }) => {
  const pathname = usePathname();

  return (
    <nav
      className="bg-[#02503B] px-5 py-3 rounded-md flex items-center gap-4"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {logo && (
        <div className="mr-4 flex-shrink-0">{logo}</div>
      )}
      <ul className="flex flex-row gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-2 py-1 font-black font-sans text-[#B04F17] text-base rounded transition-colors border-b-2 ${
                  isActive ? 'border-[#B04F17]' : 'border-transparent'
                } hover:border-[#B04F17]`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar; 