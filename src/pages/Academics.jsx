import { useState, useEffect } from 'react';
import { BookOpenIcon, DownloadIcon, FilterIcon } from '@heroicons/react/outline';
import axios from 'axios';

const Academics = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    if (selectedStream !== 'all' && subject.stream !== selectedStream && subject.stream !== 'both') return false;
    if (selectedLevel !== 'all' && subject.class_level !== selectedLevel) return false;
    return true;
  });

  const curriculum = {
    science: {
      title: 'Science Stream',
      description: 'Following the science curriculum with focus on STEM subjects',
      levels: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Lower Sixth', 'Upper Sixth', 'LSS'],
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Further Mathematics', 'Statistics']
    },
    art: {
      title: 'Art Stream',
      description: 'Following the arts curriculum with focus on humanities and social sciences',
      levels: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Lower Sixth', 'Upper Sixth', 'USA'],
      subjects: ['English Language', 'English Literature', 'French', 'History', 'Geography', 'Economics', 'Philosophy', 'Sociology']
    }
  };

  const examSchedule = [
    { term: 'First Term', period: 'November - December', type: 'Continuous Assessment' },
    { term: 'Second Term', period: 'March - April', type: 'Mid-Term Examinations' },
    { term: 'Third Term', period: 'May - June', type: 'Final Examinations' }
  ];

  const resources = [
    { name: 'Student Handbook', type: 'PDF', size: '2.5 MB', content: 'STUDENT HANDBOOK - LYCÉE BILINGUE OMBESSA\n\nTable of Contents:\n1. School Rules and Regulations\n2. Academic Policies\n3. Attendance Requirements\n4. Code of Conduct\n5. Examination Guidelines\n6. Extracurricular Activities\n7. School Services\n8. Contact Information\n\nFor more information, please contact the school administration.' },
    { name: 'Curriculum Guide', type: 'PDF', size: '1.8 MB', content: 'CURRICULUM GUIDE - LYCÉE BILINGUE OMBESSA\n\nEnglish Stream:\n- Form 1-5: Following international curriculum\n- Lower Sixth-Upper Sixth: Advanced level preparation\n\nFrench Stream:\n- 6ème-Terminale: Following national French curriculum\n\nCore Subjects:\n- Mathematics, English/French Language, Sciences\n- Social Studies, ICT, Physical Education\n\nFor detailed subject information, contact the academic office.' },
    { name: 'Exam Regulations', type: 'PDF', size: '0.5 MB', content: 'EXAMINATION REGULATIONS - LYCÉE BILINGUE OMBESSA\n\n1. Examination Schedule\n2. Rules During Examinations\n3. Prohibited Items\n4. Academic Integrity Policy\n5. Malpractice Penalties\n6. Special Accommodations\n7. Results Publication\n\nAll students must adhere to these regulations. Violations will result in disciplinary action.' },
    { name: 'Academic Calendar 2024-2025', type: 'PDF', size: '0.8 MB', content: 'ACADEMIC CALENDAR 2024-2025\n\nFirst Term:\n- September 2 - December 20\n- Mid-term break: October 21-25\n- Exams: December 9-20\n\nSecond Term:\n- January 6 - March 28\n- Mid-term break: February 17-21\n- Exams: March 17-28\n\nThird Term:\n- April 14 - June 30\n- Exams: June 16-30\n\nSchool holidays and events are marked in the full calendar.' }
  ];

  const handleDownload = (resource) => {
    // Create a text file with the content
    const blob = new Blob([resource.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Academics
          </h1>
          <p className="text-xl text-blue-100">
            Excellence in Bilingual Education
          </p>
        </div>
      </div>

      {/* Curriculum Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Curriculum Overview
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(curriculum).map(([stream, data]) => (
              <div key={stream} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <BookOpenIcon className="h-8 w-8 text-blue-800 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">{data.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{data.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Class Levels</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.levels.map((level) => (
                      <span key={level} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Core Subjects</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {data.subjects.map((subject) => (
                      <div key={subject} className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 text-sm">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Available Subjects
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Streams</option>
              <option value="science">Science</option>
              <option value="art">Art</option>
              <option value="both">Both</option>
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-xl p-6 shadow-md card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{subject.code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subject.stream === 'science' ? 'bg-blue-100 text-blue-800' :
                    subject.stream === 'art' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {subject.stream}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                {subject.class_level && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Level:</span>
                    <span className="ml-2">{subject.class_level}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Teaching Methodology
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interactive Learning',
                description: 'Engaging students through discussions, group work, and hands-on activities'
              },
              {
                title: 'Technology Integration',
                description: 'Using digital tools and online resources to enhance learning experiences'
              },
              {
                title: 'Personalized Attention',
                description: 'Small class sizes allow for individualized support and guidance'
              },
              {
                title: 'Assessment for Learning',
                description: 'Continuous assessment to monitor progress and provide feedback'
              },
              {
                title: 'Critical Thinking',
                description: 'Encouraging analysis, problem-solving, and independent thought'
              },
              {
                title: 'Bilingual Approach',
                description: 'Seamlessly integrating both languages for true bilingual proficiency'
              }
            ].map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 card-hover">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{method.title}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Schedule */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Examination Schedule
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Term</th>
                    <th className="px-6 py-4 text-left font-semibold">Period</th>
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {examSchedule.map((exam, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-6 py-4 font-medium text-gray-800">{exam.term}</td>
                      <td className="px-6 py-4 text-gray-600">{exam.period}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                          {exam.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Downloadable Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 card-hover">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <DownloadIcon className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{resource.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{resource.type}</span>
                  <span>{resource.size}</span>
                </div>
                <button 
                  onClick={() => handleDownload(resource)}
                  className="mt-4 w-full px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;