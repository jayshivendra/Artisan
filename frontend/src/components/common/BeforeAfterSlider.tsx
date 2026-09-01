import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Sliders } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Photo',
  afterLabel = 'AI Studio Enhanced'
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPosition(pos);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl select-none cursor-ew-resize border-2 border-stone-200 bg-stone-100 touch-none"
    >
      {/* After Image (Full background) */}
      <img
        src={afterImage}
        alt="AI Studio Enhanced"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Original"
          className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-80"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 bg-artisan-terracotta/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1 pointer-events-none">
        <Sparkles className="w-3 h-3 text-amber-300" />
        <span>{afterLabel}</span>
      </div>

      {/* Vertical Divider Line and Draggable Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-artisan-terracotta shadow-2xl flex items-center justify-center border-2 border-artisan-terracotta">
          <Sliders className="w-4 h-4" />
        </div>
      </div>

      {/* Interactive Helper Text */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-stone-900/60 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-3 py-1 rounded-full pointer-events-none">
        👈 Drag slider to compare 👉
      </div>
    </div>
  );
};
