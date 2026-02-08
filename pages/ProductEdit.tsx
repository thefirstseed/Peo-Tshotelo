import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Tag, Users } from 'lucide-react';
import { Product } from '../types';
import { PRODUCT_CATEGORIES } from '../constants';
import { useParams, navigate } from '../router';
import { fetchProduct, createOrUpdateProduct } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { ImageUploader } from '../components/ImageUploader';

// --- Reusable Form Components ---
const PillSelector = <T extends string>({ label, options, selected, onSelect, icon: Icon }: { label: string, options: T[], selected: T, onSelect: (value: T) => void, icon?: React.ElementType }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
      {Icon && <Icon className="w-4 h-4 mr-2 text-neutral-400" />}
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selected === option 
            ? 'bg-neutral-900 text-white' 
            : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const CheckboxGrid = ({ label, options, selected, onToggle }: { label: string, options: string[], selected: string[], onToggle: (value: string) => void }) => (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`text-center p-2 text-sm font-medium rounded-lg transition-colors border ${
              selected.includes(option)
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
);


export const ProductEditPage: React.FC = () => {
  const { id: productId } = useParams();
  const { user } = useAuth();
  const isEditing = !!productId;

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'vendorId' | 'vendorName' | 'likeCount'>>({
    title: '', price: 0, description: '', category: 'Clothing', imageUrls: [], condition: 'Like New', sizes: [], stock: 1, department: 'women', brand: ''
  });
  const [priceInput, setPriceInput] = useState(''); // State for the price text input
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  
  const [isLoading, setIsLoading] = useState(isEditing); // Only load if editing
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing && user && !user.vendorId) {
        navigate('/sell');
        return;
    }
    
    if (isEditing && productId) {
      setIsLoading(true);
      fetchProduct(productId)
        .then(product => {
          if (product.vendorId !== user?.vendorId) {
             setError("You don't have permission to edit this product.");
             return;
          }
          setFormData({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            department: product.department,
            brand: product.brand,
            imageUrls: product.imageUrls,
            condition: product.condition || 'Good',
            sizes: product.sizes || [],
            stock: product.stock,
          });
          setPriceInput(product.price > 0 ? product.price.toString() : '');
        })
        .catch((err) => {
            console.error(err);
            setError("Could not find the product to edit.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [productId, user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'number') {
      const numValue = Math.max(0, parseInt(value, 10) || 0);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
        setPriceInput(value);
        setFormData(prev => ({...prev, price: parseFloat(value) || 0}));
    }
  };

  const handleImageUpdate = (files: File[], remainingUrls: string[]) => {
    setNewImageFiles(files);
    setFormData(prev => ({...prev, imageUrls: remainingUrls}));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => {
        const newSizes = prev.sizes?.includes(size)
            ? prev.sizes.filter(s => s !== size)
            : [...(prev.sizes || []), size];
        return {...prev, sizes: newSizes };
    })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.vendorId) {
        setSaveError("Cannot save product: your seller profile is not complete.");
        return;
    }
    setSaveError(null);
    if (formData.imageUrls.length === 0 && newImageFiles.length === 0) {
        setSaveError('Please add at least one product image.');
        return;
    }
    if (formData.brand.trim() === '') {
        setSaveError("Please enter a brand name, or 'Unbranded' if it doesn't have one.");
        return;
    }
    
    setIsSaving(true);
    try {
      await createOrUpdateProduct(formData, newImageFiles, user.vendorId, productId);
      setTimeout(() => {
        setIsSaving(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setSaveError("Failed to save product. Please check your connection and try again.");
      console.error("Save product failed:", err);
      setIsSaving(false);
    }
  };
  
  if (!isEditing && user && !user.vendorId) {
    return <div className="text-center py-10">Redirecting to seller setup...</div>;
  }
  if (isLoading) return <div className="text-center py-10">Loading product...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  const inputStyles = "w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
        {saveError && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6">{saveError}</div>}
        <div className="space-y-6">
            <ImageUploader
                onUpdate={handleImageUpdate}
                initialImageUrls={formData.imageUrls}
            />
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">Product Title</label>
              <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Vintage Denim Jacket" className={inputStyles}/>
            </div>
             <div>
              <label htmlFor="brand" className="block text-sm font-medium text-neutral-700 mb-1">Brand</label>
              <input type="text" name="brand" id="brand" required value={formData.brand} onChange={handleChange} placeholder="e.g. Nike, Zara, or 'Unbranded'" className={inputStyles}/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea name="description" id="description" required value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the item's condition, material, etc." className={inputStyles}></textarea>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PillSelector 
                    label="Department"
                    icon={Users}
                    options={['women', 'men', 'kids']}
                    selected={formData.department}
                    onSelect={(v) => setFormData(p => ({...p, department: v}))}
                />
                <PillSelector 
                    label="Category"
                    icon={Tag}
                    options={PRODUCT_CATEGORIES as any}
                    selected={formData.category}
                    onSelect={(v) => setFormData(p => ({...p, category: v}))}
                />
            </div>
            <PillSelector 
                label="Condition"
                options={['New', 'Like New', 'Good', 'Fair']}
                selected={formData.condition!}
                onSelect={(v) => setFormData(p => ({...p, condition: v}))}
            />
            <CheckboxGrid 
                label="Available Sizes (optional)"
                options={['XS', 'S', 'M', 'L', 'XL', '38', '40', '42']}
                selected={formData.sizes!}
                onToggle={handleSizeToggle}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">Price (Pula)</label>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">P</span>
                        <input 
                            type="text" 
                            inputMode="decimal"
                            name="price" 
                            id="price" 
                            required 
                            value={priceInput} 
                            onChange={handlePriceChange} 
                            placeholder="0.00" 
                            className={`${inputStyles} pl-8`}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 mb-1">Stock Quantity</label>
                    <input 
                        type="number" 
                        name="stock" 
                        id="stock" 
                        required 
                        value={formData.stock} 
                        onChange={handleChange} 
                        min="0"
                        placeholder="e.g. 1" 
                        className={inputStyles}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
               <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50">Cancel</button>
               <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`px-8 py-2.5 text-sm font-semibold text-white rounded-xl transition w-32 flex justify-center items-center
                    ${isSaving ? 'bg-green-600' : 'bg-neutral-900 hover:bg-neutral-800'}`}
                >
                    {isSaving ? <><Check className="w-5 h-5 mr-1.5"/> Saved</> : (isEditing ? 'Save Changes' : 'Add Product')}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};