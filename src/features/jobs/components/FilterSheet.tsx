import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Switch } from "../../../components/ui/switch";
import { ChevronRight } from "lucide-react";
import axios from "axios";

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: Record<string, boolean>;
  onFiltersChange: (filters: Record<string, boolean>) => void;
}

interface FilterState {
  datePosted: string;
  experienceLevel: string;
  company: string;
  jobType: string;
  remote: string;
  easyApply: boolean;
  hasVerifications: boolean;
  location: string;
  industry: string;
  jobFunction: string;
  title: string;
  under10Applicants: boolean;
  inYourNetwork: boolean;
  sortBy: string;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ 
  isOpen, 
  onClose, 
  activeFilters, 
  onFiltersChange 
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    datePosted: "Edit",
    experienceLevel: "Any",
    company: "Any",
    jobType: "Any",
    remote: "Any",
    easyApply: false,
    hasVerifications: false,
    location: "Any",
    industry: "Any",
    jobFunction: "Any",
    title: "Any",
    under10Applicants: false,
    inYourNetwork: false,
    sortBy: "Most relevant"
  });

  const [loading, setLoading] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Load saved filters on mount
  useEffect(() => {
    if (isOpen) {
      loadSavedFilters();
    }
  }, [isOpen]);

  const loadSavedFilters = async () => {
    try {
      const response = await axios.get('/api/user/filter-preferences');
      if (response.data.success && response.data.filters) {
        setFilterState(prev => ({ ...prev, ...response.data.filters }));
      }
    } catch (error: any) {
      console.error('Error loading saved filters:', error);
    }
  };

  const saveFilters = async () => {
    try {
      setLoading(true);
      await axios.post('/api/user/filter-preferences', {
        filters: filterState
      });

      // Convert filter state to the format expected by parent
      const convertedFilters = {
        jobs: true,
        easy: filterState.easyApply,
        date: filterState.datePosted !== "Any time",
        exp: filterState.experienceLevel !== "Any",
      };

      onFiltersChange(convertedFilters);
      onClose();
    } catch (error: any) {
      console.error('Error saving filters:', error);
      alert(`Error saving filters: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterState({
      datePosted: "Edit",
      experienceLevel: "Any",
      company: "Any",
      jobType: "Any",
      remote: "Any",
      easyApply: false,
      hasVerifications: false,
      location: "Any",
      industry: "Any",
      jobFunction: "Any",
      title: "Any",
      under10Applicants: false,
      inYourNetwork: false,
      sortBy: "Most relevant"
    });
  };

  const handleSwitchChange = (key: keyof FilterState, value: boolean) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  };

  const filterItems = [
    { 
      label: "Date posted", 
      value: filterState.datePosted, 
      type: "link",
      key: "datePosted"
    },
    { 
      label: "Experience level", 
      value: filterState.experienceLevel, 
      type: "link",
      key: "experienceLevel"
    },
    { 
      label: "Company", 
      value: filterState.company, 
      type: "link",
      key: "company"
    },
    { 
      label: "Job type", 
      value: filterState.jobType, 
      type: "link",
      key: "jobType"
    },
    { 
      label: "Remote", 
      value: filterState.remote, 
      type: "link",
      key: "remote"
    },
    { 
      label: "Easy Apply", 
      value: filterState.easyApply, 
      type: "switch",
      key: "easyApply"
    },
    { 
      label: "Has verifications", 
      value: filterState.hasVerifications, 
      type: "switch",
      key: "hasVerifications"
    },
    { 
      label: "Location", 
      value: filterState.location, 
      type: "link",
      key: "location"
    },
    { 
      label: "Industry", 
      value: filterState.industry, 
      type: "link",
      key: "industry"
    },
    { 
      label: "Job function", 
      value: filterState.jobFunction, 
      type: "link",
      key: "jobFunction"
    },
    { 
      label: "Title", 
      value: filterState.title, 
      type: "link",
      key: "title"
    },
    { 
      label: "Under 10 applicants", 
      value: filterState.under10Applicants, 
      type: "switch",
      key: "under10Applicants"
    },
    { 
      label: "In your network", 
      value: filterState.inYourNetwork, 
      type: "switch",
      key: "inYourNetwork"
    },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            style={{scrollbarWidth: "none"}}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-4xl shadow-lg max-h-[90vh] flex flex-col overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center p-2">
              <div className="w-18 h-1 bg-foreground rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-2 border-b-1 border-muted-foreground">
              <h2 className="text-lg font-semibold">Filters</h2>
              {/* <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  Reset
                </button>
                <button
                  onClick={saveFilters}
                  disabled={loading}
                  className={`px-4 py-1 text-sm text-white rounded ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Saving...' : 'Apply'}
                </button>
              </div> */}
            </div>

            {/* Premium Message */}
            <div className="my-4 mx-12 bg-muted rounded-xl px-6 py-4 flex flex-col space-y-2 items-center justify-center border-1 md:w-md md:self-center">
              <h2 className="text-center">Filter jobs where you'd be a top applicant</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-[12px] h-[12px] bg-red-500 rounded-xs"></div>
                <p className="text-blue-400 text-sm">Try premium for $10</p>
              </div>
              <div className="flex text-xs items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs">👥</span>
                </div>
                <p>Millions of members use premium</p>
              </div>
            </div>

            {/* Sort By Section */}
            <div className="border-t-2 border-muted-foreground pt-4 pb-1 pr-6 text-foreground font-normal text-[16px]">
              <div className=" flex justify-between border-b-1 ml-6 pr-4 w-full">
                <label className="">Sort by</label>
                <p className="text-xs">{filterState.sortBy}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 text-xs">
              {filterItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pr-4 py-4 border-b-2 ml-6"
                >
                  <span className="text">{item.label}</span>

                  {item.type === "link" ? (
                    <div className="flex items-center gap-2">
                      <span className="pb-4">{item.value}</span>
                    </div>
                  ) : (
                    <Switch 
                      checked={item.value as boolean}
                      onCheckedChange={(checked) => 
                        handleSwitchChange(item.key as keyof FilterState, checked)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FilterSheet;