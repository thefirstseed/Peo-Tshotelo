import React, { useState } from 'react';
import { ArrowLeft, Store, Camera, MapPin, CheckCircle } from 'lucide-react';

interface VendorOnboardingPageProps {
  onBack: () => void;
}

export const VendorOnboardingPage: React.FC<VendorOnboardingPageProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    location: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success state
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Become a Kulture Kloze Seller</h1>
              <p className="text-gray-500 mt-2">Start selling your unique finds to thousands of customers online.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">More Customers</h3>
                  <p className="text-sm text-gray-500">Reach people across the country, beyond your local area.</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Easy Shipping</h3>
                  <p className="text-sm text-gray-500">Our delivery partners handle pickup and delivery for you.</p>
               </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Start Selling
            </button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
             <h2 className="text-xl font-bold mb-6">Your Shop Details</h2>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                   <input 
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                    placeholder="e.g. Thrifty Gabs"
                   />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
                   <input 
                    required
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Money Number</label>
                   <input 
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel" 
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                    placeholder="+267 7..."
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                   <div className="flex gap-2">
                     <input 
                      required
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      type="text" 
                      className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                      placeholder="e.g. Block 8, Gaborone"
                     />
                     <button type="button" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <MapPin className="w-5 h-5 text-gray-600" />
                     </button>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                     <Camera className="w-8 h-8 mb-2" />
                     <span className="text-sm">Tap to upload a profile picture</span>
                     <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
             </div>

             <button 
              type="submit"
              className="w-full mt-8 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Submit Application
            </button>
          </form>
        )}

        {step === 3 && (
           <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h2>
              <p className="text-gray-500 mb-6">We will call you on <b>{formData.phone}</b> within 24 hours to verify your details and complete setup.</p>
              <button onClick={onBack} className="text-emerald-600 font-medium hover:underline">
                 Return to Home
              </button>
           </div>
        )}
      </div>
    </div>
  );
};