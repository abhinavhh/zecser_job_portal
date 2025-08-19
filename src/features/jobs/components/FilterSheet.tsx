import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Switch } from "../../../components/ui/switch";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import DateFilterSheet from "./DateFilterSheet";
import ExperienceFilterSheet from "./ExperienceFilterSheet";
import CompanyFilterSheet from "./CompanyFilterSheet";
import JobTypeFilterSheet from "./JobTypeFilterSheet";
import RemoteFilterSheet from "./RemoteFilterSheet";

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: FilterState;
  onFiltersChange: (filters: { jobs: boolean; easyApply: boolean; datePosted: boolean; experienceLevel: boolean }) => void;
}

interface FilterState {
  datePosted: string;
  experienceLevel: string;
  company: string | string[];
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

type Panel =
  | "main"
  | "datePosted"
  | "experienceLevel"
  | "company"
  | "jobType"
  | "remote";

const variants = {
  enter: { y: "100%" },
  center: { y: 0 },
  exit: { y: "100%" },
};

const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  // activeFilters,
  onFiltersChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Internal filter state - manages all filter values
   * Initialized from URL parameters on component mount
   */
  const [filterState, setFilterState] = useState<FilterState>({
    datePosted: searchParams.get("datePosted") || "Anytime",
    experienceLevel: searchParams.get("experienceLevel") || "Any",
    company: searchParams.get("company") || "Any",
    jobType: searchParams.get("jobType") || "Any",
    remote: searchParams.get("remote") || "Any",
    easyApply: searchParams.get("easyApply") === "true",
    hasVerifications: searchParams.get("hasVerifications") === "true",
    location: searchParams.get("location") || "Any",
    industry: searchParams.get("industry") || "Any",
    jobFunction: searchParams.get("jobFunction") || "Any",
    title: searchParams.get("title") || "Any",
    under10Applicants: searchParams.get("under10Applicants") === "true",
    inYourNetwork: searchParams.get("inYourNetwork") === "true",
    sortBy: searchParams.get("sortBy") || "Most relevant",
  });

  const [activePanel, setActivePanel] = useState<Panel>("main");
  const [loading, setLoading] = useState(false);

