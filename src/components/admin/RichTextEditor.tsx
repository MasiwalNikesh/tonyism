"use client";

import { useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { label: 'Bold', action: () => insertFormatting('**', '**'), icon: 'B' },
    { label: 'Italic', action: () => insertFormatting('*', '*'), icon: 'I' },
    { label: 'Quote', action: () => insertFormatting('\n> ', ''), icon: '"' },
    { label: 'Line Break', action: () => insertFormatting('\n\n'), icon: '↵' },
    { label: 'Em Dash', action: () => insertFormatting(' — '), icon: '—' },
  ];

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex items-center justify-between">
        <div className="flex space-x-1">
          {formatButtons.map((button) => (
            <button
              key={button.label}
              type="button"
              onClick={button.action}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-mono text-black"
              title={button.label}
            >
              {button.icon}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1 text-sm rounded ${
              isPreviewMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="min-h-[300px]">
        {isPreviewMode ? (
          <div 
            className="p-4 prose prose-sm max-w-none text-black"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-4 text-black">${renderPreview(value)}</p>` 
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-80 p-4 resize-none border-0 focus:outline-none focus:ring-0 text-black"
          />
        )}
      </div>
      
      {/* Character count */}
      <div className="border-t border-gray-300 px-4 py-2 bg-gray-50 text-sm text-gray-500 flex justify-between">
        <span>Characters: {value.length}</span>
        <span>Words: {value.trim() ? value.trim().split(/\s+/).length : 0}</span>
      </div>
    </div>
  );
}