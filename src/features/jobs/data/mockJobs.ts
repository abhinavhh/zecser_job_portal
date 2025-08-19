// src/features/jobs/data/mockJobs.ts
import type { Job } from "../types";

export const mockJobs: Job[] = [
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
    verified: true,
    applicants: 5,
    inYourNetwork: true,
    remote: "Hybrid", // ✅ "Remote", "Onsite", "Hybrid"
    type: "Full-time", // ✅ "Full-time", "Part-time", "Internship"
    experienceLevel: "Mid", // ✅ "Entry", "Mid", "Senior"
    postedTime: "2025-08-15T09:30:00Z", // use ISO date string for filtering
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
    promoted: false,
    verified: false,
    applicants: 20,
    inYourNetwork: false,
    remote: "Onsite",
    type: "Contract",
    experienceLevel: "Senior",
    postedTime: "2025-08-10T14:00:00Z",
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
    promoted: false,
    verified: true,
    applicants: 8,
    inYourNetwork: false,
    remote: "Remote",
    type: "Internship",
    experienceLevel: "Entry",
    postedTime: "2025-08-01T12:00:00Z",
  },
];

export default mockJobs;
