import React from 'react';
import { Badge as BadgeType } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface BadgesWidgetProps {
    badges: BadgeType[];
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
    const unlockedCount = badges.filter(b => b.isUnlocked).length;

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900 text-xl">Vos Badges</h3>
                <Badge variant="ghost" size="md">
                    {unlockedCount}/{badges.length} débloqués
                </Badge>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center">
                {badges.map((badge) => {
                    const IconComponent = getBadgeIcon(badge.icon);
                    return (
                        <div
                            key={badge.id}
                            className={cn(
                                "group relative flex-shrink-0 w-20 flex flex-col items-center gap-3 transition-all duration-300",
                                badge.isUnlocked ? "opacity-100 hover:scale-110" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                            )}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 bg-gray-900 text-white p-4 rounded-2xl shadow-soft-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-center">
                                <p className="font-bold mb-1 text-sm font-outfit text-white">{badge.name}</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{badge.description}</p>
                                {!badge.isUnlocked && badge.maxProgress && (
                                    <div className="mt-3 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(badge.progress! / badge.maxProgress) * 100}%` }}
                                        ></div>
                                    </div>
                                )}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                            </div>

                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft-sm border-2 transition-all duration-300",
                                badge.isUnlocked
                                    ? "bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200 text-amber-600 shadow-amber-100"
                                    : "bg-gray-50 border-gray-100 text-gray-400"
                            )}>
                                <IconComponent className="w-8 h-8" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
