import React from 'react';
import { UserPlus, MoreHorizontal, Shield, Search, Mail } from 'lucide-react';

const TeamsView: React.FC = () => {
  const members = [
    { id: 1, name: 'Alex Designer', email: 'alex@agency.com', role: 'Admin', status: 'Active', avatar: 'bg-emerald-500' },
    { id: 2, name: 'Sarah Strategy', email: 'sarah@agency.com', role: 'Editor', status: 'Active', avatar: 'bg-blue-500' },
    { id: 3, name: 'Mike Analyst', email: 'mike@agency.com', role: 'Viewer', status: 'Active', avatar: 'bg-amber-500' },
    { id: 4, name: 'Rachel Lead', email: 'rachel@agency.com', role: 'Editor', status: 'Offline', avatar: 'bg-purple-500' },
    { id: 5, name: 'John Doe', email: 'john@agency.com', role: 'Viewer', status: 'Invited', avatar: 'bg-zinc-400' },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in gap-6">
       {/* Header */}
      <div className="flex items-end justify-between flex-shrink-0">
        <div>
            <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">Team Management</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Manage access and roles for your Devspace.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-bold font-header shadow-lg shadow-zinc-900/10 dark:shadow-white/10 hover:scale-105 active:scale-95">
            <UserPlus size={18} />
            Invite Member
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search members..." 
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm font-sans"
                />
            </div>
            <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-zinc-500 font-header uppercase">Filter by:</span>
                 <button className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold font-header text-zinc-700 dark:text-zinc-300">Role: All</button>
                 <button className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold font-header text-zinc-700 dark:text-zinc-300">Status: All</button>
            </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
            <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-bold font-header uppercase text-zinc-400 dark:text-zinc-500 sticky top-0">
                    <tr>
                        <th className="px-8 py-4">Member</th>
                        <th className="px-8 py-4">Role</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Last Active</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {members.map(member => (
                        <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                            <td className="px-8 py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full ${member.avatar} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 dark:text-white font-display text-sm">{member.name}</p>
                                        <div className="flex items-center gap-1 text-zinc-400 text-xs">
                                            <Mail size={10} />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-header border ${
                                    member.role === 'Admin' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900' :
                                    member.role === 'Editor' ? 'bg-primary-50 text-primary-700 border-primary-200' :
                                    'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
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
                                {member.status === 'Invited' ? '-' : '2 hours ago'}
                            </td>
                            <td className="px-8 py-4 text-right">
                                <button className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default TeamsView;