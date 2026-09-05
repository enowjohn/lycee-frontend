import { useState } from 'react';
import { AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

const Admissions = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    previous_school: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    address: '',
    stream_preference: 'english',
    class_level: ''
  });
  const [loading, setLoading] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/applications', formData);
      setApplicationNumber(response.data.application_number);
      toast.success('Application submitted successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        previous_school: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        address: '',
        stream_preference: 'english',
        class_level: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    const appNumber = prompt('Enter your application number:');
    if (appNumber) {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/${appNumber}`);
        alert(`Application Status: ${response.data.status}`);
      } catch (error) {
        toast.error('Application not found');
      }
    }
  };

  const requirements = [
    'Completed application form',
    'Birth certificate',
    'Previous school reports',
    'Parent/guardian ID',
    'Passport-size photographs',
    'Medical certificate'
  ];

  const feeStructure = [
    { level: 'Form 1-3', fee: '500,000 XAF' },
    { level: 'Form 4-5', fee: '550,000 XAF' },
    { level: 'Lower Sixth', fee: '600,000 XAF' },
    { level: 'Upper Sixth', fee: '650,000 XAF' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Admissions
          </h1>
          <p className="text-xl text-blue-100">
            Join Our Community of Excellence
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Application Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Online Application</h2>
            
            {applicationNumber ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-800">Application Submitted!</h3>
                    <p className="text-green-700">Your application number: <strong>{applicationNumber}</strong></p>
                    <p className="text-sm text-green-600 mt-1">Please save this number for tracking.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      required
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                    <input
                      type="text"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stream Preference</label>
                    <select
                      name="stream_preference"
                      required
                      value={formData.stream_preference}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                    <input
                      type="text"
                      name="class_level"
                      required
                      value={formData.class_level}
                      onChange={handleChange}
                      placeholder="e.g., Form 1, 6ème"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                    <input
                      type="text"
                      name="parent_name"
                      required
                      value={formData.parent_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                    <input
                      type="tel"
                      name="parent_phone"
                      required
                      value={formData.parent_phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                    <input
                      type="email"
                      name="parent_email"
                      required
                      value={formData.parent_email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}

            <button
              onClick={checkStatus}
              className="w-full mt-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              Check Application Status
            </button>
          </div>

          {/* Requirements & Fees */}
          <div className="space-y-8">
            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-blue-800 mr-2" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Structure */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fee Structure</h3>
              <div className="space-y-3">
                {feeStructure.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">{item.level}</span>
                    <span className="font-semibold text-blue-800">{item.fee}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Fees are per academic year and subject to change
              </p>
            </div>

            {/* Scholarships */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Scholarships Available</h3>
              <p className="text-gray-700 mb-4">
                We offer merit-based scholarships to outstanding students. Contact our admissions office for more information.
              </p>
              <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;