import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { useParams, navigate } from '../router';
import { fetchProduct, createOrUpdateProduct } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { ImageUploader } from '../components/ImageUploader';

// --- Reusable Form Components ---
const PillSelector = <T extends string>({ label, options, selected, onSelect }: { label: string, options: T[], selected: T, onSelect: (value: T) => void }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
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

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'vendorId' | 'vendorName'>>({
    title: '', price: 0, description: '', category: 'Clothing', imageUrls: [], condition: 'Like New', sizes: []
  });
  // Separate state for file objects, which won't be part of the main form data JSON
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
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
            imageUrls: product.imageUrls,
            condition: product.condition || 'Good',
            sizes: product.sizes || []
          });
        })
        .catch(() => setError("Could not find the product to edit."))
        .finally(() => setIsLoading(false));
    }
  }, [productId, user?.vendorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
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
    if (formData.imageUrls.length === 0 && newImageFiles.length === 0) {
        alert('Please add at least one product image.');
        return;
    }
    
    setIsSaving(true);
    try {
      // TODO Backend: POST /api/products (new) or PUT /api/products/:id (edit)
      // The backend will receive a multipart/form-data request.
      // It should process the `newImageFiles` array for uploads,
      // and use the `formData.imageUrls` array to manage existing images.
      await createOrUpdateProduct(formData, newImageFiles, productId);
      setTimeout(() => {
        setIsSaving(false);
        navigate('/dashboard');
      }, 1500); // Wait for the "Saved" animation to finish
    } catch (err) {
      alert("Failed to save product.");
      console.error(err);
      setIsSaving(false);
    }
  };

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
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea name="description" id="description" required value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the item's condition, material, etc." className={inputStyles}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PillSelector 
                    label="Category"
                    options={CATEGORIES.filter(c => c !== 'All') as Product['category'][]}
                    selected={formData.category}
                    onSelect={(v) => setFormData(p => ({...p, category: v}))}
                />
                <PillSelector 
                    label="Condition"
                    options={['New', 'Like New', 'Good', 'Fair']}
                    selected={formData.condition!}
                    onSelect={(v) => setFormData(p => ({...p, condition: v}))}
                />
            </div>
            <CheckboxGrid 
                label="Available Sizes (optional)"
                options={['XS', 'S', 'M', 'L', 'XL', '38', '40', '42']}
                selected={formData.sizes!}
                onToggle={handleSizeToggle}
            />
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">Price (Pula)</label>
                <input type="number" name="price" id="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" className={inputStyles}/>
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
