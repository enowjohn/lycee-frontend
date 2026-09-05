import { useState } from 'react';
import axios from 'axios';
import { 
  MailIcon, 
  PhoneIcon, 
  LocationMarkerIcon, 
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

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
      await axios.post('http://localhost:5000/api/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: LocationMarkerIcon,
      title: 'Address',
      content: '123 Education Street, Obessa, Cameroon',
      color: 'text-blue-600'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '+237 123 456 789',
      color: 'text-green-600'
    },
    {
      icon: MailIcon,
      title: 'Email',
      content: 'info@lycee-obessa.com',
      color: 'text-amber-600'
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      content: 'Mon - Fri: 7:30 AM - 4:30 PM',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Contact Us
          </h1>
          <p className="text-xl text-blue-100">
            Get in Touch with Lycée Bilingue Obessa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your message here..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 card-hover">
                  <info.icon className={`h-8 w-8 ${info.color} mb-3`} />
                  <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                  <p className="text-gray-600 text-sm">{info.content}</p>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Find Us on the Map</h3>
              </div>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.7514738334577!2d11.5024!3d3.8488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7d6e1234567%3A0x123456789abcdef!2sObessa%2C%20Cameroon!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lycée Bilingue Obessa Location"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">General Inquiries</h3>
            <p className="text-gray-600 text-sm mb-4">
              For general questions about admissions, programs, or school activities
            </p>
            <a href="mailto:info@lycee-obessa.com" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              info@lycee-obessa.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Admissions Office</h3>
            <p className="text-gray-600 text-sm mb-4">
              For admission applications, requirements, and enrollment procedures
            </p>
            <a href="tel:+237123456789" className="text-green-600 hover:text-green-800 text-sm font-medium">
              +237 123 456 789
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Office Hours</h3>
            <p className="text-gray-600 text-sm mb-4">
              Monday - Friday: 7:30 AM - 4:30 PM
            </p>
            <p className="text-gray-600 text-sm">
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'What are the admission requirements?',
                answer: 'Students must provide previous school reports, birth certificate, and complete the application form. Entrance examinations may be required for certain grade levels.'
              },
              {
                question: 'What curriculum do you follow?',
                answer: 'We offer both English and French streams, following international and national curricula respectively, preparing students for various examinations.'
              },
              {
                question: 'Do you offer scholarships?',
                answer: 'Yes, we offer merit-based scholarships to outstanding students. Contact our admissions office for more information on eligibility and application procedures.'
              },
              {
                question: 'What extracurricular activities are available?',
                answer: 'We offer sports, cultural activities, clubs, and academic enrichment programs to support holistic development.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;