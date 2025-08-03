import React from 'react';
import { MapPin, Clock, DollarSign, AlertTriangle, Star, Zap } from 'lucide-react';
import { Job } from '../types';

interface JobFeedProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

const JobFeed: React.FC<JobFeedProps> = ({ jobs, onJobClick }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateEarningPotential = (job: Job) => {
    // Simple algorithm: base on urgency and job type
    const urgencyMultiplier = {
      'EMERGENCY': 2.0,
      'HIGH': 1.5,
      'MEDIUM': 1.2,
      'LOW': 1.0,
    };

    const baseAmount = 200; // Base job amount
    return Math.round(baseAmount * (urgencyMultiplier[job.urgency as keyof typeof urgencyMultiplier] || 1));
  };

  const calculateXPGain = (job: Job) => {
    // XP based on urgency and complexity
    const baseXP = 50;
    const urgencyMultiplier = {
      'EMERGENCY': 3,
      'HIGH': 2,
      'MEDIUM': 1.5,
      'LOW': 1,
    };

    return Math.round(baseXP * (urgencyMultiplier[job.urgency as keyof typeof urgencyMultiplier] || 1));
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const jobDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Sort jobs by earning potential and urgency
  const sortedJobs = [...jobs].sort((a, b) => {
    const aScore = calculateEarningPotential(a) + (a.urgency === 'EMERGENCY' ? 1000 : 0);
    const bScore = calculateEarningPotential(b) + (b.urgency === 'EMERGENCY' ? 1000 : 0);
    return bScore - aScore;
  });

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
        <div className="text-gray-400 mb-4">
          <Clock className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
        <p className="text-gray-600">
          Check back soon for new opportunities, or update your preferences to see more jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-forge-500" />
            <h3 className="text-lg font-semibold text-gray-900">Available Jobs</h3>
          </div>
          <span className="bg-forge-100 text-forge-800 text-sm font-medium px-3 py-1 rounded-full">
            {jobs.length} jobs
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Ranked by earning potential and location
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedJobs.map((job, index) => (
          <div
            key={job.id}
            onClick={() => onJobClick(job)}
            className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors duration-150 last:border-b-0"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Job Header */}
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900 truncate">{job.title}</h4>
                  {index === 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      🔥 Top Pick
                    </span>
                  )}
                </div>

                {/* Job Details */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{job.address}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(job.requestedAt)}</span>
                  </div>
                </div>

                {/* Job Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {job.description}
                </p>

                {/* Job Stats */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">${calculateEarningPotential(job)}</span>
                    <span className="text-xs text-gray-500">est.</span>
                  </div>
                  <div className="flex items-center space-x-1 text-forge-600">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">+{calculateXPGain(job)} XP</span>
                  </div>
                </div>
              </div>

              {/* Urgency Badge */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                {getUrgencyIcon(job.urgency)}
                <span>{job.urgency}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Customer: {job.createdBy.firstName} {job.createdBy.lastName}
                </span>
                {job.photos.length > 0 && (
                  <span className="flex items-center space-x-1">
                    <span>📷</span>
                    <span>{job.photos.length} photo{job.photos.length !== 1 ? 's' : ''}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFeed;