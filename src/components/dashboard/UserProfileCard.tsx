import React from 'react';
import { UserStats } from '../../data/mockGamification';

interface UserProfileCardProps {
    user: {
        name: string;
        avatar: string;
        title: string;
    };
    stats: UserStats;
}

export default function UserProfileCard({ user, stats }: UserProfileCardProps) {
    const xpPercentage = (stats.currentXP / stats.nextLevelXP) * 100;

    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 relative overflow-hidden group">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/20"></div>

            <div className="relative z-10 flex flex-col items-center mt-4">
                <div className="w-24 h-24 rounded-full p-1 bg-white shadow-xl">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-3">{user.name}</h2>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">
                    {user.title}
                </span>

                {/* Level & XP */}
                <div className="w-full mt-6">
                    <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                        <span>Niveau {stats.level}</span>
                        <span>{stats.currentXP} / {stats.nextLevelXP} XP</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${xpPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        Plus que {stats.nextLevelXP - stats.currentXP} XP pour atteindre le niveau {stats.level + 1} !
                    </p>
                </div>
            </div>
        </div>
    );
}
