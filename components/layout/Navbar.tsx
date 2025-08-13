'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AuthButton } from '@/components/auth/AuthButton'
import { Book, MessageCircle, Search, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">NovelHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Browse
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-blue-600 font-medium flex items-center space-x-1">
              <MessageCircle size={18} />
              <span>Chat</span>
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-blue-600 font-medium flex items-center space-x-1">
              <Search size={18} />
              <span>Search</span>
            </Link>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/chat"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chat
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
