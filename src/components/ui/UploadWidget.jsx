import { useState, useRef } from 'react';
import { Upload, X, Loader2, Crop } from 'lucide-react';
import api from '../../api';
import ImageCropper from './ImageCropper';

export default function UploadWidget({ onUpload, currentUrl, crop = true }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const [cropFile, setCropFile] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (crop) {
      setCropFile(file);
    } else {
      uploadFile(file);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);

    setUploading(true);
    try {
      const { data } = await api.post('/upload', fd);
      const url = data.url;
      setPreview(url);
      onUpload?.(url);
    } catch (err) {
      alert('Upload gagal: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleCropDone = (croppedFile) => {
    setCropFile(null);
    uploadFile(croppedFile);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-honda-red/10 text-gray-700 dark:text-gray-300 hover:text-honda-red border border-gray-200 dark:border-gray-700 rounded-xl transition-all text-sm font-medium disabled:opacity-50">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : crop ? <Crop size={16} /> : <Upload size={16} />}
          {uploading ? 'Mengupload...' : crop ? 'Crop & Upload' : 'Upload Gambar'}
        </button>
        {preview && (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button type="button" onClick={() => { setPreview(''); onUpload?.(''); }}
              className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-lg">
              <X size={10} />
            </button>
          </div>
        )}
      </div>

      {cropFile && (
        <ImageCropper
          file={cropFile}
          onCrop={handleCropDone}
          onClose={() => setCropFile(null)}
          aspectRatio={typeof crop === 'number' ? crop : null}
        />
      )}
    </>
  );
}
