import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  AcademicCapIcon, 
  UsersIcon, 
  BookOpenIcon, 
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarIcon,
  PlusIcon,
  UploadIcon
} from '@heroicons/react/outline';

const StaffPortal = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token');
      // In a real implementation, you'd fetch the teacher's data from their user profile
      // For now, we'll use mock data
      const teacherId = 1; // This would come from the user's profile
      
      const [sessionsRes, gradesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/video-sessions', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/marks', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setScheduledSessions(sessionsRes.data);
      setRecentGrades(gradesRes.data);
      setTeacherData({
        name: 'Dr. Marie Curie',
        teacherId: 'TCH001',
        subject: 'Physics',
        department: 'Science',
        email: 'marie.curie@lycee-obessa.com'
      });
      
      // Mock classes
      setMyClasses([
        { id: 1, name: 'Form 3 Physics', studentCount: 25, schedule: 'Mon, Wed, Fri 9:00 AM' },
        { id: 2, name: 'Form 4 Physics', studentCount: 22, schedule: 'Tue, Thu 10:00 AM' },
        { id: 3, name: 'Form 5 Physics', studentCount: 20, schedule: 'Mon, Wed 2:00 PM' }
      ]);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Staff Portal</h1>
          <p className="text-blue-100">Welcome, {teacherData?.name}</p>
          
          {teacherData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Teacher ID</p>
                <p className="font-semibold">{teacherData.teacherId}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Subject</p>
                <p className="font-semibold">{teacherData.subject}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Department</p>
                <p className="font-semibold">{teacherData.department}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Email</p>
                <p className="font-semibold text-sm">{teacherData.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-800 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">
                  {myClasses.reduce((sum, c) => sum + c.studentCount, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">My Classes</p>
                <p className="text-2xl font-bold text-gray-800">{myClasses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <VideoCameraIcon className="h-8 w-8 text-amber-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Live Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{scheduledSessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Grades Entered</p>
                <p className="text-2xl font-bold text-gray-800">{recentGrades.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            to="/live-class"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <VideoCameraIcon className="h-8 w-8 text-blue-800 mr-3" />
              <h3 className="font-semibold text-gray-800">Start Live Class</h3>
            </div>
            <p className="text-sm text-gray-600">Begin a live teaching session</p>
          </Link>
          
          <Link
            to="/students"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <UsersIcon className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="font-semibold text-gray-800">Manage Students</h3>
            </div>
            <p className="text-sm text-gray-600">View and update student records</p>
          </Link>
          
          <Link
            to="/ai-chat"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <PlusIcon className="h-8 w-8 text-amber-600 mr-3" />
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            </div>
            <p className="text-sm text-gray-600">Get help with research and planning</p>
          </Link>
          
          <Link
            to="/assignments"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <UploadIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="font-semibold text-gray-800">Manage Assignments</h3>
            </div>
            <p className="text-sm text-gray-600">Create and grade student assignments</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="p-4">
              {myClasses.length > 0 ? (
                <div className="space-y-3">
                  {myClasses.map((classItem) => (
                    <div key={classItem.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{classItem.name}</p>
                        <p className="text-sm text-gray-600">{classItem.schedule}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{classItem.studentCount} students</p>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No classes assigned</p>
              )}
            </div>
          </div>

          {/* Scheduled Sessions */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Scheduled Sessions</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Schedule New
              </button>
            </div>
            <div className="p-4">
              {scheduledSessions.length > 0 ? (
                <div className="space-y-3">
                  {scheduledSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{session.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.scheduled_date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'live' ? 'bg-green-100 text-green-800' :
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status}
                        </span>
                        <Link
                          to="/live-class"
                          className="px-3 py-1 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900"
                        >
                          Start
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No sessions scheduled</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-800">Grades entered for Form 3 Physics</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-800">Live session completed: Introduction to Waves</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-800">New materials uploaded: Lab Safety Guidelines</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;