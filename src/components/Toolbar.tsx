'use client';
import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export function Toolbar() {
  const [newText, setNewText] = useState('');
  const { addTextLayer, backgroundImage, setBackgroundImage } = useEditorStore();

  const handleAddText = () => {
    if (newText.trim()) {
      addTextLayer(newText);
      setNewText('');
    } else {
      addTextLayer('New Text');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.includes('png')) {
      alert('Please upload a PNG image');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setBackgroundImage(imageUrl, file, useEditorStore.getState().fabricCanvas);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tools</h2>

      {/* Upload Image */}
      <div className="mb-6">
        <label className="flex items-center gap-2 w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
          <Upload className="h-5 w-5" />
          <span className="font-medium">
            {backgroundImage ? 'Change Image' : 'Upload PNG'}
          </span>
          <input
            type="file"
            accept=".png,image/png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Add Text */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Text Layer
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter text..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddText();
              }
            }}
          />
          <button
            onClick={handleAddText}
            disabled={!backgroundImage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            title="Add text layer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Arrow keys: Move selected text</div>
          <div>• Shift + Arrow: Move 10px</div>
          <div>• Delete: Remove selected text</div>
          <div>• Drag corners: Resize text</div>
          <div>• Drag rotation handle: Rotate</div>
        </div>
      </div>
    </div>
  );
}
