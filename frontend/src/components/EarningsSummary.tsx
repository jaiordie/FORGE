import React from 'react';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Earnings } from '../types';

interface EarningsSummaryProps {
  earnings: Earnings;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ earnings }) => {
  const earningsData = [
    {
      label: 'Today',
      amount: earnings.today,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'This Week',
      amount: earnings.week,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'This Month',
      amount: earnings.month,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Total Earned',
      amount: earnings.total,
      icon: DollarSign,
      color: 'text-forge-600',
      bgColor: 'bg-forge-50',
      borderColor: 'border-forge-200',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <DollarSign className="w-6 h-6 text-forge-500" />
        <h3 className="text-lg font-semibold text-gray-900">Earnings Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {earningsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`${item.bgColor} ${item.borderColor} border rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${item.color}`}>
                  {formatCurrency(item.amount)}
                </p>
                {item.amount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.label === 'Today' && earnings.today > 0 && '🔥 Great day!'}
                    {item.label === 'This Week' && earnings.week > 1000 && '💪 Strong week!'}
                    {item.label === 'This Month' && earnings.month > 3000 && '🚀 Excellent month!'}
                    {item.label === 'Total Earned' && earnings.total > 10000 && '⭐ Master Plumber!'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Avg/Day</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(earnings.month / 30)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Weekly Goal</p>
            <p className="text-sm font-semibold text-gray-900">
              {earnings.week >= 1500 ? '✅' : `${Math.round((earnings.week / 1500) * 100)}%`}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Goal</p>
            <p className="text-sm font-semibold text-gray-900">
              {earnings.month >= 6000 ? '✅' : `${Math.round((earnings.month / 6000) * 100)}%`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;