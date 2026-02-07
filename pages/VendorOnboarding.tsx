import React, { useState } from 'react';
import { navigate } from '../router';
import { useAuth } from '../hooks/useAuth';
import { IconInput } from '../components/forms/IconInput';
import { FileUpload } from '../components/forms/FileUpload';
import { ArrowLeft, Store, Building, Shield, FileText, User as UserIcon, Mail, Phone, MapPin, Hash, BookText, Banknote, CreditCard, Wallet, CheckCircle, Calendar, Globe } from 'lucide-react';

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="relative mb-8 h-1 w-full bg-neutral-200 rounded-full">
    <div 
      className="absolute top-0 left-0 h-1 bg-primary-500 rounded-full transition-all duration-300"
      style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
    />
  </div>
);

const PillSelector: React.FC<{ options: string[], selected: string | string[], onToggle: (value: string) => void }> = ({ options, selected, onToggle }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            (Array.isArray(selected) && selected.includes(option)) || selected === option
            ? 'bg-primary-500 text-white' 
            : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
);


export const VendorOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { completeSellerOnboarding, user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
      // Step 1 - Business
      businessName: '',
      // Step 1 - Personal
      ownerName: user?.name || '',
      phone: user?.phone?.number || '',
      email: user?.email || '',
      address: '',
      nationality: '',
      dateOfBirth: '',
      idType: '',
      ownerId: '',
      // Step 2
      marketName: '', stallNumber: '', locationAddress: '', description: '', 
      categories: [] as string[],
      // Step 3
      bankName: '', accountHolder: '', accountNumber: '', branchCode: '', 
      mobileMoneyProvider: '', mobileMoneyName: '', mobileMoneyNumber: '',
      // Step 4
      idFile: null as File | null, shopPhotoFile: null as File | null,
      productPhotosFile: null as File | null, bankStatementFile: null as File | null, termsAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (name: string) => (file: File | null) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.termsAccepted) {
          alert('You must agree to the terms and conditions.');
          return;
      }
      setIsSubmitting(true);
      console.log('Submitting vendor application', formData);
      
      try {
        // 1. Update user with KYC info from the form
        await updateUser({
            name: formData.ownerName,
            phone: { number: formData.phone, verified: false },
            // For simplicity, we store the full address in the 'street' field of the address object
            address: { street: formData.address, city: '', country: '' }, 
            identity: {
                nationality: formData.nationality,
                dateOfBirth: formData.dateOfBirth,
                idType: formData.idType,
                idNumber: formData.ownerId,
            }
        });

        // 2. Mark onboarding as complete (updates user role and assigns a vendorId)
        await completeSellerOnboarding();

        setIsSubmitting(false);
        handleNext(); // Move to success step
      } catch (error) {
          console.error("Onboarding submission failed:", error);
          alert("There was an error submitting your application. Please try again.");
          setIsSubmitting(false);
      }
  };
  
  const renderStep = () => {
      switch(step) {
          case 1: return (
              <div>
                  <h2 className="text-xl font-bold mb-6">Owner & Business Information</h2>
                  
                  <h3 className="font-semibold text-neutral-800 mb-3 text-base">Contact Information</h3>
                  <div className="space-y-4 mb-6">
                     <IconInput icon={Mail} name="email" type="email" placeholder="Email Address *" required onChange={handleChange} value={formData.email}/>
                     <IconInput icon={Phone} name="phone" type="tel" placeholder="Phone Number *" required onChange={handleChange} value={formData.phone}/>
                  </div>

                  <h3 className="font-semibold text-neutral-800 mb-3 text-base">Personal Details</h3>
                   <div className="space-y-4 mb-6">
                      <IconInput icon={UserIcon} name="ownerName" placeholder="Legal Name *" required onChange={handleChange} value={formData.ownerName}/>
                      <IconInput icon={MapPin} name="address" placeholder="Address *" required isTextarea onChange={handleChange} value={formData.address}/>
                      <IconInput icon={Globe} name="nationality" placeholder="Nationality *" required onChange={handleChange} value={formData.nationality}/>
                      <IconInput icon={Calendar} name="dateOfBirth" placeholder="Date of birth (YYYY-MM-DD) *" required onChange={handleChange} value={formData.dateOfBirth} />
                      <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Type of ID *</label>
                           <PillSelector 
                              options={['Omang', 'Passport', "Driver's License"]}
                              selected={formData.idType}
                              onToggle={(type) => setFormData(p => ({...p, idType: p.idType === type ? '' : type}))}
                          />
                      </div>
                      <IconInput icon={FileText} name="ownerId" placeholder="ID number *" required onChange={handleChange} value={formData.ownerId}/>
                   </div>
                  
                  <h3 className="font-semibold text-neutral-800 mb-3 text-base">Business Details</h3>
                  <div className="space-y-4">
                      <IconInput icon={Store} name="businessName" placeholder="Business/Stall Name *" required onChange={handleChange} value={formData.businessName}/>
                  </div>
              </div>
          );
          case 2: return (
              <div>
                  <h2 className="text-xl font-bold mb-1">Location & Business Details</h2>
                  <p className="text-sm text-neutral-500 mb-6">Where is your business located and what do you sell?</p>
                  <div className="space-y-4">
                      <IconInput icon={Building} name="marketName" placeholder="Market Name (e.g. BBS Mall, Main Mall)" onChange={handleChange} value={formData.marketName}/>
                      <IconInput icon={Hash} name="stallNumber" placeholder="Stall Number/Location *" required onChange={handleChange} value={formData.stallNumber}/>
                      <IconInput icon={MapPin} name="locationAddress" placeholder="Full Address/Location Details *" required isTextarea onChange={handleChange} value={formData.locationAddress}/>
                      <IconInput icon={BookText} name="description" placeholder="Describe your business and products *" required isTextarea onChange={handleChange} value={formData.description}/>
                      <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">Product Categories *</label>
                          <PillSelector 
                              options={['Clothing', 'Accessories', 'Shoes', 'Jewelry', 'Home', 'Crafts']}
                              selected={formData.categories}
                              onToggle={(cat) => setFormData(p => ({...p, categories: p.categories.includes(cat) ? p.categories.filter(c => c !== cat) : [...p.categories, cat]}))}
                          />
                      </div>
                  </div>
              </div>
          );
          case 3: return (
              <div>
                  <h2 className="text-xl font-bold mb-1">Banking Information</h2>
                  <p className="text-sm text-neutral-500 mb-6">We need your banking details to process payments.</p>
                  <h3 className="font-semibold text-neutral-800 mb-3">Bank Account Details</h3>
                  <div className="space-y-4 mb-6">
                      <IconInput icon={Banknote} name="bankName" placeholder="Bank Name *" required onChange={handleChange} value={formData.bankName}/>
                      <IconInput icon={UserIcon} name="accountHolder" placeholder="Account Holder Name *" required onChange={handleChange} value={formData.accountHolder}/>
                      <div className="flex gap-4">
                          <IconInput icon={CreditCard} name="accountNumber" placeholder="Account Number *" required onChange={handleChange} value={formData.accountNumber}/>
                          <IconInput icon={Hash} name="branchCode" placeholder="Branch Code" onChange={handleChange} value={formData.branchCode}/>
                      </div>
                  </div>
                  <h3 className="font-semibold text-neutral-800 mb-3">Mobile Money Details</h3>
                  <div className="space-y-4">
                      <PillSelector 
                          options={['Orange Money', 'Mascom MyZaka', 'BTC Smega']}
                          selected={formData.mobileMoneyProvider}
                          onToggle={(p) => setFormData(prev => ({...prev, mobileMoneyProvider: prev.mobileMoneyProvider === p ? '' : p}))}
                      />
                      {formData.mobileMoneyProvider && (
                        <div className="space-y-4 pt-2">
                            <IconInput 
                                icon={UserIcon} 
                                name="mobileMoneyName" 
                                placeholder="Account Holder Name *" 
                                required 
                                onChange={handleChange} 
                                value={formData.mobileMoneyName}
                            />
                            <IconInput 
                                icon={Phone} 
                                name="mobileMoneyNumber" 
                                type="tel"
                                placeholder="Mobile Number *" 
                                required 
                                onChange={handleChange} 
                                value={formData.mobileMoneyNumber}
                            />
                        </div>
                      )}
                  </div>
              </div>
          );
          case 4: return (
              <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold mb-1">Document Upload</h2>
                  <p className="text-sm text-neutral-500 mb-6">Upload required documents to complete your application.</p>
                  <div className="space-y-4">
                    <FileUpload label="Owner ID Copy" required onFileChange={handleFileChange('idFile')} />
                    <FileUpload label="Stall/Shop Photo" required onFileChange={handleFileChange('shopPhotoFile')} />
                    <FileUpload label="Bank Statement (Last 3 months)" onFileChange={handleFileChange('bankStatementFile')} />
                  </div>
                  <div className="mt-6 bg-neutral-50 p-4 rounded-lg text-xs text-neutral-600 space-y-1">
                      <h4 className="font-semibold text-neutral-800">Document Requirements:</h4>
                      <ul className="list-disc list-inside">
                          <li>All documents must be clear and readable.</li>
                          <li>Images should be in JPEG or PNG format.</li>
                          <li>Maximum file size: 5MB per document.</li>
                      </ul>
                  </div>
                  <div className="mt-6 flex items-start">
                      <input type="checkbox" id="terms" checked={formData.termsAccepted} onChange={e => setFormData(p => ({...p, termsAccepted: e.target.checked}))} className="h-4 w-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                      <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">I confirm that all information provided is accurate and I agree to the <a href="#" className="font-medium text-primary-600 hover:underline">Terms and Conditions</a>.</label>
                  </div>
              </form>
          );
          case 5: return (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900">Application Submitted!</h2>
              <p className="text-neutral-600 mt-2 mb-6">Thank you! Your application is under review. We'll notify you via email within 3-5 business days. You are now a seller!</p>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600">Go to Dashboard</button>
            </div>
          );
          default: return null;
      }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <Store className="mx-auto h-12 w-12 text-primary-500 bg-primary-100 p-2 rounded-full mb-2" />
        <h1 className="text-3xl font-bold tracking-tight">Become a Vendor</h1>
        <p className="text-neutral-500">Join Kulture Kloze and reach thousands of customers.</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
        {step < 5 && (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handleBack} disabled={step === 1} className="p-2 disabled:opacity-0 disabled:pointer-events-none">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-neutral-500">Step {step} of 4</span>
                </div>
                <ProgressBar currentStep={step} totalSteps={4} />
            </>
        )}

        {renderStep()}

        {step < 4 && (
            <div className="mt-8">
                <button onClick={handleNext} className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition">
                    Continue
                </button>
            </div>
        )}
        {step === 4 && (
            <div className="mt-8 flex gap-4">
                <button type="button" onClick={handleBack} className="w-full bg-neutral-200 text-neutral-800 py-3 rounded-xl font-semibold hover:bg-neutral-300">Previous</button>
                <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-70">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};