'use client'

import { useState, useEffect } from 'react'
import { ChatRoomList } from './ChatRoomList'
import { ChatRoom } from './ChatRoom'
import { Menu, X } from 'lucide-react'

export function ChatLayout() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex h-[600px]">
          <div className="hidden md:block w-80 border-r bg-gray-50 p-4">
            <ChatRoomList
              selectedRoomId={selectedRoomId}
              onRoomSelect={setSelectedRoomId}
            />
          </div>

          {showSidebar && (
            <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="bg-white w-80 h-full p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Chat Rooms</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>
                <ChatRoomList
                  selectedRoomId={selectedRoomId}
                  onRoomSelect={(roomId) => {
                    setSelectedRoomId(roomId)
                    setShowSidebar(false)
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <div className="md:hidden flex items-center justify-between p-4 border-b">
              <button
                onClick={() => setShowSidebar(true)}
                className="text-gray-600"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-semibold">Chat</h1>
              <div></div>
            </div>

            <div className="flex-1 p-4">
              {selectedRoomId ? (
                <ChatRoom roomId={selectedRoomId} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Welcome to Chat
                    </h3>
                    <p className="text-gray-500">
                      Select a room to start chatting about light novels!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
