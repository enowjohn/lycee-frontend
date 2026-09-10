import { useState, useEffect, useRef, useCallback } from 'react';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneIcon,
  DesktopComputerIcon,
  HandIcon,
  ChatIcon,
  UsersIcon,
  XIcon,
  ClipboardCopyIcon,
  CheckIcon
} from '@heroicons/react/outline';
import io from 'socket.io-client';
import { Room, RoomEvent } from 'livekit-client';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const LiveClass = () => {
  const authToken = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId') || 'user';
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showPolls, setShowPolls] = useState(false);
  const [polls, setPolls] = useState([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });
  const [raisedHands, setRaisedHands] = useState([]);
  const [tiles, setTiles] = useState([]); // people currently on camera: { identity, name, isLocal, videoEl }
  const [viewerCount, setViewerCount] = useState(0);
  const [participants, setParticipants] = useState([]); // everyone in the room, on camera or not
  const [showParticipants, setShowParticipants] = useState(false);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [showSessionList, setShowSessionList] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    subject_id: '',
    class_level: 'Form 1',
    scheduled_date: '',
    duration: 60
  });
  const [justCreatedMeetingId, setJustCreatedMeetingId] = useState(null); // shown as a persistent card, not just a toast
  const [copied, setCopied] = useState(false);

  const socketRef = useRef(null);
  const roomRef = useRef(null);
  const videoContainerRefs = useRef({});

  useEffect(() => {
    socketRef.current = io(API_BASE_URL);

    socketRef.current.on('session-message', (data) => setChatMessages(prev => [...prev, data]));

    socketRef.current.on('new-poll', (data) => setPolls(prev => [...prev, { ...data, id: Date.now() }]));

    socketRef.current.on('poll-response', (data) => {
      setPolls(prev => prev.map(p => (p.id === data.pollId ? { ...p, responses: [...(p.responses || []), data] } : p)));
    });

    socketRef.current.on('hand-raised', (data) => {
      setRaisedHands(prev =>
        data.isRaised
          ? [...prev.filter(h => h.userId !== data.userId), data]
          : prev.filter(h => h.userId !== data.userId)
      );
    });

    return () => socketRef.current?.disconnect();
  }, []);

  // Render a LiveKit video track — local OR remote — into its tile once
  // React has mounted the container div for that participant. This covers
  // both RoomEvent.TrackSubscribed (other people's cameras) and
  // RoomEvent.LocalTrackPublished (your own camera), which is the piece
  // that was missing before: local publications never fire "Subscribed".
  const attachTrack = useCallback((track, participant) => {
    if (track.kind !== 'video') return; // audio just needs to play, not render — see below
    const el = track.attach();
    setTiles(prev => {
      const exists = prev.some(t => t.identity === participant.identity);
      if (exists) return prev.map(t => (t.identity === participant.identity ? { ...t, videoEl: el } : t));
      return [...prev, {
        identity: participant.identity,
        name: participant.isLocal ? 'You' : (participant.name || participant.identity),
        isLocal: participant.isLocal,
        videoEl: el
      }];
    });
  }, []);

  const detachTrack = useCallback((track, participant) => {
    if (track.kind !== 'video') return;
    track.detach().forEach(el => el.remove());
    setTiles(prev => prev.filter(t => t.identity !== participant.identity));
  }, []);

  // Keep the Participants panel in sync with who's actually connected,
  // independent of who currently has their camera on.
  const refreshParticipants = useCallback((room) => {
    if (!room) return;
    const list = [{
      identity: room.localParticipant.identity,
      name: 'You',
      isLocal: true,
      isPublishing: room.localParticipant.videoTrackPublications.size > 0
    }];
    room.remoteParticipants.forEach((p) => {
      list.push({
        identity: p.identity,
        name: p.name || p.identity,
        isLocal: false,
        isPublishing: p.videoTrackPublications.size > 0
      });
    });
    setParticipants(list);
    setViewerCount(list.length);
  }, []);

  const joinSession = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/livekit/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ meetingId: sessionId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not join session');

      socketRef.current.emit('join-session', data.roomName);
      setIsTeacher(data.isTeacher);
      setCanPublish(data.isTeacher);

      const room = new Room({
        adaptiveStream: true, // each viewer only pulls the video quality their tile size needs
        dynacast: true        // publishers stop encoding/sending layers nobody is currently watching
      });
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => attachTrack(track, participant));
      room.on(RoomEvent.TrackUnsubscribed, (track, _pub, participant) => detachTrack(track, participant));
      // These two cover your OWN camera — TrackSubscribed never fires for
      // tracks you publish yourself, only for tracks you receive.
      room.on(RoomEvent.LocalTrackPublished, (pub) => {
        if (pub.track) attachTrack(pub.track, room.localParticipant);
      });
      room.on(RoomEvent.LocalTrackUnpublished, (pub) => {
        if (pub.track) detachTrack(pub.track, room.localParticipant);
      });
      room.on(RoomEvent.ParticipantConnected, () => refreshParticipants(room));
      room.on(RoomEvent.ParticipantDisconnected, () => refreshParticipants(room));
      room.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
        setTiles([]);
        setParticipants([]);
      });

      await room.connect(data.wsUrl, data.token);
      setIsConnected(true);
      refreshParticipants(room);

      if (data.isTeacher) {
        try {
          await room.localParticipant.setCameraEnabled(true);
          await room.localParticipant.setMicrophoneEnabled(true);
          setIsVideoOff(false);
        } catch (mediaError) {
          // Don't let a camera/mic permission problem take down the whole
          // session — you can still see/hear everyone else and retry later.
          console.error('Could not enable camera/mic:', mediaError);
          toast.error('Camera/microphone access was blocked. Check your browser\'s site permissions and try the camera button again.');
        }
      }

      // The server can live-upgrade a promoted student's permissions without
      // a reconnect — we just react by turning on camera/mic locally.
      socketRef.current.on('livekit-promoted', async ({ identity }) => {
        if (identity !== data.identity) return;
        setCanPublish(true);
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
          setIsMuted(false);
        } catch (mediaError) {
          console.error('Could not enable microphone after promotion:', mediaError);
          toast.error('You were promoted, but microphone access was blocked. Check your browser permissions.');
        }
      });

      socketRef.current.on('livekit-demoted', async ({ identity }) => {
        if (identity !== data.identity) return;
        setCanPublish(false);
        try {
          await room.localParticipant.setCameraEnabled(false);
          await room.localParticipant.setMicrophoneEnabled(false);
          setIsVideoOff(true);
          setIsMuted(true);
        } catch (mediaError) {
          console.error('Could not disable camera/mic after demotion:', mediaError);
        }
      });
    } catch (error) {
      console.error('Error joining session:', error);
      alert(error.message || 'Could not join the class. Check your camera/microphone permissions.');
    }
  };

  const leaveSession = () => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    if (sessionId) socketRef.current.emit('leave-session', `class_${sessionId}`);
    setIsConnected(false);
    setTiles([]);
    setParticipants([]);
  };

  const toggleMute = async () => {
    if (!roomRef.current || !canPublish) return;
    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Could not toggle microphone:', error);
      toast.error('Microphone access was blocked by the browser.');
    }
  };

  const toggleVideo = async () => {
    if (!roomRef.current || !canPublish) return;
    try {
      await roomRef.current.localParticipant.setCameraEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    } catch (error) {
      console.error('Could not toggle camera:', error);
      toast.error('Camera access was blocked by the browser.');
    }
  };

  const toggleScreenShare = async () => {
    if (!roomRef.current || !canPublish) return;
    try {
      await roomRef.current.localParticipant.setScreenShareEnabled(!isScreenSharing);
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Could not toggle screen share:', error);
      toast.error('Screen share was blocked or cancelled.');
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    socketRef.current?.emit('raise-hand', {
      sessionId: `class_${sessionId}`,
      userId: currentUserId,
      isRaised: !isHandRaised
    });
  };

  const promoteStudent = async (userId) => {
    await fetch(`${API_BASE_URL}/api/livekit/promote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ meetingId: sessionId, studentUserId: userId })
    });
    setRaisedHands(prev => prev.filter(h => h.userId !== userId));
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const message = { sessionId: `class_${sessionId}`, userName: 'You', message: messageInput, timestamp: new Date().toISOString() };
    socketRef.current.emit('session-message', message);
    setChatMessages(prev => [...prev, message]);
    setMessageInput('');
  };

  const createPoll = () => {
    if (!newPoll.question || newPoll.options.filter(o => o).length < 2) return;
    const poll = { sessionId: `class_${sessionId}`, question: newPoll.question, options: newPoll.options.filter(o => o), timestamp: new Date().toISOString() };
    socketRef.current.emit('new-poll', poll);
    setPolls(prev => [...prev, { ...poll, id: Date.now() }]);
    setNewPoll({ question: '', options: ['', ''] });
    setShowCreatePoll(false);
  };

  const respondToPoll = (pollId, optionIndex) => {
    socketRef.current.emit('poll-response', { sessionId: `class_${sessionId}`, pollId, optionIndex, userName: 'You' });
  };

  const addPollOption = () => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });

  const fetchAvailableSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/video-sessions`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      setAvailableSessions(data);
      setShowSessionList(true);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const createSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/video-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(newSession)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Session created!');
        setSessionId(data.meeting_id);
        setJustCreatedMeetingId(data.meeting_id); // keeps the ID visible on screen, not just in the toast
        setShowCreateSession(false);
        setNewSession({
          title: '',
          description: '',
          subject_id: '',
          class_level: 'Form 1',
          scheduled_date: '',
          duration: 60
        });
      } else {
        toast.error(data.error || 'Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    }
  };

  const copyMeetingId = async (idToCopy) => {
    try {
      await navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      toast.success('Meeting ID copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast.error('Could not copy — select and copy the ID manually.');
    }
  };

  // Mount each track's <video> element into its React-rendered container.
  useEffect(() => {
    tiles.forEach(tile => {
      const container = videoContainerRefs.current[tile.identity];
      if (container && tile.videoEl && !container.contains(tile.videoEl)) {
        container.innerHTML = '';
        container.appendChild(tile.videoEl);
      }
    });
  }, [tiles]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col animate-fadeIn">
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Live Classroom</h1>
          {isConnected && <span className="px-3 py-1 bg-green-600 rounded-full text-sm">Live</span>}
        </div>
        <div className="flex items-center space-x-4">
          {isConnected && (
            <button onClick={() => setShowParticipants(!showParticipants)} className="flex items-center hover:bg-gray-700 rounded-lg px-2 py-1" title="Participants">
              <UsersIcon className="h-5 w-5 mr-2" />
              <span>{viewerCount}</span>
            </button>
          )}
          {isConnected && (
            <>
              <button onClick={() => setShowPolls(!showPolls)} className="p-2 hover:bg-gray-700 rounded-lg relative" title="Polls">
                <span className="text-white font-semibold">📊</span>
                {polls.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {polls.length}
                  </span>
                )}
              </button>
              {isTeacher && (
                <button onClick={() => setShowCreatePoll(true)} className="p-2 hover:bg-gray-700 rounded-lg" title="Create Poll">
                  <span className="text-white font-semibold">➕</span>
                </button>
              )}
            </>
          )}
          <button onClick={() => setShowChat(!showChat)} className="p-2 hover:bg-gray-700 rounded-lg">
            {showChat ? <XIcon className="h-5 w-5" /> : <ChatIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col">
          {!isConnected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Join a Class Session</h2>

                {justCreatedMeetingId && (
                  <div className="mb-4 p-4 bg-green-900 bg-opacity-40 border border-green-600 rounded-lg">
                    <p className="text-green-300 text-xs font-medium mb-2">
                      Session created — share this Meeting ID with your students:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-900 text-green-300 px-3 py-2 rounded text-sm break-all">
                        {justCreatedMeetingId}
                      </code>
                      <button
                        onClick={() => copyMeetingId(justCreatedMeetingId)}
                        className="p-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors flex-shrink-0"
                        title="Copy Meeting ID"
                      >
                        {copied ? <CheckIcon className="h-5 w-5 text-white" /> : <ClipboardCopyIcon className="h-5 w-5 text-white" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowCreateSession(true)}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold mb-2"
                >
                  Create New Session
                </button>
                <button
                  onClick={fetchAvailableSessions}
                  className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold mb-4"
                >
                  View Available Sessions
                </button>

                <label className="block text-xs font-medium text-gray-400 mb-1">Session/Meeting ID</label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Paste or select a Meeting ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {sessionId && (
                    <button
                      onClick={() => copyMeetingId(sessionId)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0"
                      title="Copy Meeting ID"
                    >
                      <ClipboardCopyIcon className="h-5 w-5 text-white" />
                    </button>
                  )}
                </div>

                <button onClick={joinSession} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Join Session
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 bg-black p-4 grid gap-4"
              style={{ gridTemplateColumns: `repeat(${Math.min(tiles.length || 1, 4)}, 1fr)` }}
            >
              {tiles.length === 0 && (
                <div className="flex items-center justify-center text-gray-400 col-span-full">
                  Waiting for the teacher to start their camera…
                </div>
              )}
              {tiles.map(tile => (
                <div key={tile.identity} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                  <div
                    ref={el => { videoContainerRefs.current[tile.identity] = el; }}
                    className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {tile.isLocal ? 'You' : tile.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isConnected && (
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-center space-x-4">
              <button
                onClick={toggleMute}
                disabled={!canPublish}
                className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors disabled:opacity-40`}
              >
                <MicrophoneIcon className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={toggleVideo}
                disabled={!canPublish}
                className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors disabled:opacity-40`}
              >
                <VideoCameraIcon className="h-6 w-6 text-white" />
              </button>
              {canPublish && (
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}
                >
                  <DesktopComputerIcon className="h-6 w-6 text-white" />
                </button>
              )}
              {!isTeacher && (
                <button
                  onClick={toggleHandRaise}
                  className={`p-3 rounded-full ${isHandRaised ? 'bg-amber-600' : 'bg-gray-700'} hover:bg-gray-600 transition-colors`}
                >
                  <HandIcon className="h-6 w-6 text-white" />
                </button>
              )}
              <button onClick={leaveSession} className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
                <PhoneIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
        </div>

        {showParticipants && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {participants.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No one else here yet</p>
              ) : (
                participants.map((p) => (
                  <div key={p.identity} className="flex items-center justify-between bg-gray-700 rounded-lg px-3 py-2">
                    <span className="text-white text-sm">{p.isLocal ? 'You' : p.name}</span>
                    {p.isPublishing && (
                      <span className="text-xs text-green-400 flex items-center">
                        <VideoCameraIcon className="h-3.5 w-3.5 mr-1" /> On camera
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700"><h3 className="text-white font-semibold">Chat</h3></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No messages yet. Start the conversation!</p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-blue-400 text-sm font-medium">{msg.userName}</span>
                    <p className="text-white text-sm">{msg.message}</p>
                    <span className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
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
                <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {showPolls && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700"><h3 className="text-white font-semibold">Polls & Quizzes</h3></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {polls.length === 0 ? (
                <p className="text-gray-400 text-center text-sm">No active polls</p>
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
                            <div className="absolute inset-0 bg-blue-600 opacity-30" style={{ width: `${percentage}%` }} />
                            <span className="relative z-10 text-white text-sm">
                              {option} ({responseCount} votes - {percentage.toFixed(0)}%)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Total votes: {poll.responses?.length || 0}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showSessionList && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Available Sessions</h3>
                <button onClick={() => setShowSessionList(false)} className="text-gray-400 hover:text-gray-600">
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                {availableSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No sessions available</p>
                ) : (
                  <div className="space-y-3">
                    {availableSessions.map((session) => (
                      <div key={session.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{session.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            session.status === 'live' ? 'bg-green-100 text-green-800' :
                            session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{session.description || 'No description'}</p>
                        <div className="text-sm text-gray-500 mb-2">
                          <p>Subject: {session.subject_name}</p>
                          <p>Teacher: {session.teacher_first_name} {session.teacher_last_name}</p>
                          <p>Scheduled: {new Date(session.scheduled_date).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-200 px-2 py-1 rounded flex-1">{session.meeting_id}</code>
                          <button
                            onClick={() => copyMeetingId(session.meeting_id)}
                            className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded"
                            title="Copy Meeting ID"
                          >
                            <ClipboardCopyIcon className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => {
                              setSessionId(session.meeting_id);
                              setShowSessionList(false);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showCreatePoll && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Create Poll</h3>
                <button onClick={() => setShowCreatePoll(false)} className="text-gray-400 hover:text-gray-600">
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
                  <button onClick={() => setShowCreatePoll(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={createPoll} className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
                    Create Poll
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isTeacher && raisedHands.length > 0 && (
          <div className="absolute bottom-24 left-4 bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="flex items-center text-white mb-2">
              <HandIcon className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm font-semibold">Raised Hands ({raisedHands.length})</span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {raisedHands.map((hand, index) => (
                <div key={index} className="flex items-center justify-between text-gray-300 text-xs gap-2">
                  <span>{hand.userName || `User ${hand.userId}`}</span>
                  <button onClick={() => promoteStudent(hand.userId)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Promote
                  </button>
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