import { Funnel } from "lucide-react";
import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type FilterKey = "jobs" | "easyApply" | "datePosted" | "experienceLevel";

interface FilterBarProps {
  activeFilters: Record<FilterKey, boolean>;
  onFiltersChange: (filters: Record<FilterKey, boolean>) => void;
  onOpenFilterSheet: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onFiltersChange,
  onOpenFilterSheet
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Filter configuration - defines all available quick filters
   * These correspond to the main filter categories
   */
  const filters = useMemo(
    () => [
      { key: "jobs" as const, label: "Jobs" },
      { key: "easyApply" as const, label: "Easy Apply" },
      { key: "datePosted" as const, label: "Date Posted" },
      { key: "experienceLevel" as const, label: "Experience" }
    ],
    []
  );

  /**
   * Toggle filter state and update URL parameters
   * This triggers the useJobs hook to re-filter results
   */
  const handleFilterToggle = (filterKey: FilterKey) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: !activeFilters[filterKey]
    };
    onFiltersChange(newFilters);

    // Update URL parameters to trigger job refetch
    const newParams = new URLSearchParams(searchParams);
    
    if (newFilters[filterKey]) {
      // Add filter parameter when activated
      switch (filterKey) {
        case "jobs":
          // Jobs filter doesn't add specific param, just indicates filtering is active
          break;
        case "easyApply":
          newParams.set("easyApply", "true");
          break;
        case "datePosted":
          // Set default date filter if none exists
          if (!newParams.get("datePosted")) {
            newParams.set("datePosted", "Past week");
          }
          break;
        case "experienceLevel":
          // Set default experience filter if none exists
          if (!newParams.get("experienceLevel")) {
            newParams.set("experienceLevel", "Mid");
          }
          break;
      }
    } else {
      // Remove filter parameter when deactivated
      switch (filterKey) {
        case "jobs":
          // Remove all job-related filters when jobs filter is turned off
          newParams.delete("easyApply");
          newParams.delete("datePosted");
          newParams.delete("experienceLevel");
          newParams.delete("hasVerifications");
          newParams.delete("under10Applicants");
          newParams.delete("inYourNetwork");
          newParams.delete("remote");
          newParams.delete("jobType");
          newParams.delete("company");
          break;
        case "easyApply":
          newParams.delete("easyApply");
          break;
        case "datePosted":
          newParams.delete("datePosted");
          break;
        case "experienceLevel":
          newParams.delete("experienceLevel");
          break;
      }
    }
    
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div
      className="mt-4 border-y-2 border-border overflow-x-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Hide scrollbar for webkit browsers */}
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <div className="flex items-center gap-5 pl-4 py-2 min-w-full whitespace-nowrap">
        {filters.map((f, idx) => (
          <React.Fragment key={f.key}>
            <div className="flex space-x-4 items-center">
              {/* Filter icon - only show for Jobs filter */}
              {f.label === "Jobs" && (
                <Funnel
                  size={25}
                  className="text-foreground cursor-pointer"
                  onClick={onOpenFilterSheet}
                />
              )}

              {/* Filter toggle button */}
              <button
                className={`px-4 py-1 rounded-full text-sm flex-shrink-0 transition-colors ${
                  activeFilters[f.key]
                    ? "bg-chart-2 text-primary-foreground"
                    : "bg-white border border-gray-300 text-foreground hover:bg-gray-100"
                }`}
                onClick={() => handleFilterToggle(f.key)}
              >
                {f.label}
              </button>
            </div>

            {/* Separator line after Jobs filter */}
            {idx === 0 && (
              <span className="h-7 w-px border-r-2 border-border flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;