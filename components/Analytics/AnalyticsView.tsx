import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MockFirebase, AnalyticsRecord } from '../../services/mockFirebase';

const AnalyticsView: React.FC = () => {
  const [logs, setLogs] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const data = await MockFirebase.db.getAnalytics();
        setLogs(data);
        setLoading(false);
    };
    loadData();
  }, []);

  const chartData = [
      { name: 'Deck A', views: 400, clicks: 240 },
      { name: 'Deck B', views: 300, clicks: 139 },
      { name: 'Deck C', views: 200, clicks: 980 },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in p-2">
        <div className="mb-8 px-4 pt-2">
            <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">Analytics</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Real-time engagement metrics.</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/20 dark:border-zinc-700">
                    <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white mb-8">Conversion Funnel</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="views" fill="#e4e4e7" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="clicks" fill="#f97316" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/20 dark:border-zinc-700">
                     <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white mb-8">Engagement Log</h3>
                     <div className="overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-400 uppercase font-header">
                                <tr>
                                    <th className="pb-4">Viewer</th>
                                    <th className="pb-4">Action</th>
                                    <th className="pb-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="py-3 font-bold text-zinc-700 dark:text-zinc-300">{log.viewer}</td>
                                        <td className="py-3 text-primary-600 font-bold">{log.action}</td>
                                        <td className="py-3 text-right text-zinc-400 font-medium">{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AnalyticsView;