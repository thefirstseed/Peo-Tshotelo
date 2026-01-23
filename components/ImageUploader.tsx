import React, { useState, useEffect, useRef } from 'react';
import { X, ImagePlus, Crop, Check } from 'lucide-react';
// FIX: Alias `Crop` type from `react-image-crop` to avoid conflict with `Crop` icon from `lucide-react`.
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop as ReactCropType,
  type PixelCrop,
} from 'react-image-crop';

// --- Helper Functions ---
const MIN_WIDTH = 300;
const MIN_HEIGHT = 300;
const MAX_WIDTH = 2048;
const MAX_HEIGHT = 2048;
const ASPECT_RATIO = 1;

interface ImageUploaderProps {
  onUpdate: (files: File[], remainingUrls: string[]) => void;
  initialImageUrls?: string[];
}

const isBlobUrl = (url: string) => url.startsWith('blob:');

// Helper to validate initial image dimensions
const validateImageDimensions = (file: File): Promise<{file: File, isValid: boolean}> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = e => {
      const image = new Image();
      image.onload = () => {
        resolve({ file, isValid: image.naturalWidth >= MIN_WIDTH && image.naturalHeight >= MIN_HEIGHT });
      };
      image.onerror = () => resolve({ file, isValid: false });
      image.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ file, isValid: false });
    reader.readAsDataURL(file);
  });
};

// Helper to create a cropped image blob
function getCroppedBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return Promise.resolve(null);
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
}

// Helper to resize an image if it's too large
const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            const { naturalWidth: width, naturalHeight: height } = image;
            if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
                resolve(file);
                return;
            }

            let newWidth = width;
            let newHeight = height;
            const ratio = width / height;

            if (newWidth > MAX_WIDTH) {
                newWidth = MAX_WIDTH;
                newHeight = Math.round(newWidth / ratio);
            }
            if (newHeight > MAX_HEIGHT) {
                newHeight = MAX_HEIGHT;
                newWidth = Math.round(newHeight * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(file); return; }
            
            ctx.drawImage(image, 0, 0, newWidth, newHeight);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
                } else {
                    resolve(file);
                }
            }, file.type, 0.9);
        };
        image.onerror = () => resolve(file);
        image.src = URL.createObjectURL(file);
    });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpdate, initialImageUrls = [] }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for the cropping modal
  const [cropQueue, setCropQueue] = useState<{file: File, dataUrl: string}[]>([]);
  // FIX: Use the aliased `ReactCropType` for the crop state.
  const [crop, setCrop] = useState<ReactCropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    setExistingUrls(initialImageUrls);
    const blobPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...initialImageUrls, ...blobPreviews]);
    return () => { blobPreviews.forEach(URL.revokeObjectURL); };
  }, [initialImageUrls]);

  const updateParent = (updatedFiles: File[], updatedUrls: string[]) => {
    // Revoke old blob URLs before creating new ones
    previews.filter(isBlobUrl).forEach(URL.revokeObjectURL);

    setFiles(updatedFiles);
    setExistingUrls(updatedUrls);
    const newPreviews = updatedFiles.map(URL.createObjectURL);
    setPreviews([...updatedUrls, ...newPreviews]);
    onUpdate(updatedFiles, updatedUrls);
  };

  const handleFilesChange = async (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    const potentialFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
    const validationPromises = potentialFiles.map(validateImageDimensions);
    const results = await Promise.all(validationPromises);
    
    const validFiles = results.filter(r => r.isValid).map(r => r.file);
    const invalidFileNames = results.filter(r => !r.isValid).map(r => r.file.name);

    if (invalidFileNames.length > 0) {
      alert(`The following images were rejected because they are smaller than ${MIN_WIDTH}x${MIN_HEIGHT}px: ${invalidFileNames.join(', ')}`);
    }

    if (validFiles.length > 0) {
        const fileReaders = validFiles.map(file => {
            return new Promise<{file: File, dataUrl: string}>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve({ file, dataUrl: reader.result as string });
                reader.readAsDataURL(file);
            });
        });
        const queueItems = await Promise.all(fileReaders);
        setCropQueue(prev => [...prev, ...queueItems]);
    }
  };
  
  const processNextInQueue = async (processedFile: File) => {
    const finalFile = await resizeImage(processedFile);
    updateParent([...files, finalFile], existingUrls);
    setCropQueue(prev => prev.slice(1)); // Advance queue
    setCrop(undefined); // Reset crop for next image
  };

  const handleConfirmCrop = async () => {
    if (!completedCrop || !imgRef.current || cropQueue.length === 0) return;
    const originalFile = cropQueue[0].file;
    const croppedBlob = await getCroppedBlob(imgRef.current, completedCrop);
    if (croppedBlob) {
        const croppedFile = new File([croppedBlob], originalFile.name, { type: originalFile.type, lastModified: Date.now() });
        await processNextInQueue(croppedFile);
    }
  };

  const handleSkipCrop = async () => {
    if (cropQueue.length === 0) return;
    await processNextInQueue(cropQueue[0].file);
  };

  const handleRemove = (index: number) => {
    const isExisting = index < existingUrls.length;
    let updatedFiles = [...files];
    let updatedUrls = [...existingUrls];
    if (isExisting) {
      updatedUrls.splice(index, 1);
    } else {
      updatedFiles.splice(index - existingUrls.length, 1);
    }
    updateParent(updatedFiles, updatedUrls);
  };
  
  const currentCroppingItem = cropQueue[0];

  return (
    <div>
      {/* --- Cropping Modal --- */}
      {currentCroppingItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold text-center mb-4">Crop Image ({cropQueue.indexOf(currentCroppingItem) + 1}/{cropQueue.length})</h3>
                <div className="max-h-[60vh] overflow-y-auto flex items-center justify-center bg-neutral-100 rounded-lg">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={ASPECT_RATIO}
                        minWidth={100}
                        minHeight={100}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop preview"
                            src={currentCroppingItem.dataUrl}
                            onLoad={(e) => {
                                const { width, height } = e.currentTarget;
                                setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, ASPECT_RATIO, width, height), width, height));
                            }}
                            className="max-h-[60vh] object-contain"
                        />
                    </ReactCrop>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={handleSkipCrop} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">Skip</button>
                    <button onClick={handleConfirmCrop} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center gap-1.5"><Check className="w-4 h-4" /> Confirm Crop</button>
                </div>
            </div>
        </div>
      )}

      {/* --- Uploader UI --- */}
      <label className="block text-sm font-medium text-neutral-700 mb-1">Product Images</label>
      <div className="grid grid-cols-3 gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border">
            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <div
          className={`relative flex justify-center items-center aspect-square rounded-xl border-2 border-dashed
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'}
            transition-colors duration-200 ease-in-out cursor-pointer bg-neutral-50 hover:border-primary-400`}
          onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {e.preventDefault(); setIsDragging(false); handleFilesChange(e.dataTransfer.files);}}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className="text-center p-2">
            <ImagePlus className="mx-auto h-8 w-8 text-neutral-400" />
            <p className="mt-1 text-xs text-neutral-600"><span className="font-semibold text-primary-600">Add images</span></p>
          </div>
        </div>
      </div>
      <p className="text-xs text-neutral-500 mt-2">
         Min size: {MIN_WIDTH}x{MIN_HEIGHT}px. Images are cropped to a square and resized to max {MAX_WIDTH}px.
       </p>
      <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          multiple
          className="sr-only" 
          accept="image/*"
          onChange={(e) => handleFilesChange(e.target.files)}
      />
    </div>
  );
};