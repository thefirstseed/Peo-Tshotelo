import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { navigate } from '../router';
import { Modal } from '../components/Modal';

const InfoRow: React.FC<{ label: string; children: React.ReactNode; action?: React.ReactNode; isLast?: boolean }> = ({ label, children, action, isLast }) => (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center py-5 ${!isLast ? 'border-b border-neutral-100' : ''}`}>
        <div className="mb-2 sm:mb-0">
            <p className="text-sm font-medium text-neutral-800">{label}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-600 text-left sm:text-right">{children}</div>
            {action && <div>{action}</div>}
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-2">{title}</h2>
        <div className="divide-y divide-neutral-100">
            {children}
        </div>
    </div>
);


export const EditProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    if (!user) return <div className="text-center py-10">Loading profile...</div>;

    const handleEmailSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmail.trim() === '' || newEmail === user.email) {
            setIsEmailModalOpen(false);
            return;
        }
        setIsSaving(true);
        setModalError(null);
        try {
            await updateUser({ email: newEmail, emailVerified: false });
            setIsEmailModalOpen(false);
        } catch (err) {
            setModalError('Failed to update email. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleVerifyEmail = async () => {
        // This is a mock verification. In a real app, this would trigger an email.
        setIsSaving(true);
        await updateUser({ emailVerified: true });
        setIsSaving(false);
    };

    const actionButtonStyles = "text-sm font-semibold text-primary-600 hover:underline";
    const addressString = user.address ? `${user.address.street}, ${user.address.city}, ${user.address.country}` : 'Not provided';

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Personal Information</h1>
                    <p className="text-neutral-500 mt-1">View and manage your personal details.</p>
                </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                <Section title="Personal info">
                    <InfoRow label="Username">
                        <p>{user.name}</p>
                    </InfoRow>
                    <InfoRow label="Account type" isLast>
                        <p className="capitalize">{user.role}</p>
                    </InfoRow>
                </Section>
                
                <Section title="Contact info">
                     <InfoRow 
                        label="Email address" 
                        action={
                            <button 
                                onClick={() => {
                                    setNewEmail(user.email);
                                    setModalError(null);
                                    setIsEmailModalOpen(true);
                                }} 
                                className={actionButtonStyles}>
                                Edit
                            </button>
                        }
                    >
                        <div className="flex flex-col items-start sm:items-end">
                            <span>{user.email}</span>
                            {user.emailVerified ? (
                                <span className="text-xs text-green-600 font-medium">Verified</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                <span className="text-xs text-yellow-600 font-medium">Not verified</span>
                                <button onClick={handleVerifyEmail} disabled={isSaving} className={`${actionButtonStyles} text-xs text-red-600`}>
                                    {isSaving ? 'Verifying...' : 'Verify'}
                                </button>
                                </div>
                            )}
                        </div>
                    </InfoRow>
                    <InfoRow label="Phone number" isLast>
                         {user.phone ? (
                             <div className="flex flex-col items-start sm:items-end">
                                 <span>{user.phone.number}</span>
                                 {user.phone.verified ? (
                                     <span className="text-xs text-green-600 font-medium">Verified</span>
                                 ) : (
                                     <span className="text-xs text-yellow-600 font-medium">Not verified</span>
                                 )}
                             </div>
                         ) : (
                             'Not provided'
                         )}
                    </InfoRow>
                </Section>

                <Section title="Personal details">
                     <InfoRow label="Legal name">
                        <p>{user.identity?.idNumber ? user.name : 'Not provided'}</p>
                    </InfoRow>
                     <InfoRow label="Address">
                        <p className="max-w-xs truncate">{addressString}</p>
                    </InfoRow>
                     <InfoRow label="Nationality">
                        <p>{user.identity?.nationality || 'Not provided'}</p>
                    </InfoRow>
                     <InfoRow label="Date of birth">
                        <p>{user.identity?.dateOfBirth ? new Date(user.identity.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                    </InfoRow>
                     <InfoRow label="Type of ID">
                        <p>{user.identity?.idType || 'Not provided'}</p>
                    </InfoRow>
                     <InfoRow label="ID number" isLast>
                        <p>{user.identity?.idNumber || 'Not provided'}</p>
                    </InfoRow>
                </Section>

            </div>
            
            <Modal 
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                title="Edit Email Address"
            >
                <form onSubmit={handleEmailSave}>
                    <p className="text-sm text-neutral-600 mb-4">For security, changing your email will require you to re-verify it.</p>
                    {modalError && (
                        <div className="flex items-start gap-2 text-xs text-red-600 mb-3 p-2 bg-red-50 rounded-md border border-red-200">
                           <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                           <span>{modalError}</span>
                        </div>
                    )}
                    <input 
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-70 flex items-center">
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};