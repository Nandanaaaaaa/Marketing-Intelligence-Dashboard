import React from 'react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableStates: string[];
  availableTactics: string[];
  availableCampaigns: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  availableStates, 
  availableTactics,
  availableCampaigns 
}) => {
  const platforms = ['Facebook', 'Google', 'TikTok', 'Business'];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-4">Advanced Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Date Range */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Date Range</label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Platforms</label>
          <div className="space-y-2">
            {platforms.map(platform => (
              <label key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(platform)}
                  onChange={(e) => {
                    const newPlatforms = e.target.checked
                      ? [...filters.platforms, platform]
                      : filters.platforms.filter(p => p !== platform);
                    onFiltersChange({ ...filters, platforms: newPlatforms });
                  }}
                  className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-300 text-sm">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* States */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">States</label>
          <select
            multiple
            value={filters.states}
            onChange={(e) => {
              const selectedStates = Array.from(e.target.selectedOptions, option => option.value);
              onFiltersChange({ ...filters, states: selectedStates });
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            size={4}
          >
            {availableStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>

        {/* Spend Range */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Daily Spend Range</label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min spend"
              value={filters.minSpend || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                minSpend: parseFloat(e.target.value) || 0
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max spend"
              value={filters.maxSpend || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                maxSpend: parseFloat(e.target.value) || Infinity
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-700">
        {/* Tactics */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Campaign Tactics</label>
          <select
            multiple
            value={filters.tactics}
            onChange={(e) => {
              const selectedTactics = Array.from(e.target.selectedOptions, option => option.value);
              onFiltersChange({ ...filters, tactics: selectedTactics });
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            size={3}
          >
            {availableTactics.map(tactic => (
              <option key={tactic} value={tactic}>{tactic}</option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Quick Filters</label>
          <div className="space-y-2">
            <button
              onClick={() => onFiltersChange({
                ...filters,
                dateRange: {
                  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  end: new Date().toISOString().split('T')[0]
                }
              })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => onFiltersChange({
                ...filters,
                dateRange: {
                  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  end: new Date().toISOString().split('T')[0]
                }
              })}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => onFiltersChange({
                dateRange: {
                  start: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  end: new Date().toISOString().split('T')[0]
                },
                platforms: ['Facebook', 'Google', 'TikTok'],
                states: [],
                tactics: [],
                campaigns: [],
                minSpend: 0,
                maxSpend: Infinity
              })}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;