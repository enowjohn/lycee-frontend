import { useState, useEffect } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon, MailIcon, CheckIcon, ChatIcon, UsersIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const Messaging = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [classMessages, setClassMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('private'); // 'private' or 'class'
  
  const [composeForm, setComposeForm] = useState({
    receiver_id: '',
    message: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);
        
        // Connect to Socket.io
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        
        // Join user's personal room
        newSocket.emit('join', userData.id);
        
        // Join class room if student
        if (userData.class_level) {
          newSocket.emit('join_class', userData.class_level);
        }
        
        // Listen for private messages
        newSocket.on('receive_message', (message) => {
          setMessages(prev => [...prev, message]);
          toast.success(`New message from ${message.sender_name}`);
        });
        
        // Listen for class messages
        newSocket.on('receive_class_message', (message) => {
          setClassMessages(prev => [...prev, message]);
          toast.success(`New class message from ${message.sender_name}`);
        });
        
        // Listen for message confirmation
        newSocket.on('message_sent', (message) => {
          setMessages(prev => [...prev, message]);
        });
        
        fetchMessages();
        fetchNotifications();
        if (userData.class_level) {
          fetchClassMessages(userData.class_level);
        }
        
        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Fetch messages for each conversation
      for (const conv of response.data) {
        const msgResponse = await axios.get(`http://localhost:5000/api/messages/${conv.other_user_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(prev => [...prev, ...msgResponse.data]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchClassMessages = async (classLevel) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/class-messages/${classLevel}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassMessages(response.data);
    } catch (error) {
      console.error('Error fetching class messages:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !messageInput.trim()) return;
    
    const senderName = `${user.first_name} ${user.last_name}`;
    
    if (activeTab === 'private' && selectedConversation) {
      socket.emit('private_message', {
        senderId: user.id,
        receiverId: selectedConversation,
        message: messageInput,
        senderName
      });
    } else if (activeTab === 'class' && user.class_level) {
      socket.emit('class_message', {
        senderId: user.id,
        classLevel: user.class_level,
        message: messageInput,
        senderName
      });
    }
    
    setMessageInput('');
  };

  const handleComposeMessage = async (e) => {
    e.preventDefault();
    if (!socket) return;
    
    const senderName = `${user.first_name} ${user.last_name}`;
    socket.emit('private_message', {
      senderId: user.id,
      receiverId: composeForm.receiver_id,
      message: composeForm.message,
      senderName
    });
    
    toast.success('Message sent successfully');
    setShowCompose(false);
    setComposeForm({ receiver_id: '', message: '' });
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

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Messaging</h1>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            New Message
          </button>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Message</h2>
            <form onSubmit={handleComposeMessage}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient ID</label>
                  <input
                    type="text"
                    required
                    value={composeForm.receiver_id}
                    onChange={(e) => setComposeForm({...composeForm, receiver_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    value={composeForm.message}
                    onChange={(e) => setComposeForm({...composeForm, message: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('private')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'private' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChatIcon className="h-5 w-5 mr-2" />
            Private Messages
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'class' ? 'bg-blue-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Class Chat {user?.class_level && `(${user.class_level})`}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Panel */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <MailIcon className="h-5 w-5 mr-2 text-blue-800" />
                Notifications
              </h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${
                        !notification.is_read ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                            notification.type === 'exam' ? 'bg-red-100 text-red-800' :
                            notification.type === 'event' ? 'bg-green-100 text-green-800' :
                            notification.type === 'grade' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.type}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === 'private' ? 'Private Chat' : `Class Chat - ${user?.class_level || 'N/A'}`}
              </h2>
            </div>
            
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {activeTab === 'private' ? (
                messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id 
                          ? 'bg-blue-800 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm font-medium mb-1">{message.sender_name}</p>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start a conversation!
                  </div>
                )
              ) : (
                classMessages.length > 0 ? (
                  classMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id 
                          ? 'bg-blue-800 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm font-medium mb-1">{message.sender_name}</p>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No class messages yet. Start the conversation!
                  </div>
                )
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;