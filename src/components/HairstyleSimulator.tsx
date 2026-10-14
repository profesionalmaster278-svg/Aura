import React, { useState } from 'react';
import { HairstyleModel, GenderTier, HairLengthTier, ClientProfile } from '../types';
import { HAIRSTYLE_CATALOG, HAIR_COLORS } from '../data/hairstyleCatalog';
import { AtelierPortraitVisual } from './AtelierPortraitVisual';
import { Sparkles, Sliders, Scissors, Shield, ChevronRight, Check, Columns2 } from 'lucide-react';

interface HairstyleSimulatorProps {
  currentProfile: ClientProfile;
  selectedStyle: HairstyleModel;
  onSelectStyle: (style: HairstyleModel) => void;
  selectedColorHex: string;
  onSelectColorHex: (hex: string) => void;
  onOpenExecutionBrief: () => void;
  onOpenCompare?: (styleToCompare?: HairstyleModel) => void;
}

export const HairstyleSimulator: React.FC<HairstyleSimulatorProps> = ({
  currentProfile,
  selectedStyle,
  onSelectStyle,
  selectedColorHex,
  onSelectColorHex,
  onOpenExecutionBrief,
  onOpenCompare,
}) => {
  const [genderFilter, setGenderFilter] = useState<GenderTier>('All');
  const [lengthFilter, setLengthFilter] = useState<HairLengthTier | 'All'>('All');
  const [splitPosition, setSplitPosition] = useState<number>(50); // 0 to 100 percentage for before/after slider
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customDirectiveResult, setCustomDirectiveResult] = useState<string | null>(null);
  const [isProcessingPrompt, setIsProcessingPrompt] = useState<boolean>(false);

  // Filter catalog
  const filteredStyles = HAIRSTYLE_CATALOG.filter((item) => {
    const matchesGender = genderFilter === 'All' || item.genderCategory === genderFilter || item.genderCategory === 'Unisex';
    const matchesLength = lengthFilter === 'All' || item.lengthCategory === lengthFilter;
    return matchesGender && matchesLength;
  });

  // Handle slider mouse / touch drag
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSplitPosition(percent);
  };

  const handleCustomDirective = async () => {
    if (!customPrompt.trim()) return;
    setIsProcessingPrompt(true);
    try {
      const response = await fetch('/api/generate-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: currentProfile.name,
          faceShape: currentProfile.faceShape,
          selectedStyle: selectedStyle.name,
          clientPreferences: customPrompt,
        }),
      });
      const data = await response.json();
      setCustomDirectiveResult(data.summary || 'Bespoke parameters tailored to facial proportions.');
    } catch {
      setCustomDirectiveResult('Tailored styling adjustments formulated for bone structure.');
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Interactive Before & After Split Mirror Viewport */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Interactive Biometric Split Mirror
            </div>
            <h2 className="text-xl font-serif font-semibold text-neutral-100 mt-0.5">
              Before (Native Cranium) · After ({selectedStyle.name})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {onOpenCompare && (
              <button
                type="button"
                onClick={() => onOpenCompare()}
                className="px-3 py-1.5 bg-[#14141B] hover:bg-neutral-800 text-neutral-200 border border-[#262633] hover:border-[#E0A99A]/50 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Columns2 className="w-3.5 h-3.5 text-[#E0A99A]" />
                <span>Compare 2 Models</span>
              </button>
            )}
            <div className="text-xs font-mono text-neutral-400 hidden sm:block">
              Slide horizontal axis to compare
            </div>
          </div>
        </div>

        {/* Split Container */}
        <div
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 select-none cursor-ew-resize"
          onMouseMove={handleSplitMouseMove}
          onMouseDown={() => setIsDraggingSplit(true)}
          onMouseUp={() => setIsDraggingSplit(false)}
          onMouseLeave={() => setIsDraggingSplit(false)}
        >
          {/* Baseline Left (Underneath) */}
          <div className="absolute inset-0">
            <AtelierPortraitVisual
              faceShape={currentProfile.faceShape}
              selectedColorHex="#251e1b"
              hairstyleKey="baseline-native"
              showLandmarks={false}
              showThirds={true}
              showCranialMesh={false}
              userImageSrc={currentProfile.presetAvatarUrl || null}
            />
            <div className="absolute bottom-4 left-4 z-20 px-2.5 py-1 bg-neutral-950/80 backdrop-blur rounded border border-neutral-800 text-[11px] font-mono text-neutral-300">
              Baseline Cranial Axis
            </div>
          </div>

          {/* Right Simulated Half (Clipped by splitPosition) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
          >
            <AtelierPortraitVisual
              faceShape={currentProfile.faceShape}
              selectedColorHex={selectedColorHex}
              hairstyleKey={selectedStyle.imageVectorKey}
              showLandmarks={false}
              showThirds={false}
              showCranialMesh={false}
              userImageSrc={null}
            />
            <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 bg-amber-950/80 backdrop-blur rounded border border-amber-800/80 text-[11px] font-mono text-amber-200">
              Simulated: {selectedStyle.name}
            </div>
          </div>

          {/* Draggable Divider Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 shadow-[0_0_8px_#f59e0b] pointer-events-none"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-neutral-950 border-2 border-amber-400 flex items-center justify-center text-[9px] text-amber-300 font-bold shadow-md">
              ⇄
            </div>
          </div>
        </div>

        {/* Color Palette Selector Strip */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-neutral-400">Atelier Color Tone:</span>
            <div className="flex items-center gap-2">
              {HAIR_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => onSelectColorHex(color.hex)}
                  title={`${color.name}: ${color.desc}`}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    selectedColorHex === color.hex
                      ? 'scale-125 border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-neutral-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-amber-300">
            {HAIR_COLORS.find((c) => c.hex === selectedColorHex)?.name || 'Custom Color'}
          </div>
        </div>
      </div>

      {/* Bespoke Styling AI Directive Bar */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Styling Directive (AI Customization)</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., Soften curtain fringe to cheekbones and add sun-kissed micro-ribbons..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/80"
            onKeyDown={(e) => e.key === 'Enter' && handleCustomDirective()}
          />
          <button
            onClick={handleCustomDirective}
            disabled={isProcessingPrompt || !customPrompt.trim()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
          >
            {isProcessingPrompt ? 'Formulating...' : 'Apply Directive'}
          </button>
        </div>
        {customDirectiveResult && (
          <div className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-900/50 p-3 rounded-lg leading-relaxed">
            {customDirectiveResult}
          </div>
        )}
      </div>

      {/* Hairstyle & Wig Catalog Filter Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-neutral-100">
              Crown & Hairpiece Catalog
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Calibrated cuts, tapers, layers, and medical-grade lace units across all genders & ages
            </p>
          </div>

          {/* Gender Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 overflow-x-auto max-w-full">
            {(['All', 'Women', 'Men', 'Unisex', 'Mature', 'Avant-Garde'] as GenderTier[]).map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  genderFilter === gender
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStyles.map((style) => {
            const isSelected = selectedStyle.id === style.id;
            const matchesFaceShape = style.targetFaceShapes.includes(currentProfile.faceShape);

            return (
              <div
                key={style.id}
                onClick={() => onSelectStyle(style)}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-amber-400">
                        {style.category}
                      </span>
                      <h4 className="text-base font-serif font-semibold text-neutral-100 leading-snug mt-0.5">
                        {style.name}
                      </h4>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-amber-400 text-neutral-950">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                    {style.description}
                  </p>

                  <div className="bg-neutral-900/90 border border-neutral-800/80 rounded-lg p-2.5 text-[11px] mb-3">
                    <div className="font-mono text-neutral-400 text-[10px] uppercase">
                      Cranial Harmony:
                    </div>
                    <div className="text-neutral-300 mt-0.5 leading-tight">
                      {style.cranialHarmonyNote}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                    <span>Texture: {style.textureCompatibility}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                  <span className={`text-[11px] font-mono ${
                    matchesFaceShape ? 'text-amber-300' : 'text-neutral-500'
                  }`}>
                    {matchesFaceShape ? '✓ Ideal for your face shape' : 'Experimental fit'}
                  </span>

                  <div className="flex items-center gap-2">
                    {onOpenCompare && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCompare(style);
                        }}
                        className="text-xs text-neutral-400 hover:text-[#E0A99A] flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-neutral-800"
                        title="Compare this hairstyle model side-by-side with your active style"
                      >
                        <Columns2 className="w-3.5 h-3.5 text-[#E0A99A]" />
                        <span>Compare</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStyle(style);
                        onOpenExecutionBrief();
                      }}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Brief</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
