import React, { useState } from 'react';
import { ClientProfile, HairstyleModel } from '../types';
import { BiometricScanner } from './BiometricScanner';
import { CranialAnalysisPanel } from './CranialAnalysisPanel';
import { HairstyleSimulator } from './HairstyleSimulator';
import { DynamicMaskCanvas } from './DynamicMaskCanvas';
import { StyleComparisonStudio } from './StyleComparisonStudio';
import { Layers, Sparkles, Sliders, Columns2 } from 'lucide-react';

interface StyleStudioProps {
  currentProfile: ClientProfile;
  onSelectProfile: (profile: ClientProfile) => void;
  onAnalysisComplete: (newProfile: ClientProfile) => void;
  isAnalyzing: boolean;
  selectedStyle: HairstyleModel;
  onSelectStyle: (style: HairstyleModel) => void;
  selectedColorHex: string;
  onSelectColorHex: (hex: string) => void;
  onOpenExecutionBrief: () => void;
  onOpenPrivacyModal?: () => void;
}

export const StyleStudio: React.FC<StyleStudioProps> = ({
  currentProfile,
  onSelectProfile,
  onAnalysisComplete,
  isAnalyzing,
  selectedStyle,
  onSelectStyle,
  selectedColorHex,
  onSelectColorHex,
  onOpenExecutionBrief,
  onOpenPrivacyModal,
}) => {
  const [studioMode, setStudioMode] = useState<'mapping' | 'masking' | 'simulation'>('mapping');
  const [customMask, setCustomMask] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [comparisonStyleB, setComparisonStyleB] = useState<HairstyleModel | undefined>(undefined);

  const handleLaunchCompare = (styleToCompare?: HairstyleModel) => {
    navigator.vibrate?.(15);
    if (styleToCompare) {
      setComparisonStyleB(styleToCompare);
    }
    setIsCompareMode(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Studio Mode Selector & Compare Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-3">
        <div>
          <h2 className="text-xl font-serif font-semibold text-neutral-100">
            Aura Master Style Studio
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Biometric Cranial Mapping · Dynamic Hair Masking · AR Crown Simulation · Dual Model Comparison
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Compare Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              navigator.vibrate?.(15);
              setIsCompareMode(!isCompareMode);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border shadow-sm ${
              isCompareMode
                ? 'bg-[#E0A99A] text-neutral-950 border-[#E0A99A] ring-2 ring-[#E0A99A]/30'
                : 'bg-[#14141B] text-neutral-300 hover:text-neutral-100 border-[#262633] hover:border-[#E0A99A]/50'
            }`}
            title="Toggle side-by-side dual hairstyle model comparison to evaluate face-shape fit"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Compare Models</span>
            {isCompareMode && (
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse ml-0.5" />
            )}
          </button>

          {/* Core Studio Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setIsCompareMode(false);
                setStudioMode('mapping');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !isCompareMode && studioMode === 'mapping'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Cranial Mapping
            </button>

            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setIsCompareMode(false);
                setStudioMode('masking');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !isCompareMode && studioMode === 'masking'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Dynamic Mask
            </button>

            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setIsCompareMode(false);
                setStudioMode('simulation');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !isCompareMode && studioMode === 'simulation'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              AR Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Render Dual Model Comparison Studio when Compare Toggle is Active */}
      {isCompareMode ? (
        <StyleComparisonStudio
          currentProfile={currentProfile}
          selectedStyleA={selectedStyle}
          onSelectStyleA={onSelectStyle}
          selectedStyleB={comparisonStyleB}
          onSelectStyleB={(style) => setComparisonStyleB(style)}
          selectedColorHex={selectedColorHex}
          onSelectColorHex={onSelectColorHex}
          onOpenExecutionBrief={onOpenExecutionBrief}
          onCloseCompare={() => setIsCompareMode(false)}
        />
      ) : (
        <>

      {/* Mode 1: Biometric Mapping */}
      {studioMode === 'mapping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <BiometricScanner
              currentProfile={currentProfile}
              onSelectProfile={onSelectProfile}
              onAnalysisComplete={onAnalysisComplete}
              isAnalyzing={isAnalyzing}
              selectedColorHex={selectedColorHex}
              selectedHairstyleKey={selectedStyle.imageVectorKey}
              onOpenPrivacyModal={onOpenPrivacyModal}
            />
          </div>

          <div className="lg:col-span-7">
            <CranialAnalysisPanel
              analysis={currentProfile.biometricAnalysis}
              onSelectRecommendedStyle={(styleName) => {
                // Switch to simulation
                setStudioMode('simulation');
              }}
            />
          </div>
        </div>
      )}

      {/* Mode 2: Dynamic Hair Masking */}
      {studioMode === 'masking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <DynamicMaskCanvas
              imageSrc={currentProfile.presetAvatarUrl || null}
              onMaskGenerated={(mask) => setCustomMask(mask)}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4 bg-neutral-900/40 border border-neutral-800 rounded-xl p-6">
            <div>
              <div className="text-[11px] font-mono uppercase text-[#E0A99A] tracking-wider">
                Precision Inpaint Boundary
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-100 mt-1">
                Anatomical Hairline Segmentation
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                The dynamic mask isolates the native hair perimeter from the client's facial forehead, ears, and neck. Adjust the boundary with brush and eraser tools before generating bespoke hairpiece inpainting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
              <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800">
                <div className="text-neutral-400 font-mono text-[10px]">Hairline Alignment:</div>
                <div className="text-neutral-200 font-medium mt-0.5">Golden Upper Third</div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800">
                <div className="text-neutral-400 font-mono text-[10px]">Temporal Margin:</div>
                <div className="text-neutral-200 font-medium mt-0.5">Zero Demarcation Line</div>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setStudioMode('simulation');
              }}
              className="mt-4 px-4 py-2.5 bg-[#E0A99A] hover:bg-[#d89c8c] text-neutral-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 self-start"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proceed to AR Crown Simulation</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: AR Crown Simulation */}
      {studioMode === 'simulation' && (
        <HairstyleSimulator
          currentProfile={currentProfile}
          selectedStyle={selectedStyle}
          onSelectStyle={onSelectStyle}
          selectedColorHex={selectedColorHex}
          onSelectColorHex={onSelectColorHex}
          onOpenExecutionBrief={onOpenExecutionBrief}
          onOpenCompare={handleLaunchCompare}
        />
      )}
        </>
      )}
    </div>
  );
};
