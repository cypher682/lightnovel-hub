'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Send, Users } from 'lucide-react'
import { Database } from '@/types/database.types'
import toast from 'react-hot-toast'

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
  const { user } = useAuth()
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
      subscribeToMessages()
    }
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error) {
      console.error('Error fetching room:', error)
      return
    }

    setRoom(data)
  }

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Error fetching messages:', error)
      return
    }

    setMessages(data || [])
    setLoading(false)
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage

          // Fetch the profile data for the new message
          if (newMessage.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', newMessage.user_id)
              .single()

            newMessage.profiles = profile
          }

          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    // Check message length based on user status
    const maxLength = user ? 1000 : 50
    if (newMessage.length > maxLength) {
      toast.error(`Message too long. Max ${maxLength} characters ${!user ? '(anonymous users)' : ''}.`)
      return
    }

    setSending(true)

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            room_id: roomId,
            user_id: user?.id || null,
            content: newMessage.trim(),
            is_anonymous: !user,
          },
        ])

      if (error) throw error

      setNewMessage('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSending(false)
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-gray-800">{room?.name}</h3>
          {room?.description && (
            <p className="text-sm text-gray-600">{room.description}</p>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users size={16} className="mr-1" />
          <span>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {message.is_anonymous ? 'A' : message.profiles?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">
                    {message.is_anonymous ? 'Anonymous' : message.profiles?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? "Type your message..." : "Type your message (50 chars max)..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={user ? 1000 : 50}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {newMessage.length}/{user ? 1000 : 50}
        </div>
      </form>
    </div>
  )
}
