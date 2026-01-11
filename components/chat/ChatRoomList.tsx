'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Users, Book } from 'lucide-react'
import { Database } from '@/types/database.types'
import { mockChatRooms } from '@/lib/mock-data'

type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'] & {
  regions?: Database['public']['Tables']['regions']['Row'] | null
  light_novels?: Database['public']['Tables']['light_novels']['Row'] | null
}

interface ChatRoomListProps {
  selectedRoomId: string | null
  onRoomSelect: (roomId: string) => void
}

export function ChatRoomList({ selectedRoomId, onRoomSelect }: ChatRoomListProps) {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setTimeout(() => {
      setRooms(mockChatRooms)
      setLoading(false)
    }, 300)
  }

  const getRoomIcon = (room: ChatRoom) => {
    switch (room.type) {
      case 'general':
        return <MessageCircle size={16} />
      case 'region':
        return <Users size={16} />
      case 'novel':
        return <Book size={16} />
      default:
        return <MessageCircle size={16} />
    }
  }

  const getRoomDisplayName = (room: ChatRoom) => {
    if (room.type === 'novel' && room.light_novels) {
      return room.light_novels.title
    }
    return room.name
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Chat Rooms</h3>
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomSelect(room.id)}
          className={`w-full text-left p-3 rounded-lg transition-all ${
            selectedRoomId === room.id
              ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 border'
              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`${selectedRoomId === room.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {getRoomIcon(room)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-800 dark:text-white truncate">
                {getRoomDisplayName(room)}
              </div>
              {room.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {room.description}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
