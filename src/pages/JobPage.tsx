// src/pages/JobResults.tsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SearchBar } from "../features/jobs";
import { FilterBar } from "../features/jobs/components/FilterBar";
import { JobList } from "../features/jobs/components/JobList";
import TopJobsPicks from "../features/jobs/components/TopJobsPicks";
import FilterSheet from "../features/jobs/components/FilterSheet";
import { useNavigate } from "react-router-dom";
import type { FilterState } from "../features/jobs/types";

const JobPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    jobs: true,
    easy: true,
    date: false,
    exp: false,
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const navigate = useNavigate();

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
              onChange={() => {}}
              readonly={true}
            />
          </div>
        </div>
      </div>

      <FilterBar
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
      />

      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        activeFilters={activeFilters}
        onFiltersChange={(filters) => setActiveFilters(filters as FilterState)}
      />

      <JobList searchQuery={searchQuery} activeFilters={activeFilters} />

      <TopJobsPicks />
    </div>
  );
};

export default JobPage;
