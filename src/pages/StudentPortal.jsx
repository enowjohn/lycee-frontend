import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  VideoCameraIcon, 
  DocumentTextIcon,
  CalendarIcon,
  TrendingUpIcon
} from '@heroicons/react/outline';
import { API_BASE_URL } from '../config/api';

const StudentPortal = () => {
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [gradesRes, sessionsRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/marks/student/1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        axios.get(`${API_BASE_URL}/api/video-sessions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        axios.get(`${API_BASE_URL}/api/assignments`)
      ]);
      
      setGrades(gradesRes.data);
      setUpcomingClasses(sessionsRes.data);
      setAssignments(assignmentsRes.data);
      setStudentData({
        name: 'John Doe',
        studentId: 'STU001',
        class: 'Form 3',
        stream: 'Science',
        admissionDate: '2022-09-01'
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
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
          <h1 className="text-3xl font-bold mb-2">Student Portal</h1>
          <p className="text-blue-100">Welcome back, {studentData?.name}</p>
          
          {studentData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Student ID</p>
                <p className="font-semibold">{studentData.studentId}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Class</p>
                <p className="font-semibold">{studentData.class}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Stream</p>
                <p className="font-semibold">{studentData.stream}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Admission Date</p>
                <p className="font-semibold">{new Date(studentData.admissionDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-800 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-800">
                  {grades.length > 0 ? (grades.reduce((sum, g) => sum + (g.total_marks || 0), 0) / grades.length).toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{grades.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <VideoCameraIcon className="h-8 w-8 text-amber-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Live Classes</p>
                <p className="text-2xl font-bold text-gray-800">{upcomingClasses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-800">{assignments.filter(a => a.status === 'pending').length}</p>
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
              <h3 className="font-semibold text-gray-800">Join Live Class</h3>
            </div>
            <p className="text-sm text-gray-600">Access your scheduled live sessions</p>
          </Link>
          
          <Link
            to="/report-card"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <TrendingUpIcon className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="font-semibold text-gray-800">View Results</h3>
            </div>
            <p className="text-sm text-gray-600">Check your academic performance</p>
          </Link>
          
          <Link
            to="/ai-chat"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-amber-600 mr-3" />
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            </div>
            <p className="text-sm text-gray-600">Ask questions and get help</p>
          </Link>
          
          <Link
            to="/messaging"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="font-semibold text-gray-800">Messages</h3>
            </div>
            <p className="text-sm text-gray-600">Communicate with teachers</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Live Classes</h2>
            </div>
            <div className="p-4">
              {upcomingClasses.length > 0 ? (
                <div className="space-y-3">
                  {upcomingClasses.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{session.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.scheduled_date).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to="/live-class"
                        className="px-3 py-1 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900"
                      >
                        Join
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming classes</p>
              )}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Pending Assignments</h2>
              <div className="flex space-x-2">
                <button
                  onClick={fetchStudentData}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Refresh
                </button>
                <Link to="/assignments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-4">
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.slice(0, 5).map((assignment) => (
                    <Link
                      key={assignment.id}
                      to="/assignments"
                      className="block flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{assignment.title}</p>
                        <p className="text-sm text-gray-600">
                          {assignment.subject_name} • {assignment.teacher_name || 'Teacher'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                          Pending
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending assignments</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="mt-8 bg-white rounded-xl shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Grades</h2>
          </div>
          <div className="p-4">
            {grades.length > 0 ? (
              <div className="space-y-3">
                {grades.slice(0, 5).map((grade, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{grade.subject_name}</p>
                      <p className="text-sm text-gray-600">{grade.term} Term</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-800">{grade.total_marks || 0}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        grade.grade === 'A' ? 'bg-green-100 text-green-800' :
                        grade.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        grade.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {grade.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No grades available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;