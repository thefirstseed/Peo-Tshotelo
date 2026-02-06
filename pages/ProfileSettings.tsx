import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, User, ChevronRight, Store, CreditCard, Shield, MapPin, Heart, ShoppingBag } from 'lucide-react';
import { navigate } from '../router';

const SettingsLink: React.FC<{ title: string; description: string; icon: React.ElementType; onClick: () => void; }> = ({ title, description, icon: Icon, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center text-left p-4 hover:bg-neutral-50 rounded-lg transition-colors">
        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
            <Icon className="w-5 h-5 text-neutral-600" />
        </div>
        <div className="flex-1">
            <h3 className="font-semibold text-neutral-800">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-400" />
    </button>
);

export const ProfileSettingsPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Account Settings</h1>
                    <p className="text-neutral-500 mt-1">Manage your personal info, payments, and account security.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {/* Personal Info Section */}
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 px-4 mb-2">Personal Info</h2>
                    <div className="bg-white py-2 px-1 rounded-2xl shadow-sm border border-neutral-200/80 space-y-1">
                        <SettingsLink 
                            title="Personal information" 
                            description="Update your name and contact details."
                            icon={User}
                            onClick={() => navigate('/settings/personal-info')}
                        />
                        <SettingsLink 
                            title="Sign-in and security" 
                            description="Change your password."
                            icon={Shield}
                            onClick={() => navigate('/settings/security')}
                        />
                        <SettingsLink 
                            title="Addresses" 
                            description="Manage shipping addresses."
                            icon={MapPin}
                            onClick={() => navigate('/settings/addresses')}
                        />
                    </div>
                </div>

                {/* Payment Information Section */}
                 <div>
                    <h2 className="text-lg font-bold text-neutral-900 px-4 mb-2">Payment Information</h2>
                     <div className="bg-white py-2 px-1 rounded-2xl shadow-sm border border-neutral-200/80 space-y-1">
                        {user.role === 'seller' ? (
                            <SettingsLink 
                                title="Payouts" 
                                description="Manage your payout methods."
                                icon={CreditCard}
                                onClick={() => navigate('/settings/payouts')}
                            />
                        ) : (
                             <SettingsLink 
                                title="Payments" 
                                description="Manage saved cards for checkout."
                                icon={CreditCard}
                                onClick={() => navigate('/settings/payments')}
                            />
                        )}
                    </div>
                </div>

                {user.role === 'seller' && (
                  <div>
                      <h2 className="text-lg font-bold text-neutral-900 px-4 mb-2">Seller Tools</h2>
                       <div className="bg-white py-2 px-1 rounded-2xl shadow-sm border border-neutral-200/80 space-y-1">
                          <SettingsLink 
                              title="Storefront" 
                              description="Customize your public shop page."
                              icon={Store}
                              onClick={() => navigate('/settings/storefront')}
                          />
                      </div>
                  </div>
                )}

                 <div>
                    <h2 className="text-lg font-bold text-neutral-900 px-4 mb-2">My Activity</h2>
                     <div className="bg-white py-2 px-1 rounded-2xl shadow-sm border border-neutral-200/80 space-y-1">
                         {user.role === 'buyer' && (
                           <SettingsLink 
                                title="Purchase History" 
                                description="View your past orders."
                                icon={ShoppingBag}
                                onClick={() => navigate('/settings/history')}
                            />
                         )}
                         <SettingsLink 
                            title="Wishlist" 
                            description="View your saved items."
                            icon={Heart}
                            onClick={() => navigate('/wishlist')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};