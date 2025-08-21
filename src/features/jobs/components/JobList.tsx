// src/features/jobs/components/JobList.tsx
import { JobCard } from "./JobCard";
import { useJobs } from "../hooks/useJobs";
import type { FilterState } from "../types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JobListProps {
  searchQuery: string;
  activeFilters: FilterState;
}

export const JobList = ({ searchQuery }: JobListProps) => {
  const { jobsData, loading, error, dismissJob } = useJobs(searchQuery);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // jobs per page

  const totalPages = Math.ceil(jobsData.length / pageSize);

  const paginatedJobs = jobsData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // 🔹 Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // delay between each job card
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // start slightly below
    show: { opacity: 1, y: 0 }, // animate upwards into place
  };

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
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {paginatedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, y: -20 }} // animate upwards when leaving
                  transition={{ duration: 0.3 }}
                >
                  <JobCard job={job} onDismiss={dismissJob} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-4 py-4">
            <button
              disabled={currentPage === 1}
              onClick={handlePrev}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={handleNext}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;
