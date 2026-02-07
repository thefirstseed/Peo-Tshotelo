import React from 'react';
import { Heart, UserPlus } from 'lucide-react';

// MOCK DATA for activity feed
const MOCK_ACTIVITY = [
  { type: 'like', user: 'Sarah P.', item: 'Reworked Floral Dress', time: '2h ago' },
  { type: 'follow', user: 'John D.', time: '5h ago' },
  { type: 'like', user: 'Mike T.', item: 'Vintage Denim Jacket', time: '1d ago' },
  { type: 'follow', user: 'Lerato K.', time: '2d ago' },
];

const ActivityItem: React.FC<{ activity: typeof MOCK_ACTIVITY[0] }> = ({ activity }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
            {activity.type === 'like' ? <Heart className="w-4 h-4 text-red-500"/> : <UserPlus className="w-4 h-4 text-primary-600"/>}
        </div>
        <div className="flex-1">
            <p className="text-sm text-neutral-700">
                <span className="font-semibold">{activity.user}</span>
                {activity.type === 'like' ? ` liked your item ` : ' started following you.'}
                {activity.type === 'like' && <span className="font-semibold">{activity.item}</span>}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
        </div>
    </div>
);

export const ActivityFeed: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {MOCK_ACTIVITY.map((act, index) => <ActivityItem key={index} activity={act} />)}
            </div>
        </div>
    );
};
