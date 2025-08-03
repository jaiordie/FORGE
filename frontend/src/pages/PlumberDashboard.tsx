import React, { useState, useEffect } from 'react';
import { Power, Settings, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { plumberAPI } from '../utils/api';
import { DashboardData, Job } from '../types';
import XPProgressBar from '../components/XPProgressBar';
import EarningsSummary from '../components/EarningsSummary';
import BadgeDisplay from '../components/BadgeDisplay';
import JobFeed from '../components/JobFeed';

const PlumberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadJobs();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await plumberAPI.getDashboard();
      setDashboardData(data);
      setIsAvailable(data.profile.isActive);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    }
  };

  const loadJobs = async () => {
    try {
      const { jobs: jobsData } = await plumberAPI.getJobs();
      setJobs(jobsData);
    } catch (err) {
      setError('Failed to load jobs');
      console.error('Jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const newStatus = !isAvailable;
      await plumberAPI.updateAvailability(newStatus);
      setIsAvailable(newStatus);
      
      // Refresh dashboard data
      await loadDashboardData();
    } catch (err) {
      setError('Failed to update availability');
      console.error('Availability error:', err);
    }
  };

  const handleJobClick = (job: Job) => {
    // Navigate to job detail page (would use React Router in a full app)
    console.log('Job clicked:', job);
    // For now, just show an alert
    alert(`Job clicked: ${job.title}\n\nIn a full app, this would navigate to the job detail page.`);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forge-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-forge-500 text-white px-4 py-2 rounded-lg hover:bg-forge-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-forge-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FORGE</h1>
                  <p className="text-xs text-gray-500">Plumber Dashboard</p>
                </div>
              </div>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center space-x-4">
              {/* Availability Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Available:</span>
                <button
                  onClick={handleAvailabilityToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-forge-500 focus:ring-offset-2 ${
                    isAvailable ? 'bg-forge-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Level {dashboardData.profile.level}</p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  title="Logout"
                >
                  <Power className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            {isAvailable
              ? `You're currently available for jobs. ${jobs.length} jobs are waiting for you!`
              : "You're currently offline. Toggle availability to start receiving jobs."
            }
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Feed */}
          <div className="lg:col-span-2 space-y-8">
            <JobFeed jobs={jobs} onJobClick={handleJobClick} />
          </div>

          {/* Right Column - Stats and Gamification */}
          <div className="space-y-8">
            {/* XP Progress */}
            <XPProgressBar
              currentXP={dashboardData.profile.xp}
              currentLevel={dashboardData.profile.level}
              forgeScore={dashboardData.profile.forgeScore}
            />

            {/* Earnings Summary */}
            <EarningsSummary earnings={dashboardData.earnings} />

            {/* Job Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Jobs</span>
                  <span className="font-semibold text-forge-600">{dashboardData.jobs.available}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{dashboardData.jobs.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{dashboardData.jobs.completed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mt-8">
          <BadgeDisplay badges={dashboardData.badges} />
        </div>
      </main>
    </div>
  );
};

export default PlumberDashboard;