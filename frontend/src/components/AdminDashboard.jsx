import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { UserPlus, IndianRupee, Calendar, Check, X, ShieldAlert, Award, Lock, KeyRound, ChevronRight, Smartphone, MessageSquare } from 'lucide-react';
import CommunityChat from './CommunityChat';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { token } = useAuth();
  const { addToast } = useSocket();

  // Active sub-sections
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'finances' | 'leaves' | 'credentials'

  // Form states: Enrollment (using mobile instead of email)
  const [tName, setTName] = useState('');
  const [tMobile, setTMobile] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tSalary, setTSalary] = useState('');
  const [tSubject, setTSubject] = useState('Mathematics');
  const [tSubjectCustom, setTSubjectCustom] = useState('');

  const [sName, setSName] = useState('');
  const [sMobile, setSMobile] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sFee, setSFee] = useState('');
  const [sSubject, setSSubject] = useState('All Subjects');
  const [sSubjectCustom, setSSubjectCustom] = useState('');
  
  // Custom billing cycle day states (default to 28)
  const [tCycleDay, setTCycleDay] = useState('28');
  const [sCycleDay, setSCycleDay] = useState('28');

  // Form states: Credentials Override
  const [credUserId, setCredUserId] = useState(null);
  const [credName, setCredName] = useState('');
  const [credMobile, setCredMobile] = useState('');
  const [credPassword, setCredPassword] = useState('');

  // Teacher detail overlay
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [selectedTeacherMobile, setSelectedTeacherMobile] = useState('');
  const [selectedTeacherSubject, setSelectedTeacherSubject] = useState('');
  const [teacherDetails, setTeacherDetails] = useState({ lectures: [], attendance: [], leaves: [] });
  const [activeDetailTab, setActiveDetailTab] = useState('lectures'); // 'lectures' | 'attendance' | 'leaves'

  // Ledgers & rosters
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [fees, setFees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Payment states
  const [payAmount, setPayAmount] = useState({});
  const [feeAmount, setFeeAmount] = useState({});
  const [feePayType, setFeePayType] = useState({});
  const [salaryPayType, setSalaryPayType] = useState({});

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Fetch rosters & ledgers
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.filter((u) => u.role === 'teacher'));
        setStudents(data.filter((u) => u.role === 'student'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFinances = async (type) => {
    try {
      const res = await fetch(`${API_BASE}/admin/finances?type=${type}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (type === 'salary') setSalaries(data);
        else setFees(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/leaves`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch details for clicked teacher
  const fetchTeacherDetails = async (teacherId, teacherName, teacherMobile, teacherSubject) => {
    try {
      const res = await fetch(`${API_BASE}/admin/teachers/${teacherId}/details`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTeacherDetails(data);
        setSelectedTeacherId(teacherId);
        setSelectedTeacherName(teacherName);
        setSelectedTeacherMobile(teacherMobile || 'N/A');
        setSelectedTeacherSubject(teacherSubject || 'General');
      } else {
        addToast('danger', 'Detail Query Failed', 'Failed to retrieve teacher aggregates.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFinances('salary');
    fetchFinances('fee');
    fetchLeaves();
  }, [activeTab]);

  const handleEnrollTeacher = async (e) => {
    e.preventDefault();
    if (!tName || !tMobile || !tPassword) {
      addToast('danger', 'Error', 'All primary teacher fields are required.');
      return;
    }

    try {
      const amount = tSalary ? parseFloat(tSalary) : 3000.00;
      const finalSubject = tSubject === 'Other' ? tSubjectCustom : tSubject;
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          name: tName, 
          mobile_number: tMobile, 
          role: 'teacher', 
          password: tPassword, 
          financialAmount: amount,
          subject: finalSubject,
          cycle_day: parseInt(tCycleDay) || 28
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', 'Teacher Enrolled', `Account setup completed for ${tName}.`);
        setTName('');
        setTMobile('');
        setTPassword('');
        setTSalary('');
        setTSubject('Mathematics');
        setTSubjectCustom('');
        setTCycleDay('28');
        fetchUsers();
        fetchFinances('salary');
      } else {
        addToast('danger', 'Enrollment Failed', data.error || 'Server error.');
      }
    } catch (err) {
      addToast('danger', 'Connection Error', 'Failed to connect to backend.');
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!sName || !sMobile || !sPassword) {
      addToast('danger', 'Error', 'All primary student fields are required.');
      return;
    }

    try {
      const amount = sFee ? parseFloat(sFee) : 1200.00;
      const finalSubject = sSubject === 'Other' ? sSubjectCustom : sSubject;
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          name: sName, 
          mobile_number: sMobile, 
          role: 'student', 
          password: sPassword, 
          financialAmount: amount,
          subject: finalSubject,
          cycle_day: parseInt(sCycleDay) || 28
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', 'Student Enrolled', `Account setup completed for ${sName}.`);
        setSName('');
        setSMobile('');
        setSPassword('');
        setSFee('');
        setSSubject('All Subjects');
        setSSubjectCustom('');
        setSCycleDay('28');
        fetchUsers();
        fetchFinances('fee');
      } else {
        addToast('danger', 'Enrollment Failed', data.error || 'Server error.');
      }
    } catch (err) {
      addToast('danger', 'Connection Error', 'Failed to connect to backend.');
    }
  };

  const handleRecordPayment = async (financeId, type, amountNow) => {
    if (!amountNow || parseFloat(amountNow) <= 0) {
      addToast('danger', 'Invalid Payment', 'Please enter a positive numeric value.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/finances/pay`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ finance_id: financeId, amount_paid_now: parseFloat(amountNow) }),
      });

      if (res.ok) {
        addToast('success', 'Transaction Registered', 'Financial ledger balances updated.');
        if (type === 'salary') {
          setPayAmount((prev) => ({ ...prev, [financeId]: '' }));
          fetchFinances('salary');
        } else {
          setFeeAmount((prev) => ({ ...prev, [financeId]: '' }));
          fetchFinances('fee');
        }
      } else {
        const err = await res.json();
        addToast('danger', 'Transaction Failed', err.error || 'Check input.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndoPayment = async (financeId, type) => {
    const isConfirmed = window.confirm(
      '⚠️ Reversion Warning:\nAre you sure you want to revert this payment transaction? Paid balance will return to ₹0 and account balance will be restored.'
    );

    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/admin/finances/undo`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ finance_id: financeId }),
      });

      if (res.ok) {
        addToast('success', 'Payment Reverted', 'Balance restored to original pending state.');
        fetchFinances(type);
      } else {
        addToast('danger', 'Reversion Failed', 'Database could not rollback transaction.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPendingAmount = async (financeId, studentName, currentPending) => {
    const newAmountStr = window.prompt(`Edit Pending Amount for ${studentName}:`, currentPending);
    if (newAmountStr === null) return;

    const newAmount = parseFloat(newAmountStr);
    if (isNaN(newAmount) || newAmount < 0) {
      addToast('danger', 'Invalid Input', 'Please enter a valid non-negative number.');
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to change the pending fee balance for ${studentName} to ₹${newAmount.toFixed(2)}?`);
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/admin/finances/edit-pending`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ finance_id: financeId, amount_pending: newAmount }),
      });

      if (res.ok) {
        addToast('success', 'Balance Updated', `Pending fee balance updated to ₹${newAmount.toFixed(2)}.`);
        fetchFinances('fee');
      } else {
        const data = await res.json();
        addToast('danger', 'Update Failed', data.error || 'Server error.');
      }
    } catch (err) {
      console.error(err);
      addToast('danger', 'Connection Error', 'Failed to update balance.');
    }
  };

  const handleMarkNotPending = async (financeId, studentName) => {
    const isConfirmed = window.confirm(`⚠️ Mark Not Pending:\nAre you sure you want to mark ${studentName}'s fee status as Not Pending? This will clear their pending balance to ₹0.`);
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/admin/finances/edit-pending`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ finance_id: financeId, status: 'not_pending' }),
      });

      if (res.ok) {
        addToast('success', 'Status Updated', `${studentName}'s fees marked as Not Pending.`);
        fetchFinances('fee');
      } else {
        const data = await res.json();
        addToast('danger', 'Update Failed', data.error || 'Server error.');
      }
    } catch (err) {
      console.error(err);
      addToast('danger', 'Connection Error', 'Failed to update status.');
    }
  };

  const handleReviewLeave = async (leaveId, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/leaves/${leaveId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        addToast('success', 'Leave Reviewed', `Leave request successfully marked as ${status}.`);
        fetchLeaves();
        fetchFinances('salary');
      } else {
        addToast('danger', 'Error', 'Failed to review leave.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOverrideCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!credUserId) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users/credentials`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: credUserId,
          mobile_number: credMobile || undefined,
          password: credPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', 'Credentials Override Complete', `Security access profiles updated successfully.`);
        setCredUserId(null);
        setCredName('');
        setCredMobile('');
        setCredPassword('');
        fetchUsers();
      } else {
        addToast('danger', 'Override Failed', data.error || 'Server error.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Dynamic Tabs Navigation Header */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <UserPlus size={18} /> Roster Directory
        </button>
        <button
          className={`btn ${activeTab === 'finances' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('finances')}
        >
          <IndianRupee size={18} /> Financials Tracker
        </button>
        <button
          className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('leaves')}
        >
          <Calendar size={18} /> Leaves Manager
        </button>
        <button
          className={`btn ${activeTab === 'credentials' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('credentials')}
        >
          <Lock size={18} /> Credentials Override
        </button>
        <button
          className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={18} /> Community Chat
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. TAB: ROSTER DIRECTORY & SEPARATE ADD OPTION FORMS    */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Two Separate Addition Cards */}
          <div className="grid-2">
            
            {/* Enrollment Form: Teacher */}
            <div className="card">
              <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award style={{ color: 'var(--accent)' }} /> Enroll New Teacher
              </h2>
              <form onSubmit={handleEnrollTeacher}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Avantika Mishra"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 9988776655"
                    value={tMobile}
                    onChange={(e) => setTMobile(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contract Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={tPassword}
                    onChange={(e) => setTPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly contract Base Salary (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Default 3000"
                    value={tSalary}
                    onChange={(e) => setTSalary(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Billing Cycle Date</label>
                  <select
                    className="form-control"
                    value={tCycleDay}
                    onChange={(e) => setTCycleDay(e.target.value)}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>Day {day} of the Month</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Specialization</label>
                  <select
                    className="form-control"
                    value={tSubject}
                    onChange={(e) => setTSubject(e.target.value)}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Other">Other (Type Custom)</option>
                  </select>
                </div>
                {tSubject === 'Other' && (
                  <div className="form-group" style={{ animation: 'slide-in 0.2s ease' }}>
                     <label className="form-label">Type Custom Subject</label>
                     <input
                       type="text"
                       className="form-control"
                       placeholder="e.g. History"
                       value={tSubjectCustom}
                       onChange={(e) => setTSubjectCustom(e.target.value)}
                       required
                     />
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Enroll Teacher Contract
                </button>
              </form>
            </div>

            {/* Enrollment Form: Student */}
            <div className="card">
              <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCapIcon style={{ color: 'var(--accent)' }} /> Enroll New Student
              </h2>
              <form onSubmit={handleEnrollStudent}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Richard Feynman"
                    value={sName}
                    onChange={(e) => setSName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 8877665544"
                    value={sMobile}
                    onChange={(e) => setSMobile(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ecosystem Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={sPassword}
                    onChange={(e) => setSPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Annual Tuition Fee (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Default 1200"
                    value={sFee}
                    onChange={(e) => setSFee(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Billing Cycle Date</label>
                  <select
                    className="form-control"
                    value={sCycleDay}
                    onChange={(e) => setSCycleDay(e.target.value)}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>Day {day} of the Month</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Assignment</label>
                  <select
                    className="form-control"
                    value={sSubject}
                    onChange={(e) => setSSubject(e.target.value)}
                  >
                    <option value="All Subjects">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Other">Other (Type Custom)</option>
                  </select>
                </div>
                {sSubject === 'Other' && (
                  <div className="form-group" style={{ animation: 'slide-in 0.2s ease' }}>
                     <label className="form-label">Type Custom Subject</label>
                     <input
                       type="text"
                       className="form-control"
                       placeholder="e.g. Art & Craft"
                       value={sSubjectCustom}
                       onChange={(e) => setSSubjectCustom(e.target.value)}
                       required
                     />
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Enroll Student Account
                </button>
              </form>
            </div>

          </div>

          {/* Directory Listings with Drill-Down Actions */}
          <div className="grid-2">
            
            {/* Teacher Directory */}
            <div className="card">
              <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert style={{ color: 'var(--accent)' }} /> Registered Teacher Roster
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                💡 Click on any teacher below to view their active aggregate class history, marked student attendance register, and current month leave queries!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                {teachers.map((t) => (
                  <div 
                    key={t.id} 
                    className="checklist-item"
                    onClick={() => fetchTeacherDetails(t.id, t.name, t.mobile_number, t.subject)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.75rem 1rem', 
                      background: selectedTeacherId === t.id ? 'var(--accent-light)' : 'var(--bg-primary)', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedTeacherId === t.id ? '1px solid var(--accent)' : '1px solid transparent',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div>
                      <strong style={{ color: selectedTeacherId === t.id ? 'var(--accent)' : 'var(--text-main)' }}>
                        {t.name}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {t.mobile_number}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
                {teachers.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No teachers enrolled.</div>
                )}
              </div>
            </div>

            {/* Student Directory */}
            <div className="card">
              <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert style={{ color: 'var(--accent)' }} /> Registered Student Roster
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                {students.map((s) => (
                  <div 
                    key={s.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.75rem 1rem', 
                      background: 'var(--bg-primary)', 
                      borderRadius: '8px' 
                    }}
                  >
                    <strong>{s.name}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📞 {s.mobile_number}</span>
                  </div>
                ))}
                {students.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No students enrolled.</div>
                )}
              </div>
            </div>

          </div>

          {/* Drill-down Aggregate Pane (Teacher clicked) */}
          {selectedTeacherId && (
            <div className="card" style={{ borderLeft: '5px solid var(--accent)', animation: 'slide-in 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <span className="badge badge-accent" style={{ marginBottom: '0.25rem' }}>Contract Monitoring Details</span>
                  <h2 style={{ fontFamily: 'var(--font-display)' }}>📊 {selectedTeacherName}'s Operations Summary</h2>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span><strong>📞 Mobile:</strong> {selectedTeacherMobile}</span>
                    <span><strong>📚 Subject:</strong> {selectedTeacherSubject}</span>
                    <span><strong>🔑 Role:</strong> Teacher</span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedTeacherId(null)}>
                  Close Overlay
                </button>
              </div>

              {/* Sub tabs inside drill-down */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                  className={`btn btn-sm ${activeDetailTab === 'lectures' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveDetailTab('lectures')}
                >
                  Lectures Conducted ({teacherDetails.lectures.length})
                </button>
                <button
                  className={`btn btn-sm ${activeDetailTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveDetailTab('attendance')}
                >
                  Marked Attendance Registry ({teacherDetails.attendance.length})
                </button>
                <button
                  className={`btn btn-sm ${activeDetailTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveDetailTab('leaves')}
                >
                  Leaves requested This Month ({teacherDetails.leaves.length})
                </button>
              </div>

              {/* SUBTAB: LECTURES */}
              {activeDetailTab === 'lectures' && (
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Batch</th>
                          <th>Topic</th>
                          <th>Conducted Date</th>
                          <th>Hours Window</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherDetails.lectures.map((l) => (
                          <tr key={l.id}>
                            <td><strong>{l.batch_name}</strong></td>
                            <td>{l.topic}</td>
                            <td>{l.date}</td>
                            <td>{l.start_time} - {l.end_time}</td>
                          </tr>
                        ))}
                        {teacherDetails.lectures.length === 0 && (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No lectures recorded.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB: ATTENDANCE */}
              {activeDetailTab === 'attendance' && (
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Class Topic</th>
                          <th>Student Name</th>
                          <th>Student Mobile</th>
                          <th>Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherDetails.attendance.map((a) => (
                          <tr key={a.id}>
                            <td>{a.date}</td>
                            <td><strong>{a.topic}</strong></td>
                            <td>{a.student_name}</td>
                            <td>{a.student_mobile}</td>
                            <td>
                              <span className={`badge badge-${a.status === 'present' ? 'success' : a.status === 'late' ? 'warning' : 'danger'}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {teacherDetails.attendance.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No student attendance data found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB: LEAVES */}
              {activeDetailTab === 'leaves' && (
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Absence Window</th>
                          <th>Reason Description</th>
                          <th>Review Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherDetails.leaves.map((l) => (
                          <tr key={l.id}>
                            <td><strong>{l.start_date}</strong> to <strong>{l.end_date}</strong></td>
                            <td>{l.reason}</td>
                            <td>
                              <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {teacherDetails.leaves.length === 0 && (
                          <tr>
                            <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No contract leaves filed this month.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TAB: FINANCE TRACKER WITH UNDO payment reversions     */}
      {/* ======================================================== */}
      {activeTab === 'finances' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Teacher Payrolls */}
          <div className="card">
            <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award style={{ color: 'var(--accent)' }} /> Teacher Payroll Ledgers
            </h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Salary Paid</th>
                    <th>Salary Discussed</th>
                    <th>Amount Pending</th>
                    <th>Contract Due Date</th>
                    <th>Status</th>
                    <th>Record Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {s.mobile_number}</div>
                      </td>
                      <td>₹{s.amount_paid.toFixed(2)}</td>
                      <td>₹{s.amount_total.toFixed(2)}</td>
                      <td style={{ color: s.amount_pending > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '600' }}>
                        ₹{s.amount_pending.toFixed(2)}
                      </td>
                      <td>{s.due_date}</td>
                      <td>
                        <span className={`badge badge-${s.status === 'paid' ? 'success' : 'warning'}`}>
                          {s.status === 'paid' ? 'Settled' : s.status}
                        </span>
                      </td>
                      <td>
                        {s.status !== 'paid' ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                              className="form-control"
                              style={{ width: '148px', padding: '0.4rem 1.75rem 0.4rem 0.6rem', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border)', appearance: 'auto', WebkitAppearance: 'auto' }}
                              value={salaryPayType[s.id] || 'part'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSalaryPayType({ ...salaryPayType, [s.id]: val });
                                if (val === 'full') {
                                  setPayAmount({ ...payAmount, [s.id]: s.amount_pending.toString() });
                                } else {
                                  setPayAmount({ ...payAmount, [s.id]: '' });
                                }
                              }}
                            >
                              <option value="part">Part Payment</option>
                              <option value="full">Full Payment</option>
                            </select>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Amount"
                              style={{ width: '100px', padding: '0.4rem' }}
                              value={payAmount[s.id] || ''}
                              disabled={salaryPayType[s.id] === 'full'}
                              onChange={(e) => setPayAmount({ ...payAmount, [s.id]: e.target.value })}
                            />
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                const valStr = payAmount[s.id];
                                const amt = parseFloat(valStr);
                                if (!valStr || isNaN(amt) || amt <= 0) {
                                  addToast('danger', 'Invalid Payment', 'Please enter a positive numeric value.');
                                  return;
                                }
                                if (amt > s.amount_pending) {
                                  addToast('danger', 'Invalid Payment', 'Amount cannot exceed pending balance.');
                                  return;
                                }
                                const isConfirmed = window.confirm(`Confirm Transaction:\nAre you sure you want to log a payroll payment of ₹${amt.toFixed(2)} for ${s.name}?`);
                                if (isConfirmed) {
                                  handleRecordPayment(s.id, 'salary', valStr);
                                }
                              }}
                            >
                              Pay
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleUndoPayment(s.id, 'salary')}
                            style={{ fontSize: '0.75rem' }}
                          >
                            Undo Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {salaries.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No teacher payroll accounts loaded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Fees */}
          <div className="card">
            <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IndianRupee style={{ color: 'var(--accent)' }} /> Student Tuition Ledgers
            </h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Tuition Fees</th>
                    <th>Amount Paid</th>
                    <th>Balance Amount</th>
                    <th>Payment Due Date</th>
                    <th>Status</th>
                    <th>Log Fee Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <strong>{f.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {f.mobile_number}</div>
                      </td>
                      <td>₹{f.amount_total.toFixed(2)}</td>
                      <td>₹{f.amount_paid.toFixed(2)}</td>
                      <td style={{ color: f.amount_pending > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          ₹{f.amount_pending.toFixed(2)}
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.15rem 0.35rem', fontSize: '0.7rem' }}
                            onClick={() => handleEditPendingAmount(f.id, f.name, f.amount_pending)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                      <td>{f.due_date}</td>
                      <td>
                        <span className={`badge badge-${f.status === 'paid' ? 'success' : f.status === 'not_pending' ? 'success' : 'warning'}`}>
                          {f.status === 'paid' ? 'Settled' : f.status === 'not_pending' ? 'Not Pending' : f.status}
                        </span>
                      </td>
                      <td>
                        {f.status !== 'paid' && f.status !== 'not_pending' ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                              className="form-control"
                              style={{ width: '148px', padding: '0.4rem 1.75rem 0.4rem 0.6rem', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border)', appearance: 'auto', WebkitAppearance: 'auto' }}
                              value={feePayType[f.id] || 'part'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFeePayType({ ...feePayType, [f.id]: val });
                                if (val === 'full') {
                                  setFeeAmount({ ...feeAmount, [f.id]: f.amount_pending.toString() });
                                } else {
                                  setFeeAmount({ ...feeAmount, [f.id]: '' });
                                }
                              }}
                            >
                              <option value="part">Part Payment</option>
                              <option value="full">Full Payment</option>
                            </select>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Amount"
                              style={{ width: '100px', padding: '0.4rem' }}
                              value={feeAmount[f.id] || ''}
                              disabled={feePayType[f.id] === 'full'}
                              onChange={(e) => setFeeAmount({ ...feeAmount, [f.id]: e.target.value })}
                            />
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                const valStr = feeAmount[f.id];
                                const amt = parseFloat(valStr);
                                if (!valStr || isNaN(amt) || amt <= 0) {
                                  addToast('danger', 'Invalid Payment', 'Please enter a positive numeric value.');
                                  return;
                                }
                                if (amt > f.amount_pending) {
                                  addToast('danger', 'Invalid Payment', 'Amount cannot exceed pending balance.');
                                  return;
                                }
                                const isConfirmed = window.confirm(`Confirm Transaction:\nAre you sure you want to log a fee payment of ₹${amt.toFixed(2)} for ${f.name}?`);
                                if (isConfirmed) {
                                  handleRecordPayment(f.id, 'fee', valStr);
                                }
                              }}
                            >
                              Log
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleMarkNotPending(f.id, f.name)}
                              style={{ fontSize: '0.75rem' }}
                            >
                              Not Pending
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {f.status === 'not_pending' ? 'Waived (Not Pending)' : 'Fully Paid'}
                            </span>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleUndoPayment(f.id, 'fee')}
                              style={{ fontSize: '0.75rem' }}
                            >
                              Undo
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No student tuition ledgers loaded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB: LEAVES MANAGEMENT REVIEW                         */}
      {/* ======================================================== */}
      {activeTab === 'leaves' && (
        <div className="card">
          <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar style={{ color: 'var(--accent)' }} /> Leaves Management Review
          </h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Date Range</th>
                  <th>Reason Description</th>
                  <th>Current Status</th>
                  <th>Actions Hook</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {l.mobile_number}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '550' }}>{l.start_date}</span> to <span style={{ fontWeight: '550' }}>{l.end_date}</span>
                    </td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {l.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleReviewLeave(l.id, 'approved')}
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReviewLeave(l.id, 'rejected')}
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No teacher leave requests submitted.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem' }} className="badge badge-accent">
            💡 Leave Approval applies a 5% monthly base payroll salary deduction hook to the corresponding teacher's pending finances record!
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB: CREDENTIALS OVERRIDE & MODIFICATION CARD        */}
      {/* ======================================================== */}
      {activeTab === 'credentials' && (
        <div className="grid-2">
          
          {/* Column 1: Manage Teacher Credentials */}
          <div className="card">
            <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound style={{ color: 'var(--accent)' }} /> Teacher Credentials Override
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {teachers.map((teacher) => (
                <div 
                  key={teacher.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 1rem', 
                    background: 'var(--bg-primary)', 
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <strong>{teacher.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {teacher.mobile_number}</div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setCredUserId(teacher.id);
                      setCredName(teacher.name);
                      setCredMobile(teacher.mobile_number);
                      setCredPassword('');
                    }}
                  >
                    Modify
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Manage Student Credentials */}
          <div className="card">
            <h2 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound style={{ color: 'var(--accent)' }} /> Student Credentials Override
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {students.map((student) => (
                <div 
                  key={student.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem 1rem', 
                    background: 'var(--bg-primary)', 
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <strong>{student.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {student.mobile_number}</div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setCredUserId(student.id);
                      setCredName(student.name);
                      setCredMobile(student.mobile_number);
                      setCredPassword('');
                    }}
                  >
                    Modify
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inline Credentials Overlay Edit card */}
          {credUserId && (
            <div className="card" style={{ gridColumn: 'span 2', borderLeft: '5px solid var(--warning)', marginTop: '1rem', animation: 'slide-in 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }}>🔐 Overriding Account Access: {credName}</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setCredUserId(null)}>Cancel</button>
              </div>

              <form onSubmit={handleOverrideCredentialsSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Set New Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New login mobile"
                    value={credMobile}
                    onChange={(e) => setCredMobile(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Set New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Leave blank to keep current"
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                  Commit Credentials Override
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB: COMMUNITY BATCH CHAT SECTION                    */}
      {/* ======================================================== */}
      {activeTab === 'chat' && (
        <CommunityChat />
      )}
    </div>
  );
}

// Custom simple inline Icons to avoid missing import compilation issues
const GraduationCapIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);
