import { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Pilcrow } from 'lucide-react';

export default function RichEditor({ value, onChange, className = '' }) {
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) exec('createLink', url);
  };

  if (!isEditing) {
    return (
      <div
        className={`cursor-pointer hover:ring-2 hover:ring-honda-red/50 rounded-xl p-3 transition-all ${className}`}
        onClick={() => setIsEditing(true)}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    );
  }

  return (
    <div className={`border-2 border-honda-red rounded-xl overflow-hidden ${className}`}>
      <div className="flex items-center gap-0.5 p-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-wrap">
        {[
          { icon: Bold, cmd: 'bold', title: 'Tebal' },
          { icon: Italic, cmd: 'italic', title: 'Miring' },
          { icon: Underline, cmd: 'underline', title: 'Garis Bawah' },
          { icon: List, cmd: 'insertUnorderedList', title: 'List' },
          { icon: ListOrdered, cmd: 'insertOrderedList', title: 'List Nomor' },
        ].map((btn) => (
          <button key={btn.cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(btn.cmd); }}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title={btn.title}>
            <btn.icon size={16} />
          </button>
        ))}
        <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Link">
          <Link size={16} />
        </button>
        <div className="flex-1" />
        <button type="button" onClick={() => setIsEditing(false)}
          className="px-2 py-1 text-xs font-semibold text-honda-red hover:bg-honda-red/10 rounded-lg transition-colors">
          Selesai
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        className="p-3 min-h-[100px] text-sm focus:outline-none leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
}
