// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { NovelGrid } from '@/components/novels/NovelGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { Search, Filter, Sparkles } from 'lucide-react'
import { Database } from '@/types/database.types'

type LightNovel = Database['public']['Tables']['light_novels']['Row'] & {
  regions: Database['public']['Tables']['regions']['Row']
  novel_genres: Array<{
    genres: Database['public']['Tables']['genres']['Row']
  }>
}

export default function HomePage() {
  const [novels, setNovels] = useState<LightNovel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegions, setSelectedRegions] = useState<number[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    fetchNovels()
  }, [selectedRegions, selectedGenres, selectedStatus, searchTerm])

  const fetchNovels = async () => {
    setLoading(true)
    
    let query = supabase
      .from('light_novels')
      .select(`
        *,
        regions (*),
        novel_genres (
          genres (*)
        )
      `)

    // Apply filters
    if (selectedRegions.length > 0) {
      query = query.in('region_id', selectedRegions)
    }

    if (selectedStatus.length > 0) {
      query = query.in('status', selectedStatus)
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching novels:', error)
      setLoading(false)
      return
    }

    let filteredData = data || []

    // Filter by genres (client-side because of junction table)
    if (selectedGenres.length > 0) {
      filteredData = filteredData.filter(novel =>
        novel.novel_genres.some(ng => selectedGenres.includes(ng.genres.id))
      )
    }

    setNovels(filteredData)
    setLoading(false)
  }

  const clearFilters = () => {
    setSelectedRegions([])
    setSelectedGenres([])
    setSelectedStatus([])
    setSearchTerm('')
  }

  const hasActiveFilters = selectedRegions.length > 0 || selectedGenres.length > 0 || selectedStatus.length > 0 || searchTerm

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="text-yellow-500 mr-2" size={32} />
          <h1 className="text-4xl font-bold text-gray-800">
            Discover Amazing Light Novels
          </h1>
          <Sparkles className="text-yellow-500 ml-2" size={32} />
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore light novels from Japan, China, and Korea. Join our community to discuss your favorites!
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24">
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
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Filter size={18} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
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

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Light Novels'}
              </h2>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${novels.length} novels found`}
              </p>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {/* Region filters */}
                {selectedRegions.map(regionId => {
                  // You'd need to fetch region names for display
                  return (
                    <span key={`region-${regionId}`} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Region {regionId}
                    </span>
                  )
                })}
                
                {/* Status filters */}
                {selectedStatus.map(status => (
                  <span key={`status-${status}`} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full capitalize">
                    {status}
                  </span>
                ))}
                
                {/* Clear all button */}
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Novel Grid */}
          <NovelGrid novels={novels} loading={loading} />
        </div>
      </div>
    </div>
  )
}

