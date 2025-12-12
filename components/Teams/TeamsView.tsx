
import React, { useEffect, useState } from 'react';
import { UserPlus, MoreHorizontal, Shield, Search, Mail, Users, X, Send } from 'lucide-react';
import { MockFirebase } from '../../services/mockFirebase';
import { TeamMember } from '../../types';

const TeamsView: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [isInviting, setIsInviting] = useState(false);

  const fetchMembers = async () => {
      const data = await MockFirebase.db.getTeamMembers();
      setMembers(data);
      setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
    const unsubscribe = MockFirebase.subscribe(fetchMembers);
    return () => unsubscribe();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inviteEmail) return;
      setIsInviting(true);
      await MockFirebase.db.inviteMember(inviteEmail, inviteRole);
      setIsInviting(false);
      setShowInviteModal(false);
      setInviteEmail('');
      // fetchMembers is handled via subscription now
  };

  return (
    <div className="h-full flex flex-col animate-fade-in gap-6 relative">
       {/* Header */}
      <div className="flex items-end justify-between flex-shrink-0 mb-2 px-2">
        <div>
            <h1 className="text-3xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white">Team Management</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Manage access and roles for your Devspace.</p>
        </div>
        <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-bold font-header shadow-lg shadow-zinc-900/10 dark:shadow-white/10 hover:scale-105 active:scale-95 duration-200"
        >
            <UserPlus size={18} />
            Invite Member
        </button>
      </div>

      <div className="flex-1 glass-gradient rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/20 dark:border-white/5 flex items-center justify-between gap-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-md">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search members..." 
                    className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-zinc-800/50 border border-white/30 dark:border-white/10 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm font-sans backdrop-blur-sm transition-all"
                />
            </div>
            <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-zinc-500 font-header uppercase">Filter by:</span>
                 <button className="px-3 py-1.5 rounded-lg border border-white/30 dark:border-white/10 bg-white/30 dark:bg-zinc-800/30 text-xs font-bold font-header text-zinc-700 dark:text-zinc-300 hover:bg-white/50 transition-colors">Role: All</button>
                 <button className="px-3 py-1.5 rounded-lg border border-white/30 dark:border-white/10 bg-white/30 dark:bg-zinc-800/30 text-xs font-bold font-header text-zinc-700 dark:text-zinc-300 hover:bg-white/50 transition-colors">Status: All</button>
            </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
            {loading ? (
                <div className="p-8 space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/20 dark:bg-zinc-800/20 rounded-xl animate-pulse"></div>)}
                </div>
            ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-20 animate-fade-in">
                    <div className="w-20 h-20 bg-white/40 dark:bg-zinc-800/40 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-6 shadow-sm border border-white/20">
                        <Users size={32} />
                    </div>
                    <h2 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white mb-2">No members yet</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-header max-w-xs">
                        Your team is currently empty. Invite your colleagues to start collaborating.
                    </p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/30 dark:bg-zinc-900/30 text-xs font-bold font-header uppercase text-zinc-400 dark:text-zinc-500 sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th className="px-8 py-4">Member</th>
                            <th className="px-8 py-4">Role</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Last Active</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 dark:divide-white/5">
                        {members.map(member => (
                            <tr key={member.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200 group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full ${member.avatar} flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white/20`}>
                                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white font-display tracking-[-0.04em] text-sm group-hover:text-primary-600 transition-colors">{member.name}</p>
                                            <div className="flex items-center gap-1 text-zinc-400 text-xs">
                                                <Mail size={10} />
                                                {member.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-header border backdrop-blur-sm ${
                                        member.role === 'Admin' ? 'bg-zinc-900/90 text-white border-zinc-900 dark:bg-white/90 dark:text-zinc-900' :
                                        member.role === 'Editor' ? 'bg-primary-50/50 text-primary-700 border-primary-200/50' :
                                        'bg-zinc-100/50 text-zinc-600 border-zinc-200/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50'
                                    }`}>
                                        {member.role === 'Admin' && <Shield size={10} />}
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : member.status === 'Invited' ? 'bg-amber-500' : 'bg-zinc-300'}`}></div>
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{member.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-sm text-zinc-400 font-medium">
                                    {member.status === 'Invited' ? '-' : 'Recently'}
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <button className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in rounded-[2rem]">
            <div className="glass-card w-full max-w-md p-8 rounded-[2rem] shadow-2xl relative bg-white/80 dark:bg-zinc-900/80">
                <button onClick={() => setShowInviteModal(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <X size={20} />
                </button>
                <div className="mb-6">
                    <div className="w-12 h-12 bg-primary-50/50 dark:bg-primary-900/20 text-primary-500 rounded-2xl flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-900/30">
                        <UserPlus size={24} />
                    </div>
                    <h3 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white">Invite Team Member</h3>
                    <p className="text-sm text-zinc-500 font-header">Send an invitation to join your workspace.</p>
                </div>
                
                <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Email Address</label>
                        <input 
                            autoFocus
                            type="email" 
                            required 
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="colleague@company.com" 
                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Admin', 'Editor', 'Viewer'].map(r => (
                                <button 
                                    key={r} 
                                    type="button"
                                    onClick={() => setInviteRole(r)}
                                    className={`px-2 py-2.5 rounded-xl text-sm font-bold font-header border transition-all ${
                                        inviteRole === r 
                                        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 shadow-md' 
                                        : 'bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-white/80'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!inviteEmail || isInviting}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold font-header py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transition-all mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isInviting ? 'Sending...' : <>Send Invitation <Send size={16} /></>}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeamsView;
