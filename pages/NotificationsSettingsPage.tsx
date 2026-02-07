import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { navigate } from '../router';
import { Switch } from '../components/forms/Switch';

// Mocked initial state. In a real app, this would come from the user's profile/settings.
const initialSettings = {
  email: {
    messages: true,
    orders: true,
    likes: false,
    follows: true,
    promotions: true,
  },
  push: {
    messages: true,
    orders: true,
    likes: true,
    follows: true,
    promotions: false,
  },
};

const NotificationSettingRow: React.FC<{ label: string; emailChecked: boolean; onEmailChange: (checked: boolean) => void; pushChecked: boolean; onPushChange: (checked: boolean) => void; }> = 
({ label, emailChecked, onEmailChange, pushChecked, onPushChange }) => (
    <div className="flex justify-between items-center py-4">
        <p className="text-sm text-neutral-700">{label}</p>
        <div className="flex items-center gap-6">
            <Switch checked={emailChecked} onChange={onEmailChange} />
            <Switch checked={pushChecked} onChange={onPushChange} />
        </div>
    </div>
);

export const NotificationsSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState(initialSettings);

    const handleSettingChange = (channel: 'email' | 'push', type: keyof typeof initialSettings.email) => (checked: boolean) => {
        setSettings(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                [type]: checked,
            },
        }));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Notifications</h1>
                    <p className="text-neutral-500 mt-1">Manage how you receive notifications.</p>
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-neutral-900">Activity</h2>
                    <div className="flex items-center gap-6 text-sm font-semibold text-neutral-500">
                        <span className="w-12 text-center">Email</span>
                        <span className="w-12 text-center">Push</span>
                    </div>
                </div>

                <div className="divide-y divide-neutral-100">
                    <NotificationSettingRow 
                        label="New messages"
                        emailChecked={settings.email.messages}
                        onEmailChange={handleSettingChange('email', 'messages')}
                        pushChecked={settings.push.messages}
                        onPushChange={handleSettingChange('push', 'messages')}
                    />
                    <NotificationSettingRow 
                        label="Order updates"
                        emailChecked={settings.email.orders}
                        onEmailChange={handleSettingChange('email', 'orders')}
                        pushChecked={settings.push.orders}
                        onPushChange={handleSettingChange('push', 'orders')}
                    />
                    <NotificationSettingRow 
                        label="New item likes"
                        emailChecked={settings.email.likes}
                        onEmailChange={handleSettingChange('email', 'likes')}
                        pushChecked={settings.push.likes}
                        onPushChange={handleSettingChange('push', 'likes')}
                    />
                     <NotificationSettingRow 
                        label="New followers"
                        emailChecked={settings.email.follows}
                        onEmailChange={handleSettingChange('email', 'follows')}
                        pushChecked={settings.push.follows}
                        onPushChange={handleSettingChange('push', 'follows')}
                    />
                </div>

                <h2 className="text-lg font-bold text-neutral-900 mt-8 mb-4 px-1">From Kulture Kloze</h2>
                 <div className="divide-y divide-neutral-100">
                    <NotificationSettingRow 
                        label="Promotions and tips"
                        emailChecked={settings.email.promotions}
                        onEmailChange={handleSettingChange('email', 'promotions')}
                        pushChecked={settings.push.promotions}
                        onPushChange={handleSettingChange('push', 'promotions')}
                    />
                </div>
            </div>
        </div>
    );
};
