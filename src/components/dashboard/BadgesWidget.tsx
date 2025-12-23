import React from 'react';
import { Badge } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';

interface BadgesWidgetProps {
    badges: Badge[];
}

const getBadgeIcon = (iconStr: string) => {
    switch (iconStr) {
        case '🚀': return Icons.Rocket;
        case '🧠': return Icons.Brain;
        case '🏃': return Icons.Clock;
        case '💬': return Icons.MessageCircle;
        default: return Icons.Star;
    }
};

export default function BadgesWidget({ badges }: BadgesWidgetProps) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Vos Badges</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {badges.filter(b => b.isUnlocked).length}/{badges.length} débloqués
                </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {badges.map((badge) => {
                    const IconComponent = getBadgeIcon(badge.icon);
                    return (
                        <div
                            key={badge.id}
                            className={`group relative flex-shrink-0 w-20 flex flex-col items-center gap-2 ${badge.isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'} transition-all hover:scale-110 cursor-pointer`}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs p-3 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-center pointer-events-none">
                                <p className="font-bold mb-1">{badge.name}</p>
                                <p>{badge.description}</p>
                                {!badge.isUnlocked && badge.maxProgress && (
                                    <div className="mt-2 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full" style={{ width: `${(badge.progress! / badge.maxProgress) * 100}%` }}></div>
                                    </div>
                                )}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                            </div>

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-2 ${badge.isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                <IconComponent className="w-8 h-8" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
