import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Users, BookOpen, Radio, Calendar, CheckSquare, PlusCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function TeacherDashboard() {
  const { token } = useAuth();
  const { addToast } = useSocket();

  // Active view pane
  const [activeTab, setActiveTab] = useState('attendance'); // 'batches' | 'lectures' | 'attendance' | 'broadcast' | 'leaves'

  // Directories & Lists
  const [studentDirectory, setStudentDirectory] = useState([]);
  const [batches, setBatches] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // 1. Create Batch States
  const [batchName, setBatchName] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [clickedBatch, setClickedBatch] = useState(null);
  const [batchSelectStudentId, setBatchSelectStudentId] = useState('');
  const [modalAddStudentId, setModalAddStudentId] = useState('');

  // 2. Schedule Lecture States
  const [schedBatchId, setSchedBatchId] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedStartTime, setSchedStartTime] = useState('');
  const [schedEndTime, setSchedEndTime] = useState('');
  const [schedTopic, setSchedTopic] = useState('');

  // 3. Mark Attendance States
  const [attBatchId, setAttBatchId] = useState('');
  const [attLectureId, setAttLectureId] = useState('');
  const [attRecords, setAttRecords] = useState({}); // { studentId: 'present' | 'absent' }

  // 4. Broadcast Notice States
  const [broadBatchId, setBroadBatchId] = useState('');
  const [broadMessage, setBroadMessage] = useState('');

  // 5. Apply for Leave States
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Fetch utilities
  const fetchStudentDirectory = async () => {
    try {
      const res = await fetch(`${API_BASE}/teacher/students`, { headers });
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setStudentDirectory(sorted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API_BASE}/teacher/batches`, { headers });
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
        if (data.length > 0) {
          setSchedBatchId(data[0].id);
          setAttBatchId(data[0].id);
          setBroadBatchId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await fetch(`${API_BASE}/teacher/lectures`, { headers });
      if (res.ok) setLectures(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE}/teacher/leaves`, { headers });
      if (res.ok) setLeaves(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudentDirectory();
    fetchBatches();
    fetchLectures();
    fetchLeaves();
  }, [activeTab]);

  // Load lectures matching selected attendance batch
  useEffect(() => {
    if (!attBatchId) return;
    const batchLectures = lectures.filter((l) => l.batch_id === attBatchId);
    if (batchLectures.length > 0) {
      setAttLectureId(batchLectures[0].id);
    } else {
      setAttLectureId('');
    }
  }, [attBatchId, lectures]);

  // Load enrolled students check when attendance lecture changes
  useEffect(() => {
    if (!attLectureId) {
      setAttRecords({});
      return;
    }

    const loadEnrolledAndStatus = async () => {
      try {
        // Fetch students enrolled in the active batch
        const selectedBatchObj = batches.find((b) => b.id === attBatchId);
        const enrolledStudents = selectedBatchObj ? selectedBatchObj.students : [];

        // Check if attendance is already logged
        const res = await fetch(`${API_BASE}/teacher/attendance?lecture_id=${attLectureId}`, { headers });
        const existingData = res.ok ? await res.json() : [];

        const recordsMap = {};
        // Default to present for everyone
        enrolledStudents.forEach((student) => {
          recordsMap[student.id] = 'present';
        });

        // Overlay existing status if logged
        existingData.forEach((record) => {
          recordsMap[record.student_id] = record.status;
        });

        setAttRecords(recordsMap);
      } catch (err) {
        console.error(err);
      }
    };

    loadEnrolledAndStatus();
  }, [attLectureId, attBatchId, batches]);

  // Handle Create Batch
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!batchName || selectedStudentIds.length === 0) {
      addToast('danger', 'Form Incomplete', 'Provide a batch name and select at least one student.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teacher/batches`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ batch_name: batchName, student_ids: selectedStudentIds }),
      });

      if (res.ok) {
        addToast('success', 'Batch Created', `Batch "${batchName}" is now registered.`);
        setBatchName('');
        setSelectedStudentIds([]);
        fetchBatches();
      } else {
        addToast('danger', 'Error', 'Failed to create batch.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudentToBatch = async (batchId, studentId) => {
    if (!studentId) return;
    try {
      const res = await fetch(`${API_BASE}/teacher/batches/${batchId}/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ student_id: studentId })
      });
      if (res.ok) {
        addToast('success', 'Student Added', 'Roster updated successfully.');
        setModalAddStudentId('');
        await fetchBatches();
        const updatedBatches = await fetch(`${API_BASE}/teacher/batches`, { headers }).then(r => r.json());
        const updatedBatch = updatedBatches.find(b => b.id === batchId);
        if (updatedBatch) setClickedBatch(updatedBatch);
      } else {
        const err = await res.json();
        addToast('danger', 'Enrollment Failed', err.error || 'Server error.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveStudentFromBatch = async (batchId, studentId, studentName) => {
    const isConfirmed = window.confirm(`⚠️ Roster Change:\nAre you sure you want to remove ${studentName} from this batch?`);
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/teacher/batches/${batchId}/students/${studentId}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        addToast('success', 'Student Removed', 'Roster updated successfully.');
        await fetchBatches();
        const updatedBatches = await fetch(`${API_BASE}/teacher/batches`, { headers }).then(r => r.json());
        const updatedBatch = updatedBatches.find(b => b.id === batchId);
        if (updatedBatch) {
          setClickedBatch(updatedBatch);
        } else {
          setClickedBatch(null);
        }
      } else {
        addToast('danger', 'Removal Failed', 'Could not update batch roster.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Schedule Lecture
  const handleScheduleLecture = async (e) => {
    e.preventDefault();
    if (!schedBatchId || !schedDate || !schedStartTime || !schedEndTime || !schedTopic) {
      addToast('danger', 'Form Incomplete', 'All lecture scheduling fields are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teacher/lectures`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          batch_id: schedBatchId,
          date: schedDate,
          start_time: schedStartTime,
          end_time: schedEndTime,
          topic: schedTopic,
        }),
      });

      if (res.ok) {
        addToast('success', 'Lecture Scheduled', 'Real-time WebSocket alerts triggered for enrolled students.');
        setSchedDate('');
        setSchedStartTime('');
        setSchedEndTime('');
        setSchedTopic('');
        fetchLectures();
      } else {
        const err = await res.json();
        addToast('danger', 'Error', err.error || 'Failed to schedule.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Save Attendance
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!attLectureId) {
      addToast('danger', 'Error', 'No lecture selected to log attendance.');
      return;
    }

    const recordsPayload = Object.keys(attRecords).map((studentId) => ({
      student_id: studentId,
      status: attRecords[studentId],
    }));

    try {
      const res = await fetch(`${API_BASE}/teacher/attendance`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ lecture_id: attLectureId, records: recordsPayload }),
      });

      if (res.ok) {
        addToast('success', 'Attendance Logged', 'Daily roll-call attendance sheet committed.');
      } else {
        addToast('danger', 'Error', 'Failed to register attendance.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttRecordChange = (studentId, status) => {
    setAttRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  // Handle Broadcast Notice
  const handleBroadcastNotice = async (e) => {
    e.preventDefault();
    if (!broadBatchId || !broadMessage) {
      addToast('danger', 'Form Incomplete', 'Select a batch and enter a message to broadcast.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teacher/broadcast`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ batch_id: broadBatchId, message_text: broadMessage }),
      });

      if (res.ok) {
        addToast('success', 'Broadcast Notice Transmitted', 'WebSocket alert sent to all students in the batch.');
        setBroadMessage('');
      } else {
        addToast('danger', 'Error', 'Failed to broadcast notice.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Apply for Leave
  const handleRequestLeave = async (e) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) {
      addToast('danger', 'Form Incomplete', 'Specify all leave parameters.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teacher/leaves`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ start_date: leaveStart, end_date: leaveEnd, reason: leaveReason }),
      });

      if (res.ok) {
        addToast('success', 'Leave Requested', 'Awaiting administrative review.');
        setLeaveStart('');
        setLeaveEnd('');
        setLeaveReason('');
        fetchLeaves();
      } else {
        addToast('danger', 'Error', 'Failed to request leave.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getActiveBatchStudents = () => {
    const activeBatchObj = batches.find((b) => b.id === attBatchId);
    return activeBatchObj ? activeBatchObj.students : [];
  };

  return (
    <div>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('attendance')}
        >
          <CheckSquare size={18} /> Mark Attendance
        </button>
        <button
          className={`btn ${activeTab === 'lectures' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('lectures')}
        >
          <BookOpen size={18} /> Schedule Lectures
        </button>
        <button
          className={`btn ${activeTab === 'batches' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('batches')}
        >
          <Users size={18} /> Create Batches
        </button>
        <button
          className={`btn ${activeTab === 'broadcast' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('broadcast')}
        >
          <Radio size={18} /> Broadcast Notices
        </button>
        <button
          className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('leaves')}
        >
          <Calendar size={18} /> Leave Request
        </button>
      </div>

      {/* --- MARK ATTENDANCE VIEW --- */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Lecture Selection Grid */}
          <div className="card">
            <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare style={{ color: 'var(--accent)' }} /> Scheduled Lectures Directory
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              💡 Click on any scheduled lecture box below to open the student roll-call register. You can log or view attendance at any time!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', maxHeight: '320px', overflowY: 'auto', padding: '0.25rem' }}>
              {lectures.map((l) => {
                const isActive = attLectureId === l.id;
                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      setAttLectureId(l.id);
                      setAttBatchId(l.batch_id);
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: '1.25rem',
                      border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: isActive ? 'var(--accent-light)' : 'var(--bg-primary)',
                      borderRadius: '12px',
                      transition: 'var(--transition)',
                      boxShadow: isActive ? 'var(--shadow-premium)' : 'none',
                      animation: 'fade-in 0.25s ease'
                    }}
                    className="checklist-item"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-accent" style={{ textTransform: 'none' }}>{l.batch_name}</span>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.date}</strong>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0', color: isActive ? 'var(--accent)' : 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                      {l.topic}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      🕒 Window: {l.start_time.substring(0, 5)} - {l.end_time.substring(0, 5)}
                    </p>
                  </div>
                );
              })}
              {lectures.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No scheduled lectures found under your batches. Create one first!
                </div>
              )}
            </div>
          </div>

          {/* Attendance Checklist Form (Opened when lecture selected) */}
          {attLectureId && (
            <div className="card" style={{ borderLeft: '5px solid var(--accent)', animation: 'slide-in 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <span className="badge badge-accent">Daily Roll-Call Registry</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', marginTop: '0.25rem' }}>
                    📝 Log Attendance for {lectures.find(l => l.id === attLectureId)?.topic || 'Selected Lecture'}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Batch: {lectures.find(l => l.id === attLectureId)?.batch_name || 'N/A'} • Conducted: {lectures.find(l => l.id === attLectureId)?.date || 'N/A'}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setAttLectureId('')}>
                  Close Register
                </button>
              </div>

              <form onSubmit={handleSaveAttendance}>
                <div className="attendance-list" style={{ marginBottom: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {getActiveBatchStudents().map((student) => (
                    <div key={student.id} className="attendance-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', background: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
                      <div>
                        <strong>{student.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                          📞 {student.mobile_number}
                        </span>
                      </div>

                      <div className="attendance-toggles" style={{ display: 'flex', gap: '1rem' }}>
                        <label className="toggle-label" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', cursor: 'pointer', color: attRecords[student.id] === 'present' ? 'var(--success)' : 'var(--text-muted)', fontWeight: attRecords[student.id] === 'present' ? '600' : '400' }}>
                          <input
                            type="radio"
                            name={`att-${student.id}`}
                            value="present"
                            checked={attRecords[student.id] === 'present'}
                            onChange={() => handleAttRecordChange(student.id, 'present')}
                          />
                          Present
                        </label>
                        <label className="toggle-label" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', cursor: 'pointer', color: attRecords[student.id] === 'absent' ? 'var(--danger)' : 'var(--text-muted)', fontWeight: attRecords[student.id] === 'absent' ? '600' : '400' }}>
                          <input
                            type="radio"
                            name={`att-${student.id}`}
                            value="absent"
                            checked={attRecords[student.id] === 'absent'}
                            onChange={() => handleAttRecordChange(student.id, 'absent')}
                          />
                          Absent
                        </label>
                        <label className="toggle-label" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', cursor: 'pointer', color: attRecords[student.id] === 'late' ? 'var(--warning)' : 'var(--text-muted)', fontWeight: attRecords[student.id] === 'late' ? '600' : '400' }}>
                          <input
                            type="radio"
                            name={`att-${student.id}`}
                            value="late"
                            checked={attRecords[student.id] === 'late'}
                            onChange={() => handleAttRecordChange(student.id, 'late')}
                          />
                          Late
                        </label>
                      </div>
                    </div>
                  ))}
                  {getActiveBatchStudents().length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      No students are enrolled in this batch.
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit & Save Attendance Report
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- SCHEDULE LECTURE VIEW --- */}
      {activeTab === 'lectures' && (
        <div className="grid-2">
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle style={{ color: 'var(--accent)' }} /> Add Class Schedule
            </h2>
            <form onSubmit={handleScheduleLecture}>
              <div className="form-group">
                <label className="form-label">Target Batch</label>
                <select
                  className="form-control"
                  value={schedBatchId}
                  onChange={(e) => setSchedBatchId(e.target.value)}
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.batch_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lecture Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={schedStartTime}
                    onChange={(e) => setSchedStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={schedEndTime}
                    onChange={(e) => setSchedEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Syllabus Topic</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Fundamental Theorem of Calculus"
                  value={schedTopic}
                  onChange={(e) => setSchedTopic(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Broadcast and Commit Class
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen style={{ color: 'var(--accent)' }} /> Lecture Roster History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {lectures.map((l) => (
                <div key={l.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge badge-accent">{l.batch_name || 'Advanced Batch'}</span>
                    <strong style={{ fontSize: '0.9rem' }}>{l.date}</strong>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', margin: '0.25rem 0' }}>{l.topic}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Window: {l.start_time} - {l.end_time}
                  </p>
                </div>
              ))}
              {lectures.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No lectures scheduled yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE BATCH VIEW --- */}
      {activeTab === 'batches' && (
        <div className="grid-2">
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users style={{ color: 'var(--accent)' }} /> Assemble New Student Batch
            </h2>
            <form onSubmit={handleCreateBatch}>
              <div className="form-group">
                <label className="form-label">Batch Classification Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Calculus Section B"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Add Student to Batch</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    className="form-control"
                    value={batchSelectStudentId}
                    onChange={(e) => setBatchSelectStudentId(e.target.value)}
                  >
                    <option value="">-- Choose Student --</option>
                    {studentDirectory
                      .filter((student) => !selectedStudentIds.includes(student.id))
                      .map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.mobile_number})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (batchSelectStudentId) {
                        setSelectedStudentIds([...selectedStudentIds, batchSelectStudentId]);
                        setBatchSelectStudentId('');
                      } else {
                        addToast('danger', 'Selection Empty', 'Select a student from the dropdown list to add.');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Enrolled Student list for Batch ({selectedStudentIds.length})</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-primary)' }}>
                  {selectedStudentIds.map((id) => {
                    const student = studentDirectory.find((s) => s.id === id);
                    if (!student) return null;
                    return (
                      <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                        <span>{student.name} <em style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({student.mobile_number})</em></span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                          onClick={() => setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id))}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  {selectedStudentIds.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem' }}>No roster members selected yet. Add them using the dropdown above.</div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Establish Student Batch
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users style={{ color: 'var(--accent)' }} /> Active Batches Led
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {batches.map((b) => (
                <div 
                  key={b.id} 
                  onClick={() => setClickedBatch(b)}
                  className="checklist-item"
                  style={{ 
                    padding: '1.25rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: 'var(--bg-primary)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{b.batch_name}</h3>
                    <span className="badge badge-accent" style={{ textTransform: 'none' }}>Roster: {b.students ? b.students.length : 0} enrolled</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    📅 Schedule: {b.schedule_description}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    👉 Click to view enrolled students list
                  </p>
                </div>
              ))}
              {batches.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No batches registered under your contract.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- BROADCAST NOTICES VIEW --- */}
      {activeTab === 'broadcast' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio style={{ color: 'var(--accent)' }} /> Push-Notification Console
          </h2>
          <form onSubmit={handleBroadcastNotice}>
            <div className="form-group">
              <label className="form-label">Target Batch Group</label>
              <select
                className="form-control"
                value={broadBatchId}
                onChange={(e) => setBroadBatchId(e.target.value)}
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>{b.batch_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Broadcast Memo Text</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Type real-time student alert here..."
                value={broadMessage}
                onChange={(e) => setBroadMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Transmit Real-Time Notice
            </button>
          </form>
        </div>
      )}

      {/* --- LEAVE VIEW --- */}
      {activeTab === 'leaves' && (
        <div className="grid-2">
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ color: 'var(--accent)' }} /> Submit Leave Application
            </h2>
            <form onSubmit={handleRequestLeave}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={leaveStart}
                  onChange={(e) => setLeaveStart(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={leaveEnd}
                  onChange={(e) => setLeaveEnd(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Absence Rationale</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Reason for contract leave..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                File Request
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ color: 'var(--accent)' }} /> Filed Absences History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {leaves.map((l) => (
                <div key={l.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>
                      {l.status}
                    </span>
                    <strong style={{ fontSize: '0.85rem' }}>{l.start_date} to {l.end_date}</strong>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{l.reason}</p>
                </div>
              ))}
              {leaves.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No leave records filed yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alphabetic Enrolled Students Popup Modal Overlay */}
      {clickedBatch && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0, 0, 0, 0.65)', 
            backdropFilter: 'blur(4px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            animation: 'fade-in 0.25s ease'
          }}
          onClick={() => setClickedBatch(null)}
        >
          <div 
            className="card" 
            style={{ 
              width: '420px', 
              background: 'var(--bg-secondary)', 
              padding: '2rem', 
              borderRadius: '16px', 
              border: '1px solid var(--border)', 
              boxShadow: 'var(--shadow-premium)', 
              animation: 'slide-in 0.2s ease' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <span className="badge badge-accent" style={{ marginBottom: '0.25rem' }}>Active Class Roster</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>👥 Enrolled in {clickedBatch.batch_name}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📅 Schedule: {clickedBatch.schedule_description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.25rem' }}>
              {clickedBatch.students && [...clickedBatch.students].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
                <div 
                  key={s.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 1rem', 
                    background: 'var(--bg-primary)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>{s.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {s.mobile_number}</div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => handleRemoveStudentFromBatch(clickedBatch.id, s.id, s.name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {(!clickedBatch.students || clickedBatch.students.length === 0) && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                  No students assigned to this batch.
                </div>
              )}
            </div>

            {/* Quick Add Student Section inside Modal */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-accent" style={{ marginBottom: '0.4rem', textTransform: 'none' }}>Roster Quick Enrollment</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="form-control"
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                  value={modalAddStudentId}
                  onChange={(e) => setModalAddStudentId(e.target.value)}
                >
                  <option value="">-- Choose Student --</option>
                  {studentDirectory
                    .filter((student) => !clickedBatch.students || !clickedBatch.students.some((s) => s.id === student.id))
                    .map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.mobile_number})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleAddStudentToBatch(clickedBatch.id, modalAddStudentId)}
                >
                  Add
                </button>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }} 
              onClick={() => setClickedBatch(null)}
            >
              Dismiss Roster
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
