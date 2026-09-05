import { useState, useEffect, useRef } from 'react';
import { 
  VideoCameraIcon, 
  MicrophoneIcon, 
  PhoneIcon, 
  DesktopComputerIcon,
  HandIcon,
  ChatIcon,
  UsersIcon,
  XIcon
} from '@heroicons/react/outline';
import io from 'socket.io-client';

const LiveClass = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [showPolls, setShowPolls] = useState(false);
  const [polls, setPolls] = useState([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });
  const [raisedHands, setRaisedHands] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketRef.current.on('session-message', (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    socketRef.current.on('raise-hand', (data) => {
      console.log('Hand raised:', data);
    });

    socketRef.current.on('screen-share', (data) => {
      console.log('Screen share:', data);
    });

    socketRef.current.on('new-poll', (data) => {
      setPolls(prev => [...prev, { ...data, id: Date.now() }]);
    });

    socketRef.current.on('poll-response', (data) => {
      setPolls(prev => prev.map(poll => {
        if (poll.id === data.pollId) {
          return {
            ...poll,
            responses: [...(poll.responses || []), data]
          };
        }
        return poll;
      }));
    });

    socketRef.current.on('hand-raised', (data) => {
      setRaisedHands(prev => {
        if (data.isRaised) {
          return [...prev, data];
        } else {
          return prev.filter(h => h.userId !== data.userId);
        }
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinSession = async () => {
    if (sessionId && socketRef.current) {
      socketRef.current.emit('join-session', sessionId);
      
      // Get local media stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Store stream for later use
        localStreamRef.current = stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access camera/microphone. Please ensure permissions are granted.');
      }
    }
  };

  const leaveSession = () => {
    if (sessionId && socketRef.current) {
      socketRef.current.emit('leave-session', sessionId);
      setSessionId('');
      
      // Stop local media stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false
        });
        setIsScreenSharing(true);
        // In a real implementation, you would send this stream to the peer connection
      } else {
        setIsScreenSharing(false);
        // Stop screen sharing
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    if (socketRef.current && sessionId) {
      socketRef.current.emit('raise-hand', {
        sessionId,
        userId: 'current-user-id',
        isRaised: !isHandRaised
      });
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current && sessionId) {
      const message = {
        sessionId,
        userId: 'current-user-id',
        userName: 'You',
        message: messageInput,
        timestamp: new Date().toISOString()
      };
      socketRef.current.emit('session-message', message);
      setChatMessages(prev => [...prev, message]);
      setMessageInput('');
    }
  };

  const createPoll = () => {
    if (newPoll.question && newPoll.options.filter(o => o).length >= 2 && socketRef.current && sessionId) {
      const poll = {
        sessionId,
        question: newPoll.question,
        options: newPoll.options.filter(o => o),
        createdBy: 'current-user-id',
        timestamp: new Date().toISOString()
      };
      socketRef.current.emit('new-poll', poll);
      setPolls(prev => [...prev, { ...poll, id: Date.now() }]);
      setNewPoll({ question: '', options: ['', ''] });
      setShowCreatePoll(false);
    }
  };

  const respondToPoll = (pollId, optionIndex) => {
    if (socketRef.current && sessionId) {
      socketRef.current.emit('poll-response', {
        sessionId,
        pollId,
        optionIndex,
        userId: 'current-user-id',
        userName: 'You'
      });
    }
  };

  const addPollOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const endCall = () => {
    leaveSession();
    // In a real implementation, you would close all peer connections
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Live Classroom</h1>
          {sessionId && (
            <span className="px-3 py-1 bg-green-600 rounded-full text-sm">
              Connected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>{participants.length + 1}</span>
          </div>
          {sessionId && (
            <>
              <button
                onClick={() => setShowPolls(!showPolls)}
                className="p-2 hover:bg-gray-700 rounded-lg relative"
                title="Polls"
              >
                <span className="text-white font-semibold">📊</span>
                {polls.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {polls.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowCreatePoll(true)}
                className="p-2 hover:bg-gray-700 rounded-lg"
                title="Create Poll"
              >
                <span className="text-white font-semibold">➕</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {showChat ? <XIcon className="h-5 w-5" /> : <ChatIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {!sessionId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  Join a Class Session
                </h2>
                <input
                  type="text"
                  placeholder="Enter Session ID"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={joinSession}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Join Session
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Remote Video (Teacher/Main) */}
              <div className="flex-1 bg-black relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                  Teacher's Screen
                </div>
              </div>

              {/* Local Video (Self) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  You
                </div>
              </div>
            </>
          )}

          {/* Control Bar */}
          {sessionId && (
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}
              >
                <MicrophoneIcon className={`h-6 w-6 ${isMuted ? 'text-white' : 'text-white'}`} />
              </button>
              
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}
              >
                <VideoCameraIcon className={`h-6 w-6 ${isVideoOff ? 'text-white' : 'text-white'}`} />
              </button>
              
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}
              >
                <DesktopComputerIcon className="h-6 w-6 text-white" />
              </button>
              
              <button
                onClick={toggleHandRaise}
                className={`p-3 rounded-full ${isHandRaised ? 'bg-amber-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}
              >
                <HandIcon className="h-6 w-6 text-white" />
              </button>
              
              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                <PhoneIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {chatMessages.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-blue-400 text-sm font-medium">
                      {msg.userName}
                    </span>
                    <p className="text-white text-sm">{msg.message}</p>
                    <span className="text-gray-500 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Polls Panel */}
        {showPolls && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Polls & Quizzes</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {polls.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">
                  No active polls
                </p>
              ) : (
                polls.map((poll) => (
                  <div key={poll.id} className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">{poll.question}</h4>
                    <div className="space-y-2">
                      {poll.options.map((option, index) => {
                        const responseCount = poll.responses?.filter(r => r.optionIndex === index).length || 0;
                        const totalResponses = poll.responses?.length || 0;
                        const percentage = totalResponses > 0 ? (responseCount / totalResponses) * 100 : 0;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => respondToPoll(poll.id, index)}
                            className="w-full text-left p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors relative overflow-hidden"
                          >
                            <div 
                              className="absolute inset-0 bg-blue-600 opacity-30"
                              style={{ width: `${percentage}%` }}
                            />
                            <span className="relative z-10 text-white text-sm">
                              {option} ({responseCount} votes - {percentage.toFixed(0)}%)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Total votes: {poll.responses?.length || 0}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Create Poll Modal */}
        {showCreatePoll && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Create Poll</h3>
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={newPoll.question}
                      onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your question"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                    <div className="space-y-2">
                      {newPoll.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newPoll.options];
                            newOptions[index] = e.target.value;
                            setNewPoll({ ...newPoll, options: newOptions });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                      <button
                        onClick={addPollOption}
                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowCreatePoll(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createPoll}
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Create Poll
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raised Hands Indicator */}
        {raisedHands.length > 0 && (
          <div className="absolute bottom-24 left-4 bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="flex items-center text-white mb-2">
              <HandIcon className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm font-semibold">Raised Hands ({raisedHands.length})</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {raisedHands.map((hand, index) => (
                <div key={index} className="text-gray-300 text-xs">
                  {hand.userName || `User ${hand.userId}`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClass;