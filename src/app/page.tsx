'use client';                             
import { useEffect, useState } from 'react';
import { ImageEditor } from '@/components/ImageEditor';
import { Toolbar } from '@/components/Toolbar';
import { LayerPanel } from '@/components/LayerPanel';
import { TextPropertiesPanel } from '@/components/TextPropertiesPanel';
import { useEditorStore } from '@/store/editorStore';
import { GoogleFontsLoader } from '@/utils/googleFonts';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const {
    backgroundImage,
    selectedLayer,
    history,
    historyIndex,
    undo,
    redo,
    reset,
    exportCanvas,
    setGoogleFonts, // <- ADD this!
  } = useEditorStore();

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('image-text-composer');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        useEditorStore.getState().loadState(parsed);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
    // Load Google Fonts list on first mount
    GoogleFontsLoader.loadFontFamilies().then(families => setGoogleFonts(families));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const state = useEditorStore.getState();
    const saveData = {
      backgroundImage: state.backgroundImage,
      layers: state.layers,
      canvasSize: state.canvasSize
    };
    localStorage.setItem('image-text-composer', JSON.stringify(saveData));
  }, [backgroundImage, mounted]);

  if (!mounted) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Image Text Composer</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button onClick={undo} disabled={historyIndex <= 0}
                      className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">↶</button>
              <span className="text-sm text-gray-600">{historyIndex + 1}/{history.length}</span>
              <button onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">↷</button>
            </div>
            <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reset</button>
            <button onClick={exportCanvas}
                    disabled={!backgroundImage}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300">Export PNG</button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <Toolbar />
          <LayerPanel />
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <ImageEditor />
        </div>
        <div className="w-80 bg-white border-l border-gray-200">
          <TextPropertiesPanel />
        </div>
      </div>
    </div>
  );
}
