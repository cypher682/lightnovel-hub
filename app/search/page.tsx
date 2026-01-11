'use client'

import { useState } from 'react'
import { Search, Filter, Sparkles } from 'lucide-react'
import { NovelGrid } from '@/components/novels/NovelGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { Database } from '@/types/database.types'
import { mockNovels } from '@/lib/mock-data'

type LightNovel = Database['public']['Tables']['light_novels']['Row'] & {
  regions: Database['public']['Tables']['regions']['Row']
  novel_genres: Array<{
    genres: Database['public']['Tables']['genres']['Row']
  }>
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [novels, setNovels] = useState<LightNovel[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedRegions, setSelectedRegions] = useState<number[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const performSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    setTimeout(() => {
      const term = searchTerm.toLowerCase()
      let filteredData = mockNovels.filter(
        (novel) =>
          novel.title.toLowerCase().includes(term) ||
          novel.author.toLowerCase().includes(term) ||
          novel.summary.toLowerCase().includes(term)
      )

      if (selectedRegions.length > 0) {
        filteredData = filteredData.filter((novel) =>
          selectedRegions.includes(novel.region_id)
        )
      }

      if (selectedStatus.length > 0) {
        filteredData = filteredData.filter((novel) =>
          selectedStatus.includes(novel.status)
        )
      }

      if (selectedGenres.length > 0) {
        filteredData = filteredData.filter((novel: LightNovel) =>
          novel.novel_genres.some(ng => selectedGenres.includes(ng.genres.id))
        )
      }

      setNovels(filteredData)
      setLoading(false)
    }, 300)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await performSearch()
  }

  const clearFilters = () => {
    setSelectedRegions([])
    setSelectedGenres([])
    setSelectedStatus([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="text-blue-500 dark:text-blue-400 mr-2" size={28} />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Search Light Novels</h1>
          <Sparkles className="text-blue-500 dark:text-blue-400 ml-2" size={28} />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Find your next favorite read from our collection</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            selectedRegions={selectedRegions}
            selectedGenres={selectedGenres}
            selectedStatus={selectedStatus}
            onRegionChange={setSelectedRegions}
            onGenreChange={setSelectedGenres}
            onStatusChange={setSelectedStatus}
            onClear={clearFilters}
          />
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 h-full overflow-y-auto">
              <FilterSidebar
                selectedRegions={selectedRegions}
                selectedGenres={selectedGenres}
                selectedStatus={selectedStatus}
                onRegionChange={setSelectedRegions}
                onGenreChange={setSelectedGenres}
                onStatusChange={setSelectedStatus}
                onClear={clearFilters}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}

        <div className="flex-1">
          {!hasSearched ? (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Start your search</h3>
              <p className="text-gray-500 dark:text-gray-500">Enter a title, author, or keyword to find light novels</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Search Results for &quot;{searchTerm}&quot;
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? 'Searching...' : `${novels.length} results found`}
                </p>
              </div>
              <NovelGrid novels={novels} loading={loading} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
