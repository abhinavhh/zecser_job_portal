// src/features/jobs/types.ts
export interface Job {
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

export interface FilterState {
  jobs: boolean;
  easy: boolean;
  date: boolean;
  exp: boolean;
  [key: string]: boolean;
}
