import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import PlumberDashboard from './pages/PlumberDashboard';
import Login from './pages/Login';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forge-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FORGE...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Route based on user role
  switch (user.role) {
    case 'PLUMBER':
      return <PlumberDashboard />;
    case 'HOMEOWNER':
      // Would redirect to homeowner portal in a full app
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Homeowner Portal</h2>
            <p className="text-gray-600 mb-4">Coming soon! This would be the homeowner interface.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-forge-500 text-white px-4 py-2 rounded-lg hover:bg-forge-600"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    case 'DISPATCHER':
      // Would redirect to dispatcher interface in a full app
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispatcher Interface</h2>
            <p className="text-gray-600 mb-4">Coming soon! This would be the dispatcher dashboard.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-forge-500 text-white px-4 py-2 rounded-lg hover:bg-forge-600"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    default:
      return <Login />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
