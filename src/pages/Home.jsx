import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UsersIcon, 
  BookOpenIcon, 
  CalendarIcon,
  ChevronRightIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/outline';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    sessions: 0
  });
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
      title: 'Excellence in Bilingual Education',
      subtitle: 'Preparing leaders for tomorrow'
    },
    {
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
      title: 'Modern Learning Environment',
      subtitle: 'State-of-the-art facilities'
    },
    {
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200',
      title: 'Comprehensive Curriculum',
      subtitle: 'English & French streams'
    }
  ];

  useEffect(() => {
    fetchStats();
    fetchAnnouncements();
    fetchEvents();
    
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(bannerInterval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color} mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          ))}
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fadeIn">
              Lycée Bilingue Ombessa
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2 animate-fadeIn">
              Excellence in Education
            </p>
            <p className="text-lg text-amber-300 mb-8 animate-fadeIn">
              {banners[currentBanner].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
              <Link
                to="/admissions"
                className="px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Banner Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? 'bg-amber-500' : 'bg-white opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2026 Theme Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-900 via-blue-800 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white border-opacity-20">
            <div className="flex items-center justify-center mb-4">
              <span className="px-4 py-2 bg-amber-500 text-white rounded-full font-bold text-sm uppercase tracking-wider">
                Thème 2026
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-4 leading-tight">
              Transformation numérique et Intelligence Artificielle pour une gouvernance inclusive et des enseignements-apprentissages de qualité dans un environnement sain et protecteur
            </h2>
            <p className="text-lg text-blue-100 text-center mb-6">
              Digital Transformation and Artificial Intelligence for Inclusive Governance and Quality Teaching-Learning in a Healthy and Protective Environment
            </p>
            <div className="flex justify-center">
              <Link
                to="/ethics"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Learn More
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={UsersIcon}
              label="Students"
              value={stats.students}
              color="bg-blue-600"
            />
            <StatCard
              icon={AcademicCapIcon}
              label="Teachers"
              value={stats.teachers}
              color="bg-amber-500"
            />
            <StatCard
              icon={BookOpenIcon}
              label="Subjects"
              value={stats.subjects}
              color="bg-green-500"
            />
            <StatCard
              icon={CalendarIcon}
              label="Live Sessions"
              value={stats.sessions}
              color="bg-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Student Portal',
                description: 'Access assignments, grades, and live classes',
                icon: UsersIcon,
                color: 'bg-blue-100 text-blue-600',
                link: '/student-portal'
              },
              {
                title: 'Parent Portal',
                description: 'Monitor your child progress and communicate',
                icon: AcademicCapIcon,
                color: 'bg-amber-100 text-amber-600',
                link: '/parent-portal'
              },
              {
                title: 'Staff Portal',
                description: 'Manage classes, grades, and resources',
                icon: BookOpenIcon,
                color: 'bg-green-100 text-green-600',
                link: '/staff-portal'
              }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="bg-gray-50 rounded-xl p-6 card-hover hover:shadow-lg"
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${item.color} mb-4`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Access Portal</span>
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Latest Announcements
            </h2>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </Link>
          </div>
          
          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-xl shadow-md p-6 card-hover">
                  <div className="flex items-center mb-3">
                    <StarIcon className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-xs font-semibold text-amber-600 uppercase">
                      {announcement.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No announcements at this time
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Upcoming Events
            </h2>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
              View Calendar
            </Link>
          </div>
          
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-xl p-6 flex items-center card-hover">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-800 rounded-lg flex flex-col items-center justify-center text-white mr-6">
                    <span className="text-2xl font-bold">
                      {new Date(event.event_date).getDate()}
                    </span>
                    <span className="text-xs uppercase">
                      {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{event.event_time}</span>
                      {event.location && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming events scheduled
            </div>
          )}
        </div>
      </section>

      {/* Campus Gallery Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Campus Life
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our vibrant campus community through photos and videos
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
              'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400',
              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
              'https://images.unsplash.com/photo-1562774053-701939374585?w=400'
            ].map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg aspect-square">
                <img
                  src={image}
                  alt={`Campus ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              View Full Gallery
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Apply now for the upcoming academic year and become part of our excellence
          </p>
          <Link
            to="/admissions"
            className="inline-flex items-center px-8 py-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-lg"
          >
            Start Your Application
            <ChevronRightIcon className="h-6 w-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;