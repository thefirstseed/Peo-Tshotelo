import React, { useState } from 'react';
import { ArrowLeft, Store, CheckCircle, PenSquare } from 'lucide-react';
import { navigate } from '../router';

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`h-2 rounded-full transition-all duration-300 ${
          index < currentStep ? 'bg-primary-500 w-8' : 'bg-neutral-200 w-4'
        }`}
      />
    ))}
  </div>
);

export const VendorOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Form, 2: Success
  const [formData, setFormData] = useState({
    shopName: '',
    location: '',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 2));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting application:", formData);
    handleNext();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Become a Seller</h1>
            <p className="text-neutral-500 mt-2 mb-8">Join our community of creators and curators.</p>
            <button 
              onClick={handleNext}
              className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition"
            >
              Get Started
            </button>
          </div>
        );
      case 1:
        return (
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Tell us about your shop</h2>
                <p className="text-neutral-500 text-sm">This information will be displayed on your public profile.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Shop Name</label>
                <input required name="shopName" value={formData.shopName} onChange={handleChange} type="text" className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500" placeholder="e.g. Vintage Finds" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <input required name="location" value={formData.location} onChange={handleChange} type="text" className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500" placeholder="e.g. Gaborone, Botswana" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Short Bio</label>
                <textarea required name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500" placeholder="Describe what makes your shop special." />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
               <button type="button" onClick={handleBack} className="w-full bg-neutral-200 text-neutral-800 py-3 rounded-xl font-semibold hover:bg-neutral-300 transition">Back</button>
               <button type="submit" className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition">Continue</button>
            </div>
          </form>
        );
      case 2:
        return (
           <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">You're all set!</h2>
              <p className="text-neutral-500 mb-6">Your shop is ready. Start by adding your first product to get noticed.</p>
              <button onClick={() => navigate('/products/new')} className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition">
                 <PenSquare className="w-5 h-5"/> Add First Product
              </button>
           </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200/80">
        <ProgressBar currentStep={step} totalSteps={3} />
        {renderStep()}
      </div>
    </div>
  );
};
