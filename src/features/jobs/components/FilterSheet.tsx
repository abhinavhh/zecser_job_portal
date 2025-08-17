import { motion, AnimatePresence, applyGeneratorOptions } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Switch } from "../../../components/ui/switch";
import { ChevronRight } from "lucide-react";
import axios from "axios";

import DateFilterSheet from "./DateFilterSheet";

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

type Panel = "main" | "datePosted" | "experienceLevel";

const variants = {
  enter: { y: "100%" },
  center: { y: 0 },
  exit: { y: "100%" },
};

const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  activeFilters,
  onFiltersChange,
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
  const [activePanel, setActivePanel] = useState<Panel>("main");
  const [loading, setLoading] = useState(false);

  // Escape key closes the sheet
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Load saved filters on opening
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const resp = await axios.get('/api/user/filter-preferences');
          if (resp.data.success && resp.data.filters) {
            setFilterState(prev => ({ ...prev, ...resp.data.filters }));
          }
        } catch (err) {
          console.error('Error loading filters', err);
        }
      })();
    }
  }, [isOpen]);

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

  const handleSwitchChange = (key: keyof FilterState, value: boolean) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  };

  const saveFilters = async () => {
    setLoading(true);
    try {
      await axios.post('/api/user/filter-preferences', { filters: filterState });
      onFiltersChange({
        jobs: true,
        easy: filterState.easyApply,
        date: filterState.datePosted !== "Any time",
        exp: filterState.experienceLevel !== "Any",
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Error saving filters: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterState({
      datePosted: "Any time",
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
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-secondary/58"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Container */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-4xl shadow-lg shadow-black max-h-[90vh] flex flex-col overflow-y-auto bg-secondary"
            initial="enter" animate="center" exit="exit"
            variants={variants} transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Handle & Header */}
            <div className="flex justify-center p-2">
              <div className="w-18 h-1 bg-foreground rounded-full" />
            </div>
            <div className="flex justify-between items-center px-6 pb-2 border-b-1 border-muted-foreground">
              <h2 className="text-lg font-semibold">{activePanel === "main" ? "Filters" : ""}</h2>
              {activePanel !== "main" && (
                <button onClick={() => setActivePanel("main")}>Back</button>
              )}
            </div>

            {/* Panels */}
            <AnimatePresence>
              {activePanel === "main" && (
                <motion.div
                  key="main"
                  initial="enter" animate="center" exit="exit"
                  variants={variants}
                >
                  {/* Premium & Sort sections*/}
                  <div className="my-4 mx-12 bg-border border-secondary rounded-xl px-6 py-4 flex flex-col space-y-2 items-center justify-center border-1 border- md:w-md md:self-center">
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

                  {/* Scrollable main list */}
                  <div className="flex-1 text-xs">
                    {filterItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between pr-4 py-4 border-b-2 ml-6"
                      >
                        <span>{item.label}</span>
                        {item.type === "link" ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="pb-4 cursor-pointer"
                              onClick={() => setActivePanel(item.key as Panel)}
                            >
                              {filterState[item.key as keyof FilterState]?.toString()}
                            </span>
                            {/* <ChevronRight className="w-4 h-4 text-muted-foreground" /> */}
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
                    {/* Buttons for Reset / Apply */}
                    {/* <div className="flex justify-end gap-2 p-4">
                      <button onClick={resetFilters} className="text-sm text-primary">Reset</button>
                      <button
                        onClick={saveFilters}
                        disabled={loading}
                        className={`text-sm text-secondary rounded ${loading ? 'bg-gray-600' : 'bg-primary hover:bg-blue-600/'} px-4 py-1`}
                      >
                        {loading ? 'Saving...' : 'Apply'}
                      </button>
                    </div> */}
                  </div>
                </motion.div>
              )}

              {activePanel === "datePosted" && (
                <DateFilterSheet isOpen={true} onClose={() => setActivePanel("main")} onApply={(selectedDate) => {
                  setFilterState((prev) => ({ ...prev, datePosted: selectedDate}));
                  setActivePanel("main");
                }}/>
              )}

              {activePanel === "experienceLevel" && (
                <motion.div
                  key="experienceLevel"
                  initial="enter" animate="center" exit="exit"
                  variants={variants}
                >
                  <div className="py-4 px-6">
                    <h3 className="text-sm font-semibold mb-2">Experience level</h3>
                    {["Any","Entry","Mid","Senior"].map(opt => (
                      <button
                        key={opt}
                        className={`block w-full text-left py-2 ${filterState.experienceLevel === opt ? 'font-semibold text-blue-600' : 'text-foreground'}`}
                        onClick={() => setFilterState(prev => ({ ...prev, experienceLevel: opt }))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
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
