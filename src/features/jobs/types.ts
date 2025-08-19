// src/features/jobs/types.ts

/**
 * Main Job interface - represents a single job listing
 * Contains all job metadata, status flags, and filtering properties
 */
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;

  // ✅ Status flags - job interaction states
  activelyReviewing: boolean;   // Company is actively reviewing applications
  viewed: boolean;              // User has viewed this job
  earlyApplicant: boolean;      // User would be among first applicants
  easyApply: boolean;           // Job supports one-click application
  promoted?: boolean;           // Job is promoted/sponsored
  verified?: boolean;           // Company is verified

  // ✅ Job metadata - filtering and display info
  applicants?: number;          // Total number of applicants
  inYourNetwork?: boolean;      // Someone in your network works here
  remote?: "Remote" | "Onsite" | "Hybrid"; // Work arrangement
  type?: "Full-time" | "Part-time" | "Contract" | "Internship"; // Employment type
  experienceLevel?: "Entry" | "Mid" | "Senior"; // Required experience level

  // ✅ Posting info
  postedTime: string;           // ISO date string ("2025-08-15T09:30:00Z")
}

/**
 * Filter toggles interface - used by FilterBar component
 * Represents the quick filter buttons state
 */
export interface FilterToggles {
  jobs: boolean;                // General jobs filter active
  easyApply: boolean;           // Easy apply filter active
  datePosted: boolean;          // Date posted filter active
  experienceLevel: boolean;     // Experience level filter active
}

/**
 * API response interface for job listings
 */
export interface JobsApiResponse {
  success: boolean;
  jobs?: Job[];
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * User filter preferences interface
 * Used for saving/loading user's preferred filter settings
 */
export interface UserFilterPreferences {
  filters: Partial<FilterState>;
  savedAt: string;
  userId: string;
} 
export interface FilterState {
  // Dropdown filters
  datePosted: string;           // "Anytime" | "Past 24 hours" | "Past week" | "Past month"
  experienceLevel: string;      // "Any" | "Entry" | "Mid" | "Senior"
  company: string | string[];   // Company name or "Any"
  jobType: string;              // "Any" | "Full-time" | "Part-time" | "Contract" | "Internship"
  remote: string;               // "Any" | "Remote" | "Onsite" | "Hybrid"
  location: string;             // Location string or "Any"
  industry: string;             // Industry category or "Any"
  jobFunction: string;          // Job function category or "Any"
  title: string;                // Job title or "Any"
  sortBy: string;               // "Most relevant" | "Most recent" | "Salary"

  // Boolean filters (switches)
  easyApply: boolean;           // Show only easy apply jobs
  hasVerifications: boolean;    // Show only verified companies
  under10Applicants: boolean;   // Show jobs with <10 applicants
  inYourNetwork: boolean;       // Show only network jobs

  // Allow additional dynamic properties for extensibility
  [key: string]: any;
}

/**
 * Filter state interface - manages all filter options in FilterSheet
 * Used for both internal state and API communication
 */