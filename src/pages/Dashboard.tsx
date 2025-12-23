import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import StatsOverview from '../components/dashboard/StatsOverview';
import BadgesWidget from '../components/dashboard/BadgesWidget';
import ChallengesList from '../components/dashboard/ChallengesList';
import LeaderboardWidget from '../components/dashboard/LeaderboardWidget';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import GamificationRules from '../components/dashboard/GamificationRules';
import { Icons } from '../components/dashboard/DashboardIcons';

// Mock Data Imports
import {
    mockUserStats,
    mockBadges,
    mockChallenges as initialChallenges,
    mockLeaderboard,
    mockActivity
} from '../data/mockGamification';

// Existing Mock Data (kept for content)
const continueWatching = [
    { id: 1, title: 'Maths : Le Théorème de Pythagore', author: 'Sophie Martin', lessons: 5, duration: '2h 15m', category: 'Mathématiques', rating: 4.9, progress: 65, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Anglais : Verbes Irréguliers', author: 'Alice Faure', lessons: 4, duration: '2h 00m', category: 'Anglais', rating: 4.5, progress: 30, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

const recommended = [
    { id: 3, title: 'Physique : Forces et Mouvement', author: 'Marie Leroy', lessons: 6, duration: '3h 45m', category: 'Physique-Chimie', rating: 4.7, image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Histoire : La Guerre Froide', author: 'Karim Ben', lessons: 10, duration: '5h 10m', category: 'Histoire-Géo', rating: 4.6, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'SVT : La Cellule et l\'ADN', author: 'Lucas Morel', lessons: 7, duration: '3h 15m', category: 'SVT', rating: 4.9, image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

export default function Dashboard() {
    const [userStats, setUserStats] = useState(mockUserStats);
    const [mockChallenges, setMockChallenges] = useState(initialChallenges);
    const [showRules, setShowRules] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

    // Clear toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleClaimReward = (id: string) => {
        // Find the challenge and get points
        const challenge = mockChallenges.find(c => c.id === id);
        if (challenge) {
            setUserStats(prev => ({
                ...prev,
                totalPoints: prev.totalPoints + challenge.rewardPoints
            }));

            // Mark challenge as claimed (locally mocked by removing it or acting like it's claimed)
            // For now, let's just show the toast
            setToast({
                message: `Bravo ! Vous avez gagné ${challenge.rewardPoints} points ! 🏆`,
                type: 'success'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-24 right-6 z-50 animate-fade-in-up">
                    <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-xl p-4 flex items-center gap-3 pr-8">
                        <div className="text-green-500 bg-green-50 p-2 rounded-full">
                            <Icons.CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Succès</p>
                            <p className="text-sm text-gray-600">{toast.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Background */}
            <div className="bg-white border-b border-gray-100 pt-8 pb-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="animate-fade-in-up">
                            <span className="text-primary font-bold tracking-wider uppercase text-xs">Tableau de bord</span>
                            <h1 className="text-3xl font-bold font-display text-gray-900 mt-1">
                                Bonjour, <span className="text-primary">Thomas</span> ! 👋
                            </h1>
                            <p className="text-gray-500 mt-2 text-lg">
                                Prêt à relever de nouveaux défis aujourd'hui ?
                            </p>
                        </div>

                        {/* Quick Action Button */}
                        <Link to="/formation" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:translate-y-[-2px]">
                            <span>Explorer le catalogue</span>
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 space-y-8">
                {/* Stats Overview */}
                <StatsOverview stats={userStats} />

                {/* Gamification Guide (Dismissible) */}
                {showRules && (
                    <div className="animate-fade-in">
                        <GamificationRules onClose={() => setShowRules(false)} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (Profile & Badges) - 3 cols */}
                    <div className="lg:col-span-3 space-y-8">
                        <UserProfileCard
                            user={{
                                name: 'Thomas P.',
                                avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                                title: 'Apprenti Sage'
                            }}
                            stats={userStats}
                        />
                        <BadgesWidget badges={mockBadges} />

                        {/* Mobile only: Challenges appear here on small screens */}
                        <div className="lg:hidden">
                            <ChallengesList challenges={mockChallenges} onClaim={handleClaimReward} />
                        </div>
                    </div>

                    {/* Middle Column (Learning Flow) - 6 cols */}
                    <div className="lg:col-span-6 space-y-10">
                        {/* Continue Watching */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Reprendre l'apprentissage
                                </h2>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                                {continueWatching.map(course => (
                                    <div key={course.id} className="w-[260px] flex-shrink-0">
                                        <CourseCard {...course} showProgress={true} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recommended */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Recommandé pour vous
                                </h2>
                                <Link to="/formation" className="text-primary font-bold text-sm hover:underline">Voir tout</Link>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                                {recommended.map(course => (
                                    <div key={course.id} className="w-[260px] flex-shrink-0">
                                        <CourseCard {...course} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Community & Challenges) - 3 cols */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="hidden lg:block">
                            <ChallengesList challenges={mockChallenges} onClaim={handleClaimReward} />
                        </div>
                        <LeaderboardWidget entries={mockLeaderboard} currentUserId="u3" />
                        <ActivityFeed activities={mockActivity} />
                    </div>

                </div>
            </div>
        </div>
    );
}

