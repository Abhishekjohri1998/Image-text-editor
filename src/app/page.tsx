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
    setGoogleFonts,
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
    GoogleFontsLoader.loadFontFamilies().then(families => setGoogleFonts(families));
  }, [setGoogleFonts]);

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
      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Image Text Composer</h1>
          <div className="flex items-center gap-3 flex-wrap">
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

      {/* Responsive main content container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left sidebar */}
        <aside className="w-full md:w-72 bg-white border-b md:border-r md:border-b-0 border-gray-200 flex-shrink-0">
          <Toolbar />
          <LayerPanel />
        </aside>
        {/* Editor center */}
        <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-8">
          <ImageEditor />
        </main>
        {/* Right sidebar */}
        <aside className="w-full md:w-80 bg-white border-t md:border-l md:border-t-0 border-gray-200 flex-shrink-0">
          <TextPropertiesPanel />
        </aside>
      </div>
      {/* Mobile blocker overlay: only shown below md */}
      <div className="fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col items-center justify-center md:hidden">
        <h2 className="text-lg font-bold mb-4">Desktop Only</h2>
        <p className="text-gray-600 text-center max-w-xs">
          This editor is designed for desktop or tablet screen sizes.<br />
          Please use a larger device for best experience.
        </p>
      </div>
    </div>
  );
}
