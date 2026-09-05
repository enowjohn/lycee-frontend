import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuIcon, XIcon, UserIcon, AcademicCapIcon, BellIcon } from '@heroicons/react/outline';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'fr' : 'en');

  const navItems = [
    { name: language === 'en' ? 'Home' : 'Accueil', path: '/' },
    { name: language === 'en' ? 'About' : 'À propos', path: '/about' },
    { name: language === 'en' ? 'Academics' : 'Académique', path: '/academics' },
    { name: language === 'en' ? 'Admissions' : 'Admissions', path: '/admissions' },
    { name: language === 'en' ? 'Departments' : 'Départements', path: '/departments' },
    { name: language === 'en' ? 'Assignments' : 'Devoirs', path: '/assignments' },
    { name: language === 'en' ? 'AI Chat' : 'IA Chat', path: '/ai-chat' },
    { name: language === 'en' ? 'Ethics' : 'Éthique', path: '/ethics' },
    { name: language === 'en' ? 'Gallery' : 'Galerie', path: '/gallery' },
    { name: language === 'en' ? 'Contact' : 'Contact', path: '/contact' },
  ];

  const portalItems = [
    { name: language === 'en' ? 'Student Portal' : 'Portail Élève', path: '/student-portal' },
    { name: language === 'en' ? 'Parent Portal' : 'Portail Parent', path: '/parent-portal' },
    { name: language === 'en' ? 'Staff Portal' : 'Portail Personnel', path: '/staff-portal' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-blue-800" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-800">
                  {language === 'en' ? 'Lycée Bilingue' : 'Lycée Bilingue'}
                </span>
                <span className="text-xs text-amber-500 font-semibold">
                  Ombessa
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Portals Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors flex items-center">
                {language === 'en' ? 'Portals' : 'Portails'}
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {portalItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors relative"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            !notification.is_read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`flex-1 ${!notification.is_read ? 'font-semibold' : ''}`}>
                              <p className="text-sm text-gray-800">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-md text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-blue-800 border border-blue-800 hover:bg-blue-50 transition-colors"
              >
                {language === 'en' ? 'Login' : 'Connexion'}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 transition-colors"
              >
                {language === 'en' ? 'Register' : "S'inscrire"}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-md text-sm font-medium text-amber-600 mr-2"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                {language === 'en' ? 'Portals' : 'Portails'}
              </p>
              {portalItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex space-x-2">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="flex-1 block px-3 py-2 rounded-md text-base font-medium text-center text-blue-800 border border-blue-800 hover:bg-blue-50"
              >
                {language === 'en' ? 'Login' : 'Connexion'}
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="flex-1 block px-3 py-2 rounded-md text-base font-medium text-center text-white bg-blue-800 hover:bg-blue-900"
              >
                {language === 'en' ? 'Register' : "S'inscrire"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;