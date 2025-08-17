'use client';
import { Eye, EyeOff, Trash2, Move } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export function LayerPanel() {
  const { layers, selectedLayer, selectLayer, deleteLayer, reorderLayers } = useEditorStore();

  // Clicking layer toggles selection
  const handleLayerClick = (layerId: string) => {
    selectLayer(selectedLayer === layerId ? null : layerId);
  };

  // Prevent event bubbling on delete button
  const handleDeleteLayer = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteLayer(layerId);
  };

  // Sort layers by zIndex descending for display top on top
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  if (layers.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Layers</h2>
        <div className="text-center text-gray-500 py-8">
          <div className="text-sm">No text layers yet</div>
          <div className="text-xs mt-1">Add some text to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Layers ({layers.length})
      </h2>

      <div className="space-y-2">
        {sortedLayers.map((layer, index) => (
          <div
            key={layer.id}
            className={`
              group relative flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
              ${selectedLayer === layer.id
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-opacity-50'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }
            `}
            onClick={() => handleLayerClick(layer.id)}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', layer.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const draggedLayerId = e.dataTransfer.getData('text/plain');
              if (draggedLayerId && draggedLayerId !== layer.id) {
                const dragIndex = layers.findIndex(l => l.id === draggedLayerId);
                const hoverIndex = layers.findIndex(l => l.id === layer.id);
                reorderLayers(dragIndex, hoverIndex);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <Move className="h-4 w-4 text-gray-400 cursor-move" />
              <div className="font-medium text-sm text-gray-900 truncate max-w-[12rem]">
                {layer.text || 'Empty Text'}
              </div>
            </div>
            <button
              onClick={(e) => handleDeleteLayer(layer.id, e)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 p-1 rounded"
              aria-label={`Delete layer ${layer.text}`}
              title={`Delete layer "${layer.text}"`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
