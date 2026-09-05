import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon, AcademicCapIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/outline';

const ParentPortal = () => {
  const [childData, setChildData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    try {
      const token = localStorage.getItem('token');
      // In a real implementation, you'd fetch the parent's children first
      // For now, we'll use a mock student ID
      const studentId = 1; // This would come from the parent's profile
      
      const [gradesRes, feesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/marks/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/fees/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setGrades(gradesRes.data);
      setFees(feesRes.data);
      setChildData({
        name: 'John Doe',
        studentId: 'STU001',
        class: 'Form 3',
        stream: 'English'
      });
    } catch (error) {
      console.error('Error fetching parent data:', error);
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
          <h1 className="text-3xl font-bold mb-2">Parent Portal</h1>
          <p className="text-blue-100">Monitor your child's academic progress</p>
          
          {childData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Student Name</p>
                <p className="font-semibold">{childData.name}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Student ID</p>
                <p className="font-semibold">{childData.studentId}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Class</p>
                <p className="font-semibold">{childData.class}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-xs text-blue-100">Stream</p>
                <p className="font-semibold">{childData.stream}</p>
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
              <CalendarIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-800">95%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-amber-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Fee Balance</p>
                <p className="text-2xl font-bold text-gray-800">
                  {fees.length > 0 ? fees.reduce((sum, f) => sum + (f.balance || 0), 0).toLocaleString() + ' XAF' : '0 XAF'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{grades.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Grades */}
          <div className="bg-white rounded-xl shadow-md">
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

          {/* Fee Status */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Fee Status</h2>
            </div>
            <div className="p-4">
              {fees.length > 0 ? (
                <div className="space-y-3">
                  {fees.slice(0, 5).map((fee, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{fee.term} Term {fee.year}</p>
                        <p className="text-sm text-gray-600">Due: {new Date(fee.due_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{fee.balance?.toLocaleString() || 0} XAF</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                          fee.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No fee records</p>
              )}
            </div>
          </div>
        </div>

        {/* Communication Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Communicate with Teachers</h2>
          <p className="text-gray-600 mb-4">
            Send messages to your child's teachers directly through our messaging system.
          </p>
          <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
            Go to Messaging
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;