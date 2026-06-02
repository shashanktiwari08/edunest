import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Users, Shield, GraduationCap, Award, Search, Sparkles, Paperclip, X, Image, FileText, Download } from 'lucide-react';

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
  const [uploadFile, setUploadFile] = useState(null); // { name, type, dataUrl }
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevBatchIdRef = useRef(null);

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
        let endpoint;
        if (user.role === 'admin') {
          endpoint = `${API_BASE}/admin/batches`;
        } else if (user.role === 'teacher') {
          endpoint = `${API_BASE}/teacher/batches`;
        } else {
          endpoint = `${API_BASE}/student/dashboard`;
        }

        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const list = data.batches || data || [];
          setBatches(list);
          if (list.length > 0) setSelectedBatch(list[0]);
        }
      } catch (err) {
        console.error('Failed to load batch channels:', err);
      } finally {
        setBatchesLoading(false);
      }
    };

    fetchChannels();
  }, [token, user, customBatches]);

  // 2. Fetch messages for the selected batch (no auto-scroll on poll)
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

    const isNewBatch = prevBatchIdRef.current !== selectedBatch.id;
    prevBatchIdRef.current = selectedBatch.id;

    setMessagesLoading(true);
    fetchMessages(selectedBatch.id).finally(() => {
      setMessagesLoading(false);
      // Only scroll on initial batch load
      if (isNewBatch) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    // Poll every 4 seconds, no scroll
    const interval = setInterval(() => {
      fetchMessages(selectedBatch.id);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedBatch, token]);

  // 3. Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Max 5MB allowed.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadFile({
        name: file.name,
        type: file.type,
        dataUrl: ev.target.result
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 4. Send Message (text or file)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    if (!typedMessage.trim() && !uploadFile) return;

    setUploading(true);
    const messageText = typedMessage.trim();
    setTypedMessage('');

    // Pre-inject optimistically
    const tempMessage = {
      id: Math.random().toString(),
      batch_id: selectedBatch.id,
      sender_id: user.id,
      sender_name: user.name,
      sender_role: user.role,
      message: messageText || null,
      file_data: uploadFile ? uploadFile.dataUrl : null,
      file_name: uploadFile ? uploadFile.name : null,
      file_type: uploadFile ? uploadFile.type : null,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMessage]);

    // Scroll to new message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    const fileToSend = uploadFile;
    setUploadFile(null);

    try {
      const body = {
        message: messageText || null,
        file_data: fileToSend ? fileToSend.dataUrl : null,
        file_name: fileToSend ? fileToSend.name : null,
        file_type: fileToSend ? fileToSend.type : null
      };

      const res = await fetch(`${API_BASE}/chat/${selectedBatch.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        fetchMessages(selectedBatch.id);
      }
    } catch (err) {
      console.error('Failed to dispatch message:', err);
    } finally {
      setUploading(false);
    }
  };

  // Helper: is an image type
  const isImage = (type) => type && type.startsWith('image/');

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
        width: '280px',
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
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                {user.role === 'admin' ? 'All Batch Channels' : 'My Batch Channels'}
              </span>
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
                color: '#334155',
                boxSizing: 'border-box'
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
                    fontSize: '13px',
                    flexShrink: 0
                  }}>
                    #
                  </div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.batch_name}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {b.teacher_name ? `by ${b.teacher_name}` : (b.schedule_description || 'Active class chat')}
                    </span>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', minWidth: 0 }}>
        {selectedBatch ? (
          <>
            {/* Chat Pane Header */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              flexShrink: 0
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span># {selectedBatch.batch_name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '9999px', padding: '2px 8px', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase' }}>
                    <Sparkles size={8} style={{ marginRight: '3px' }} /> Active
                  </span>
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  Enrolled members, Admin &amp; batch teachers are in this channel
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
                        padding: msg.file_data ? '0.5rem' : '0.75rem 1rem',
                        borderRadius: '16px',
                        borderTopLeftRadius: isOwnMessage ? '16px' : '4px',
                        borderTopRightRadius: isOwnMessage ? '4px' : '16px',
                        backgroundColor: isOwnMessage ? '#4f46e5' : '#ffffff',
                        color: isOwnMessage ? '#ffffff' : '#1e293b',
                        border: isOwnMessage ? 'none' : '1px solid #e2e8f0',
                        fontSize: '13px',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        maxWidth: '100%'
                      }}>
                        {/* Show text if present */}
                        {msg.message && (
                          <div style={{ padding: msg.file_data ? '0.5rem 0.5rem 0.25rem' : '0' }}>
                            {msg.message}
                          </div>
                        )}

                        {/* Show image if file is an image */}
                        {msg.file_data && isImage(msg.file_type) && (
                          <div>
                            <img
                              src={msg.file_data}
                              alt={msg.file_name || 'Shared image'}
                              style={{
                                maxWidth: '280px',
                                maxHeight: '200px',
                                width: '100%',
                                objectFit: 'contain',
                                borderRadius: '10px',
                                display: 'block',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(msg.file_data, '_blank')}
                            />
                            {msg.file_name && (
                              <div style={{
                                fontSize: '10px',
                                opacity: 0.7,
                                marginTop: '4px',
                                padding: '0 4px',
                                textAlign: isOwnMessage ? 'right' : 'left'
                              }}>{msg.file_name}</div>
                            )}
                          </div>
                        )}

                        {/* Show file download card for non-image files */}
                        {msg.file_data && !isImage(msg.file_type) && (
                          <a
                            href={msg.file_data}
                            download={msg.file_name || 'download'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '0.6rem 0.75rem',
                              backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              color: isOwnMessage ? '#ffffff' : '#334155',
                              margin: msg.message ? '0.25rem 0 0' : '0'
                            }}
                          >
                            <FileText size={18} style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {msg.file_name || 'File'}
                              </div>
                              <div style={{ fontSize: '10px', opacity: 0.7 }}>Click to download</div>
                            </div>
                            <Download size={14} style={{ flexShrink: 0 }} />
                          </a>
                        )}
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

            {/* File Preview Strip */}
            {uploadFile && (
              <div style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#f0f4ff',
                borderTop: '1px solid #e0e7ff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {isImage(uploadFile.type) ? (
                  <img src={uploadFile.dataUrl} alt="preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #c7d2fe' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} color="#4f46e5" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadFile.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{uploadFile.type}</div>
                </div>
                <button
                  onClick={() => setUploadFile(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {uploadError && (
              <div style={{ padding: '4px 1.5rem', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '11px', borderTop: '1px solid #fecaca' }}>
                {uploadError}
              </div>
            )}

            {/* Input Form Box */}
            <form onSubmit={handleSendMessage} style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end',
              flexShrink: 0
            }}>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.ppt,.pptx"
                style={{ display: 'none' }}
              />

              {/* Attach button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image or file"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                className="attach-btn"
              >
                <Paperclip size={16} />
              </button>

              <input
                type="text"
                placeholder={uploadFile ? `Add a caption (optional)...` : `Message #${selectedBatch.batch_name}...`}
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
                  backgroundColor: '#f8fafc',
                  minWidth: 0
                }}
              />
              <button
                type="submit"
                disabled={uploading || (!typedMessage.trim() && !uploadFile)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: (uploading || (!typedMessage.trim() && !uploadFile)) ? '#c7d2fe' : '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (uploading || (!typedMessage.trim() && !uploadFile)) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
                className="chat-send-btn"
              >
                <Send size={15} />
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
          height: 620px !important;
        }
        .channel-btn:hover {
          background-color: rgba(79, 70, 229, 0.05) !important;
        }
        .attach-btn:hover {
          background-color: #e0e7ff !important;
          border-color: #c7d2fe !important;
          color: #4f46e5 !important;
        }
        .chat-send-btn:hover:not(:disabled) {
          background-color: #4338ca !important;
        }
        @media (max-width: 768px) {
          .chat-container-layout {
            flex-direction: column !important;
            height: auto !important;
            min-height: 500px !important;
          }
          .chat-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
            max-height: 180px !important;
          }
        }
      `}</style>
    </div>
  );
}
