import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  PaperAirplaneIcon,
  ChatIcon,
  UsersIcon,
  SearchIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

const Messaging = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [classLevel, setClassLevel] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [classMessages, setClassMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('private');

  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [typingFrom, setTypingFrom] = useState(null);

  const selectedRef = useRef(null);
  const typingTimer = useRef(null);
  const bottomRef = useRef(null);

  // Keep a ref of the open conversation so socket callbacks (registered once)
  // always see the latest selection without re-subscribing.
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to use messaging.');
      return;
    }

    let userData = {};
    try {
      userData = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (err) {
      console.error('Could not read stored user:', err);
    }
    if (!userData.id) {
      try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        userData = JSON.parse(atob(payload));
      } catch (err) {
        console.error('Could not read token payload:', err);
      }
    }
    setUser(userData);

    const s = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
    setSocket(s);

    s.on('connect', () => {
      setConnected(true);
      s.emit('join', userData.id); // personal room for direct messages
    });
    s.on('disconnect', () => setConnected(false));

    // Someone sent us a direct message.
    s.on('receive_message', (msg) => {
      const sel = selectedRef.current;
      const belongsToOpenThread =
        sel && (String(msg.sender_id) === String(sel.id) || String(msg.receiver_id) === String(sel.id));

      if (belongsToOpenThread) {
        setMessages((prev) =>
          prev.some((m) => String(m.id) === String(msg.id)) ? prev : [...prev, msg]
        );
      }
      if (!sel || String(msg.sender_id) !== String(sel.id)) {
        toast.success(`New message from ${msg.sender_name || 'a contact'}`, { duration: 3000 });
      }
      fetchConversations();
    });

    // Confirmation echoed back to the sender.
    s.on('message_sent', (msg) => {
      const sel = selectedRef.current;
      if (!sel) return;
      if (String(msg.sender_id) === String(sel.id) || String(msg.receiver_id) === String(sel.id)) {
        setMessages((prev) =>
          prev.some((m) => String(m.id) === String(msg.id)) ? prev : [...prev, msg]
        );
      }
    });

    s.on('receive_class_message', (msg) => {
      setClassMessages((prev) =>
        prev.some((m) => String(m.id) === String(msg.id)) ? prev : [...prev, msg]
      );
    });

    // "X is typing…"
    s.on('typing', (data) => {
      const sel = selectedRef.current;
      if (sel && String(data.senderId) === String(sel.id) && data.isTyping) {
        setTypingFrom(data.senderName || 'Someone');
      } else if (sel && String(data.senderId) === String(sel.id) && !data.isTyping) {
        setTypingFrom(null);
      }
    });

    // Real-time live-class invitations (from the "add members" feature).
    s.on('live-invite', (data) => {
      toast.success(`${data.title} is live now — open Live Class to join.`, { duration: 7000 });
    });

    (async () => {
      try {
        const auth = { headers: { Authorization: `Bearer ${token}` } };
        const [usersRes, convRes, studentRes, notifRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/users`, auth),
          axios.get(`${API_BASE_URL}/api/messages/conversations`, auth),
          axios.get(`${API_BASE_URL}/api/students/me`, auth),
          axios.get(`${API_BASE_URL}/api/notifications`, auth)
        ]);

        if (usersRes.status === 'fulfilled') setContacts(usersRes.value.data || []);
        if (convRes.status === 'fulfilled') setConversations(convRes.value.data || []);
        if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data || []);

        if (studentRes.status === 'fulfilled' && studentRes.value.data?.class_level) {
          const lvl = studentRes.value.data.class_level;
          setClassLevel(lvl);
          s.emit('join_class', lvl);
          try {
            const cm = await axios.get(
              `${API_BASE_URL}/api/class-messages/${encodeURIComponent(lvl)}`,
              auth
            );
            setClassMessages(cm.data || []);
          } catch (err) {
            console.error('Could not load class messages:', err);
          }
        }
      } catch (err) {
        console.error('Error loading messaging data:', err);
      }
    })();

    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data || []);
    } catch (err) {
      /* non-fatal */
    }
  };

  const openConversation = async (contact) => {
    setSelected(contact);
    setTypingFrom(null);
    setMessages([]);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/messages/${contact.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
    } catch (err) {
      toast.error('Could not load that conversation.');
    }
  };

  const senderName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'Me';

  const sendMessage = (e) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text || !socket || !user) return;

    if (activeTab === 'private') {
      if (!selected) {
        toast.error('Choose a contact first.');
        return;
      }
      socket.emit('private_message', {
        senderId: user.id,
        receiverId: selected.id,
        message: text,
        senderName
      });
      socket.emit('typing', {
        senderId: user.id,
        receiverId: selected.id,
        senderName,
        isTyping: false
      });
    } else {
      if (!classLevel) {
        toast.error('You are not assigned to a class.');
        return;
      }
      socket.emit('class_message', {
        senderId: user.id,
        classLevel,
        message: text,
        senderName
      });
    }
    setMessageInput('');
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    if (!socket || !user || activeTab !== 'private' || !selected) return;

    socket.emit('typing', {
      senderId: user.id,
      receiverId: selected.id,
      senderName,
      isTyping: true
    });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit('typing', {
        senderId: user.id,
        receiverId: selected.id,
        senderName,
        isTyping: false
      });
    }, 2000);
  };

  const markNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => (n._id === id || n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, classMessages, activeTab, typingFrom]);

  // Contacts sorted by most-recent conversation, with names/last messages.
  const contactRows = useMemo(() => {
    const byId = new Map();
    conversations.forEach((c) => {
      byId.set(String(c.other_user_id), c);
    });
    const rows = contacts.map((c) => {
      const conv = byId.get(String(c.id));
      return {
        ...c,
        last_message: conv?.last_message || null,
        last_message_time: conv?.last_message_time || null
      };
    });
    rows.sort((a, b) => {
      if (a.last_message_time && b.last_message_time) {
        return new Date(b.last_message_time) - new Date(a.last_message_time);
      }
      if (a.last_message_time) return -1;
      if (b.last_message_time) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
    const q = search.trim().toLowerCase();
    return q
      ? rows.filter((r) => `${r.name} ${r.email} ${r.role}`.toLowerCase().includes(q))
      : rows;
  }, [contacts, conversations, search]);

  const displayMessages = activeTab === 'private' ? messages : classMessages;
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time chat for students and teachers
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                {unread} notification{unread === 1 ? '' : 's'}
              </span>
            )}
            <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              connected ? 'bg-teal-100 text-teal-800' : 'bg-gray-200 text-gray-600'
            }`}>
              <span className={`h-2 w-2 rounded-full mr-2 ${connected ? 'bg-teal-600' : 'bg-gray-400'}`} />
              {connected ? 'Connected' : 'Connecting…'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('private')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'private'
                ? 'bg-blue-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChatIcon className="h-5 w-5 mr-2" />
            Direct Messages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('class')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'class'
                ? 'bg-blue-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Class Chat {classLevel ? `(${classLevel})` : ''}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts / conversations */}
          <aside className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search people…"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="max-h-[520px] overflow-y-auto custom-scrollbar divide-y divide-gray-100">
              {contactRows.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No contacts found.
                </div>
              ) : (
                contactRows.map((contact) => {
                  const isActive = selected && String(selected.id) === String(contact.id);
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => openConversation(contact)}
                      className={`w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors ${
                        isActive ? 'bg-teal-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-semibold flex-shrink-0">
                          {(contact.name || contact.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-gray-800 truncate">{contact.name}</p>
                            <span className="text-[10px] uppercase tracking-wide text-gray-400">
                              {contact.role}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {contact.last_message || contact.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Chat thread */}
          <section className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {activeTab === 'private'
                    ? selected ? selected.name : 'Select a conversation'
                    : `Class Chat${classLevel ? ` — ${classLevel}` : ''}`}
                </h2>
                <p className="text-xs text-gray-500">
                  {activeTab === 'private'
                    ? selected ? selected.email : 'Pick someone from the list to start chatting'
                    : classLevel ? 'Everyone in your class sees these messages' : 'Class chat is for students'}
                </p>
              </div>
              {typingFrom && activeTab === 'private' && (
                <span className="text-xs text-teal-700 italic">{typingFrom} is typing…</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50">
              {displayMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                  <ChatIcon className="h-10 w-10 mb-2 text-gray-300" />
                  {activeTab === 'private'
                    ? selected ? 'No messages yet — say hello!' : 'Select a contact to start chatting'
                    : 'No class messages yet.'}
                </div>
              ) : (
                displayMessages.map((message) => {
                  const mine = String(message.sender_id) === String(user?.id);
                  return (
                    <div key={message.id || message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        mine ? 'bg-teal-700 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                      }`}>
                        {!mine && (
                          <p className="text-xs font-semibold mb-1 text-teal-700">
                            {message.sender_name || 'User'}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        <p className={`text-[10px] mt-1 ${mine ? 'text-teal-100' : 'text-gray-400'}`}>
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {mine && <CheckCircleIcon className="inline h-3 w-3 ml-1 -mt-0.5" />}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleTyping}
                  placeholder={
                    activeTab === 'private'
                      ? selected ? `Message ${selected.name}…` : 'Select a contact to message'
                      : classLevel ? 'Message your class…' : 'Class chat unavailable'
                  }
                  disabled={
                    (activeTab === 'private' && !selected) ||
                    (activeTab === 'class' && !classLevel)
                  }
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-3 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
