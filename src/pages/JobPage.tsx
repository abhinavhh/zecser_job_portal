// src/pages/JobResults.tsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

// Import everything from jobs barrel file
import {
  SearchBar,
  FilterBar,
  JobList,
  TopJobsPicks,
  FilterSheet,
  type FilterToggles,
  type FilterState,
  useJobs,
} from "../features/jobs";


import { useNavigate } from "react-router-dom";

const JobPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterToggles>({
    jobs: true,
    easyApply: false,
    datePosted: false,
    experienceLevel: false,
  });

  const [filterSheetStates, setFilterSheetStates] = useState<FilterState>({
    datePosted: "Anytime",
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
    sortBy: "Most relevant",// Ensure industry is always a string
  });

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const navigate = useNavigate();

  // Use the jobs hook - this handles all filtering logic
  useJobs(searchQuery);

  /**
   * Handle filter bar changes
   * Updates the quick filter toggles and may set default filter values
   */
  const handleFilterBarChange = (filters: FilterToggles) => {
    setActiveFilters(filters);
    
    // Sync with filter sheet state if needed
    if (filters.easyApply !== filterSheetStates.easyApply) {
      setFilterSheetStates(prev => ({
        ...prev,
        easyApply: filters.easyApply
      }));
    }
  };

   /**
   * Handle filter sheet changes
   * Updates the detailed filter state and syncs with filter bar
   */
  const handleFilterSheetChange = (filters: any) => {
    // Update filter bar toggles based on filter sheet state
    setActiveFilters(prev => ({
      ...prev,
      jobs: filters.job || false,
      easyApply: filters.easy || false,
      datePosted: filters.date || false,
      experienceLevel: filters.exp || false,
    }));
  };

  /**
   * Open the detailed filter sheet
   */
  const openFilterSheet = () => {
    setIsFilterSheetOpen(true);
  };


  /**
   * Close the detailed filter sheet
   */
  const closeFilterSheet = () => {
    setIsFilterSheetOpen(false);
  };

  /**
   * Handle search input changes
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full min-h-screen bg-secondary pb-6">
      <div className="flex items-center px-4 pt-4 gap-3 justify-center w-full">
        <button className="flex-shrink-0">
          <ArrowLeft
            size={25}
            className="text-muted-foreground"
            onClick={() => navigate("/home")}
          />
        </button>
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <div onClick={() => navigate("/search", { state: { currentQuery: searchQuery, returnTo: "/jobs" } })} className="w-full">
            <SearchBar
              placeholder="Search ..."
              icon="search"
              value={searchQuery}
              onChange={() => handleSearchChange}
              readonly={true}
            />
          </div>
        </div>
      </div>

      <FilterBar
        activeFilters={activeFilters}
        onFiltersChange={handleFilterBarChange}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
      />


      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={closeFilterSheet}
        activeFilters={filterSheetStates}
        onFiltersChange={handleFilterSheetChange}
      />

      <JobList searchQuery={searchQuery} activeFilters={filterSheetStates} />

      <TopJobsPicks />
    </div>
  );
};

export default JobPage;
