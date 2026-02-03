import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, User, CheckCircle, Save } from 'lucide-react';
import { navigate } from '../router';

export const SettingsPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        country: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                street: user.address?.street || '',
                city: user.address?.city || '',
                country: user.address?.country || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setIsSuccess(false);

        try {
            const updatedDetails = {
                name: formData.name,
                email: formData.email,
                address: user.role === 'buyer' ? {
                    street: formData.street,
                    city: formData.city,
                    country: formData.country,
                } : user.address,
            };
            await updateUser(updatedDetails);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (error) {
            alert('Failed to update profile.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return <div className="text-center py-10">Loading profile...</div>;
    }
    
    const inputStyles = "w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Edit Profile</h1>
                    <p className="text-neutral-500 mt-1">Manage your account details and shipping address.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Account Details */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                    <h2 className="text-xl font-bold mb-6">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputStyles} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={inputStyles} />
                        </div>
                    </div>
                </div>

                {/* Shipping Address - only for buyers */}
                {user.role === 'buyer' && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                        <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                         <div className="space-y-4">
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
                                <textarea name="street" id="street" required value={formData.street} onChange={handleChange} className={`${inputStyles} resize-none`} rows={2} placeholder="e.g. Plot 123, Main Mall" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                                    <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className={inputStyles} placeholder="e.g. Gaborone"/>
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
                                    <input type="text" name="country" id="country" required value={formData.country} onChange={handleChange} className={inputStyles} placeholder="e.g. Botswana"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Save Button */}
                <div className="flex justify-end gap-4 pt-6 border-t border-neutral-100">
                    <button type="button" onClick={() => navigate('/profile')} className="px-6 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50">Cancel</button>
                    <button
                        type="submit"
                        disabled={isSaving || isSuccess}
                        className={`px-8 py-2.5 text-sm font-semibold text-white rounded-xl transition w-40 flex justify-center items-center
                            ${isSuccess ? 'bg-green-600' : 'bg-neutral-900 hover:bg-neutral-800'}
                            disabled:opacity-70`}
                    >
                        {isSuccess ? <><CheckCircle className="w-5 h-5 mr-1.5" /> Saved!</> 
                        : isSaving ? 'Saving...' 
                        : <><Save className="w-5 h-5 mr-1.5" /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
