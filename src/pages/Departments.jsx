import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon, MailIcon, PhoneIcon } from '@heroicons/react/outline';

const Departments = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const departments = [
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'arts', name: 'Arts', icon: '🎨' },
    { id: 'ict', name: 'ICT', icon: '💻' },
    { id: 'languages', name: 'Languages', icon: '🌍' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐' },
    { id: 'physical_education', name: 'Physical Education', icon: '⚽' }
  ];

  const filteredTeachers = selectedDepartment === 'all' 
    ? teachers 
    : teachers.filter(t => t.department === selectedDepartment);

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Departments
          </h1>
          <p className="text-xl text-blue-100">
            Meet Our Dedicated Faculty
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Department Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedDepartment === 'all' 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Departments
            </button>
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedDepartment === dept.id 
                    ? 'bg-blue-800 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dept.icon} {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
                <div className="h-48 bg-gradient-to-r from-blue-100 to-amber-100 flex items-center justify-center">
                  {teacher.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/${teacher.photo}`}
                      alt={teacher.first_name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
                      <UserIcon className="h-16 w-16 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {teacher.first_name} {teacher.last_name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{teacher.subject}</p>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {teacher.department}
                  </span>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MailIcon className="h-4 w-4 mr-2" />
                      <span>{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {teacher.qualification && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Qualification:</span> {teacher.qualification}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No teachers found in this department
            </div>
          )}
        </div>

        {/* Department Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-xl p-6 shadow-md card-hover">
              <div className="text-4xl mb-4">{dept.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{dept.name}</h3>
              <p className="text-gray-600 text-sm">
                Dedicated to providing excellence in {dept.name.toLowerCase()} education with experienced faculty and modern resources.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;