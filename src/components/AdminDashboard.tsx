import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  LogOut,
  RefreshCw,
  Shield,
  BarChart2,
  Flame,
  Zap,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  college_name: string | null;
  xp: number | null;
  level: number | null;
  streak: number | null;
  completed_chapters: number[] | null;
  achievements: string[] | null;
  provider: string | null;
  active_world: string | null;
  is_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof UserProfile>('xp');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMsg, setSaveMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch profiles:', error);
        setProfiles([]);
      } else {
        setProfiles(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditForm({ ...user });
    setSaveStatus('idle');
    setSaveMsg('');
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({});
    setSaveStatus('idle');
    setSaveMsg('');
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaveStatus('saving');
    setSaveMsg('');

    try {
      const payload: any = {};
      if (editForm.username !== undefined) payload.username = editForm.username;
      if (editForm.email !== undefined) payload.email = editForm.email;
      if (editForm.college_name !== undefined) payload.college_name = editForm.college_name;
      if (editForm.xp !== undefined) payload.xp = Number(editForm.xp) || 0;
      if (editForm.level !== undefined) payload.level = Number(editForm.level) || 1;
      if (editForm.streak !== undefined) payload.streak = Number(editForm.streak) || 0;
      if (editForm.active_world !== undefined) payload.active_world = editForm.active_world;
      if (editForm.is_admin !== undefined) payload.is_admin = editForm.is_admin;
      if (editForm.completed_chapters !== undefined) payload.completed_chapters = editForm.completed_chapters;
      if (editForm.achievements !== undefined) payload.achievements = editForm.achievements;
      payload.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingUser.id);

      if (error) {
        setSaveStatus('error');
        setSaveMsg(error.message);
      } else {
        setSaveStatus('success');
        setSaveMsg('Profile updated successfully!');
        await fetchProfiles();
        setTimeout(() => closeEditModal(), 1200);
      }
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMsg(err.message || 'Update failed');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        alert('Failed to delete: ' + error.message);
      } else {
        setDeleteConfirm(null);
        await fetchProfiles();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSort = (field: keyof UserProfile) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Filter & sort
  const filtered = profiles
    .filter(p => {
      const q = searchQuery.toLowerCase();
      return (
        (p.username || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.college_name || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortAsc ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

  // Stats
  const totalUsers = profiles.filter(p => !p.is_admin).length;
  const avgXp = totalUsers > 0 ? Math.round(profiles.filter(p => !p.is_admin).reduce((sum, p) => sum + (p.xp || 0), 0) / totalUsers) : 0;
  const totalChaptersCompleted = profiles.reduce((sum, p) => sum + (p.completed_chapters?.length || 0), 0);
  const activeStreaks = profiles.filter(p => (p.streak || 0) > 0 && !p.is_admin).length;

  const SortableHeader = ({ field, label }: { field: keyof UserProfile; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
    >
      {label}
      {sortField === field ? (
        sortAsc ? <ChevronUp size={12} className="text-red-400" /> : <ChevronDown size={12} className="text-red-400" />
      ) : (
        <ArrowUpDown size={10} className="text-slate-600 group-hover:text-slate-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] bg-red-500/5" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[150px] bg-violet-500/5" />
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-red-400/30">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-[10px] text-slate-400 font-mono">GitVerse Administration · {profiles.length} profiles loaded</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProfiles}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-slate-400 hover:text-white hover:border-slate-600 transition-all duration-300 hover:shadow-lg"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/40 p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300">
              <Users size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{totalUsers}</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Users</span>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/40 p-5 flex items-center gap-4 shadow-xl hover:border-amber-500/30 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Zap size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{avgXp.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Avg XP</span>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/40 p-5 flex items-center gap-4 shadow-xl hover:border-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Award size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{totalChaptersCompleted}</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Chapters Done</span>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/40 p-5 flex items-center gap-4 shadow-xl hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300">
              <Flame size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{activeStreaks}</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Active Streaks</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/40 shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <BarChart2 size={18} className="text-red-400" />
              <h2 className="text-sm font-bold text-white">User Profiles</h2>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/40">
                {filtered.length} results
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 border border-slate-700/40 px-3 py-2 rounded-xl w-full sm:w-72">
              <Search size={14} className="text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search by name, email, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-xs w-full placeholder-slate-500"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw size={24} className="animate-spin text-slate-500 mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading profiles...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No profiles found{searchQuery && ` matching "${searchQuery}"`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800/40">
                    <th className="px-4 py-3 text-left"><SortableHeader field="username" label="User" /></th>
                    <th className="px-4 py-3 text-left"><SortableHeader field="email" label="Email" /></th>
                    <th className="px-4 py-3 text-left"><SortableHeader field="college_name" label="College" /></th>
                    <th className="px-4 py-3 text-center"><SortableHeader field="xp" label="XP" /></th>
                    <th className="px-4 py-3 text-center"><SortableHeader field="level" label="Level" /></th>
                    <th className="px-4 py-3 text-center"><SortableHeader field="streak" label="Streak" /></th>
                    <th className="px-4 py-3 text-center">Chapters</th>
                    <th className="px-4 py-3 text-center"><SortableHeader field="provider" label="Provider" /></th>
                    <th className="px-4 py-3 text-center">Admin</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {filtered.map((p) => (
                    <React.Fragment key={p.id}>
                      <tr className="hover:bg-slate-900/40 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-[10px] text-white border border-slate-600/50 shadow-sm shrink-0">
                              {(p.username || '??').substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-200 truncate max-w-[120px]">{p.username || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[10px] truncate max-w-[160px]">{p.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-slate-400 truncate max-w-[120px]">{p.college_name || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-black text-amber-300">{(p.xp || 0).toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
                            Lv {p.level || 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="flex items-center justify-center gap-1 text-orange-400 font-bold">
                            <Flame size={11} /> {p.streak || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                            className="text-slate-400 hover:text-white font-mono text-[10px] bg-slate-950/40 px-2 py-0.5 rounded border border-slate-700/40 hover:border-slate-600 transition-all"
                          >
                            {p.completed_chapters?.length || 0}/20
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border
                            ${p.provider === 'google' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                              p.provider === 'github' ? 'bg-slate-700/40 text-slate-300 border-slate-600/40' :
                              'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            }
                          `}>
                            {p.provider || 'supabase'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.is_admin ? (
                            <Shield size={14} className="text-red-400 mx-auto drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-amber-300 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all"
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            {!p.is_admin && (
                              <button
                                onClick={() => setDeleteConfirm(p.id)}
                                className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row: Chapters & Achievements */}
                      {expandedRow === p.id && (
                        <tr>
                          <td colSpan={10} className="px-6 py-4 bg-slate-950/40">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">Completed Chapters</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.completed_chapters && p.completed_chapters.length > 0 ? (
                                    p.completed_chapters.map(ch => (
                                      <span key={ch} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">
                                        Ch {ch}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-600 text-[10px]">None</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">Achievements</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.achievements && p.achievements.length > 0 ? (
                                    p.achievements.map(a => (
                                      <span key={a} className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded text-[10px] font-bold">
                                        {a}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-600 text-[10px]">None</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Active World</span>
                                <span className="text-[10px] text-slate-300">{p.active_world || 'Not set'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Created</span>
                                <span className="text-[10px] text-slate-300 font-mono">{p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Delete Confirmation */}
                      {deleteConfirm === p.id && (
                        <tr>
                          <td colSpan={10} className="px-6 py-4 bg-red-500/5 border-l-4 border-l-red-500">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-red-300">
                                <AlertTriangle size={14} />
                                <span>Delete <strong>{p.username || p.email}</strong>'s profile? This cannot be undone.</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-xs text-red-300 font-bold hover:bg-red-500/30 transition-all"
                                >
                                  Confirm Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeEditModal} />
          <div className="relative z-10 bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20">
                  {(editingUser.username || '??').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Profile</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{editingUser.id.substring(0, 8)}...</p>
                </div>
              </div>
              <button onClick={closeEditModal} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Username</label>
                <input
                  type="text"
                  value={editForm.username || ''}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                />
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">College</label>
                <input
                  type="text"
                  value={editForm.college_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, college_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                />
              </div>

              {/* XP, Level, Streak row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">XP</label>
                  <input
                    type="number"
                    value={editForm.xp ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, xp: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Level</label>
                  <input
                    type="number"
                    value={editForm.level ?? 1}
                    onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Streak</label>
                  <input
                    type="number"
                    value={editForm.streak ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, streak: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Active World */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active World</label>
                <select
                  value={editForm.active_world || 'kingdom'}
                  onChange={(e) => setEditForm({ ...editForm, active_world: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                >
                  <option value="kingdom">Kingdom</option>
                  <option value="space">Space</option>
                </select>
              </div>

              {/* Is Admin */}
              <div className="flex items-center gap-3 bg-slate-950/40 rounded-xl p-3 border border-slate-800/40">
                <input
                  type="checkbox"
                  checked={editForm.is_admin || false}
                  onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                  className="w-4 h-4 accent-red-500 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">Admin Access</span>
                  <span className="text-[10px] text-slate-500 block">Grant admin privileges to this user</span>
                </div>
              </div>

              {/* Completed Chapters (JSON editor) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Chapters (JSON array)</label>
                <input
                  type="text"
                  value={JSON.stringify(editForm.completed_chapters || [])}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (Array.isArray(parsed)) setEditForm({ ...editForm, completed_chapters: parsed });
                    } catch {}
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all font-mono text-[11px]"
                />
              </div>

              {/* Achievements (JSON editor) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Achievements (JSON array)</label>
                <input
                  type="text"
                  value={JSON.stringify(editForm.achievements || [])}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (Array.isArray(parsed)) setEditForm({ ...editForm, achievements: parsed });
                    } catch {}
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white outline-none focus:border-amber-500/50 transition-all font-mono text-[11px]"
                />
              </div>

              {/* Save Status */}
              {saveStatus !== 'idle' && (
                <div className={`flex items-center gap-2 rounded-xl p-3 text-xs border ${
                  saveStatus === 'saving' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                  saveStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                  'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                  {saveStatus === 'saving' && <RefreshCw size={14} className="animate-spin" />}
                  {saveStatus === 'success' && <CheckCircle2 size={14} />}
                  {saveStatus === 'error' && <AlertTriangle size={14} />}
                  <span>{saveMsg || (saveStatus === 'saving' ? 'Saving...' : '')}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/40">
              <button
                onClick={closeEditModal}
                className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs text-slate-300 font-bold hover:text-white hover:border-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
