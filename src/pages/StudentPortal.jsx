import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AcademicCapIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarIcon,
  TrendingUpIcon,
  UploadIcon,
  XIcon,
  DownloadIcon
} from '@heroicons/react/outline';
import { API_BASE_URL } from '../config/api';

const StudentPortal = () => {
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    submission_text: '',
    file: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [studentProfileForm, setStudentProfileForm] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    parent_phone: '',
    parent_email: '',
    class_level: 'Form 1',
    stream: 'english',
    admission_date: ''
  });
  const [submittingProfile, setSubmittingProfile] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Check if student profile exists
      try {
        const studentRes = await axios.get(`${API_BASE_URL}/api/students/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentData(studentRes.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // No profile exists, show profile form
          setShowProfileForm(true);
          setLoading(false);
          return;
        }
        throw error;
      }

      const [gradesRes, sessionsRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/marks/student/1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        axios.get(`${API_BASE_URL}/api/video-sessions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        axios.get(`${API_BASE_URL}/api/assignments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
      ]);

      setGrades(gradesRes.data);
      setUpcomingClasses(sessionsRes.data);
      setAssignments(assignmentsRes.data);

      // Fetch student's submission for each assignment
      const submissionPromises = assignmentsRes.data.map(async (assignment) => {
        try {
          const subResponse = await axios.get(`${API_BASE_URL}/api/assignments/${assignment.id}/my-submission`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return { assignmentId: assignment.id, submission: subResponse.data };
        } catch (error) {
          return { assignmentId: assignment.id, submission: null };
        }
      });

      const submissionsData = await Promise.all(submissionPromises);
      const submissionsMap = {};
      submissionsData.forEach(item => {
        submissionsMap[item.assignmentId] = item.submission;
      });
      setMySubmissions(submissionsMap);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Submitting student profile:', studentProfileForm);
      console.log('Token:', token ? 'exists' : 'missing');

      const response = await axios.post(`${API_BASE_URL}/api/students`, studentProfileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile creation response:', response.data);
      toast.success('Profile created successfully!');
      setShowProfileForm(false);
      fetchStudentData();
    } catch (error) {
      console.error('Error creating profile:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to create profile: ${error.response?.data?.error || error.message}`);
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('submission_text', submissionForm.submission_text);
      if (submissionForm.file) {
        formData.append('file', submissionForm.file);
      }

      await axios.post(`${API_BASE_URL}/api/assignments/${selectedAssignment.id}/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Assignment submitted successfully!');
      setShowAssignmentModal(false);
      setSubmissionForm({ submission_text: '', file: null });
      fetchStudentData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
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
            <p className="text-gray-600">Please fill in your student information to continue.</p>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  value={studentProfileForm.student_id}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, student_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., STU001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={studentProfileForm.first_name}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={studentProfileForm.last_name}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={studentProfileForm.date_of_birth}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  required
                  value={studentProfileForm.gender}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                <select
                  required
                  value={studentProfileForm.class_level}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, class_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                  <option value="Form 5">Form 5</option>
                  <option value="Lower Sixth">Lower Sixth</option>
                  <option value="Upper Sixth">Upper Sixth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                <select
                  required
                  value={studentProfileForm.stream}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, stream: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="english">English</option>
                  <option value="french">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                <input
                  type="tel"
                  required
                  value={studentProfileForm.parent_phone}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, parent_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                <input
                  type="email"
                  required
                  value={studentProfileForm.parent_email}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, parent_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={studentProfileForm.address}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                <input
                  type="date"
                  required
                  value={studentProfileForm.admission_date}
                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, admission_date: e.target.value })}
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
                    <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{assignment.title}</p>
                        <p className="text-sm text-gray-600">
                          {assignment.subject_name} • {assignment.teacher_name || 'Teacher'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                        {mySubmissions[assignment.id] ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mySubmissions[assignment.id].status === 'approved' ? 'bg-green-100 text-green-800' :
                            mySubmissions[assignment.id].status === 'rejected' ? 'bg-red-100 text-red-800' :
                            mySubmissions[assignment.id].status === 'graded' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {mySubmissions[assignment.id].status === 'approved' ? '✓ Approved' :
                             mySubmissions[assignment.id].status === 'rejected' ? '✗ Changes Requested' :
                             mySubmissions[assignment.id].status === 'graded' ? `Graded: ${mySubmissions[assignment.id].grade}` :
                             'Submitted'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleViewAssignment(assignment)}
                            className="mt-1 px-3 py-1 bg-blue-800 text-white rounded-lg text-xs hover:bg-blue-900"
                          >
                            View & Submit
                          </button>
                        )}
                      </div>
                    </div>
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

      {/* Assignment View & Submit Modal */}
      {showAssignmentModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{selectedAssignment.title}</h2>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
                  <p className="text-gray-800">{selectedAssignment.subject_name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Teacher</h3>
                  <p className="text-gray-800">{selectedAssignment.teacher_name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Class Level</h3>
                  <p className="text-gray-800">{selectedAssignment.class_level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Stream</h3>
                  <p className="text-gray-800 capitalize">{selectedAssignment.stream}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                  <p className="text-gray-800">{new Date(selectedAssignment.due_date).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Marks</h3>
                  <p className="text-gray-800">{selectedAssignment.total_marks}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedAssignment.description}</p>
                </div>
                {selectedAssignment.file_path && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Attachment</h3>
                    <button
                      onClick={() => handleDownload(selectedAssignment.file_path)}
                      className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download Attachment
                    </button>
                  </div>
                )}
              </div>

              {!mySubmissions[selectedAssignment.id] ? (
                <form onSubmit={handleSubmitAssignment} className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Your Assignment</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Answer (optional)
                      </label>
                      <textarea
                        value={submissionForm.submission_text}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, submission_text: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type your answer here..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or Upload File (optional)
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : (
                        <>
                          <UploadIcon className="h-5 w-5 mr-2" />
                          Submit Assignment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Submission</h3>
                  <div className={`p-4 rounded-lg mb-4 ${
                    mySubmissions[selectedAssignment.id].status === 'approved' ? 'bg-green-50' :
                    mySubmissions[selectedAssignment.id].status === 'rejected' ? 'bg-red-50' :
                    mySubmissions[selectedAssignment.id].status === 'graded' ? 'bg-blue-50' :
                    'bg-amber-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${
                        mySubmissions[selectedAssignment.id].status === 'approved' ? 'text-green-800' :
                        mySubmissions[selectedAssignment.id].status === 'rejected' ? 'text-red-800' :
                        mySubmissions[selectedAssignment.id].status === 'graded' ? 'text-blue-800' :
                        'text-amber-800'
                      }`}>
                        Status: {mySubmissions[selectedAssignment.id].status.charAt(0).toUpperCase() + mySubmissions[selectedAssignment.id].status.slice(1)}
                      </span>
                      {mySubmissions[selectedAssignment.id].grade && (
                        <span className={`font-bold ${
                          mySubmissions[selectedAssignment.id].status === 'approved' ? 'text-green-800' :
                          mySubmissions[selectedAssignment.id].status === 'rejected' ? 'text-red-800' :
                          mySubmissions[selectedAssignment.id].status === 'graded' ? 'text-blue-800' :
                          'text-amber-800'
                        }`}>
                          Grade: {mySubmissions[selectedAssignment.id].grade}
                        </span>
                      )}
                    </div>
                    {mySubmissions[selectedAssignment.id].marks && (
                      <p className={`text-sm mb-2 ${
                        mySubmissions[selectedAssignment.id].status === 'approved' ? 'text-green-700' :
                        mySubmissions[selectedAssignment.id].status === 'rejected' ? 'text-red-700' :
                        mySubmissions[selectedAssignment.id].status === 'graded' ? 'text-blue-700' :
                        'text-amber-700'
                      }`}>
                        Marks: {mySubmissions[selectedAssignment.id].marks} / {selectedAssignment.total_marks}
                      </p>
                    )}
                    {mySubmissions[selectedAssignment.id].feedback && (
                      <p className={`text-sm ${
                        mySubmissions[selectedAssignment.id].status === 'approved' ? 'text-green-700' :
                        mySubmissions[selectedAssignment.id].status === 'rejected' ? 'text-red-700' :
                        mySubmissions[selectedAssignment.id].status === 'graded' ? 'text-blue-700' :
                        'text-amber-700'
                      }`}>
                        <strong>Feedback:</strong> {mySubmissions[selectedAssignment.id].feedback}
                      </p>
                    )}
                  </div>
                  {mySubmissions[selectedAssignment.id].submission_text && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Your Answer</h4>
                      <p className="text-gray-700">{mySubmissions[selectedAssignment.id].submission_text}</p>
                    </div>
                  )}
                  {mySubmissions[selectedAssignment.id].file_path && (
                    <button
                      onClick={() => handleDownload(mySubmissions[selectedAssignment.id].file_path)}
                      className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download Your Submission
                    </button>
                  )}
                  {mySubmissions[selectedAssignment.id].status === 'rejected' && (
                    <button
                      onClick={() => {
                        setShowAssignmentModal(false);
                        handleViewAssignment(selectedAssignment);
                      }}
                      className="mt-4 w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                      Resubmit Assignment
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;