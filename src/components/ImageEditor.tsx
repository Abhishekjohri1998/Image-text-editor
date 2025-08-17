'use client';
import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '@/store/editorStore';
import { Upload } from 'lucide-react';

export function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  const {
    backgroundImage,
    canvasSize,
    layers,
    selectedLayer,
    setFabricCanvas,
    selectLayer,
    updateLayer,
    setBackgroundImage,
    deleteLayer,
  } = useEditorStore();

  // Strictly initialize fabric canvas ONCE, only when ref is present
  useEffect(() => {
    if (!canvasRef.current) return;
    if (fabricCanvasRef.current) return; // prevent double init in strict mode

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      preserveObjectStacking: true,
      selection: true,
      backgroundColor: '#f5f5f5'
    });

    fabricCanvasRef.current = canvas;
    setFabricCanvas(canvas); // 💥 THIS stores the instance in Zustand
    setCanvasInitialized(true);

    // Keyboard Controls
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObject = canvas.getActiveObject() as any;
      if (!activeObject) return;
      const step = e.shiftKey ? 10 : 1;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          activeObject.set('left', (activeObject.left || 0) - step);
          canvas.renderAll();
          break;
        case 'ArrowRight':
          e.preventDefault();
          activeObject.set('left', (activeObject.left || 0) + step);
          canvas.renderAll();
          break;
        case 'ArrowUp':
          e.preventDefault();
          activeObject.set('top', (activeObject.top || 0) - step);
          canvas.renderAll();
          break;
        case 'ArrowDown':
          e.preventDefault();
          activeObject.set('top', (activeObject.top || 0) + step);
          canvas.renderAll();
          break;
        case 'Delete':
          e.preventDefault();
          if (activeObject.data?.layerId) {
            deleteLayer(activeObject.data.layerId);
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    canvas.on('selection:created', (e: any) => {
      const activeObject = e.target;
      if (activeObject?.data?.layerId) {
        selectLayer(activeObject.data.layerId);
      }
    });
    canvas.on('selection:cleared', () => selectLayer(null));
    canvas.on('object:modified', (e: any) => {
      const obj = e.target;
      if (obj?.data?.layerId) {
        updateLayer(obj.data.layerId, {
          x: obj.left || 0,
          y: obj.top || 0,
          width: obj.width ? obj.width * (obj.scaleX || 1) : 200,
          height: obj.height ? obj.height * (obj.scaleY || 1) : 50,
          rotation: obj.angle || 0,
        });
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
      setCanvasInitialized(false);
      setFabricCanvas(null);
    };
  }, []); // empty dependency ensures mounting only

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setDimensions({
        width: canvasSize.width,
        height: canvasSize.height
      });
    }
  }, [canvasSize.width, canvasSize.height]);

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    for (const obj of canvas.getObjects()) {
      if (obj.type === 'textbox') canvas.remove(obj);
    }
    layers.forEach(layer => {
      const textbox = new fabric.Textbox(layer.text, {
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        fontSize: layer.fontSize,
        fontFamily: layer.fontFamily,
        fontWeight: layer.fontWeight,
        fill: layer.color,
        opacity: layer.opacity,
        angle: layer.rotation,
        textAlign: layer.textAlign,
        cornerColor: '#0ea5e9',
        cornerStyle: 'circle',
        transparentCorners: false,
        cornerSize: 8,
        rotatingPointOffset: 40,
        data: { layerId: layer.id } as any
      });
      canvas.add(textbox);
    });
    canvas.renderAll();
  }, [layers]);

  // Handle image upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.includes('png') && !file.type.includes('jpg') && !file.type.includes('jpeg')) {
      alert('Please upload a PNG, JPG, or JPEG image');
      return;
    }
    if (!fabricCanvasRef.current) {
      alert('Editor not ready yet. Please wait for initialization.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && fabricCanvasRef.current) {
        setBackgroundImage(result, file, fabricCanvasRef.current);
      } else {
        alert('Failed to process image. Please try again.');
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="relative">
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="block"
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain'
          }}
        />
        {/* Upload overlay when no background image */}
        {!backgroundImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95">
            <div className="text-center p-8">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Image</h3>
              <p className="text-gray-500 mb-4">
                Select a PNG, JPG, or JPEG image to start editing
              </p>
              <label 
                className={`inline-flex cursor-pointer items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all ${
                  canvasInitialized 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {canvasInitialized ? 'Choose File' : 'Loading...'}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={!canvasInitialized}
                />
              </label>
              {!canvasInitialized && (
                <div className="mt-3 text-sm text-yellow-700">
                  Please wait for editor to finish loading...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
