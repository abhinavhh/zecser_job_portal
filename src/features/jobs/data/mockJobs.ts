// src/features/jobs/data/mockJobs.ts
import type { Job } from "../types";

export const DUMMY_JOBS: Job[] = [
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
