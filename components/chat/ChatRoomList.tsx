'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageCircle, Users, Book } from 'lucide-react'
import { Database } from '@/types/database.types'

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
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        regions (*),
        light_novels (*)
      `)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching rooms:', error)
      return
    }

    setRooms(data || [])
    setLoading(false)
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
          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 mb-3">Chat Rooms</h3>
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomSelect(room.id)}
          className={`w-full text-left p-3 rounded-lg transition-colors ${
            selectedRoomId === room.id
              ? 'bg-blue-100 border-blue-500 border'
              : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`${selectedRoomId === room.id ? 'text-blue-600' : 'text-gray-500'}`}>
              {getRoomIcon(room)}
            </span>
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-800">
                {getRoomDisplayName(room)}
              </div>
              {room.description && (
                <div className="text-xs text-gray-600 truncate">
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

