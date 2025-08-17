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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activePanel, setActivePanel] = useState<'toolbar' | 'layers' | 'properties'>('toolbar');
  
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
          
          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3 flex-wrap">
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

          {/* Mobile menu button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile controls bar */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          <button onClick={undo} disabled={historyIndex <= 0}
                  className="flex-shrink-0 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-sm">↶</button>
          <span className="flex-shrink-0 text-sm text-gray-600 px-2 py-1">{historyIndex + 1}/{history.length}</span>
          <button onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex-shrink-0 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 text-sm">↷</button>
          <button onClick={reset} className="flex-shrink-0 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Reset</button>
          <button onClick={exportCanvas}
                  disabled={!backgroundImage}
                  className="flex-shrink-0 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 text-sm">Export</button>
        </div>
      </header>

      {/* Responsive main content container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left sidebar - Hidden on mobile, shown in modal */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <Toolbar />
          <LayerPanel />
        </aside>
        
        {/* Editor center */}
        <main className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-8 min-h-0">
          <div className="w-full h-full">
            <ImageEditor />
          </div>
        </main>
        
        {/* Right sidebar - Hidden on mobile, shown in modal */}
        <aside className="hidden lg:block w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
          <TextPropertiesPanel />
        </aside>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden bg-white border-t border-gray-200">
        <div className="flex">
          <button
            onClick={() => {
              setActivePanel('toolbar');
              setShowMobileMenu(true);
            }}
            className="flex-1 py-3 text-center text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
          >
            Tools
          </button>
          <button
            onClick={() => {
              setActivePanel('layers');
              setShowMobileMenu(true);
            }}
            className="flex-1 py-3 text-center text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50 border-l border-gray-200"
          >
            Layers
          </button>
          <button
            onClick={() => {
              setActivePanel('properties');
              setShowMobileMenu(true);
            }}
            className="flex-1 py-3 text-center text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50 border-l border-gray-200"
          >
            Properties
          </button>
        </div>
      </div>

      {/* Mobile panel modal */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[75vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex space-x-1">
                {(['toolbar', 'layers', 'properties'] as const).map((panel) => (
                  <button
                    key={panel}
                    onClick={() => setActivePanel(panel)}
                    className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
                      activePanel === panel 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {panel}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {activePanel === 'toolbar' && <Toolbar />}
              {activePanel === 'layers' && <LayerPanel />}
              {activePanel === 'properties' && <TextPropertiesPanel />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}