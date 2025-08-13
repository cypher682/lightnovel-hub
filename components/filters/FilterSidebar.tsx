'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { Database } from '@/types/database.types'

type Region = Database['public']['Tables']['regions']['Row']
type Genre = Database['public']['Tables']['genres']['Row']

interface FilterSidebarProps {
  selectedRegions: number[]
  selectedGenres: number[]
  selectedStatus: string[]
  onRegionChange: (regions: number[]) => void
  onGenreChange: (genres: number[]) => void
  onStatusChange: (status: string[]) => void
  onClear: () => void
  isMobile?: boolean
  onClose?: () => void
}

export function FilterSidebar({
  selectedRegions,
  selectedGenres,
  selectedStatus,
  onRegionChange,
  onGenreChange,
  onStatusChange,
  onClear,
  isMobile = false,
  onClose,
}: FilterSidebarProps) {
  const [regions, setRegions] = useState<Region[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [expandedSections, setExpandedSections] = useState({
    regions: true,
    genres: true,
    status: true,
  })

  const statusOptions = [
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'hiatus', label: 'Hiatus' },
    { value: 'dropped', label: 'Dropped' },
  ]

  useEffect(() => {
    fetchFilters()
  }, [])

  const fetchFilters = async () => {
    const [regionsResult, genresResult] = await Promise.all([
      supabase.from('regions').select('*').order('name'),
      supabase.from('genres').select('*').order('name'),
    ])

    if (regionsResult.data) setRegions(regionsResult.data)
    if (genresResult.data) setGenres(genresResult.data)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleRegionToggle = (regionId: number) => {
    const updated = selectedRegions.includes(regionId)
      ? selectedRegions.filter(id => id !== regionId)
      : [...selectedRegions, regionId]
    onRegionChange(updated)
  }

  const handleGenreToggle = (genreId: number) => {
    const updated = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    onGenreChange(updated)
  }

  const handleStatusToggle = (status: string) => {
    const updated = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status]
    onStatusChange(updated)
  }

  return (
    <div className={`bg-white ${isMobile ? 'h-full' : 'rounded-lg shadow-md'} p-6`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-500">
            <X size={24} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        {!isMobile && <h2 className="text-xl font-bold">Filters</h2>}
        <button
          onClick={onClear}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Regions */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('regions')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
        >
          Region
          {expandedSections.regions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedSections.regions && (
          <div className="space-y-2">
            {regions.map((region) => (
              <label key={region.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region.id)}
                  onChange={() => handleRegionToggle(region.id)}
                  className="mr-2"
                />
                <span className="text-sm">{region.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Genres */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('genres')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
        >
          Genre
          {expandedSections.genres ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedSections.genres && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="mr-2"
                />
                <span className="text-sm">{genre.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('status')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
        >
          Status
          {expandedSections.status ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedSections.status && (
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(option.value)}
                  onChange={() => handleStatusToggle(option.value)}
                  className="mr-2"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
