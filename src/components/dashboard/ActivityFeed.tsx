import React from 'react';
import { Activity } from '../../data/mockGamification';

interface ActivityFeedProps {
    activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-6">Activité de la communauté</h3>

            <div className="space-y-6 relative">
                {/* Connector Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

                {activities.map((activity) => (
                    <div key={activity.id} className="relative flex gap-4">
                        <img src={activity.userAvatar} alt={activity.userAvatar} className="w-10 h-10 rounded-full object-cover border-4 border-white relative z-10" />

                        <div>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-gray-900">{activity.userName}</span> {activity.action} <span className="font-bold text-primary">{activity.target}</span>
                            </p>
                            <span className="text-xs text-gray-400 block mt-1">{activity.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
