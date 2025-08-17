import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import axios from "axios";

interface LocationSelectorProps {
  currentLocation: string;
  onLocationSelect: (location: string) => void;
  onClose: () => void;
}

interface Location {
  id: number;
  name: string;
  state: string;
  country: string;
  fullName: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  // Popular locations
  const popularLocations = [
    "Kerala, India",
    "Bangalore, Karnataka, India",
    "Mumbai, Maharashtra, India",
    "Delhi, India",
    "Pune, Maharashtra, India",
    "Chennai, Tamil Nadu, India",
    "Hyderabad, Telangana, India",
    "Kochi, Kerala, India",
    "Thiruvananthapuram, Kerala, India",
    "Kozhikode, Kerala, India"
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      searchLocations(searchQuery);
    } else {
      setLocations([]);
    }
  }, [searchQuery]);

  const searchLocations = async (query: string) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/locations/search', {
        params: { q: query }
      });
      
      if (response.data.success) {
        setLocations(response.data.locations || []);
      }
    } catch (error: any) {
      console.error('Error searching locations:', error);
      alert(`Error searching locations: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center px-4 pt-4 gap-3 border-b">
          <button onClick={onClose}>
            <ArrowLeft size={25} className="text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Select Location</h1>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={20} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            // Search Results
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Search Results</h3>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Searching...
                </div>
              ) : locations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No locations found
                </div>
              ) : (
                <div className="space-y-2">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location.fullName)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3"
                    >
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{location.fullName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Popular Locations
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Popular Locations</h3>
              <div className="space-y-2">
                {popularLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3 ${
                      location === currentLocation ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{location}</span>
                    {location === currentLocation && (
                      <span className="ml-auto text-blue-600 text-sm">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default LocationSelector;