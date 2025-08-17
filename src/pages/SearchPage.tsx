import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../features/jobs/components/SearchBar";
import LocationSelector from "../features/jobs/components/LocationSelector";
import axios from "axios";

interface SearchHistory {
  id: number;
  query: string;
  timestamp: string;
}

interface LocationState {
  currentQuery?: string;
  returnTo?: string;
}

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [searchQuery, setSearchQuery] = useState(state?.currentQuery || "");
  const [selectedLocation, setSelectedLocation] = useState("Kerala, India");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch search history on mount
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get('/api/search/history');
      if (response.data.success) {
        setSearchHistory(response.data.history || []);
      }
    } catch (error: any) {
      console.error('Error fetching search history:', error);
      alert(`Error loading search history: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      // Save search to history
      await axios.post('/api/search/history', {
        query: query.trim(),
        location: selectedLocation
      });

      // Navigate back to job results with search query
      navigate(state?.returnTo || '/jobs', {
        state: {
          searchQuery: query.trim(),
          location: selectedLocation
        }
      });
    } catch (error: any) {
      console.error('Error performing search:', error);
      alert(`Search error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryItemClick = (historyItem: SearchHistory) => {
    setSearchQuery(historyItem.query);
    handleSearch(historyItem.query);
  };

  const handleDeleteHistoryItem = async (historyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await axios.delete(`/api/search/history/${historyId}`);
      setSearchHistory(prev => prev.filter(item => item.id !== historyId));
    } catch (error: any) {
      console.error('Error deleting search history:', error);
      alert(`Error deleting history: ${error.response?.data?.message || error.message}`);
    }
  };

  const clearAllHistory = async () => {
    try {
      await axios.delete('/api/search/history');
      setSearchHistory([]);
    } catch (error: any) {
      console.error('Error clearing search history:', error);
      alert(`Error clearing history: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary">
      {/* Header */}
      <div className="flex items-center px-4 pt-4 gap-3 bg-background shadow-sm">
        <button className="flex-shrink-0">
          <ArrowLeft 
            size={25} 
            className="text-muted-foreground" 
            onClick={() => navigate(state?.returnTo || '/jobs')} 
          />
        </button>
        <div className="flex flex-col gap-4 w-full justify-center items-center pb-4">
          <SearchBar
            placeholder="Search jobs..."
            icon="search"
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            showLocationIcon={true}
          />
        </div>
      </div>

      {/* Location Selector */}
      <div className="px-4 py-2 bg-background border-b">
        <button 
          onClick={() => setShowLocationSelector(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <MapPin size={16} />
          <span>{selectedLocation}</span>
        </button>
      </div>

      {/* Search Button */}
      <div className="px-4 py-4 bg-background border-b">
        <button
          onClick={() => handleSearch()}
          disabled={!searchQuery.trim() || loading}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            !searchQuery.trim() || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>

      {/* Search History */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent searches</h3>
          {searchHistory.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>

        {searchHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p>No recent searches</p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border hover:bg-gray-50 cursor-pointer"
                onClick={() => handleHistoryItemClick(item)}
              >
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{item.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector
          currentLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          onClose={() => setShowLocationSelector(false)}
        />
      )}
    </div>
  );
};

export default SearchPage;