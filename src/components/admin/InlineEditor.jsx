import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Edit3 } from 'lucide-react';

export default function InlineEditor({
  value: initialValue,
  onSave,
  type = 'text',
  className = '',
  tag: Tag = 'span',
  ...props
}) {
  const { editMode } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') inputRef.current.select();
    }
  }, [editing, type]);

  const handleSave = () => {
    setEditing(false);
    if (value !== initialValue && onSave) {
      onSave(value);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setValue(initialValue);
  };

  if (!editMode) {
    return <Tag className={className} {...props}>{value}</Tag>;
  }

  if (editing) {
    if (type === 'textarea') {
      return (
        <div className="relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border-2 border-honda-red rounded-xl
                       text-gray-900 dark:text-white focus:outline-none resize-y min-h-[80px]"
          />
          <div className="flex gap-1 mt-1 justify-end">
            <button onClick={handleSave} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="p-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          ref={inputRef}
          type={type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
          className="px-2 py-1 bg-white dark:bg-gray-800 border-2 border-honda-red rounded-lg
                     text-gray-900 dark:text-white focus:outline-none min-w-[120px]"
        />
        <div className="flex gap-0.5 ml-1">
          <button onClick={handleSave} className="p-1 bg-green-500 text-white rounded hover:bg-green-600">
            <Check size={14} />
          </button>
          <button onClick={handleCancel} className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      onClick={() => setEditing(true)}
      className={`group relative cursor-pointer hover:ring-2 hover:ring-honda-red/50 hover:ring-offset-2
                  hover:ring-offset-white dark:hover:ring-offset-gray-900 rounded-lg transition-all ${className}`}
      {...props}
    >
      {value}
      <Edit3 size={14} className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 text-honda-red transition-opacity" />
    </Tag>
  );
}

export function InlineImage({ src, alt, onSave, className = '', onLoad, onError }) {
  const { editMode } = useAuth();
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(src);

  useEffect(() => { setUrl(src); }, [src]);

  if (!editMode) {
    return <img src={src} alt={alt} className={className} onLoad={onLoad} onError={onError} />;
  }

  if (editing) {
    return (
      <div className="relative group">
        <img src={url} alt={alt} className={className} onLoad={onLoad} onError={onError} />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="flex flex-col gap-2 p-4 w-full max-w-sm">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm text-gray-900 bg-white"
              placeholder="Image URL..."
            />
            <div className="flex gap-2">
              <button onClick={() => { onSave?.(url); setEditing(false); }}
                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600">
                Simpan
              </button>
              <button onClick={() => { setUrl(src); setEditing(false); }}
                className="px-3 py-1.5 bg-gray-500 text-white text-sm font-semibold rounded-lg hover:bg-gray-600">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group cursor-pointer w-full h-full" onClick={() => setEditing(true)}>
      <img src={src} alt={alt} className={className} onLoad={onLoad} onError={onError} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
        <Edit3 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
