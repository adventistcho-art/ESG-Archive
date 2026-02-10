'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="삼육대학교"
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg text-gray-900">
              ESG아카이브
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/strategy" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              ESG 전략
            </Link>
            <Link href="/plans" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              ESG 계획
            </Link>
            <a href="/#archive" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              아카이브
            </a>
            <Link href="/whitepaper" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              백서
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  대시보드
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {user?.deptName}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-medium px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                <LogIn className="w-4 h-4" />
                담당자 로그인
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-900"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimateMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Link href="/strategy" className="block px-6 py-3 text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
          ESG 전략
        </Link>
        <Link href="/plans" className="block px-6 py-3 text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
          ESG 계획
        </Link>
        <a href="/#archive" className="block px-6 py-3 text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
          아카이브
        </a>
        <Link href="/whitepaper" className="block px-6 py-3 text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
          백서
        </Link>
        {isAuthenticated ? (
          <>
            <Link href="/admin" className="block px-6 py-3 text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>
              대시보드
            </Link>
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="block w-full text-left px-6 py-3 text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link href="/login" className="block px-6 py-3 text-gray-900 font-medium" onClick={() => setMenuOpen(false)}>
            담당자 로그인
          </Link>
        )}
      </AnimateMobileMenu>
    </motion.header>
  );
}

function AnimateMobileMenu({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden bg-white border-b border-gray-100 shadow-lg"
    >
      <div className="py-3">{children}</div>
    </motion.div>
  );
}
