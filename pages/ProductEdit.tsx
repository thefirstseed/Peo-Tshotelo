import React, { useState } from 'react';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Product } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { CATEGORIES } from '../constants';

interface ProductEditPageProps {
  product?: Product;
  onSave: (productData: Omit<Product, 'id' | 'vendorId' | 'vendorName'>, existingId?: string) => void;
  onBack: () => void;
}

export const ProductEditPage: React.FC<ProductEditPageProps> = ({ product, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || 0,
    description: product?.description || '',
    category: product?.category || 'Clothing',
    imageUrls: product?.imageUrls || [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleImageUpdate = (files: File[], remainingUrls: string[]) => {
    setImageFiles(files);
    setFormData(prev => ({...prev, imageUrls: remainingUrls}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the imageFiles, get the URLs,
    // and then save the product data with the combined new and existing URLs.
    
    // Create mock URLs for new files
    const newImageUrls = imageFiles.map(file => URL.createObjectURL(file));
    const finalImageUrls = [...formData.imageUrls, ...newImageUrls];
    
    if (finalImageUrls.length === 0) {
        alert('Please add at least one product image.');
        return;
    }

    onSave({ ...formData, imageUrls: finalImageUrls }, product?.id);
  };

  const inputStyles = "w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-neutral-500">Fill out the details below to list your item.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image Uploader */}
          <div className="md:col-span-1">
            <ImageUploader 
              onUpdate={handleImageUpdate} 
              initialImageUrls={formData.imageUrls}
            />
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">Product Title</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Vintage Denim Jacket"
                className={inputStyles}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">Price (P)</label>
                <div className="relative">
                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                     <DollarSign className="h-5 w-5 text-neutral-400" />
                   </div>
                   <input
                     type="number"
                     name="price"
                     id="price"
                     required
                     min="0"
                     step="0.01"
                     value={formData.price}
                     onChange={handleChange}
                     placeholder="0.00"
                     className={`${inputStyles} pl-10`}
                   />
                </div>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                 <select
                   name="category"
                   id="category"
                   required
                   value={formData.category}
                   onChange={handleChange}
                   className={inputStyles}
                 >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                 </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                name="description"
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the item's condition, size, material, etc."
                className={inputStyles}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
               <button type="button" onClick={onBack} className="px-6 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">
                 Cancel
               </button>
               <button type="submit" className="px-8 py-2.5 text-sm font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800">
                 {product ? 'Save Changes' : 'Add Product'}
               </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};