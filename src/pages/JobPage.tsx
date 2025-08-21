// src/pages/JobResults.tsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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
import SearchPage from "./SearchPage"; // ✅ import as a component

const JobPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 🔹 new state

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
    sortBy: "Most relevant",
  });

  const navigate = useNavigate();
  useJobs(searchQuery);

  const handleFilterBarChange = (filters: FilterToggles) => {
    setActiveFilters(filters);
    if (filters.easyApply !== filterSheetStates.easyApply) {
      setFilterSheetStates(prev => ({ ...prev, easyApply: filters.easyApply }));
    }
  };

  const handleFilterSheetChange = (filters: any) => {
    setActiveFilters(prev => ({
      ...prev,
      jobs: filters.job || false,
      easyApply: filters.easy || false,
      datePosted: filters.date || false,
      experienceLevel: filters.exp || false,
    }));
  };

  const closeFilterSheet = () => setIsFilterSheetOpen(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full min-h-screen bg-secondary pb-6 relative">
      {/* 🔹 Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 bg-background">
          <SearchPage
            onClose={() => setIsSearchOpen(false)} // 🔹 pass close handler
            onSearch={(q: string) => {
              setSearchQuery(q);
              setIsSearchOpen(false);
            }}
          />
        </div>
      )}

      {/* 🔹 Normal JobPage Content */}
      {!isSearchOpen && (
        <>
          <div className="flex items-center px-4 pt-4 gap-3 justify-center w-full">
            <button className="flex-shrink-0">
              <ArrowLeft
                size={25}
                className="text-muted-foreground"
                onClick={() => navigate("/home")}
              />
            </button>
            <div className="flex flex-col gap-4 justify-center items-center w-full">
              {/* Instead of navigating, open search overlay */}
              <div onClick={() => setIsSearchOpen(true)} className="w-full">
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
        </>
      )}
    </div>
  );
};

export default JobPage;
