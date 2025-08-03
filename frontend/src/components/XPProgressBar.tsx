import React from 'react';
import { Zap, Star } from 'lucide-react';

interface XPProgressBarProps {
  currentXP: number;
  currentLevel: number;
  forgeScore: number;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  currentLevel,
  forgeScore,
}) => {
  // Calculate XP needed for next level (exponential scaling)
  const xpForCurrentLevel = currentLevel * 1000;
  const xpForNextLevel = (currentLevel + 1) * 1000;
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min((xpProgress / xpNeeded) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-forge-500" />
          <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">
            ForgeScore: {forgeScore.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Level Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-forge-500 to-forge-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{currentLevel}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Level</p>
              <p className="font-semibold text-gray-900">Level {currentLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Next Level</p>
            <p className="font-semibold text-gray-900">Level {currentLevel + 1}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentXP.toLocaleString()} XP</span>
            <span>{xpForNextLevel.toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forge-400 to-forge-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>+{xpProgress.toLocaleString()} XP this level</span>
            <span>{(xpNeeded - xpProgress).toLocaleString()} XP to next level</span>
          </div>
        </div>

        {/* Level Benefits Preview */}
        {progressPercentage > 80 && (
          <div className="bg-forge-50 border border-forge-200 rounded-lg p-3">
            <p className="text-sm text-forge-700 font-medium">
              🎉 Almost there! Level {currentLevel + 1} unlocks:
            </p>
            <ul className="text-xs text-forge-600 mt-1 space-y-1">
              <li>• Priority job visibility</li>
              <li>• Higher earning potential</li>
              <li>• Exclusive badge opportunities</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default XPProgressBar;