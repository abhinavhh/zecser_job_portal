import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import SearchBar from "../features/jobs/components/SearchBar";
import { FilterBar } from "../features/jobs/components/FilterBar";
import { JobCard } from "../features/jobs/components/JobCard";
import { useNavigate } from "react-router-dom";
import TopJobsPicks from "../features/jobs/components/TopJobsPicks";
import FilterSheet from "../features/jobs/components/FilterSheet";
import axios from "axios";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  activelyReviewing: boolean;
  viewed: boolean;
  earlyApplicant: boolean;
  easyApply: boolean;
  promoted?: boolean;
  postedTime: string;
}

interface FilterState {
  jobs: boolean;
  easy: boolean;
  date: boolean;
  exp: boolean;
  [key: string]: boolean;
}

const DUMMY_JOBS: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Kochi, Kerala",
    activelyReviewing: true,
    viewed: false,
    earlyApplicant: true,
    easyApply: true,
    promoted: true,
    postedTime: "2 days ago",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Innovate Solutions",
    location: "Thiruvananthapuram, Kerala",
    activelyReviewing: true,
    viewed: false,
    earlyApplicant: false,
    easyApply: false,
    postedTime: "5 days ago",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Minds",
    location: "Kozhikode, Kerala",
    activelyReviewing: true,
    viewed: true,
    earlyApplicant: true,
    easyApply: true,
    postedTime: "",
  },
];

const JobResults = () => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    jobs: true,
    easy: true,
    date: false,
    exp: false,
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const navigate = useNavigate();

  const fetchJobs = async (query?: string, filters?: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        location: "Kerala",
        ...filters,
      };
      if (query) params.search = query;

      const response = await axios.get("/api/jobs", { params });
      if (response.data.success) {
        setJobsData(response.data.jobs || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch jobs");
      }
    } catch (err: any) {
      console.warn("API unavailable — using dummy jobs.");
      setJobsData(DUMMY_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchBarClick = () => {
    navigate("/search", {
      state: {
        currentQuery: searchQuery,
        returnTo: "/jobs",
      },
    });
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
    fetchJobs(searchQuery, newFilters);
  };

  const handleJobDismiss = async (jobId: number) => {
    try {
      await axios.post(`/api/jobs/${jobId}/dismiss`);
      setJobsData((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error: any) {
      console.error("Error dismissing job:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary pb-6 ">
      <div className="flex items-center px-4 pt-4 gap-3 justify-center w-full">
        <button className="flex-shrink-0">
          <ArrowLeft
            size={25}
            className="text-muted-foreground"
            onClick={() => navigate("/home")}
          />
        </button>
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <div onClick={handleSearchBarClick} className="w-full">
            <SearchBar
              placeholder=""
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
        onFiltersChange={handleFiltersChange}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
      />

      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        activeFilters={activeFilters}
        onFiltersChange={(filters) => (
          handleFiltersChange(filters as FilterState)
        )}
      />

      <div className="bg-mute">
        <p className="text-sm text-muted-foreground bg-border px-4 py-1">
          {loading ? "Loading..." : `${jobsData.length} results`}
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">Loading jobs...</div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">{error}</div>
        ) : jobsData.length === 0 ? (
          <div className="flex justify-center items-center py-8">No jobs found</div>
        ) : (
          jobsData.map((job) => (
            <JobCard key={job.id} job={job} onDismiss={handleJobDismiss} />
          ))
        )}
      </div>

      <TopJobsPicks />
    </div>
  );
};

export default JobResults;
