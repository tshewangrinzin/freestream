import { Search, Menu, Upload, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { movies } from '../data/movies';
import { Movie } from '../types/movie';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of search results
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredMovies);
      setShowResults(true);
      setSelectedResultIndex(-1);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedResultIndex >= 0 && searchResults[selectedResultIndex]) {
          handleResultClick(searchResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  const handleResultClick = (movie: Movie) => {
    navigate(`/watch/${movie.id}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6 dark:text-white" />
        </button>
        <h1 
          onClick={() => navigate('/')} 
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold dark:text-white cursor-pointer transition-all duration-200"
        >
          CinemaStream
        </h1>
      </div>

      <div className="flex-1 max-w-xl mx-auto px-2 md:px-4" ref={searchRef}>
        <div className="relative">
          <div className="flex items-center">
            <div className="relative flex-1 flex items-center border rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies..."
                className="w-full px-3 md:px-4 py-1.5 bg-transparent outline-none text-sm md:text-base dark:text-white dark:placeholder-gray-400"
              />
              <button className="px-3 md:px-4 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto">
              {searchResults.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => handleResultClick(movie)}
                  onMouseEnter={() => setSelectedResultIndex(index)}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                    index === selectedResultIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {movie.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {movie.year} • {movie.genre}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {showResults && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center text-gray-500 dark:text-gray-400">
              No movies found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <button
            onClick={() => navigate('/upload')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Upload"
          >
            <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700" />
          ) : (
            <Sun className="w-5 h-5 text-gray-300" />
          )}
        </button>

        <ProfileDropdown />
      </div>
    </header>
  );
}