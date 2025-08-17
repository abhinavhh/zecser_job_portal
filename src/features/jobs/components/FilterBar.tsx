import { Funnel } from "lucide-react";
import React, { useMemo } from "react";

type FilterKey = "jobs" | "easy" | "date" | "exp";

interface FilterBarProps {
  activeFilters: Record<FilterKey, boolean>;
  onFiltersChange: (filters: Record<FilterKey, boolean>) => void;
  onOpenFilterSheet: () => void; // NEW
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onFiltersChange,
  onOpenFilterSheet
}) => {
  const filters = useMemo(
    () => [
      { key: "jobs" as const, label: "Jobs" },
      { key: "easy" as const, label: "Easy Apply" },
      { key: "date" as const, label: "Date Posted" },
      { key: "exp" as const, label: "Experience" }
    ],
    []
  );

  const handleFilterToggle = (filterKey: FilterKey) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: !activeFilters[filterKey]
    };
    onFiltersChange(newFilters);
  };

  return (
    <div
      className="mt-4 border-y-2 border-border overflow-x-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
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
              {f.label === "Jobs" && (
                <Funnel
                  size={25}
                  className="text-foreground cursor-pointer"
                  onClick={onOpenFilterSheet} // OPEN SHEET
                />
              )}

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

            {idx === 0 && (
              <span className="h-7 w-px border-r-2 border-border flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
