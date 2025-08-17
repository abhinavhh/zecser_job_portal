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

  const handleCardClick = async () => {
    try {
      // Mark job as viewed if not already
      if (!job.viewed) {
        // This will be handled by the API
        console.log('Marking job as viewed:', job.id);
      }
      
      // Navigate to job details
      navigate(`/job/${job.id}`);
    } catch (error) {
      console.error('Error handling job click:', error);
    }
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
            (e.target as HTMLImageElement).src = '/default-company-logo.png';
          }}
        />
      </div>

      {/* Job Info */}
      <div className="flex items-start flex-1 border-b border-muted-foreground pl-3 pb-3 ml-2">
        <div className="flex-1" onClick={handleCardClick}>
          {/* Title & Company */}
          <h2 className="font-semibold text-foreground">{job.title}</h2>
          <p className="text-sm text-foreground">{job.company}</p>
          <p className="text-xs text-muted-foreground">{job.location}</p>

          {/* Actively reviewing */}
          {job.activelyReviewing && (
            <p className="text-foreground font-light mt-1">
              Actively reviewing applicants
            </p>
          )}

          {/* Tags row */}
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
            {job.promoted && (
              <span className=" font-bold">Promoted</span>
            )}
          </div>
        </div>

        {/* Close Icon */}
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