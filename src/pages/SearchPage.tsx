import { useState, useEffect } from "react";
import { ArrowLeft, Clock, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../features/jobs/components/SearchBar";

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

  const [searchQuery, setSearchQuery] = useState({
    companyName: "",
    location: "",
  });
  const [selectedLocation, setSelectedLocation] = useState("Kerala, India");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  // const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch search history on mount
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get("/api/search/history");
      if (response.data.success) {
        setSearchHistory(response.data.history || []);
      }
    } catch (error: any) {
      console.error("Error fetching search history:", error);
      alert(
        `Error loading search history: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleSearch = async (query?: string) => {
    const finalQuery = query || searchQuery.companyName;
    if (!finalQuery.trim()) return;

    try {
      setLoading(true);
      // Save search to history
      await axios.post("/api/search/history", {
        query: finalQuery.trim(),
        location: selectedLocation,
      });
      // Refresh history after saving
      await fetchSearchHistory();

      // Navigate back to job results with search query
      navigate(state?.returnTo || "/jobs", {
        state: {
          searchQuery: finalQuery.trim(),
          location: selectedLocation,
        },
      });
    } catch (error: any) {
      console.error("Error performing search:", error);
      alert(
        `Search error: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Ensure clicking an item re-triggers search
  const handleHistoryItemClick = (historyItem: SearchHistory) => {
    setSearchQuery((prev) => ({
      ...prev,
      companyName: historyItem.query,
    }));
    handleSearch(historyItem.query);
  };

  const handleDeleteHistoryItem = async (
    historyId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    try {
      await axios.delete(`/api/search/history/${historyId}`);
      setSearchHistory((prev) => prev.filter((item) => item.id !== historyId));
    } catch (error: any) {
      console.error("Error deleting search history:", error);
      alert(
        `Error deleting history: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const clearAllHistory = async () => {
    try {
      await axios.delete("/api/search/history");
      setSearchHistory([]);
    } catch (error: any) {
      console.error("Error clearing search history:", error);
      alert(
        `Error clearing history: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary">
      {/* Header */}
      <div className="px-4 pt-4 bg-secondary shadow-sm border-b-1 border-foreground">
        {/* Arrow + First SearchBar */}
        <div className="flex items-center gap-3 w-full pb-4">
          <button
            className="flex-shrink-0"
            onClick={() => navigate(state?.returnTo || "/jobs")}
          >
            <ArrowLeft size={25} className="text-muted-foreground" />
          </button>

          {/* First SearchBar */}
          <div className="flex-1">
            <SearchBar
              placeholder="Search by title, skill, or company"
              icon="search"
              value={searchQuery.companyName}
              onChange={(val) =>
                setSearchQuery((prev) => ({ ...prev, companyName: val }))
              }
              onClear={() =>
                setSearchQuery((prev) => ({ ...prev, companyName: "" }))
              }
              showLocationIcon={false}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        </div>

        {/* Second SearchBar (Location) */}
        <div className="ml-9 pb-4">
          <SearchBar
            placeholder="City, State, or Zip code"
            icon="location"
            value={searchQuery.location}
            onChange={(val) =>
              setSearchQuery((prev) => ({ ...prev, location: val }))
            }
            onClear={() =>
              setSearchQuery((prev) => ({ ...prev, location: "" }))
            }
            showLocationIcon={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
      </div>

      {/* Search History */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-light text-foreground">
            Try searching for
          </h3>
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
      {/* {showLocationSelector && (
        <LocationSelector
          currentLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          onClose={() => setShowLocationSelector(false)}
        />
      )} */}
    </div>
  );
};

export default SearchPage;
