"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavMenu() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return `
      font-semibold
      ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-800"}
      hover:text-blue-600
      pb-1
    `;
  };
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex gap-6">
        <Link href="/" className={linkClass("/")}>
          Search
        </Link>
        <Link href="/chat" className={linkClass("/chat")}>
          Chat
        </Link>
        <Link href="/library" className={linkClass("/library")}>
          Library
        </Link>
      </div>
    </nav>
  );
}
