import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  required?: boolean;
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, required, onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    // Basic validation (can be expanded)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) { // 5MB
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
    }
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="mt-1 flex justify-center px-6 py-5 border-2 border-neutral-300 border-dashed rounded-xl cursor-pointer hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 transition"
      >
        <div className="space-y-1 text-center">
          {file ? (
            <>
              <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-green-700 truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-neutral-500">Click to change file</p>
            </>
          ) : (
            <>
              <UploadCloud className="mx-auto h-10 w-10 text-neutral-400" />
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-primary-600">Tap to upload</span>
              </p>
              <p className="text-xs text-neutral-500">PNG, JPG, PDF up to 5MB</p>
            </>
          )}
        </div>
        <input ref={fileInputRef} onChange={handleFileChange} type="file" accept="image/png, image/jpeg, application/pdf" className="sr-only" />
      </div>
    </div>
  );
};
