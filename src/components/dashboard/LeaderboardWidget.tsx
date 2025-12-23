import React, { useState } from 'react';
import { LeaderboardEntry } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface LeaderboardWidgetProps {
    entries: LeaderboardEntry[];
    currentUserId: string;
}

export default function LeaderboardWidget({ entries, currentUserId }: LeaderboardWidgetProps) {
    const [filter, setFilter] = useState<'points' | 'streaks'>('points');

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900 text-xl">Classement</h3>
                <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => setFilter('points')}
                        className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200",
                            filter === 'points' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Points
                    </button>
                    <button
                        onClick={() => setFilter('streaks')}
                        className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200",
                            filter === 'streaks' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Série
                    </button>
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {entries.sort((a, b) => a.rank - b.rank).map((entry) => (
                    <div
                        key={entry.id}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 border",
                            entry.id === currentUserId
                                ? "bg-primary/5 border-primary/20"
                                : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 flex items-center justify-center font-bold rounded-full text-xs font-outfit",
                            entry.rank === 1 ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200" :
                                entry.rank === 2 ? "bg-gray-100 text-gray-700 ring-2 ring-gray-200" :
                                    entry.rank === 3 ? "bg-orange-100 text-orange-700 ring-2 ring-orange-200" :
                                        "text-gray-400 bg-transparent"
                        )}>
                            {entry.rank}
                        </div>

                        <Avatar src={entry.avatar} alt={entry.name} size="md" />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className={cn(
                                    "text-sm font-bold truncate",
                                    entry.id === currentUserId ? "text-primary-700" : "text-gray-900"
                                )}>
                                    {entry.name}
                                </p>
                                {entry.id === currentUserId && (
                                    <Badge variant="primary" size="sm" className="hidden sm:inline-flex">Moi</Badge>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">{entry.badgesCout} badges</p>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <p className="text-sm font-bold text-gray-900 font-outfit">{entry.points.toLocaleString()}</p>
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

            <Button variant="ghost" className="w-full mt-4 text-gray-500 hover:text-primary justify-between group">
                Voir tout le classement
                <Icons.ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
        </Card>
    );
}
