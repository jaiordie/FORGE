import React from 'react';
import { Award, Lock } from 'lucide-react';
import { Badge } from '../types';

interface BadgeDisplayProps {
  badges: Badge[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  // Sample badges that could be unlocked
  const allPossibleBadges = [
    { id: 'first-job', name: 'First Job', description: 'Complete your first job', icon: '🔧', required: true },
    { id: '5-star-streak', name: '5-Star Streak', description: 'Receive 5 consecutive 5-star reviews', icon: '⭐', required: false },
    { id: 'speed-demon', name: 'Speed Demon', description: 'Complete 3 jobs in one day', icon: '⚡', required: false },
    { id: 'customer-favorite', name: 'Customer Favorite', description: 'Maintain 4.8+ rating with 20+ reviews', icon: '❤️', required: false },
    { id: 'master-plumber', name: 'Master Plumber', description: 'Reach level 10', icon: '👑', required: false },
    { id: 'early-bird', name: 'Early Bird', description: 'Accept 10 jobs before 8 AM', icon: '🌅', required: false },
    { id: 'big-earner', name: 'Big Earner', description: 'Earn $10,000 total', icon: '💰', required: false },
    { id: 'problem-solver', name: 'Problem Solver', description: 'Complete 50 emergency jobs', icon: '🚨', required: false },
  ];

  const unlockedBadgeIds = badges.map(b => b.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Award className="w-6 h-6 text-forge-500" />
        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        <span className="bg-forge-100 text-forge-800 text-xs font-medium px-2 py-1 rounded-full">
          {badges.length}/{allPossibleBadges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {allPossibleBadges.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const unlockedBadge = badges.find(b => b.id === badge.id);

          return (
            <div
              key={badge.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isUnlocked
                  ? 'border-forge-200 bg-forge-50 hover:shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div className={`text-3xl mb-2 text-center ${isUnlocked ? '' : 'grayscale'}`}>
                {isUnlocked ? badge.icon : '🔒'}
              </div>

              {/* Badge Info */}
              <div className="text-center">
                <h4 className={`font-semibold text-sm mb-1 ${
                  isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.name}
                </h4>
                <p className={`text-xs ${
                  isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {badge.description}
                </p>

                {/* Unlock Date */}
                {isUnlocked && unlockedBadge && (
                  <p className="text-xs text-forge-600 mt-2 font-medium">
                    Unlocked {formatDate(unlockedBadge.unlockedAt.toString())}
                  </p>
                )}
              </div>

              {/* Locked Overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
              )}

              {/* New Badge Glow */}
              {isUnlocked && unlockedBadge && 
                new Date(unlockedBadge.unlockedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Message */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        {badges.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            Complete your first job to start earning badges! 🎯
          </p>
        ) : badges.length < allPossibleBadges.length ? (
          <p className="text-sm text-gray-600 text-center">
            Great progress! Keep completing jobs to unlock more achievements. 🚀
          </p>
        ) : (
          <p className="text-sm text-forge-600 text-center font-medium">
            🏆 Congratulations! You've unlocked all available badges!
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeDisplay;