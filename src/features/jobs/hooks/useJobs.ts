// src/features/jobs/hooks/useJobs.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { DUMMY_JOBS } from "../data/mockJobs";
import type { Job } from "../types";

interface FilterState {
  jobs: boolean;
  easy: boolean;
  date: boolean;
  exp: boolean;
  [key: string]: boolean;
}

export const useJobs = (searchQuery: string, filters: FilterState) => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { location: "Kerala", ...filters };
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get("/api/jobs", { params });

      if (response.data.success) {
        setJobsData(response.data.jobs || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch jobs");
      }
    } catch {
      console.warn("API unavailable — using dummy jobs.");
      setJobsData(DUMMY_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, filters]);

  const dismissJob = async (jobId: number) => {
    try {
      await axios.post(`/api/jobs/${jobId}/dismiss`);
      setJobsData((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error dismissing job:", err);
    }
  };

  return { jobsData, loading, error, dismissJob };
};
