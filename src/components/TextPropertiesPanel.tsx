'use client';
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { GoogleFontsLoader } from '@/utils/googleFonts';

const FONT_WEIGHTS = [
  { value: 'normal', label: 'Regular' },
  { value: 'bold', label: 'Bold' },
  { value: 'lighter', label: 'Light' },
  { value: 'bolder', label: 'Bolder' },
];

export function TextPropertiesPanel() {
  const {
    layers,
    selectedLayer,
    updateLayer,
    googleFonts,
    setGoogleFonts
  } = useEditorStore();

  const [currentLayer, setCurrentLayer] = useState(
    layers.find(l => l.id === selectedLayer) || null
  );

  // When selectedLayer or layers change, update currentLayer
  useEffect(() => {
    setCurrentLayer(layers.find(l => l.id === selectedLayer) || null);
  }, [selectedLayer, layers]);

  // Load Google Fonts list once
  useEffect(() => {
    if (googleFonts.length === 0) {
      GoogleFontsLoader.loadFontFamilies().then(fonts => setGoogleFonts(fonts));
    }
  }, [googleFonts.length, setGoogleFonts]);

  // Ensure the current font is loaded for Fabric.js
  useEffect(() => {
    if (currentLayer?.fontFamily) {
      GoogleFontsLoader.loadFont(currentLayer.fontFamily);
    }
  }, [currentLayer?.fontFamily]);

  if (!currentLayer) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a text layer to edit its properties
      </div>
    );
  }

  const onChange = (field: keyof typeof currentLayer, value: any) => {
    if (field === 'fontFamily') {
      GoogleFontsLoader.loadFont(value);
    }
    updateLayer(currentLayer.id, { [field]: value });
  };

  return (
    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Text Properties</h2>

      {/* Text content */}
      <label className="block text-sm font-medium text-gray-700">
        Text
        <textarea
          className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={currentLayer.text}
          onChange={(e) => onChange('text', e.target.value)}
        />
      </label>

      {/* Font Family */}
      <label className="block text-sm font-medium text-gray-700">
        Font Family
        <select
          value={currentLayer.fontFamily}
          onChange={(e) => onChange('fontFamily', e.target.value)}
          className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontFamily: currentLayer.fontFamily }}
        >
          {googleFonts.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
          ))}
        </select>
      </label>

      {/* Font Size */}
      <label className="block text-sm font-medium text-gray-700">
        Font Size
        <input
          type="number"
          min={8}
          max={200}
          value={currentLayer.fontSize}
          onChange={(e) => onChange('fontSize', Number(e.target.value))}
          className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Font Weight */}
      <label className="block text-sm font-medium text-gray-700">
        Font Weight
        <select
          value={currentLayer.fontWeight}
          onChange={(e) => onChange('fontWeight', e.target.value)}
          className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {FONT_WEIGHTS.map(w => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </label>

      {/* Text Color */}
      <label className="block text-sm font-medium text-gray-700">
        Color
        <input
          type="color"
          value={currentLayer.color}
          onChange={(e) => onChange('color', e.target.value)}
          className="w-full mt-1 p-1 border border-gray-300 rounded-md"
        />
      </label>

      {/* Opacity */}
      <label className="block text-sm font-medium text-gray-700">
        Opacity
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={currentLayer.opacity}
          onChange={(e) => onChange('opacity', Number(e.target.value))}
          className="w-full mt-1"
        />
      </label>

      {/* Text Align */}
      <label className="block text-sm font-medium text-gray-700">
        Text Align
        <select
          value={currentLayer.textAlign}
          onChange={(e) => onChange('textAlign', e.target.value as 'left' | 'center' | 'right')}
          className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>

      {/* Rotation */}
      <label className="block text-sm font-medium text-gray-700">
        Rotation (degrees)
        <input
          type="number"
          min={0}
          max={360}
          value={currentLayer.rotation}
          onChange={(e) => onChange('rotation', Number(e.target.value))}
          className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
    </div>
  );
}
