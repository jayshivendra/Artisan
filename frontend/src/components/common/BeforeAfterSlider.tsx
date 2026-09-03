import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [containerWidth, setContainerWidth] = useState<number>(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Measure container width accurately on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.clientWidth);

    const ro = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 2) pos = 2;
    if (pos > 98) pos = 98;
    setSliderPosition(pos);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      updatePosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => updatePosition(e.clientX)}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border-2 border-stone-200 bg-stone-900 touch-none"
    >
      {/* 1. After Image (Full background - Studio Enhanced) */}
      <img
        src={afterImage}
        alt="AI Studio Enhanced"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* 2. Before Image (Clipped overlay with fixed container width so image is NEVER squished) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden z-10"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Original"
          className="absolute inset-y-0 left-0 h-full object-cover filter brightness-90 contrast-95"
          style={{ width: `${containerWidth || 400}px`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-30 bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow pointer-events-none border border-white/20">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 z-30 bg-artisan-terracotta backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow flex items-center space-x-1 pointer-events-none border border-white/20">
        <Sparkles className="w-3 h-3 text-amber-300" />
        <span>{afterLabel}</span>
      </div>

      {/* Vertical Split Line and Draggable Knob */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-artisan-terracotta shadow-2xl flex items-center justify-center border-2 border-artisan-terracotta ring-4 ring-black/20">
          <Sliders className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-3.5 py-1 rounded-full pointer-events-none border border-white/20 shadow">
        👈 Drag handle to see AI difference 👉
      </div>
    </div>
  );
};
