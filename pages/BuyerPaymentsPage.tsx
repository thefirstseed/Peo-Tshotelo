import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { navigate } from '../router';

export const BuyerPaymentsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Payment Methods</h1>
                    <p className="text-neutral-500 mt-1">Manage your saved cards.</p>
                </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80 text-center">
                <p className="text-neutral-600">Managing saved payment methods is not yet implemented.</p>
            </div>
        </div>
    );
};