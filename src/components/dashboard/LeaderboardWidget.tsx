import React, { useState } from 'react';
import { LeaderboardEntry } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';

interface LeaderboardWidgetProps {
    entries: LeaderboardEntry[];
    currentUserId: string;
}

export default function LeaderboardWidget({ entries, currentUserId }: LeaderboardWidgetProps) {
    const [filter, setFilter] = useState<'points' | 'streaks'>('points');

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Classement</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setFilter('points')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filter === 'points' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Points
                    </button>
                    <button
                        onClick={() => setFilter('streaks')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filter === 'streaks' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Série
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {entries.sort((a, b) => a.rank - b.rank).map((entry) => (
                    <div
                        key={entry.id}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${entry.id === currentUserId ? 'bg-amber-50 border border-amber-100' : 'hover:bg-gray-50'}`}
                    >
                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' : entry.rank === 2 ? 'bg-gray-200 text-gray-600' : entry.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
                            {entry.rank}
                        </div>

                        <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full object-cover" />

                        <div className="flex-1">
                            <p className={`text-sm font-bold ${entry.id === currentUserId ? 'text-amber-900' : 'text-gray-900'}`}>
                                {entry.name} {entry.id === currentUserId && '(Moi)'}
                            </p>
                            <p className="text-xs text-gray-500">{entry.badgesCout} badges</p>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <p className="text-sm font-bold text-primary">{entry.points.toLocaleString()}</p>
                            <div className="h-4 flex items-center justify-end">
                                {entry.trend === 'up' ? (
                                    <Icons.TrendUp className="w-3 h-3 text-green-500" />
                                ) : entry.trend === 'down' ? (
                                    <Icons.TrendDown className="w-3 h-3 text-red-500" />
                                ) : (
                                    <span className="text-gray-300 text-xs">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                Voir tout le classement
            </button>
        </div>
    );
}
