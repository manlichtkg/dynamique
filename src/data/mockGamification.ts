
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    progress?: number;
    maxProgress?: number;
    unlockedDate?: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    rewardPoints: number;
    currentProgress: number;
    maxProgress: number;
    timeLeft: string; // e.g., "12h 30m"
    type: 'daily' | 'weekly';
}

export interface LeaderboardEntry {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    points: number;
    badgesCout: number;
    trend: 'up' | 'down' | 'neutral';
}

export interface Activity {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    action: string; // e.g., "unlocked a badge", "completed a lesson"
    target: string; // e.g., "Math Genius", "Algebra 101"
    timestamp: string; // e.g., "2h ago"
}

export interface UserStats {
    level: number;
    currentXP: number;
    nextLevelXP: number;
    totalPoints: number;
    dayStreak: number;
    coursesCompleted: number;
    quizzesPassed: number;
}

// Mock Data
export const mockUserStats: UserStats = {
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    totalPoints: 15420,
    dayStreak: 14,
    coursesCompleted: 8,
    quizzesPassed: 24,
};

export const mockBadges: Badge[] = [
    {
        id: '1',
        name: 'Premier Pas',
        description: 'Complétez votre première leçon',
        icon: '🚀',
        isUnlocked: true,
        unlockedDate: '2023-11-10',
    },
    {
        id: '2',
        name: 'Grand Savant',
        description: 'Obtenez 100% à 3 quiz consécutifs',
        icon: '🧠',
        isUnlocked: true,
        unlockedDate: '2023-12-05',
    },
    {
        id: '3',
        name: 'Marathonien',
        description: 'Étudiez pendant 2 heures sans pause',
        icon: '🏃',
        isUnlocked: false,
        progress: 90, // minutes
        maxProgress: 120,
    },
    {
        id: '4',
        name: 'Social',
        description: 'Participez à 5 discussions communautaires',
        icon: '💬',
        isUnlocked: false,
        progress: 2,
        maxProgress: 5,
    },
];

export const mockChallenges: Challenge[] = [
    {
        id: 'c1',
        title: 'Quiz Master',
        description: 'Terminez 3 quiz avec un score > 80%',
        rewardPoints: 500,
        currentProgress: 1,
        maxProgress: 3,
        timeLeft: '4h 12m',
        type: 'daily',
    },
    {
        id: 'c2',
        title: 'Explorateur de Sciences',
        description: 'Complétez le module "Physique Quantique"',
        rewardPoints: 1200,
        currentProgress: 45, // percent
        maxProgress: 100,
        timeLeft: '3j 10h',
        type: 'weekly',
    },
];

export const mockLeaderboard: LeaderboardEntry[] = [
    { id: 'u1', rank: 1, name: 'Coralie D.', avatar: 'https://i.pravatar.cc/150?u=1', points: 18500, badgesCout: 15, trend: 'neutral' },
    { id: 'u2', rank: 2, name: 'Lucas M.', avatar: 'https://i.pravatar.cc/150?u=2', points: 17200, badgesCout: 12, trend: 'up' },
    { id: 'u3', rank: 3, name: 'Thomas P.', avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', points: 15420, badgesCout: 8, trend: 'down' }, // Current User
    { id: 'u4', rank: 4, name: 'Sarah L.', avatar: 'https://i.pravatar.cc/150?u=4', points: 14900, badgesCout: 10, trend: 'up' },
    { id: 'u5', rank: 5, name: 'Medhi B.', avatar: 'https://i.pravatar.cc/150?u=5', points: 13800, badgesCout: 7, trend: 'down' },
];

export const mockActivity: Activity[] = [
    { id: 'a1', userId: 'u2', userName: 'Lucas M.', userAvatar: 'https://i.pravatar.cc/150?u=2', action: 'vient de gagner le badge', target: 'Matheux', timestamp: 'Il y a 5 min' },
    { id: 'a2', userId: 'u1', userName: 'Coralie D.', userAvatar: 'https://i.pravatar.cc/150?u=1', action: 'a terminé le cours', target: 'Introduction à la Philosophie', timestamp: 'Il y a 25 min' },
    { id: 'a3', userId: 'u4', userName: 'Sarah L.', userAvatar: 'https://i.pravatar.cc/150?u=4', action: 'a atteint le niveau', target: 'Niveau 10', timestamp: 'Il y a 1h' },
];
