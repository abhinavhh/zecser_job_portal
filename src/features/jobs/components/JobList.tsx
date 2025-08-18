// src/features/jobs/components/JobList.tsx
import { JobCard } from "./JobCard";
import { useJobs } from "../hooks/useJobs";
import type { FilterState } from "../types";

interface JobListProps {
  searchQuery: string;
  activeFilters: FilterState;
}

export const JobList = ({ searchQuery, activeFilters }: JobListProps) => {
  const { jobsData, loading, error, dismissJob } = useJobs(searchQuery, activeFilters);

  return (
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
          <JobCard key={job.id} job={job} onDismiss={dismissJob} />
        ))
      )}
    </div>
  );
};