  /**
   * Sync URL parameters with internal filter state
   * Only sets parameters that have non-default values
   */
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filterState).forEach(([key, val]) => {
      if (typeof val === "boolean") {
        // Only add boolean params if they're true
        if (val) params.set(key, "true");
      } else if (val !== "Any" && val !== "Anytime" && val !== "Most relevant") {
        // Only add non-default string values
        params.set(key, val);
      }
    });
    setSearchParams(params, { replace: true });
  }, [filterState, setSearchParams]);

  /**
   * Handle escape key to close filter sheet
   */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /**
   * Load saved filter preferences when sheet opens
   * This allows users to have persistent filter settings
   */
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const resp = await axios.get("/api/user/filter-preferences");
          if (resp.data.success && resp.data.filters) {
            setFilterState((prev) => ({ ...prev, ...resp.data.filters }));
          }
        } catch (err) {
          console.warn("Could not load saved filters:", err);
          // Continue with current state if loading fails
        }
      })();
    }
  }, [isOpen]);

  /**
   * Filter configuration for rendering the main filter list
   * Defines which filters are switches vs navigation links
   */
  const filterItems = [
    { label: "Date posted", value: filterState.datePosted, type: "link", key: "datePosted" },
    { label: "Experience level", value: filterState.experienceLevel, type: "link", key: "experienceLevel" },
    { label: "Company", value: filterState.company === "Any" ? "Any" : filterState.company, type: "link", key: "company" },
    { label: "Job type", value: filterState.jobType, type: "link", key: "jobType" },
    { label: "Remote", value: filterState.remote, type: "link", key: "remote" },
    { label: "Easy Apply", value: filterState.easyApply, type: "switch", key: "easyApply" },
    { label: "Has verifications", value: filterState.hasVerifications, type: "switch", key: "hasVerifications" },
    { label: "Location", value: filterState.location, type: "link", key: "location" },
    { label: "Industry", value: filterState.industry, type: "link", key: "industry" },
    { label: "Job function", value: filterState.jobFunction, type: "link", key: "jobFunction" },
    { label: "Title", value: filterState.title, type: "link", key: "title" },
    { label: "Under 10 applicants", value: filterState.under10Applicants, type: "switch", key: "under10Applicants" },
    { label: "In your network", value: filterState.inYourNetwork, type: "switch", key: "inYourNetwork" },
  ];

  /**
   * Handle toggle switches (boolean filters)
   */
  const handleSwitchChange = (key: keyof FilterState, value: boolean) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Save current filter state and close sheet
   * Updates parent component and persists to API
   */
  const saveFilters = async () => {
    setLoading(true);
    try {
      // Save to API for persistence
      await axios.post("/api/user/filter-preferences", { filters: filterState });
      
      // Update parent component with summary of active filters for FilterBar
      onFiltersChange({
        jobs: true, // Jobs filter is always active when using filter sheet
        easyApply: filterState.easyApply,
        datePosted: filterState.datePosted !== "Anytime",
        experienceLevel: filterState.experienceLevel !== "Any",
      });
      
      onClose();
    } catch (err: any) {
      console.error("Error saving filters:", err);
      alert(`Error saving filters: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset all filters to default values
   */
  const resetFilters = () => {
    setFilterState({
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
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-secondary/58"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Filter sheet container */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-4xl shadow-lg shadow-black max-h-[90vh] flex flex-col overflow-y-auto bg-secondary"
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center p-2">
              <div className="w-18 h-1 bg-foreground rounded-full" />
            </div>

            {/* Header with back button for sub-panels */}
            <div className="flex justify-between items-center px-6 pb-2 border-b-1 border-muted-foreground">
              <h2 className="text-lg font-semibold">
                {activePanel === "main" ? "Filters" : ""}
              </h2>
              {activePanel !== "main" && (
                <button onClick={() => setActivePanel("main")}>Back</button>
              )}
            </div>

            {/* Panel content with animations */}
            <AnimatePresence>
              {activePanel === "main" && (
                <motion.div
                  key="main"
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={variants}
                >
                  {/* Premium promotion section */}
                  <div className="my-4 mx-12 bg-border border-secondary rounded-xl px-6 py-4 flex flex-col space-y-2 items-center justify-center border-1 md:w-md md:self-center">
                    <h2 className="text-center">
                      Filter jobs where you'd be a top applicant
                    </h2>
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

                  {/* Sort by section */}
                  <div className="border-t-2 border-muted-foreground pt-4 pb-1 pr-6 text-foreground font-normal text-[16px]">
                    <div className="flex justify-between border-b-1 ml-6 pr-4 w-full">
                      <label>Sort by</label>
                      <p className="text-xs">{filterState.sortBy}</p>
                    </div>
                  </div>

                  {/* Main filter list */}
                  <div className="flex-1 text-xs">
                    {filterItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between pr-4 py-4 border-b-2 ml-6"
                      >
                        <span>{item.label}</span>
                        {item.type === "link" ? (
                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setActivePanel(item.key as Panel)}
                          >
                            <span>{filterState[item.key as keyof FilterState]?.toString()}</span>
                          </div>
                        ) : (
                          <Switch
                            checked={filterState[item.key as keyof FilterState] as boolean}
                            onCheckedChange={(checked) =>
                              handleSwitchChange(item.key as keyof FilterState, checked)
                            }
                          />
                        )}
                      </div>
                    ))}

                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 p-4">
                      <button
                        onClick={resetFilters}
                        className="text-sm text-primary"
                      >
                        Reset
                      </button>
                      <button
                        onClick={saveFilters}
                        disabled={loading}
                        className={`text-sm text-secondary rounded ${
                          loading ? "bg-gray-600" : "bg-primary hover:bg-blue-600/"
                        } px-4 py-1`}
                      >
                        {loading ? "Saving..." : "Apply"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sub-panel components */}
              {activePanel === "datePosted" && (
                <DateFilterSheet
                  isOpen={true}
                  onClose={() => setActivePanel("main")}
                  onApply={(selectedDate) => {
                    setFilterState((prev) => ({
                      ...prev,
                      datePosted: selectedDate,
                    }));
                    setActivePanel("main");
                  }}
                />
              )}

              {activePanel === "experienceLevel" && (
                <ExperienceFilterSheet
                  isOpen={true}
                  onClose={() => setActivePanel("main")}
                  onApply={(selectedExperience) => {
                    setFilterState((prev) => ({
                      ...prev,
                      experienceLevel: selectedExperience,
                    }));
                    setActivePanel("main");
                  }}
                />
              )}

              {activePanel === "company" && (
                <CompanyFilterSheet
                  isOpen={true}
                  onClose={() => setActivePanel("main")}
                  onApply={(selectedCompany) => {
                    setFilterState((prev) => ({
                      ...prev,
                      company: selectedCompany,
                    }));
                    setActivePanel("main");
                  }}
                />
              )}

              {activePanel === "jobType" && (
                <JobTypeFilterSheet
                  isOpen={true}
                  onClose={() => setActivePanel("main")}
                  onApply={(selectedJobType) => {
                    setFilterState((prev) => ({
                      ...prev,
                      jobType: selectedJobType,
                    }));
                    setActivePanel("main");
                  }}
                />
              )}

              {activePanel === "remote" && (
                <RemoteFilterSheet
                  isOpen={true}
                  onClose={() => setActivePanel("main")}
                  onApply={(selectedRemote) => {
                    setFilterState((prev) => ({
                      ...prev,
                      remote: selectedRemote,
                    }));
                    setActivePanel("main");
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FilterSheet;