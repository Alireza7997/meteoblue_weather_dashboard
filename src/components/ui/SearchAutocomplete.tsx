'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useGeocoding } from '@/hooks/useGeolocation';
import type { AppLocation } from '@/lib/types';
import { Search, X, MapPin, Loader2 } from 'lucide-react';

interface SearchAutocompleteProps {
  onSelect: (location: AppLocation) => void;
  placeholder?: string;
  className?: string;
}

export function SearchAutocomplete({
  onSelect,
  placeholder = 'Search for a city, landmark, or address...',
  className = '',
}: SearchAutocompleteProps) {
  const { search, isLoading } = useGeocoding();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        const data = await search(value);
        setResults(data);
        setIsOpen(data.length > 0);
        setSelectedIndex(-1);
      }, 200);
    },
    [search]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            onSelect(results[selectedIndex]);
            setQuery('');
            setResults([]);
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex, onSelect]
  );

  const handleSelect = useCallback(
    (location: AppLocation) => {
      onSelect(location);
      setQuery('');
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node) && listRef.current && !listRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <label htmlFor="location-search" className="sr-only">Search location</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            ref={inputRef}
            id="location-search"
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className="input pl-12 pr-12"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto"
          role="listbox"
        >
          {results.map((result, index) => (
            <li
              key={`${result.latitude}-${result.longitude}`}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${
                index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <MapPin className="text-cyan-400 w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {result.name}
                  {result.state && <span className="text-slate-400 ml-1">, {result.state}</span>}
                  {result.country && <span className="text-slate-400 ml-1">, {result.country.toUpperCase()}</span>}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(isLoading || isOpen) && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-2xl border border-white/10 p-6 text-center animate-fade-in">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-400">Searching...</p>
        </div>
      )}
    </div>
  );
}