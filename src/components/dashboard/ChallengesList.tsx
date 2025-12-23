import React from 'react';
import { Challenge } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';

interface ChallengesListProps {
    challenges: Challenge[];
    onClaim: (id: string) => void;
}

export default function ChallengesList({ challenges, onClaim }: ChallengesListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-lg">Défis en cours</h3>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                    {challenges.filter(c => c.currentProgress >= c.maxProgress).length} à réclamer
                </span>
            </div>

            {challenges.map(challenge => (
                <div key={challenge.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${challenge.type === 'daily' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {challenge.type === 'daily' ? 'Quotidien' : 'Hebdo'}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Icons.Clock className="w-3 h-3" />
                                    {challenge.timeLeft}
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900">{challenge.title}</h4>
                            <p className="text-sm text-gray-500">{challenge.description}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-primary flex items-center gap-1">
                                +{challenge.rewardPoints} <span className="text-xs">PTS</span>
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                            <span>Progression</span>
                            <span>{Math.round((challenge.currentProgress / challenge.maxProgress) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${challenge.currentProgress >= challenge.maxProgress ? 'bg-green-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min(100, (challenge.currentProgress / challenge.maxProgress) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {challenge.currentProgress >= challenge.maxProgress && (
                        <button
                            onClick={() => onClaim(challenge.id)}
                            className="w-full mt-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-green-200 shadow-lg transition-all active:scale-95"
                        >
                            Réclamer la récompense
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
