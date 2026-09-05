import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  DownloadIcon, 
  UploadIcon,
  CheckCircleIcon,
  ClockIcon,
  XIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [createForm, setCreateForm] = useState({
    teacher_name: '',
    subject_name: '',
    subject_id: '',
    class_level: 'Form 1',
    stream: 'science',
    title: '',
    description: '',
    due_date: '',
    total_marks: 100,
    file: null
  });

  const [editForm, setEditForm] = useState({
    teacher_name: '',
    subject_name: '',
    subject_id: '',
    class_level: 'Form 1',
    stream: 'science',
    title: '',
    description: '',
    due_date: '',
    total_marks: 100,
    file: null
  });

  const [gradingForm, setGradingForm] = useState({
    submission_id: '',
    marks: '',
    grade: '',
    feedback: '',
    status: 'approved'
  });

  const [submissionForm, setSubmissionForm] = useState({
    submission_text: '',
    file: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);
        if (userData.role === 'teacher') {
          fetchTeacherAssignments();
        } else if (userData.role === 'student') {
          fetchStudentAssignments();
        } else {
          // Default to student view if role is unclear
          fetchStudentAssignments();
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTeacherAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignments/teacher', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('teacher_name', createForm.teacher_name);
    formData.append('subject_name', createForm.subject_name);
    formData.append('subject_id', createForm.subject_id);
    formData.append('class_level', createForm.class_level);
    formData.append('stream', createForm.stream);
    formData.append('title', createForm.title);
    formData.append('description', createForm.description);
    formData.append('due_date', createForm.due_date);
    formData.append('total_marks', createForm.total_marks);
    if (createForm.file) {
      formData.append('file', createForm.file);
    }

    try {
      await axios.post('http://localhost:5000/api/assignments', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Assignment created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        teacher_name: '',
        subject_name: '',
        subject_id: '',
        class_level: 'Form 1',
        stream: 'science',
        title: '',
        description: '',
        due_date: '',
        total_marks: 100,
        file: null
      });
      fetchTeacherAssignments();
    } catch (error) {
      toast.error('Failed to create assignment');
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(`http://localhost:5000/api/assignments/${selectedAssignment.id}/grade`, gradingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Submission updated successfully!');
      setGradingForm({ submission_id: '', marks: '', grade: '', feedback: '', status: 'approved' });
      fetchSubmissions(selectedAssignment.id);
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setEditForm({
      teacher_name: assignment.teacher_name,
      subject_name: assignment.subject_name,
      subject_id: assignment.subject_id || '',
      class_level: assignment.class_level,
      stream: assignment.stream,
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      total_marks: assignment.total_marks,
      file: null
    });
    setShowEditModal(true);
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('teacher_name', editForm.teacher_name);
    formData.append('subject_name', editForm.subject_name);
    formData.append('subject_id', editForm.subject_id);
    formData.append('class_level', editForm.class_level);
    formData.append('stream', editForm.stream);
    formData.append('title', editForm.title);
    formData.append('description', editForm.description);
    formData.append('due_date', editForm.due_date);
    formData.append('total_marks', editForm.total_marks);
    if (editForm.file) {
      formData.append('file', editForm.file);
    }

    try {
      await axios.put(`http://localhost:5000/api/assignments/${selectedAssignment.id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Assignment updated successfully!');
      setShowEditModal(false);
      fetchTeacherAssignments();
    } catch (error) {
      toast.error('Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Assignment deleted successfully!');
      fetchTeacherAssignments();
    } catch (error) {
      toast.error('Failed to delete assignment');
    }
  };

  const handleDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/uploads/${filePath}`;
    link.download = filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitAssignment = async (assignmentId) => {
    setSelectedAssignment(assignments.find(a => a.id === assignmentId));
    setSubmissionForm({ submission_text: '', file: null });
    setShowSubmitModal(true);
  };

  const handleConfirmSubmission = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('submission_text', submissionForm.submission_text);
    if (submissionForm.file) {
      formData.append('file', submissionForm.file);
    }

    try {
      await axios.post(`http://localhost:5000/api/assignments/${selectedAssignment.id}/submit`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Assignment submitted successfully!');
      setShowSubmitModal(false);
      fetchStudentAssignments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit assignment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {user?.role === 'teacher' ? 'Manage Assignments' : 'My Assignments'}
              </h1>
              <p className="text-xl text-blue-100">
                {user?.role === 'teacher' ? 'Create and grade student assignments' : 'View and submit your assignments'}
              </p>
            </div>
            {(user?.role === 'teacher' || !user) && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Assignment
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No assignments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">
                        {assignment.subject_name || assignment.subject_name || 'Subject'} • {assignment.teacher_name || 'Teacher'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.stream === 'science' ? 'bg-blue-100 text-blue-800' :
                      assignment.stream === 'art' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assignment.stream}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium w-24">Class:</span>
                      <span>{assignment.class_level}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-24">Marks:</span>
                      <span>{assignment.total_marks}</span>
                    </div>
                  </div>

                  {assignment.file_path && (
                    <button
                      onClick={() => handleDownload(assignment.file_path)}
                      className="w-full mb-3 flex items-center justify-center px-4 py-2 border border-blue-800 text-blue-800 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download Attachment
                    </button>
                  )}

                  {user?.role === 'teacher' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          fetchSubmissions(assignment.id);
                          setShowSubmissionsModal(true);
                        }}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
                      >
                        View Submissions ({assignment.submission_count || 0})
                      </button>
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {user?.role === 'student' && (
                    <button
                      onClick={() => handleSubmitAssignment(assignment.id)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Create New Assignment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.teacher_name}
                    onChange={(e) => setCreateForm({ ...createForm, teacher_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.subject_name}
                    onChange={(e) => setCreateForm({ ...createForm, subject_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject ID</label>
                  <input
                    type="number"
                    value={createForm.subject_id}
                    onChange={(e) => setCreateForm({ ...createForm, subject_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject ID (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                  <select
                    value={createForm.class_level}
                    onChange={(e) => setCreateForm({ ...createForm, class_level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Form 5">Form 5</option>
                    <option value="Lower Sixth">Lower Sixth</option>
                    <option value="Upper Sixth">Upper Sixth</option>
                    <option value="LSS">LSS</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <select
                    value={createForm.stream}
                    onChange={(e) => setCreateForm({ ...createForm, stream: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="science">Science</option>
                    <option value="art">Art</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={createForm.due_date}
                    onChange={(e) => setCreateForm({ ...createForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={createForm.total_marks}
                    onChange={(e) => setCreateForm({ ...createForm, total_marks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach PDF (optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCreateForm({ ...createForm, file: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit Assignment</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateAssignment} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.teacher_name}
                    onChange={(e) => setEditForm({ ...editForm, teacher_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.subject_name}
                    onChange={(e) => setEditForm({ ...editForm, subject_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject ID</label>
                  <input
                    type="number"
                    value={editForm.subject_id}
                    onChange={(e) => setEditForm({ ...editForm, subject_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                  <select
                    value={editForm.class_level}
                    onChange={(e) => setEditForm({ ...editForm, class_level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Form 5">Form 5</option>
                    <option value="Lower Sixth">Lower Sixth</option>
                    <option value="Upper Sixth">Upper Sixth</option>
                    <option value="LSS">LSS</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <select
                    value={editForm.stream}
                    onChange={(e) => setEditForm({ ...editForm, stream: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="science">Science</option>
                    <option value="art">Art</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={editForm.due_date}
                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={editForm.total_marks}
                    onChange={(e) => setEditForm({ ...editForm, total_marks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach PDF (optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Update Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Submit Assignment</h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-600">{selectedAssignment.description}</p>
                {selectedAssignment.file_path && (
                  <button
                    onClick={() => handleDownload(selectedAssignment.file_path)}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Download Assignment PDF
                  </button>
                )}
              </div>
              <form onSubmit={handleConfirmSubmission}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer (type directly or upload PDF)
                  </label>
                  <textarea
                    value={submissionForm.submission_text}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, submission_text: e.target.value })}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your answer here..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Upload PDF (optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Submit Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Submissions - {selectedAssignment.title}
              </h2>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No submissions yet
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {submission.student_first_name} {submission.student_last_name}
                          </h3>
                          <p className="text-sm text-gray-500">{submission.student_id}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                          submission.status === 'late' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      {submission.submission_text && (
                        <p className="text-gray-600 text-sm mb-3">{submission.submission_text}</p>
                      )}
                      
                      {submission.file_path && (
                        <button
                          onClick={() => handleDownload(submission.file_path)}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm mb-3"
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download Submission
                        </button>
                      )}
                      
                      {submission.status === 'graded' ? (
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-green-800">Grade: {submission.grade}</span>
                            <span className="text-green-800">Marks: {submission.marks}</span>
                          </div>
                          {submission.feedback && (
                            <p className="text-sm text-green-700">{submission.feedback}</p>
                          )}
                        </div>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          setGradingForm({ ...gradingForm, submission_id: submission.id });
                          handleGradeSubmission(e);
                        }} className="mt-3 pt-3 border-t border-gray-200">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => setGradingForm({ ...gradingForm, submission_id: submission.id, status: 'approved' })}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  gradingForm.submission_id === submission.id && gradingForm.status === 'approved'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                ✓ Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => setGradingForm({ ...gradingForm, submission_id: submission.id, status: 'rejected' })}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  gradingForm.submission_id === submission.id && gradingForm.status === 'rejected'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                ✗ Request Changes
                              </button>
                              <button
                                type="button"
                                onClick={() => setGradingForm({ ...gradingForm, submission_id: submission.id, status: 'failed' })}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  gradingForm.submission_id === submission.id && gradingForm.status === 'failed'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                ✗ Fail
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="number"
                              placeholder="Marks"
                              required
                              value={gradingForm.submission_id === submission.id ? gradingForm.marks : ''}
                              onChange={(e) => setGradingForm({ ...gradingForm, submission_id: submission.id, marks: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Grade (A-F)"
                              required
                              value={gradingForm.submission_id === submission.id ? gradingForm.grade : ''}
                              onChange={(e) => setGradingForm({ ...gradingForm, submission_id: submission.id, grade: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <textarea
                            placeholder="Feedback (required for rejected/failed)"
                            value={gradingForm.submission_id === submission.id ? gradingForm.feedback : ''}
                            onChange={(e) => setGradingForm({ ...gradingForm, submission_id: submission.id, feedback: e.target.value })}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-3"
                          />
                          <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Update Submission
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
