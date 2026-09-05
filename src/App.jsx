import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Departments from './pages/Departments';
import StudentManagement from './pages/StudentManagement';
import ReportCard from './pages/ReportCard';
import Messaging from './pages/Messaging';
import LiveClass from './pages/LiveClass';
import ParentPortal from './pages/ParentPortal';
import StudentPortal from './pages/StudentPortal';
import StaffPortal from './pages/StaffPortal';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Ethics from './pages/Ethics';
import Assignments from './pages/Assignments';
import AIChat from './pages/AIChat';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/report-card" element={<ReportCard />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/live-class" element={<LiveClass />} />
          <Route path="/parent-portal" element={<ParentPortal />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/staff-portal" element={<StaffPortal />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ethics" element={<Ethics />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;