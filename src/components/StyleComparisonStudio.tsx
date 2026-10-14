import React, { useState } from 'react';
import { ClientProfile, HairstyleModel, FaceShape } from '../types';
import { HAIRSTYLE_CATALOG, HAIR_COLORS } from '../data/hairstyleCatalog';
import { AtelierPortraitVisual } from './AtelierPortraitVisual';
import {
  Columns2,
  Split,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Sparkles,
  Scissors,
  Layers,
  Clock,
  Eye,
  Sliders,
  ChevronDown,
  Info,
} from 'lucide-react';

interface StyleComparisonStudioProps {
  currentProfile: ClientProfile;
  selectedStyleA: HairstyleModel;
  onSelectStyleA: (style: HairstyleModel) => void;
  selectedStyleB?: HairstyleModel;
  onSelectStyleB?: (style: HairstyleModel) => void;
  selectedColorHex: string;
  onSelectColorHex: (hex: string) => void;
  onOpenExecutionBrief: () => void;
  onCloseCompare?: () => void;
}

export const StyleComparisonStudio: React.FC<StyleComparisonStudioProps> = ({
  currentProfile,
  selectedStyleA,
  onSelectStyleA,
  selectedStyleB: externalStyleB,
  onSelectStyleB: externalOnSelectStyleB,
  selectedColorHex,
  onSelectColorHex,
  onOpenExecutionBrief,
  onCloseCompare,
}) => {
  // Find a smart default contrast style for B if not passed
  const defaultStyleB =
    externalStyleB ||
    HAIRSTYLE_CATALOG.find((s) => s.id !== selectedStyleA.id && s.targetFaceShapes.includes(currentProfile.faceShape)) ||
    HAIRSTYLE_CATALOG.find((s) => s.id !== selectedStyleA.id) ||
    HAIRSTYLE_CATALOG[1];

  const [styleB, setStyleB] = useState<HairstyleModel>(defaultStyleB);

  const activeStyleB = externalStyleB || styleB;
  const updateStyleB = (style: HairstyleModel) => {
    setStyleB(style);
    externalOnSelectStyleB?.(style);
  };

  // Comparison View Mode: 'side-by-side' or 'overlay-slider'
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay-slider'>('side-by-side');

  // Overlay Split Slider Position (0 - 100%)
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // HUD Overlays
  const [showBiometrics, setShowBiometrics] = useState<boolean>(true);

  // Color selection for Style B (can be synchronized or distinct)
  const [syncColors, setSyncColors] = useState<boolean>(true);
  const [colorHexB, setColorHexB] = useState<string>(selectedColorHex);

  const activeColorA = selectedColorHex;
  const activeColorB = syncColors ? selectedColorHex : colorHexB;

  // Handle Dragging Split Slider
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSplitPosition(percent);
  };

  // Swap Styles A and B
  const handleSwapStyles = () => {
    navigator.vibrate?.(15);
    const temp = selectedStyleA;
    onSelectStyleA(activeStyleB);
    updateStyleB(temp);
  };

  // Calculate face-shape fit metrics
  const evaluateFit = (style: HairstyleModel, faceShape: FaceShape) => {
    const isDirectMatch = style.targetFaceShapes.includes(faceShape);
    const score = isDirectMatch ? 95 : 78;
    return {
      isDirectMatch,
      score,
      label: isDirectMatch ? 'Harmonious Fit' : 'Experimental Proportions',
    };
  };

  const fitA = evaluateFit(selectedStyleA, currentProfile.faceShape);
  const fitB = evaluateFit(activeStyleB, currentProfile.faceShape);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Mode Bar */}
      <div className="bg-[#14141B] border border-[#262633] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#E0A99A]">
              Bespoke Cranial Fit Comparison
            </span>
            <span className="text-neutral-500 text-xs">·</span>
            <span className="text-xs text-neutral-400 font-mono">
              Client: <strong className="text-neutral-200">{currentProfile.name}</strong> ({currentProfile.faceShape})
            </span>
          </div>
          <h3 className="text-xl font-serif font-semibold text-neutral-100 mt-0.5">
            Hairstyle Model Comparison & Silhouette Evaluation
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-[#0B0B0E] rounded-lg border border-[#262633]">
            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setViewMode('side-by-side');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'side-by-side'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setViewMode('overlay-slider');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'overlay-slider'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Overlay Wipe Slider</span>
            </button>
          </div>

          {/* Swap Models Button */}
          <button
            onClick={handleSwapStyles}
            className="px-3 py-1.5 bg-[#0B0B0E] hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 border border-[#262633] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            title="Swap positions of Model A and Model B"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#E0A99A]" />
            <span>Swap</span>
          </button>

          {/* Biometrics HUD Toggle */}
          <button
            onClick={() => {
              navigator.vibrate?.(15);
              setShowBiometrics(!showBiometrics);
            }}
            className={`px-3 py-1.5 border text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              showBiometrics
                ? 'bg-neutral-900 border-[#E0A99A]/50 text-[#E0A99A]'
                : 'bg-[#0B0B0E] border-[#262633] text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Cranial HUD</span>
          </button>

          {onCloseCompare && (
            <button
              onClick={onCloseCompare}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium rounded-lg border border-[#262633] transition-colors"
            >
              Exit Compare
            </button>
          )}
        </div>
      </div>

      {/* Primary Model Selectors Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Style A Selection Card */}
        <div className="bg-[#14141B] border border-[#262633] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#E0A99A] uppercase tracking-wider font-semibold">
              Model A (Primary Model)
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {fitA.label} · <strong className="text-neutral-200">{fitA.score}%</strong>
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedStyleA.id}
              onChange={(e) => {
                const found = HAIRSTYLE_CATALOG.find((s) => s.id === e.target.value);
                if (found) {
                  navigator.vibrate?.(10);
                  onSelectStyleA(found);
                }
              }}
              className="w-full bg-[#0B0B0E] border border-[#262633] focus:border-[#E0A99A] rounded-lg p-2.5 text-xs text-neutral-100 font-medium focus:outline-none transition-colors appearance-none pr-8 cursor-pointer"
            >
              {HAIRSTYLE_CATALOG.map((s) => (
                <option key={`a-${s.id}`} value={s.id}>
                  {s.name} ({s.category} · {s.genderCategory})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="text-[11px] text-neutral-400 leading-relaxed line-clamp-1">
            {selectedStyleA.cranialHarmonyNote}
          </div>
        </div>

        {/* Style B Selection Card */}
        <div className="bg-[#14141B] border border-[#262633] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
              Model B (Comparison Model)
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {fitB.label} · <strong className="text-neutral-200">{fitB.score}%</strong>
            </span>
          </div>

          <div className="relative">
            <select
              value={activeStyleB.id}
              onChange={(e) => {
                const found = HAIRSTYLE_CATALOG.find((s) => s.id === e.target.value);
                if (found) {
                  navigator.vibrate?.(10);
                  updateStyleB(found);
                }
              }}
              className="w-full bg-[#0B0B0E] border border-[#262633] focus:border-amber-400 rounded-lg p-2.5 text-xs text-neutral-100 font-medium focus:outline-none transition-colors appearance-none pr-8 cursor-pointer"
            >
              {HAIRSTYLE_CATALOG.map((s) => (
                <option key={`b-${s.id}`} value={s.id}>
                  {s.name} ({s.category} · {s.genderCategory})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="text-[11px] text-neutral-400 leading-relaxed line-clamp-1">
            {activeStyleB.cranialHarmonyNote}
          </div>
        </div>
      </div>

      {/* Main Visual Display: Side-by-Side or Overlay Slider */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Viewport A */}
          <div className="bg-[#14141B] border border-[#262633] rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#E0A99A] uppercase tracking-wider">
                  Model A Silhouette
                </span>
                <h4 className="text-base font-serif font-semibold text-neutral-100">
                  {selectedStyleA.name}
                </h4>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                fitA.isDirectMatch
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/50'
                  : 'text-amber-400 bg-amber-950/40 border border-amber-900/50'
              }`}>
                {fitA.isDirectMatch ? '✓ Optimal Fit' : 'Experimental'}
              </span>
            </div>

            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#0B0B0E] border border-[#262633]">
              <AtelierPortraitVisual
                faceShape={currentProfile.faceShape}
                selectedColorHex={activeColorA}
                hairstyleKey={selectedStyleA.imageVectorKey}
                showLandmarks={showBiometrics}
                showThirds={showBiometrics}
                showCranialMesh={showBiometrics}
                userImageSrc={null}
              />

              <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 bg-[#0B0B0E]/85 backdrop-blur rounded border border-[#262633] text-[10px] font-mono text-neutral-300">
                {currentProfile.faceShape} Cranium · {selectedStyleA.category}
              </div>
            </div>

            <div className="p-3 bg-[#0B0B0E]/60 rounded-xl border border-[#262633] text-xs flex flex-col gap-2">
              <div className="text-[10px] font-mono uppercase text-[#E0A99A]">Structural Balancing Effect:</div>
              <p className="text-neutral-300 leading-relaxed text-xs">
                {selectedStyleA.cranialHarmonyNote}
              </p>
              <div className="pt-2 border-t border-[#262633] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Technique: {selectedStyleA.shearTechnique.split(',')[0]}</span>
                <button
                  onClick={() => {
                    navigator.vibrate?.(15);
                    onOpenExecutionBrief();
                  }}
                  className="text-[#E0A99A] hover:underline"
                >
                  Brief & Ticket →
                </button>
              </div>
            </div>
          </div>

          {/* Viewport B */}
          <div className="bg-[#14141B] border border-[#262633] rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider">
                  Model B Silhouette
                </span>
                <h4 className="text-base font-serif font-semibold text-neutral-100">
                  {activeStyleB.name}
                </h4>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                fitB.isDirectMatch
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/50'
                  : 'text-amber-400 bg-amber-950/40 border border-amber-900/50'
              }`}>
                {fitB.isDirectMatch ? '✓ Optimal Fit' : 'Experimental'}
              </span>
            </div>

            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#0B0B0E] border border-[#262633]">
              <AtelierPortraitVisual
                faceShape={currentProfile.faceShape}
                selectedColorHex={activeColorB}
                hairstyleKey={activeStyleB.imageVectorKey}
                showLandmarks={showBiometrics}
                showThirds={showBiometrics}
                showCranialMesh={showBiometrics}
                userImageSrc={null}
              />

              <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 bg-[#0B0B0E]/85 backdrop-blur rounded border border-[#262633] text-[10px] font-mono text-neutral-300">
                {currentProfile.faceShape} Cranium · {activeStyleB.category}
              </div>
            </div>

            <div className="p-3 bg-[#0B0B0E]/60 rounded-xl border border-[#262633] text-xs flex flex-col gap-2">
              <div className="text-[10px] font-mono uppercase text-amber-300">Structural Balancing Effect:</div>
              <p className="text-neutral-300 leading-relaxed text-xs">
                {activeStyleB.cranialHarmonyNote}
              </p>
              <div className="pt-2 border-t border-[#262633] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Technique: {activeStyleB.shearTechnique.split(',')[0]}</span>
                <button
                  onClick={() => {
                    navigator.vibrate?.(15);
                    onSelectStyleA(activeStyleB);
                  }}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  Adopt as Primary Cut →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Overlay Wipe Split Slider View */
        <div className="bg-[#14141B] border border-[#262633] rounded-2xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-[#E0A99A] uppercase tracking-wider">
                Interactive Dual Model Wipe
              </span>
              <h4 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
                Model A ({selectedStyleA.name}) · Model B ({activeStyleB.name})
              </h4>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              Drag cursor / finger across portrait to reveal difference
            </div>
          </div>

          <div
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#0B0B0E] border border-[#262633] select-none cursor-ew-resize"
            onMouseMove={handleSplitMouseMove}
            onMouseDown={() => setIsDraggingSplit(true)}
            onMouseUp={() => setIsDraggingSplit(false)}
            onMouseLeave={() => setIsDraggingSplit(false)}
          >
            {/* Base Left (Model A) */}
            <div className="absolute inset-0">
              <AtelierPortraitVisual
                faceShape={currentProfile.faceShape}
                selectedColorHex={activeColorA}
                hairstyleKey={selectedStyleA.imageVectorKey}
                showLandmarks={showBiometrics}
                showThirds={showBiometrics}
                showCranialMesh={showBiometrics}
                userImageSrc={null}
              />
              <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 bg-[#0B0B0E]/85 backdrop-blur rounded-lg border border-[#262633] text-xs font-mono text-[#E0A99A]">
                Model A: {selectedStyleA.name}
              </div>
            </div>

            {/* Clipped Right (Model B) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
            >
              <AtelierPortraitVisual
                faceShape={currentProfile.faceShape}
                selectedColorHex={activeColorB}
                hairstyleKey={activeStyleB.imageVectorKey}
                showLandmarks={showBiometrics}
                showThirds={showBiometrics}
                showCranialMesh={showBiometrics}
                userImageSrc={null}
              />
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-neutral-950/85 backdrop-blur rounded-lg border border-amber-800/80 text-xs font-mono text-amber-300">
                Model B: {activeStyleB.name}
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#E0A99A] z-30 shadow-[0_0_10px_#E0A99A] pointer-events-none"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0B0B0E] border-2 border-[#E0A99A] flex items-center justify-center text-[10px] text-[#E0A99A] font-bold shadow-lg">
                ⇄
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span>◄ Revealing Model A: {splitPosition}%</span>
            <span>Revealing Model B: {100 - splitPosition}% ►</span>
          </div>
        </div>
      )}

      {/* Face-Shape Fit Evaluation Diagnostic Matrix */}
      <div className="bg-[#14141B] border border-[#262633] rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262633]">
          <div>
            <div className="text-[11px] font-mono uppercase text-[#E0A99A] tracking-wider">
              Anatomical Biometrics Matrix
            </div>
            <h4 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
              Comparative Face-Shape Fit Evaluation
            </h4>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Detected Contour: <strong className="text-[#E0A99A]">{currentProfile.faceShape}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#262633] text-neutral-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Evaluation Metric</th>
                <th className="py-2.5 px-3 text-[#E0A99A]">Model A ({selectedStyleA.name})</th>
                <th className="py-2.5 px-3 text-amber-300">Model B ({activeStyleB.name})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262633]/60 text-neutral-200">
              <tr>
                <td className="py-3 px-3 font-mono text-neutral-400">Face-Shape Fit Score</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E0A99A]" style={{ width: `${fitA.score}%` }} />
                    </div>
                    <span className="font-semibold text-neutral-100">{fitA.score}%</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({fitA.label})</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${fitB.score}%` }} />
                    </div>
                    <span className="font-semibold text-neutral-100">{fitB.score}%</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({fitB.label})</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-mono text-neutral-400">Harmonious Face Shapes</td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {selectedStyleA.targetFaceShapes.map((shape) => (
                      <span
                        key={`shape-a-${shape}`}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          shape === currentProfile.faceShape
                            ? 'bg-[#E0A99A]/20 text-[#E0A99A] font-bold border border-[#E0A99A]/40'
                            : 'text-neutral-400'
                        }`}
                      >
                        {shape}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {activeStyleB.targetFaceShapes.map((shape) => (
                      <span
                        key={`shape-b-${shape}`}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          shape === currentProfile.faceShape
                            ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                            : 'text-neutral-400'
                        }`}
                      >
                        {shape}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-mono text-neutral-400">Cranial Balancing Strategy</td>
                <td className="py-3 px-3 text-neutral-300 leading-relaxed max-w-xs">
                  {selectedStyleA.cranialHarmonyNote}
                </td>
                <td className="py-3 px-3 text-neutral-300 leading-relaxed max-w-xs">
                  {activeStyleB.cranialHarmonyNote}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-mono text-neutral-400">Category & Execution</td>
                <td className="py-3 px-3 text-neutral-300">
                  {selectedStyleA.category} · {selectedStyleA.lengthCategory}
                </td>
                <td className="py-3 px-3 text-neutral-300">
                  {activeStyleB.category} · {activeStyleB.lengthCategory}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-mono text-neutral-400">Hair Texture Compatibility</td>
                <td className="py-3 px-3 text-neutral-300">{selectedStyleA.textureCompatibility}</td>
                <td className="py-3 px-3 text-neutral-300">{activeStyleB.textureCompatibility}</td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-mono text-neutral-400">Technical Shear / Clipper Protocol</td>
                <td className="py-3 px-3 text-neutral-400 leading-relaxed text-[11px] max-w-xs">
                  {selectedStyleA.shearTechnique}
                </td>
                <td className="py-3 px-3 text-neutral-400 leading-relaxed text-[11px] max-w-xs">
                  {activeStyleB.shearTechnique}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Decision Row */}
        <div className="mt-5 pt-4 border-t border-[#262633] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#E0A99A]" />
            <span>Select which silhouette best flatters the client's bone structure to generate the execution ticket.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                navigator.vibrate?.(15);
                onOpenExecutionBrief();
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#E0A99A] hover:bg-[#d89c8c] text-neutral-950 font-semibold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm Model A ({selectedStyleA.name.split(' ')[0]})</span>
            </button>

            <button
              onClick={() => {
                navigator.vibrate?.(15);
                onSelectStyleA(activeStyleB);
                setTimeout(() => onOpenExecutionBrief(), 50);
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Adopt Model B ({activeStyleB.name.split(' ')[0]})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
