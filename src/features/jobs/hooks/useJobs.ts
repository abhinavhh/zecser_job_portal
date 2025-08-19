// src/features/jobs/hooks/useJobs.ts
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { mockJobs } from "../data/mockJobs";
import type { Job } from "../types";

export const useJobs = (searchQuery: string) => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  /**
   * Unified filter logic - applies all active filters to job list
   * This handles both search query and URL parameter filters
   */
  const applyFilters = (jobs: Job[]) => {
    let filtered = [...jobs];

    // 🔎 Text search filter
    const search = searchQuery.trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search) ||
          job.company.toLowerCase().includes(search) ||
          job.location.toLowerCase().includes(search)
      );
    }

    // ✅ Apply filters from URL query params
    searchParams.forEach((value, key) => {
      switch (key) {
        // Boolean filters - check if param is "true"
        case "easyApply":
          if (value === "true") filtered = filtered.filter((job) => job.easyApply);
          break;
        case "hasVerifications":
          if (value === "true") filtered = filtered.filter((job) => job.verified);
          break;
        case "under10Applicants":
          if (value === "true") filtered = filtered.filter((job) => (job.applicants ?? 0) < 10);
          break;
        case "inYourNetwork":
          if (value === "true") filtered = filtered.filter((job) => job.inYourNetwork);
          break;
        case "viewed":
          if (value === "true") filtered = filtered.filter((job) => job.viewed);
          break;
        case "activelyReviewing":
          if (value === "true") filtered = filtered.filter((job) => job.activelyReviewing);
          break;
        case "earlyApplicant":
          if (value === "true") filtered = filtered.filter((job) => job.earlyApplicant);
          break;
        case "promoted":
          if (value === "true") filtered = filtered.filter((job) => job.promoted);
          break;

        // 🗓 Date posted filter - calculate time difference
        case "datePosted":
          const now = Date.now();
          if (value === "Past 24 hours") {
            filtered = filtered.filter(
              (job) => now - new Date(job.postedTime).getTime() <= 24 * 60 * 60 * 1000
            );
          } else if (value === "Past week") {
            filtered = filtered.filter(
              (job) => now - new Date(job.postedTime).getTime() <= 7 * 24 * 60 * 60 * 1000
            );
          } else if (value === "Past month") {
            filtered = filtered.filter(
              (job) => now - new Date(job.postedTime).getTime() <= 30 * 24 * 60 * 60 * 1000
            );
          }
          break;

        // 🌍 Dropdown filters - filter if value is not "Any"
        case "remote":
          if (value !== "Any") filtered = filtered.filter((job) => job.remote === value);
          break;
        case "jobType":
          if (value !== "Any") filtered = filtered.filter((job) => job.type === value);
          break;
        case "experienceLevel":
          if (value !== "Any") filtered = filtered.filter((job) => job.experienceLevel === value);
          break;
        case "company":
          if (value !== "Any") {
            filtered = filtered.filter((job) => 
              job.company.toLowerCase() === value.toLowerCase()
            );
          }
          break;
        case "location":
          if (value !== "Any") {
            filtered = filtered.filter((job) => 
              job.location.toLowerCase().includes(value.toLowerCase())
            );
          }
          break;
        default:
          // Ignore unknown parameters
          break;
      }
    });

    return filtered;
  };

  /**
   * Fetch jobs from API or fallback to mock data
   * Applies filters to both API and mock data
   */
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare API parameters
      const params: Record<string, any> = { location: "Kerala" };
      if (searchQuery) params.search = searchQuery;

      // Include all search params in API request
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      const response = await axios.get("/api/jobs", { params });

      if (response.data.success) {
        // Apply client-side filters to API response
        setJobsData(applyFilters(response.data.jobs || []));
      } else {
        throw new Error(response.data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      console.warn("API unavailable — using mock jobs.");
      // Apply filters to mock data as fallback
      setJobsData(applyFilters(mockJobs));
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search query or filters change
  useEffect(() => {
    fetchJobs();
  }, [searchQuery, searchParams]);

  /**
   * Dismiss a job - remove from list and notify API
   */
  const dismissJob = async (jobId: number) => {
    try {
      await axios.post(`/api/jobs/${jobId}/dismiss`);
      setJobsData((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error dismissing job:", err);
      // Still remove from UI even if API call fails
      setJobsData((prev) => prev.filter((job) => job.id !== jobId));
    }
  };

  return { jobsData, loading, error, dismissJob };
};

export default useJobs;