'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { User, LogOut } from 'lucide-react'

export function AuthButton() {
  const { user, profile, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (user && profile) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <User size={18} />
          <span>{profile.username}</span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                {profile.full_name || profile.username}
              </div>
              <button
                onClick={() => {
                  signOut()
                  setShowUserMenu(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Login / Sign Up
      </button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
