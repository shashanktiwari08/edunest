import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Users, Shield, GraduationCap, Award, Search, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

export default function CommunityChat({ customBatches = null }) {
  const { token, user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);



  // 1. Fetch channels/batches based on user role
  useEffect(() => {
    const fetchChannels = async () => {
      if (customBatches) {
        setBatches(customBatches);
        if (customBatches.length > 0) {
          setSelectedBatch(customBatches[0]);
        }
        setBatchesLoading(false);
        return;
      }

      try {
        let endpoint = `${API_BASE}/student/dashboard`;
        if (user.role === 'teacher') endpoint = `${API_BASE}/teacher/batches`;
        else if (user.role === 'admin') endpoint = `${API_BASE}/admin/batches`; // We will expose or construct

        // Admin fallback check: if admin batches is not direct, let's fetch all batches
        if (user.role === 'admin') {
          const res = await fetch(`${API_BASE}/teacher/batches`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setBatches(data);
            if (data.length > 0) setSelectedBatch(data[0]);
          }
          setBatchesLoading(false);
          return;
        }

        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Extract batches list
          const list = data.batches || data || [];
          setBatches(list);
          if (list.length > 0) {
            setSelectedBatch(list[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load batch channels:', err);
      } finally {
        setBatchesLoading(false);
      }
    };

    fetchChannels();
  }, [token, user, customBatches]);

  // 2. Fetch messages for the selected batch
  const fetchMessages = async (batchId) => {
    if (!batchId) return;
    try {
      const res = await fetch(`${API_BASE}/chat/${batchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch batch chat messages:', err);
    }
  };

  useEffect(() => {
    if (!selectedBatch) return;
    setMessagesLoading(true);
    fetchMessages(selectedBatch.id).finally(() => setMessagesLoading(false));

    // Short-polling interval (3 seconds) for real-time visual syncing
    const interval = setInterval(() => {
      fetchMessages(selectedBatch.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedBatch, token]);

  // 3. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedBatch) return;

    const messageText = typedMessage.trim();
    setTypedMessage('');

    // Pre-inject client-side instantly for snappy performance feel
    const tempMessage = {
      id: Math.random().toString(),
      batch_id: selectedBatch.id,
      sender_id: user.id,
      sender_name: user.name,
      sender_role: user.role,
      message: messageText,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch(`${API_BASE}/chat/${selectedBatch.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageText })
      });

      if (!res.ok) {
        console.error('Failed to store backend message');
      } else {
        // Refresh messages list
        fetchMessages(selectedBatch.id);
      }
    } catch (err) {
      console.error('Failed to dispatch message:', err);
    }
  };

  const filteredBatches = batches.filter(b => 
    b.batch_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card chat-container-layout" style={{
      padding: 0,
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      display: 'flex',
      height: '620px',
      backgroundColor: '#ffffff',
      boxShadow: '0 15px 35px rgba(0,0,0,0.03)'
    }}>
      
      {/* Sidebar Channels List */}
      <div style={{
        width: '300px',
        borderRight: '1px solid var(--border)',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }} className="chat-sidebar">
        
        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Community Hub</h3>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Batch Channels</span>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px 6px 32px',
                fontSize: '12px',
                outline: 'none',
                color: '#334155'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
          </div>
        </div>

        {/* Channels scroll container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {batchesLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', fontSize: '12px', color: '#64748b' }}>
              Loading channels...
            </div>
          ) : filteredBatches.length > 0 ? (
            filteredBatches.map((b) => {
              const isSelected = selectedBatch?.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatch(b)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    color: isSelected ? '#4f46e5' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    marginBottom: '4px'
                  }}
                  className="channel-btn"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#4f46e5' : '#e2e8f0',
                    color: isSelected ? '#ffffff' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}>
                    #
                  </div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', display: 'block' }}>{b.batch_name}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>{b.schedule_description || 'Active class chat'}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', fontSize: '12px', color: '#64748b' }}>
              No active batches.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        {selectedBatch ? (
          <>
            {/* Chat Pane Header */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span># {selectedBatch.batch_name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '9999px', padding: '2px 8px', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase' }}>
                    <Sparkles size={8} style={{ marginRight: '3px' }} /> Active Community
                  </span>
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  👥 Enrolled members, Admin, and batch Instructors are automatically joined
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>
                <Users size={16} /> Community Chat
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }} className="premium-scroll">
              {messagesLoading && messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '13px' }}>
                  Retrieving conversations...
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isOwnMessage = msg.sender_id === user.id;
                  
                  // Role Badge coloring logic
                  let badgeBg = '#f1f5f9';
                  let badgeText = '#475569';
                  let RoleIcon = GraduationCap;

                  if (msg.sender_role === 'admin') {
                    badgeBg = '#fee2e2';
                    badgeText = '#ef4444';
                    RoleIcon = Shield;
                  } else if (msg.sender_role === 'teacher') {
                    badgeBg = '#f5f3ff';
                    badgeText = '#8b5cf6';
                    RoleIcon = Award;
                  }

                  return (
                    <div 
                      key={msg.id} 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {/* Sender details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '11px' }}>
                        <span style={{ fontWeight: '700', color: '#334155' }}>{msg.sender_name}</span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          backgroundColor: badgeBg,
                          color: badgeText,
                          borderRadius: '4px',
                          padding: '1px 5px',
                          fontWeight: '800',
                          fontSize: '8px',
                          textTransform: 'uppercase'
                        }}>
                          <RoleIcon size={8} /> {msg.sender_role}
                        </span>
                        <span style={{ color: '#94a3b8' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Message bubble */}
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        borderTopLeftRadius: isOwnMessage ? '16px' : '4px',
                        borderTopRightRadius: isOwnMessage ? '4px' : '16px',
                        backgroundColor: isOwnMessage ? '#4f46e5' : '#ffffff',
                        color: isOwnMessage ? '#ffffff' : '#1e293b',
                        border: isOwnMessage ? 'none' : '1px solid #e2e8f0',
                        fontSize: '13px',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                        wordBreak: 'break-word'
                      }}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  color: '#94a3b8',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1.5px dashed #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MessageSquare size={24} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#64748b', display: 'block', fontSize: '13px' }}>Channel is Quiet</span>
                    <span style={{ fontSize: '11px' }}>Be the first to say hello to the batch!</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSendMessage} style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                placeholder={`Send a message to #${selectedBatch.batch_name}...`}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                style={{
                  flex: 1,
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  outline: 'none',
                  color: '#1e293b',
                  backgroundColor: '#f8fafc'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                className="chat-send-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            color: '#94a3b8',
            gap: '1rem'
          }}>
            <MessageSquare size={48} strokeWidth={1.5} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#64748b' }}>Select a Batch Channel</h3>
            <p style={{ fontSize: '12px', margin: 0 }}>Choose a batch from the sidebar list to enter class discussions.</p>
          </div>
        )}
      </div>

      <style>{`
        .chat-container-layout {
          height: 600px !important;
        }
        @media (max-width: 768px) {
          .chat-container-layout {
            flex-direction: column !important;
            height: auto !important;
          }
          .chat-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
            max-height: 200px !important;
          }
          .chat-send-btn:hover {
            background-color: #4338ca !important;
          }
        }
      `}</style>
    </div>
  );
}
