'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { NovelGrid } from '@/components/novels/NovelGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      let query = supabase
        .from('light_novels')
        .select(`
          *,
          regions (*),
          novel_genres (
            genres (*)
          )
        `)
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`)

      // Apply filters
      if (selectedRegions.length > 0) {
        query = query.in('region_id', selectedRegions)
      }

      if (selectedStatus.length > 0) {
        query = query.in('status', selectedStatus)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      let filteredData = data || []

      // Filter by genres (client-side because of junction table)
      if (selectedGenres.length > 0) {
        filteredData = filteredData.filter(novel =>
          novel.novel_genres.some(ng => selectedGenres.includes(ng.genres.id))
        )
      }

      setNovels(filteredData)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedRegions([])
    setSelectedGenres([])
    setSelectedStatus([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Light Novels</h1>
        <p className="text-gray-600">Find your next favorite read</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
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

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white h-full overflow-y-auto">
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

        {/* Results */}
        <div className="flex-1">
          {!hasSearched ? (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Start your search</h3>
              <p className="text-gray-500">Enter a title, author, or keyword to find light novels</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Search Results for "{searchTerm}"
                </h2>
                <p className="text-gray-600">
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

