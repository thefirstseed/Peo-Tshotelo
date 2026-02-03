import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';
import { ChevronRight, Heart, MapPin, Settings, HelpCircle, Store } from 'lucide-react';

const ProfileMenuItem: React.FC<{icon: React.ElementType, label: string, onClick?: () => void}> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center text-left p-4 bg-white hover:bg-neutral-50 transition">
        <Icon className="w-6 h-6 text-neutral-500 mr-4" />
        <span className="flex-1 font-medium text-neutral-800">{label}</span>
        <ChevronRight className="w-5 h-5 text-neutral-400" />
    </button>
);

export const ProfileSettingsPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center py-20">Loading profile...</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-neutral-100 min-h-screen">
            <div className="bg-white pt-8 pb-6 text-center">
                 <h1 className="text-xl font-bold mb-6">Profile</h1>
                <img
                    // Replace with a dynamic user avatar if available in the future
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-neutral-200"
                />
                <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
                <p className="text-neutral-500 text-sm">{user.email}</p>
                <button 
                    onClick={() => navigate('/settings')}
                    className="mt-4 px-6 py-2 border border-primary-500 text-primary-600 font-semibold rounded-full text-sm hover:bg-primary-50 transition"
                >
                    Edit Profile
                </button>
            </div>
            
            <div className="py-6 px-4">
                {user.role === 'buyer' && (
                    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Store className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-neutral-800">Start Selling</h3>
                            <p className="text-sm text-neutral-500">Turn your products into profit.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/sell')}
                            className="bg-primary-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary-600 transition"
                        >
                            Become a Vendor
                        </button>
                    </div>
                )}

                <div className="rounded-xl shadow-sm overflow-hidden border border-neutral-200/80">
                    <ProfileMenuItem icon={Heart} label="Favorites" onClick={() => alert('Feature coming soon!')} />
                    <div className="h-px bg-neutral-200" />
                    <ProfileMenuItem icon={MapPin} label="Delivery Addresses" onClick={() => navigate('/settings')} />
                    <div className="h-px bg-neutral-200" />
                    <ProfileMenuItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
                    <div className="h-px bg-neutral-200" />
                    <ProfileMenuItem icon={HelpCircle} label="Help & Support" onClick={() => alert('Feature coming soon!')} />
                </div>
            </div>
        </div>
    );
};
