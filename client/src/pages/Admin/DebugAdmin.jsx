import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Navigate } from 'react-router-dom';

const DebugAdmin = () => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    console.log('=== DEBUG ADMIN PAGE ===');
    console.log('isLoading:', isLoading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user.role:', user?.role);
    console.log('=====================');
    
    checkAuth();
  }, [checkAuth, isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">NOT AUTHENTICATED</h2>
          <p className="mb-4">You need to login as admin first!</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">ACCESS DENIED</h2>
          <p className="mb-4">Your role is: <strong>{user?.role}</strong></p>
          <p>You need admin role to access this page!</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-sm">User Details:</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify({
                name: user?.name,
                email: user?.email,
                role: user?.role
              }, null, 2)}
            </pre>
          </div>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-green-600">✅ ADMIN ACCESS GRANTED!</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Authentication Status:</h3>
            <ul className="space-y-2">
              <li><strong>Is Authenticated:</strong> <span className="text-green-600">✓ Yes</span></li>
              <li><strong>User Role:</strong> <span className="text-green-600">✓ {user?.role}</span></li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">User Information:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Name:</strong>
                <p>{user?.name || 'N/A'}</p>
              </div>
              <div>
                <strong>Email:</strong>
                <p>{user?.email || 'N/A'}</p>
              </div>
              <div>
                <strong>Role:</strong>
                <p className="text-lg font-bold text-purple-600">{user?.role}</p>
              </div>
              <div>
                <strong>ID:</strong>
                <p className="text-xs">{user?._id || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <a 
              href="/admin" 
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-6 rounded-lg text-center font-semibold hover:shadow-lg transition-all"
            >
              Go to Dashboard
            </a>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-200 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Refresh Page
            </button>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> If you can see this page, it means admin authentication is working correctly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAdmin;
