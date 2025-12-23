import React from 'react';
import { UserStats } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatsOverviewProps {
    stats: UserStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
    const statItems = [
        { label: 'Points Totaux', value: stats.totalPoints.toLocaleString(), Icon: Icons.Trophy, color: 'text-yellow-600 bg-yellow-100' },
        { label: 'Série (Jours)', value: stats.dayStreak, Icon: Icons.Flame, color: 'text-orange-600 bg-orange-100' },
        { label: 'Cours Finis', value: stats.coursesCompleted, Icon: Icons.Book, color: 'text-blue-600 bg-blue-100' },
        { label: 'Quiz Réussis', value: stats.quizzesPassed, Icon: Icons.CheckCircle, color: 'text-green-600 bg-green-100' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((item, index) => (
                <Card key={index} padding="md" className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft-sm", item.color)}>
                        <item.Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold font-outfit text-gray-900 leading-none mb-1">{item.value}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
