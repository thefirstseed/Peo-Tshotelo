import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchVendor, updateVendorProfile } from '../api/api';
import { Vendor } from '../types';
import { ArrowLeft, Save, CheckCircle, Image as ImageIcon, Briefcase, MapPin, Loader } from 'lucide-react';
import { navigate } from '../router';

// A simplified image picker for profile/banner
const ImagePicker: React.FC<{ label: string; currentImageUrl: string; onFileSelect: (file: File) => void; aspectClass?: string }> = ({ label, currentImageUrl, onFileSelect, aspectClass = "aspect-square" }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(currentImageUrl);

    useEffect(() => {
        setPreview(currentImageUrl);
    }, [currentImageUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
            <div className={`relative ${aspectClass} rounded-xl border border-neutral-300 bg-neutral-100 group overflow-hidden`}>
                <img src={preview} alt={label} className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                >
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-semibold">Change Image</span>
                </button>
            </div>
            <input type="file" ref={inputRef} onChange={handleFileChange} className="sr-only" accept="image/jpeg, image/png" />
        </div>
    );
};


export const StorefrontSettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', description: '', location: '' });
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    
    useEffect(() => {
        if (user?.vendorId) {
            fetchVendor(user.vendorId)
                .then(data => {
                    setVendor(data);
                    setFormData({
                        name: data.name,
                        description: data.description,
                        location: data.location,
                    });
                })
                .catch(err => {
                    setError("Failed to load your storefront data.");
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.vendorId) return;
        
        setIsSaving(true);
        setIsSuccess(false);
        setError(null);

        try {
            const updates: Partial<Vendor> = { ...formData };
            if (profileImageFile) {
                updates.imageUrl = URL.createObjectURL(profileImageFile); // Simulate upload
            }
            if (bannerImageFile) {
                updates.bannerUrl = URL.createObjectURL(bannerImageFile); // Simulate upload
            }

            const updatedVendor = await updateVendorProfile(user.vendorId, updates);
            setVendor(updatedVendor); // Update local state with the result from API
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (err) {
            setError("Failed to save changes. Please try again.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) return <div className="flex justify-center items-center h-64"><Loader className="w-8 h-8 animate-spin text-primary-500" /></div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!vendor) return <div className="text-center py-10">Could not find vendor information.</div>

    const inputStyles = "w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Storefront Settings</h1>
                    <p className="text-neutral-500 mt-1">Customize your public shop page.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left side - image pickers */}
                    <div className="md:col-span-1 space-y-6">
                         <ImagePicker 
                            label="Profile Picture (Logo)"
                            currentImageUrl={vendor.imageUrl}
                            onFileSelect={setProfileImageFile}
                         />
                         <ImagePicker 
                            label="Banner Image"
                            currentImageUrl={vendor.bannerUrl}
                            onFileSelect={setBannerImageFile}
                            aspectClass="aspect-[16/9]"
                         />
                    </div>

                    {/* Right side - text fields */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="name" className="flex items-center text-sm font-medium text-neutral-700 mb-1">
                                <Briefcase className="w-4 h-4 mr-2 text-neutral-400"/> Store Name
                            </label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputStyles} />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">Store Description</label>
                            <textarea name="description" id="description" required value={formData.description} onChange={handleChange} rows={5} className={inputStyles}></textarea>
                        </div>
                        <div>
                            <label htmlFor="location" className="flex items-center text-sm font-medium text-neutral-700 mb-1">
                               <MapPin className="w-4 h-4 mr-2 text-neutral-400"/> Location
                            </label>
                            <input type="text" name="location" id="location" required value={formData.location} onChange={handleChange} className={inputStyles} />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
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
                        : <><Save className="w-5 h-5 mr-1.5" /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
