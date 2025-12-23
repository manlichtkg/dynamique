import React from 'react';
import { Challenge } from '../../data/mockGamification';
import { Icons } from './DashboardIcons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ChallengesListProps {
    challenges: Challenge[];
    onClaim: (id: string) => void;
}

export default function ChallengesList({ challenges, onClaim }: ChallengesListProps) {
    const claimableCount = challenges.filter(c => c.currentProgress >= c.maxProgress).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display font-bold text-gray-900 text-xl">Défis en cours</h3>
                {claimableCount > 0 && (
                    <Badge variant="error" className="animate-pulse shadow-sm">
                        {claimableCount} à réclamer
                    </Badge>
                )}
            </div>

            {challenges.map(challenge => (
                <Card
                    key={challenge.id}
                    padding="lg"
                    className={`transition-all duration-300 border-l-4 ${challenge.currentProgress >= challenge.maxProgress
                            ? 'border-l-success shadow-soft-md'
                            : 'border-l-transparent hover:border-l-primary/50'
                        }`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant={challenge.type === 'daily' ? 'secondary' : 'accent'} size="sm" className="uppercase tracking-wider">
                                    {challenge.type === 'daily' ? 'Quotidien' : 'Hebdo'}
                                </Badge>
                                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                    <Icons.Clock className="w-3.5 h-3.5" />
                                    {challenge.timeLeft}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{challenge.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-primary text-lg flex items-center gap-1">
                                +{challenge.rewardPoints} <span className="text-xs font-bold text-primary-600">PTS</span>
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>Progression</span>
                            <span>{Math.round((challenge.currentProgress / challenge.maxProgress) * 100)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${challenge.currentProgress >= challenge.maxProgress ? 'bg-success' : 'bg-primary'
                                    }`}
                                style={{ width: `${Math.min(100, (challenge.currentProgress / challenge.maxProgress) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {challenge.currentProgress >= challenge.maxProgress && (
                        <div className="mt-5 pt-4 border-t border-gray-50">
                            <Button
                                onClick={() => onClaim(challenge.id)}
                                className="w-full bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20"
                            >
                                Réclamer la récompense
                            </Button>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
