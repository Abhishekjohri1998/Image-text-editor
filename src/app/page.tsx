'use client';
import { useEffect, useState } from 'react';
import { Menu, X, Layers, Type, Undo, Redo, RotateCcw, Download } from 'lucide-react';

// Type definitions
type PanelType = 'toolbar' | 'layers' | 'properties';

interface MobilePanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
}

// Mock store hook for demonstration
const useEditorStore = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<any>(null);
  const [history, setHistory] = useState([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [layers, setLayers] = useState<any[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>('toolbar');

  return {
    backgroundImage,
    selectedLayer,
    history,
    historyIndex,
    layers,
    showMobileMenu,
    activePanel,
    setShowMobileMenu,
    setActivePanel,
    undo: () => setHistoryIndex(Math.max(0, historyIndex - 1)),
    redo: () => setHistoryIndex(Math.min(history.length - 1, historyIndex + 1)),
    reset: () => {
      setBackgroundImage(null);
      setLayers([]);
      setHistoryIndex(0);
    },
    exportCanvas: () => alert('Export functionality would be implemented here'),
    setGoogleFonts: () => {},
  };
};

// Mock components for demonstration
const ImageEditor = () => (
  <div className="w-full max-w-2xl aspect-video bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
    <p className="text-gray-500">Canvas Area - Drop image or start creating</p>
  </div>
);

const Toolbar = ({ isMobile = false }) => (
  <div className={`${isMobile ? 'p-4' : 'p-4 border-b border-gray-200'}`}>
    <h3 className="font-semibold mb-3">Tools</h3>
    <div className="grid grid-cols-2 gap-2">
      <button className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
        <Type className="w-5 h-5 mx-auto mb-1" />
        <span className="text-xs">Add Text</span>
      </button>
      <button className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
        <div className="w-5 h-5 bg-gray-400 rounded mx-auto mb-1"></div>
        <span className="text-xs">Add Image</span>
      </button>
    </div>
  </div>
);

const LayerPanel = ({ isMobile = false }) => (
  <div className={`${isMobile ? 'p-4' : 'p-4 border-b border-gray-200'}`}>
    <h3 className="font-semibold mb-3">Layers</h3>
    <div className="space-y-2">
      <div className="p-2 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span className="text-sm">Background</span>
        </div>
      </div>
      <div className="p-2 border border-gray-200 rounded">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          <span className="text-sm">Text Layer 1</span>
        </div>
      </div>
    </div>
  </div>
);

const TextPropertiesPanel = ({ isMobile = false }) => (
  <div className={`${isMobile ? 'p-4' : 'p-4'}`}>
    <h3 className="font-semibold mb-3">Text Properties</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Font Family</label>
        <select className="w-full p-2 border border-gray-300 rounded">
          <option>Arial</option>
          <option>Helvetica</option>
          <option>Times New Roman</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input type="range" className="w-full" min="12" max="72" defaultValue="24" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <input type="color" className="w-full h-10 border border-gray-300 rounded" defaultValue="#000000" />
      </div>
    </div>
  </div>
);

const MobilePanelModal = ({ isOpen, onClose, activePanel, setActivePanel }: MobilePanelModalProps) => {
  if (!isOpen) return null;

  const panels: Record<PanelType, { title: string; component: JSX.Element }> = {
    toolbar: { title: 'Tools', component: <Toolbar isMobile={true} /> },
    layers: { title: 'Layers', component: <LayerPanel isMobile={true} /> },
    properties: { title: 'Properties', component: <TextPropertiesPanel isMobile={true} /> }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex space-x-1">
            {(Object.entries(panels) as [PanelType, { title: string; component: JSX.Element }][]).map(([key, panel]) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activePanel === key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {panel.title}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {panels[activePanel].component}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const {
    backgroundImage,
    selectedLayer,
    history,
    historyIndex,
    showMobileMenu,
    activePanel,
    setShowMobileMenu,
    setActivePanel,
    undo,
    redo,
    reset,
    exportCanvas,
    setGoogleFonts,
  } = useEditorStore();

  useEffect(() => {
    setMounted(true);
    // Load saved state logic would go here
    // GoogleFonts loading logic would go here
  }, [setGoogleFonts]);

  if (!mounted) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
            Image Text Composer
          </h1>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex gap-2">
              <button onClick={undo} disabled={historyIndex <= 0}
                      className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors">
                <Undo className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 px-2 py-2">{historyIndex + 1}/{history.length}</span>
              <button onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors">
                <Redo className="w-4 h-4" />
              </button>
            </div>
            <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              <RotateCcw className="w-4 h-4 inline mr-1" />
              Reset
            </button>
            <button onClick={exportCanvas}
                    disabled={!backgroundImage}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 transition-colors">
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Action Bar */}
        <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          <button onClick={undo} disabled={historyIndex <= 0}
                  className="flex-shrink-0 p-2 bg-blue-500 text-white rounded disabled:bg-gray-300">
            <Undo className="w-4 h-4" />
          </button>
          <button onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex-shrink-0 p-2 bg-blue-500 text-white rounded disabled:bg-gray-300">
            <Redo className="w-4 h-4" />
          </button>
          <button onClick={reset} className="flex-shrink-0 px-3 py-2 bg-red-500 text-white rounded text-sm">
            Reset
          </button>
          <button onClick={exportCanvas}
                  disabled={!backgroundImage}
                  className="flex-shrink-0 px-3 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 text-sm">
            Export
          </button>
          <span className="flex-shrink-0 text-sm text-gray-600 px-2 py-2 bg-gray-100 rounded">
            {historyIndex + 1}/{history.length}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <Toolbar />
          <LayerPanel />
        </aside>

        {/* Editor Center */}
        <main className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-8 min-h-0">
          <div className="w-full max-w-4xl">
            <ImageEditor />
          </div>
        </main>

        {/* Desktop Right Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
          <TextPropertiesPanel />
        </aside>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => {
              setActivePanel('toolbar');
              setShowMobileMenu(true);
            }}
            className="flex flex-col items-center py-2 text-xs text-gray-600 hover:text-blue-500"
          >
            <Menu className="w-5 h-5 mb-1" />
            Tools
          </button>
          <button
            onClick={() => {
              setActivePanel('layers');
              setShowMobileMenu(true);
            }}
            className="flex flex-col items-center py-2 text-xs text-gray-600 hover:text-blue-500"
          >
            <Layers className="w-5 h-5 mb-1" />
            Layers
          </button>
          <button
            onClick={() => {
              setActivePanel('properties');
              setShowMobileMenu(true);
            }}
            className="flex flex-col items-center py-2 text-xs text-gray-600 hover:text-blue-500"
          >
            <Type className="w-5 h-5 mb-1" />
            Properties
          </button>
        </div>
      </div>

      {/* Mobile Panel Modal */}
      <MobilePanelModal
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
    </div>
  );
}