import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AcademicCapIcon, 
  UsersIcon, 
  BookOpenIcon, 
  CalendarIcon,
  BellIcon,
  LogoutIcon
} from '@heroicons/react/outline';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/statistics', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setStats(statsRes.data);
      
      // Mock recent activity
      setRecentActivity([
        { id: 1, action: 'New student registered', time: '2 hours ago', type: 'student' },
        { id: 2, action: 'Grade report generated', time: '4 hours ago', type: 'academic' },
        { id: 3, action: 'Live session completed', time: 'Yesterday', type: 'class' },
        { id: 4, action: 'New announcement posted', time: '2 days ago', type: 'announcement' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleRedirect = () => {
    switch (user.role) {
      case 'teacher': return '/staff-portal';
      case 'student': return '/student-portal';
      case 'parent': return '/parent-portal';
      default: return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user.first_name} {user.last_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <LogoutIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
          
          <div className="mt-6 flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
            <span className="text-blue-100 text-sm">{user.email}</span>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-blue-800 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.students}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Teachers</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.teachers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.subjects}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Live Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.sessions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.role === 'admin' && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/students')}>
                <UsersIcon className="h-8 w-8 text-blue-800 mb-3" />
                <h3 className="font-semibold text-gray-800">Manage Students</h3>
                <p className="text-sm text-gray-600">View and update student records</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/report-card')}>
                <BookOpenIcon className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Report Cards</h3>
                <p className="text-sm text-gray-600">Generate student reports</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/messaging')}>
                <BellIcon className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-600">Send announcements</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/live-class')}>
                <CalendarIcon className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Live Classes</h3>
                <p className="text-sm text-gray-600">Manage video sessions</p>
              </div>
            </>
          )}
          
          {user.role === 'teacher' && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/live-class')}>
                <CalendarIcon className="h-8 w-8 text-blue-800 mb-3" />
                <h3 className="font-semibold text-gray-800">Start Live Class</h3>
                <p className="text-sm text-gray-600">Begin teaching session</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/students')}>
                <UsersIcon className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-800">My Students</h3>
                <p className="text-sm text-gray-600">View class list</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/messaging')}>
                <BellIcon className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Messages</h3>
                <p className="text-sm text-gray-600">Communicate</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <BookOpenIcon className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Enter Grades</h3>
                <p className="text-sm text-gray-600">Record performance</p>
              </div>
            </>
          )}
          
          {(user.role === 'student' || user.role === 'parent') && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/live-class')}>
                <CalendarIcon className="h-8 w-8 text-blue-800 mb-3" />
                <h3 className="font-semibold text-gray-800">Live Classes</h3>
                <p className="text-sm text-gray-600">Join sessions</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/report-card')}>
                <BookOpenIcon className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Results</h3>
                <p className="text-sm text-gray-600">View grades</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/messaging')}>
                <BellIcon className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-gray-800">Messages</h3>
                <p className="text-sm text-gray-600">Check inbox</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <UsersIcon className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-800">
                  {user.role === 'student' ? 'Assignments' : 'Child Progress'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user.role === 'student' ? 'View tasks' : 'Monitor performance'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4">
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.type === 'student' ? 'bg-blue-500' :
                      activity.type === 'academic' ? 'bg-green-500' :
                      activity.type === 'class' ? 'bg-amber-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-grow">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Role-specific redirect */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(getRoleRedirect())}
            className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold"
          >
            Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;