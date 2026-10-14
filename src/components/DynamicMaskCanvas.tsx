import React, { useRef, useEffect, useState } from 'react';
import { Brush, Eraser, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface DynamicMaskCanvasProps {
  imageSrc?: string | null;
  onMaskGenerated?: (maskBase64: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

export const DynamicMaskCanvas: React.FC<DynamicMaskCanvasProps> = ({
  imageSrc,
  onMaskGenerated,
  width = 400,
  height = 480,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [showMaskOverlay, setShowMaskOverlay] = useState<boolean>(true);

  // Initialize and draw default cranial hair mask based on anatomical landmarks
  const resetToAnatomicalMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw baseline anatomical hair region
    ctx.fillStyle = 'rgba(224, 169, 154, 0.45)';
    ctx.beginPath();
    // Crown arch
    ctx.moveTo(70, 160);
    ctx.bezierCurveTo(60, 40, 340, 40, 330, 160);
    // Perimeter hairline curve across forehead
    ctx.bezierCurveTo(300, 110, 240, 125, 200, 120);
    ctx.bezierCurveTo(160, 125, 100, 110, 70, 160);
    ctx.closePath();
    ctx.fill();

    exportMask();
  };

  useEffect(() => {
    resetToAnatomicalMask();
  }, [width, height]);

  const exportMask = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onMaskGenerated) return;
    const maskData = canvas.toDataURL('image/png');
    onMaskGenerated(maskData);
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      exportMask();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(224, 169, 154, 0.5)';
      ctx.fillStyle = 'rgba(224, 169, 154, 0.5)';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    }

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      {/* Canvas Viewport */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
        {/* Underlying Client Portrait */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Client frame"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />
        )}

        {/* Dynamic Hair Mask Canvas Layer */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity ${
            showMaskOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Mask Overlay Notice */}
        <div className="absolute bottom-3 left-3 z-20 px-2 py-1 bg-neutral-950/80 backdrop-blur rounded text-[10px] font-mono text-[#E0A99A]">
          Hair Segmentation Inpaint Mask
        </div>
      </div>

      {/* Mask Refinement Toolbar */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTool('brush')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'brush' ? 'bg-[#E0A99A] text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Paint inpainting zone"
          >
            <Brush className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'eraser' ? 'bg-[#E0A99A] text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Erase inpainting zone"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetToAnatomicalMask}
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Reset to default anatomical hairline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500 font-mono">Radius:</span>
          <input
            type="range"
            min="10"
            max="60"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            className="w-16 h-1 accent-[#E0A99A] bg-neutral-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => setShowMaskOverlay(!showMaskOverlay)}
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-200 transition-colors ml-1"
            title="Toggle mask visibility"
          >
            {showMaskOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
