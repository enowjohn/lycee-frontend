import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AcademicCapIcon,
  UsersIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
  CheckCircleIcon,
  DownloadIcon
} from '@heroicons/react/outline';
import { API_BASE_URL } from '../config/api';

const StaffPortal = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    teacher_id: '',
    first_name: '',
    last_name: '',
    subject: '',
    department: '',
    phone: '',
    email: '',
    qualification: '',
    hire_date: ''
  });
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [gradingForm, setGradingForm] = useState({
    submission_id: '',
    marks: '',
    grade: '',
    feedback: '',
    status: 'approved'
  });
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Check if teacher profile exists
      try {
        const teacherRes = await axios.get(`${API_BASE_URL}/api/teachers/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeacherData(teacherRes.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // No profile exists, show profile form
          setShowProfileForm(true);
          setLoading(false);
          return;
        }
        throw error;
      }

      const [sessionsRes, gradesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/video-sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/marks`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setScheduledSessions(sessionsRes.data);
      setRecentGrades(gradesRes.data);

      // Mock classes for now - can be replaced with real API later
      setMyClasses([
        { id: 1, name: 'Form 3 Physics', studentCount: 25, schedule: 'Mon, Wed, Fri 9:00 AM' },
        { id: 2, name: 'Form 4 Physics', studentCount: 22, schedule: 'Tue, Thu 10:00 AM' },
        { id: 3, name: 'Form 5 Physics', studentCount: 20, schedule: 'Mon, Wed 2:00 PM' }
      ]);

      // Fetch pending submissions
      await fetchPendingSubmissions(token);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSubmissions = async (token) => {
    try {
      const assignmentsRes = await axios.get(`${API_BASE_URL}/api/assignments/teacher`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allSubmissions = [];
      for (const assignment of assignmentsRes.data) {
        try {
          const subsRes = await axios.get(`${API_BASE_URL}/api/assignments/${assignment.id}/submissions`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allSubmissions.push(...subsRes.data.map(sub => ({ ...sub, assignment_title: assignment.title, total_marks: assignment.total_marks })));
        } catch (error) {
          console.error('Error fetching submissions for assignment:', assignment.id);
        }
      }

      setPendingSubmissions(allSubmissions.filter(sub => sub.status === 'submitted' || sub.status === 'rejected'));
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(profileForm).forEach(key => {
        formData.append(key, profileForm[key]);
      });

      await axios.post(`${API_BASE_URL}/api/teachers`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Profile created successfully!');
      setShowProfileForm(false);
      fetchTeacherData();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingForm({
      submission_id: submission.id,
      marks: submission.marks || '',
      grade: submission.grade || '',
      feedback: submission.feedback || '',
      status: submission.status === 'rejected' ? 'approved' : 'approved'
    });
    setShowGradingModal(true);
  };

  const handleConfirmGrading = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${API_BASE_URL}/api/assignments/${selectedSubmission.assignment_id}/grade`, gradingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Submission updated successfully!');
      setShowGradingModal(false);
      const newToken = localStorage.getItem('token');
      await fetchPendingSubmissions(newToken);
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const handleDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/uploads/${filePath}`;
    link.download = filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600">Please fill in your teacher information to continue.</p>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                <input
                  type="text"
                  required
                  value={profileForm.teacher_id}
                  onChange={(e) => setProfileForm({ ...profileForm, teacher_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., TCH001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={profileForm.subject}
                  onChange={(e) => setProfileForm({ ...profileForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Physics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  required
                  value={profileForm.qualification}
                  onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., M.Sc. Physics"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                <input
                  type="date"
                  required
                  value={profileForm.hire_date}
                  onChange={(e) => setProfileForm({ ...profileForm, hire_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowProfileForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={submittingProfile}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingProfile}
                className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {submittingProfile ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Staff Portal</h1>
          <p className="text-blue-100">Welcome, {teacherData?.first_name} {teacherData?.last_name}</p>

          {teacherData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Teacher ID</p>
                <p className="font-semibold">{teacherData.teacher_id}</p>
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
          {/* Pending Submissions */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Pending Submissions</h2>
              <Link to="/assignments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-4">
              {pendingSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {pendingSubmissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{submission.student_first_name} {submission.student_last_name}</p>
                        <p className="text-sm text-gray-600">{submission.assignment_title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'submitted' ? 'bg-amber-100 text-amber-800' :
                          submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {submission.status}
                        </span>
                        <button
                          onClick={() => handleGradeSubmission(submission)}
                          className="px-3 py-1 bg-blue-800 text-white rounded-lg text-xs hover:bg-blue-900"
                        >
                          Grade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending submissions</p>
              )}
            </div>
          </div>

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

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Grade Submission</h2>
              <button
                onClick={() => setShowGradingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedSubmission.assignment_title}</h3>
                <p className="text-sm text-gray-600">Student: {selectedSubmission.student_first_name} {selectedSubmission.student_last_name}</p>
                <p className="text-sm text-gray-600">ID: {selectedSubmission.student_id}</p>
              </div>

              {selectedSubmission.submission_text && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Student's Answer</h4>
                  <p className="text-gray-700">{selectedSubmission.submission_text}</p>
                </div>
              )}

              {selectedSubmission.file_path && (
                <div className="mb-4">
                  <button
                    onClick={() => handleDownload(selectedSubmission.file_path)}
                    className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Submission File
                  </button>
                </div>
              )}

              <form onSubmit={handleConfirmGrading} className="border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setGradingForm({ ...gradingForm, status: 'approved' })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          gradingForm.status === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        ✓ Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setGradingForm({ ...gradingForm, status: 'rejected' })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          gradingForm.status === 'rejected'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        ✗ Request Changes
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marks (out of {selectedSubmission.total_marks})</label>
                    <input
                      type="number"
                      value={gradingForm.marks}
                      onChange={(e) => setGradingForm({ ...gradingForm, marks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter marks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <input
                      type="text"
                      value={gradingForm.grade}
                      onChange={(e) => setGradingForm({ ...gradingForm, grade: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., A, B, C"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                    <textarea
                      value={gradingForm.feedback}
                      onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide feedback to the student..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Submit Grade
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPortal;