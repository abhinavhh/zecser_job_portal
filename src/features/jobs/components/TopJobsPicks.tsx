import { ArrowRight } from "lucide-react";
import { JobCard } from "./JobCard";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Job } from "../types";

interface TopJobsPicksProps {
  onJobDismiss?: (jobId: number) => void;
}

// Dummy fallback jobs
const dummyJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Kochi, Kerala",
    activelyReviewing: true,
    viewed: false,
    earlyApplicant: true,
    easyApply: true,
    promoted: true,
    postedTime: "",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Innovatech",
    location: "Thiruvananthapuram, Kerala",
    activelyReviewing: false,
    viewed: true,
    earlyApplicant: false,
    easyApply: true,
    postedTime: "",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelCraft",
    location: "Kozhikode, Kerala",
    activelyReviewing: true,
    viewed: true,
    earlyApplicant: true,
    easyApply: false,
    postedTime: "",
  },
];

const TopJobsPicks: React.FC<TopJobsPicksProps> = ({ onJobDismiss }) => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTopJobs();
  }, []);

  const fetchTopJobs = async (loadAll: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/jobs/recommendations", {
        params: {
          limit: loadAll ? undefined : 10,
          type: "top_picks",
          location: "Kerala",
        },
      });

      if (response.data.success) {
        setJobsData(response.data.jobs || []);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch recommended jobs"
        );
      }
    } catch (err: any) {
      console.error("Error fetching top job picks:", err);
      setError("Failed to load recommended jobs");
      // Fallback to dummy jobs
      setJobsData(dummyJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    fetchTopJobs(true);
  };

  const handleJobDismiss = (jobId: number) => {
    setJobsData((prev) => prev.filter((job) => job.id !== jobId));
    if (onJobDismiss) {
      onJobDismiss(jobId);
    }
  };

  if (error && jobsData.length === 0) {
    return null;
  }

  return (
    <>
      <div className="px-4 pt-6">
        <h1 className="text-foreground text-2xl font-semibold border-t-6 border-border pt-2">
          Top job picks for you
        </h1>
        <p className="text-sm text-foreground mt-1">
          Based on your profile, preferences, and activity like Applies,
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">
            Loading recommendations...
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {jobsData.map((job) => (
            <JobCard key={job.id} job={job} onDismiss={handleJobDismiss}/>
          ))}
        </div>
      )}

      {!loading && jobsData.length > 0 && !showAll && (
        <div className="flex w-full justify-center items-center gap-1 border-t-2 border-b-6 border-border mt-5 text-foreground font-semibold p-2">
          <button onClick={handleShowAll} className="flex items-center gap-1">
            <span>show all</span>
            <ArrowRight size={18} className="text-muted-foreground" />
          </button>
        </div>
      )}
    </>
  );
};

export default TopJobsPicks;
