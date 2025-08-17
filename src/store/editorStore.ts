import { create } from 'zustand';
import * as fabric from 'fabric';

// Data types
export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  opacity: number;
  rotation: number;
  textAlign: 'left' | 'center' | 'right';
  zIndex: number;
}
export interface CanvasSize {
  width: number;
  height: number;
}

interface EditorState {
  backgroundImage: string | null;
  backgroundImageFile: File | null;
  layers: TextLayer[];
  selectedLayer: string | null;
  canvasSize: CanvasSize;
  history: any[];
  historyIndex: number;
  fabricCanvas: any;
  googleFonts: string[];
}
interface EditorActions {
  setBackgroundImage: (imageUrl: string, file: File, canvas: any) => void;
  addTextLayer: (text: string) => void;
  updateLayer: (id: string, updates: Partial<TextLayer>) => void;
  deleteLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  reorderLayers: (dragIndex: number, hoverIndex: number) => void;
  setFabricCanvas: (canvas: any) => void;
  undo: () => void;
  redo: () => void;
  addToHistory: (state: any) => void;
  reset: () => void;
  exportCanvas: () => void;
  loadState: (state: any) => void;
  setGoogleFonts: (fonts: string[]) => void;
}

const createInitialState = (): EditorState => ({
  backgroundImage: null,
  backgroundImageFile: null,
  layers: [],
  selectedLayer: null,
  canvasSize: { width: 800, height: 600 },
  history: [{ layers: [], backgroundImage: null, canvasSize: { width: 800, height: 600 } }],
  historyIndex: 0,
  fabricCanvas: null,
  googleFonts: []
});

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...createInitialState(),

  setBackgroundImage: (imageUrl, file, canvas) => {
    if (!canvas || !imageUrl) {
      console.error('Canvas or imageUrl not provided');
      return;
    }

    // Create HTMLImageElement for loading first
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const fabricImg = new fabric.Image(img);

        if (!fabricImg) {
          alert('Failed to create Fabric image. Please try again.');
          return;
        }

        const imgWidth = fabricImg.width || 800;
        const imgHeight = fabricImg.height || 600;

        canvas.setWidth(imgWidth);
        canvas.setHeight(imgHeight);

        canvas.backgroundColor = null;
        canvas.backgroundImage = fabricImg;

        fabricImg.set({
          scaleX: 1,
          scaleY: 1,
          originX: 'left',
          originY: 'top',
        });

        canvas.renderAll();

        set((state) => {
          const newState = {
            ...state,
            backgroundImage: imageUrl,
            backgroundImageFile: file,
            canvasSize: {
              width: imgWidth,
              height: imgHeight,
            },
            layers: [],
          };
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push({
            layers: newState.layers,
            backgroundImage: newState.backgroundImage,
            canvasSize: newState.canvasSize,
          });
          return {
            ...newState,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });

      } catch (error) {
        alert('Failed to process image. Please try a different image file.');
      }
    };

    img.onerror = () => {
      alert('Failed to load image. Please check the file and try again.');
    };

    img.src = imageUrl;
  },

  addTextLayer: (text) => {
    const id = Date.now().toString();
    const newLayer: TextLayer = {
      id,
      text,
      x: get().canvasSize.width / 2 - 100,
      y: get().canvasSize.height / 2 - 25,
      width: 200,
      height: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      opacity: 1,
      rotation: 0,
      textAlign: 'center',
      zIndex: get().layers.length,
    };
    set((state) => {
      const newLayers = [...state.layers, newLayer];
      const newState = { ...state, layers: newLayers, selectedLayer: id };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        layers: newLayers,
        backgroundImage: state.backgroundImage,
        canvasSize: state.canvasSize,
      });
      return {
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateLayer: (id, updates) => {
    set((state) => {
      const newLayers = state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      );
      const newState = { ...state, layers: newLayers };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        layers: newLayers,
        backgroundImage: state.backgroundImage,
        canvasSize: state.canvasSize,
      });
      return {
        ...newState,
        history: newHistory.length > 20 ? newHistory.slice(1) : newHistory,
        historyIndex: Math.min(newHistory.length - 1, 19),
      };
    });
  },

  deleteLayer: (id) => {
    set((state) => {
      const newLayers = state.layers.filter((layer) => layer.id !== id);
      const newState = {
        ...state,
        layers: newLayers,
        selectedLayer: state.selectedLayer === id ? null : state.selectedLayer,
      };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        layers: newLayers,
        backgroundImage: state.backgroundImage,
        canvasSize: state.canvasSize,
      });
      return {
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  selectLayer: (id) => set({ selectedLayer: id }),
  reorderLayers: (dragIndex, hoverIndex) => {
    set((state) => {
      const newLayers = [...state.layers];
      const draggedLayer = newLayers[dragIndex];
      newLayers.splice(dragIndex, 1);
      newLayers.splice(hoverIndex, 0, draggedLayer);
      const reorderedLayers = newLayers.map((layer, index) => ({
        ...layer,
        zIndex: index,
      }));
      return { ...state, layers: reorderedLayers };
    });
  },

  // 🔥 Always sets the Zustand state!
  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const historyState = state.history[newIndex];
      set({
        ...state,
        ...historyState,
        historyIndex: newIndex,
        selectedLayer: null,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const historyState = state.history[newIndex];
      set({
        ...state,
        ...historyState,
        historyIndex: newIndex,
        selectedLayer: null,
      });
    }
  },

  addToHistory: (state) => {
    const current = get();
    const newHistory = current.history.slice(0, current.historyIndex + 1);
    newHistory.push(state);
    set({
      history: newHistory.length > 20 ? newHistory.slice(1) : newHistory,
      historyIndex: Math.min(newHistory.length - 1, 19),
    });
  },

  reset: () => {
    localStorage.removeItem('image-text-composer');
    set(createInitialState());
  },

  // ✅ Export always works if canvas is alive and set by setFabricCanvas!
  exportCanvas: () => {
    const { fabricCanvas, backgroundImage } = get();
    if (!backgroundImage) {
      alert('Please upload an image before exporting.');
      return;
    }
    if (!fabricCanvas) {
      alert('Editor not ready to export.');
      return;
    }
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });
      const link = document.createElement('a');
      link.download = 'image-text-composition.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to export image: " + (error as any).message);
      console.error("Export PNG error:", error);
    }
  },

  loadState: (state) => {
    set((current) => ({
      ...current,
      ...state,
      history: [state],
      historyIndex: 0,
    }));
  },

  setGoogleFonts: (fonts) => set({ googleFonts: fonts }),
}));
