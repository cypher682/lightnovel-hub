'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Users } from 'lucide-react'
import { Database } from '@/types/database.types'
import toast from 'react-hot-toast'
import { mockChatRooms, mockChatMessages } from '@/lib/mock-data'

type ChatRoom = Database['public']['Tables']['chat_rooms']['Row']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'] & {
  profiles?: {
    username: string
    avatar_url?: string
  } | null
}

interface ChatRoomProps {
  roomId: string
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (roomId) {
      fetchRoom()
      fetchMessages()
    }
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchRoom = async () => {
    setTimeout(() => {
      const foundRoom = mockChatRooms.find((r) => r.id === roomId)
      setRoom(foundRoom || null)
    }, 200)
  }

  const fetchMessages = async () => {
    setTimeout(() => {
      const roomMessages = mockChatMessages.filter((m) => m.room_id === roomId)
      setMessages(roomMessages)
      setLoading(false)
    }, 300)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const maxLength = 50
    if (newMessage.length > maxLength) {
      toast.error(`Message too long. Max ${maxLength} characters.`)
      return
    }

    setSending(true)

    setTimeout(() => {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        room_id: roomId,
        user_id: null,
        content: newMessage.trim(),
        is_anonymous: true,
        created_at: new Date().toISOString(),
        profiles: null,
      }

      setMessages((prev) => [...prev, newMsg])
      setNewMessage('')
      setSending(false)
      toast.success('Message sent!')
    }, 300)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-96 flex flex-col transition-colors">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">{room?.name}</h3>
          {room?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{room.description}</p>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Users size={16} className="mr-1" />
          <span>Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {message.is_anonymous ? 'A' : message.profiles?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-800 dark:text-white">
                    {message.is_anonymous ? 'Anonymous' : message.profiles?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 break-words">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message (50 chars max)..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            maxLength={50}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {newMessage.length}/50
        </div>
      </form>
    </div>
  )
}
