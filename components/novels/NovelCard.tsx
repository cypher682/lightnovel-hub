'use client';

import Link from 'next/link'
import Image from 'next/image'
import { Star, BookOpen } from 'lucide-react'
import { Database } from '@/types/database.types'

type LightNovel = Database['public']['Tables']['light_novels']['Row'] & {
  regions: Database['public']['Tables']['regions']['Row']
  novel_genres: Array<{
    genres: Database['public']['Tables']['genres']['Row']
  }>
}

interface NovelCardProps {
  novel: LightNovel
}

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <Link href={`/novel/${novel.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
        <div className="relative h-64 w-full overflow-hidden">
          {novel.cover_image_url ? (
            <Image
              src={novel.cover_image_url}
              alt={novel.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <BookOpen size={48} className="text-white" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {novel.regions.code}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {novel.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">by {novel.author}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {novel.novel_genres?.slice(0, 3).map(({ genres }) => (
              <span
                key={genres.id}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
              >
                {genres.name}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
            {novel.summary}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${
                novel.status === 'ongoing' ? 'bg-green-500' :
                novel.status === 'completed' ? 'bg-blue-500' :
                novel.status === 'hiatus' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
              <span className="capitalize">{novel.status}</span>
            </span>
            {novel.total_chapters && (
              <span>{novel.total_chapters} chapters</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
