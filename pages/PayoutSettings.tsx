import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { ArrowLeft, Save, CheckCircle, Banknote, User as UserIcon, CreditCard, Hash, Smartphone, AlertTriangle } from 'lucide-react';
import { navigate } from '../router';
import { IconInput } from '../components/forms/IconInput';

const PillSelector: React.FC<{ options: string[], selected: string, onSelect: (value: string) => void }> = ({ options, selected, onSelect }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selected === option
            ? 'bg-primary-500 text-white' 
            : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
);

export const PayoutSettingsPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [bankDetails, setBankDetails] = useState({ bankName: '', accountHolder: '', accountNumber: '', branchCode: '' });
    const [mobileMoney, setMobileMoney] = useState({ provider: '', name: '', number: '' });

    useEffect(() => {
        if (user) {
            setBankDetails(user.bankDetails || { bankName: '', accountHolder: '', accountNumber: '', branchCode: '' });
            setMobileMoney(user.mobileMoneyDetails || { provider: '', name: '', number: '' });
        }
    }, [user]);

    const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileMoney({ ...mobileMoney, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setIsSuccess(false);
        setError(null);

        try {
            const updatedDetails: Partial<User> = {
                bankDetails: bankDetails.accountNumber ? bankDetails : undefined,
                mobileMoneyDetails: mobileMoney.number ? mobileMoney : undefined,
            };
            await updateUser(updatedDetails);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (err) {
            setError('Failed to update payout details. Please try again.');
            console.error("Payout update failed:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return <div className="text-center py-10">Loading settings...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Payout Settings</h1>
                    <p className="text-neutral-500 mt-1">Manage how you receive payments for your sales.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Bank Account */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                    <h2 className="text-xl font-bold mb-6">Bank Account Details</h2>
                    <p className="text-sm text-neutral-500 mb-6 -mt-4">Funds will be deposited here. Fill in all fields to activate this payout method.</p>
                    <div className="space-y-4">
                        <IconInput icon={Banknote} name="bankName" placeholder="Bank Name (e.g., FNB Botswana)" onChange={handleBankChange} value={bankDetails.bankName} />
                        <IconInput icon={UserIcon} name="accountHolder" placeholder="Account Holder Name" onChange={handleBankChange} value={bankDetails.accountHolder} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <IconInput icon={CreditCard} name="accountNumber" placeholder="Account Number" onChange={handleBankChange} value={bankDetails.accountNumber} />
                            <IconInput icon={Hash} name="branchCode" placeholder="Branch Code" onChange={handleBankChange} value={bankDetails.branchCode} />
                        </div>
                    </div>
                </div>

                {/* Mobile Money */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
                    <h2 className="text-xl font-bold mb-6">Mobile Money Details</h2>
                     <p className="text-sm text-neutral-500 mb-6 -mt-4">Alternatively, receive payments directly to your mobile money account.</p>
                    <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Provider</label>
                           <PillSelector 
                              options={['Orange Money', 'Mascom MyZaka', 'BTC Smega']}
                              selected={mobileMoney.provider}
                              onSelect={(p) => setMobileMoney(prev => ({...prev, provider: p}))}
                          />
                        </div>
                        {mobileMoney.provider && (
                            <div className="space-y-4 pt-2">
                                <IconInput icon={UserIcon} name="name" placeholder="Registered Name" onChange={handleMobileChange} value={mobileMoney.name} />
                                <IconInput icon={Smartphone} name="number" type="tel" placeholder="Mobile Number" onChange={handleMobileChange} value={mobileMoney.number} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4 pt-6 border-t border-neutral-100">
                    <button
                        type="submit"
                        disabled={isSaving || isSuccess}
                        className={`px-8 py-2.5 text-sm font-semibold text-white rounded-xl transition w-40 flex justify-center items-center
                            ${isSuccess ? 'bg-green-600' : 'bg-neutral-900 hover:bg-neutral-800'}
                            disabled:opacity-70`}
                    >
                        {isSuccess ? <><CheckCircle className="w-5 h-5 mr-1.5" /> Saved!</>
                        : isSaving ? 'Saving...'
                        : <><Save className="w-5 h-5 mr-1.5" /> Save Details</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
