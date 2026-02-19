"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a2e] text-white">
      <nav className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          그때그사람
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" className="hover:text-[#4361ee] transition-colors">
            검색
          </Link>
          <Link href="/upload" className="hover:text-[#4361ee] transition-colors">
            업로드
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-300">{user?.nickname}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#4361ee] px-3 py-1.5 rounded-md hover:bg-[#3a56d4] transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
