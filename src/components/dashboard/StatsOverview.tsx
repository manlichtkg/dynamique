import React from 'react';
import { UserStats } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';

interface StatsOverviewProps {
    stats: UserStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
    const statItems = [
        { label: 'Points Totaux', value: stats.totalPoints.toLocaleString(), Icon: Icons.Trophy, color: 'bg-yellow-100 text-yellow-600' },
        { label: 'Série (Jours)', value: stats.dayStreak, Icon: Icons.Flame, color: 'bg-orange-100 text-orange-600' },
        { label: 'Cours Finis', value: stats.coursesCompleted, Icon: Icons.Book, color: 'bg-blue-100 text-blue-600' },
        { label: 'Quiz Réussis', value: stats.quizzesPassed, Icon: Icons.CheckCircle, color: 'bg-green-100 text-green-600' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                        <item.Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
