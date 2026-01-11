'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Star, 
  BookOpen, 
  ExternalLink, 
  Plus, 
  MessageCircle,
  Calendar,
  User,
  Globe
} from 'lucide-react'
import { Database, NovelLink } from '@/types/database.types'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { mockNovels, mockReviews } from '@/lib/mock-data'

type LightNovel = Database['public']['Tables']['light_novels']['Row'] & {
  regions: Database['public']['Tables']['regions']['Row']
  novel_genres: Array<{
    genres: Database['public']['Tables']['genres']['Row']
  }>
}

type Review = Database['public']['Tables']['reviews']['Row'] & {
  profiles: {
    username: string
  }
}

export default function NovelDetailPage() {
  const params = useParams()
  const [novel, setNovel] = useState<LightNovel | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddToList, setShowAddToList] = useState(false)

  const novelId = params.id as string

  useEffect(() => {
    if (novelId) {
      fetchNovel()
      fetchReviews()
    }
  }, [novelId])

  const fetchNovel = async () => {
    setTimeout(() => {
      const foundNovel = mockNovels.find((n) => n.id === novelId)
      setNovel(foundNovel || null)
      setLoading(false)
    }, 300)
  }

  const fetchReviews = async () => {
    setTimeout(() => {
      const novelReviews = mockReviews.filter((r) => r.novel_id === novelId)
      setReviews(novelReviews)
    }, 300)
  }

  const addToReadingList = async (status: string) => {
    toast.success(`Added to ${status.replace('_', ' ')} list!`)
    setShowAddToList(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc: number, review: Review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-80 h-96 bg-gray-300 rounded"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Novel not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="relative h-96 w-full lg:w-80 mx-auto">
              {novel.cover_image_url ? (
                <Image
                  src={novel.cover_image_url}
                  alt={novel.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <BookOpen size={64} className="text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{novel.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <span>{novel.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe size={16} />
                  <span>{novel.regions.name}</span>
                </div>
                {novel.publication_year && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{novel.publication_year}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {novel.novel_genres.map((ng) => (
                <span
                  key={ng.genres.id}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {ng.genres.name}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${
                  novel.status === 'ongoing' ? 'bg-green-500' :
                  novel.status === 'completed' ? 'bg-blue-500' :
                  novel.status === 'hiatus' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <span className="capitalize font-medium">{novel.status}</span>
              </div>
              
              {reviews.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-medium">{getAverageRating()}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
              )}
              
              {novel.total_chapters && (
                <span className="text-gray-600">{novel.total_chapters} chapters</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative">
                <button
                  onClick={() => setShowAddToList(!showAddToList)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  <span>Add to List</span>
                </button>
                
                {showAddToList && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-48">
                    {['reading', 'completed', 'plan_to_read', 'on_hold', 'dropped'].map((status) => (
                      <button
                        key={status}
                        onClick={() => addToReadingList(status)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                href={`/chat?novel=${novel.id}`}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <MessageCircle size={16} />
                <span>Discuss</span>
              </Link>
            </div>

            <div className="space-y-2">
              {novel.official_links && novel.official_links.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Official Links</h3>
                  <div className="space-y-1">
                    {novel.official_links.map((link: NovelLink, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:underline"
                      >
                        <ExternalLink size={14} />
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {novel.translation_links && novel.translation_links.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Translation Links</h3>
                  <div className="space-y-1">
                    {novel.translation_links.map((link: NovelLink, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:underline"
                      >
                        <ExternalLink size={14} />
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
        <p className="text-gray-700 leading-relaxed">{novel.summary}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          <button 
            onClick={() => toast.info('Review submission coming soon!')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Write Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Be the first to review this novel!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review: Review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">
                        {review.profiles.username}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800">{review.title}</h4>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                </div>
                <p className="text-gray-700">{review.content}</p>
                {review.is_spoiler && (
                  <span className="inline-block mt-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Contains Spoilers
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
