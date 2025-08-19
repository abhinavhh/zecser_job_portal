// src/features/jobs/components/JobCard.tsx
import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  activelyReviewing: boolean;
  viewed: boolean;
  easyApply: boolean;
  earlyApplicant: boolean;
  promoted?: boolean;
  postedTime: string;
}

interface JobCardProps {
  job: Job;
  onDismiss: (jobId: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onDismiss }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/job/${job.id}`);
  };

  const handleDismissClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss(job.id);
  };

  return (
    <div className="w-full pt-3 flex cursor-pointer hover:bg-gray-50 transition-colors">
      {/* Company Logo */}
      <div className="flex-shrink-0 pl-6" onClick={handleCardClick}>
        <img
          src=""
          alt={`${job.company} logo`}
          className="w-10 h-10 rounded-md border object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-company-logo.png";
          }}
        />
      </div>

      {/* Job Info */}
      <div className="flex items-start flex-1 border-b border-muted-foreground pl-3 pb-3 ml-2">
        <div className="flex-1" onClick={handleCardClick}>
          <h2 className="font-semibold text-foreground">{job.title}</h2>
          <p className="text-sm text-foreground">{job.company}</p>
          <p className="text-xs text-muted-foreground">{job.location}</p>

          {job.activelyReviewing && (
            <p className="text-foreground font-light mt-1">
              Actively reviewing applicants
            </p>
          )}

          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
            {job.viewed && job.postedTime === "" && (
              <span className="text-foreground font-semibold">Viewed</span>
            )}
            {job.postedTime && !job.viewed && (
              <span className="text-foreground">{job.postedTime}</span>
            )}
            {job.earlyApplicant && (
              <span className="text-green-700">Be an early applicant</span>
            )}
            {job.easyApply && <span>Easy Apply</span>}
            {job.promoted && <span className=" font-bold">Promoted</span>}
          </div>
        </div>

        <button
          className="flex-shrink-0 pl-2 pr-2 hover:bg-gray-200 rounded transition-colors"
          onClick={handleDismissClick}
        >
          <X size={20} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
export default JobCard;