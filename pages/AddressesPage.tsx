import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { navigate } from '../router';

export const AddressesPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({ street: '', city: '', country: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.address) {
            setFormData({
                street: user.address.street || '',
                city: user.address.city || '',
                country: user.address.country || '',
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
        setError(null);

        try {
            await updateUser({ address: formData });
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (err) {
            setError('Failed to update address. Please try again.');
            console.error("Address update failed:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div className="text-center py-10">Loading...</div>;

    const inputStyles = "w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition";
    
    // Sellers don't manage shipping addresses from here. They are onboarded differently.
    // This page is primarily for buyers.
    if (user.role === 'seller') {
        return (
             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Addresses</h1>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80 text-center">
                    <p className="text-neutral-600">Sellers manage their business location during onboarding and in their storefront settings.</p>
                </div>
             </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Addresses</h1>
                    <p className="text-neutral-500 mt-1">Manage your default shipping address.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6">{error}</div>}
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
                 <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-neutral-100">
                    <button
                        type="submit"
                        disabled={isSaving || isSuccess}
                        className={`px-8 py-2.5 text-sm font-semibold text-white rounded-xl transition w-40 flex justify-center items-center
                            ${isSuccess ? 'bg-green-600' : 'bg-neutral-900 hover:bg-neutral-800'}
                            disabled:opacity-70`}
                    >
                        {isSuccess ? <><CheckCircle className="w-5 h-5 mr-1.5" /> Saved!</> 
                        : isSaving ? 'Saving...' 
                        : <><Save className="w-5 h-5 mr-1.5" /> Save Address</>}
                    </button>
                </div>
            </form>
        </div>
    );
};