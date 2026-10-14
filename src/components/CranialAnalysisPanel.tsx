import React from 'react';
import { CranialAnalysis } from '../types';
import { Compass, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Scale, Scissors } from 'lucide-react';

interface CranialAnalysisPanelProps {
  analysis: CranialAnalysis;
  onSelectRecommendedStyle?: (styleName: string) => void;
}

export const CranialAnalysisPanel: React.FC<CranialAnalysisPanelProps> = ({
  analysis,
  onSelectRecommendedStyle,
}) => {
  const {
    faceShape,
    faceShapeDescription,
    symmetryScore,
    goldenRatioFit,
    ratios,
    cranialArchitecture,
    detectedTexture,
    flatteringStyles,
    stylesToAvoid,
  } = analysis;

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Classification Block */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-mono text-amber-400 mb-1">
              Biometric Cranial Classification
            </div>
            <h2 className="text-2xl font-serif font-semibold text-neutral-100 flex items-center gap-2">
              <span>{faceShape}</span>
              <span className="text-sm font-sans font-normal text-neutral-400">Architecture</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-mono text-neutral-400">Symmetry Index</div>
              <div className="text-lg font-mono font-semibold text-neutral-100 tabular-nums">
                {symmetryScore}%
              </div>
            </div>
            <div className="text-right border-l border-neutral-800 pl-3">
              <div className="text-[11px] font-mono text-neutral-400">Golden Ratio Fit</div>
              <div className="text-lg font-mono font-semibold text-amber-300 tabular-nums">
                {goldenRatioFit}%
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
          {faceShapeDescription}
        </p>

        {/* Horizontal Facial Thirds Proportions Bar */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
            <span>Facial Thirds Proportions (Trichion · Glabella · Subnasale · Menton)</span>
            <span className="text-amber-400">Ideal 33.3% / 33.3% / 33.3%</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-neutral-950/80 border border-neutral-800/90 rounded-lg p-2.5">
              <div className="text-neutral-400 text-[11px]">Upper Third (Forehead)</div>
              <div className="font-mono text-sm font-medium text-amber-200 mt-0.5">
                {ratios.facialThirds?.upperThird || '33.3%'}
              </div>
            </div>
            <div className="bg-neutral-950/80 border border-neutral-800/90 rounded-lg p-2.5">
              <div className="text-neutral-400 text-[11px]">Mid Third (Brow-Nose)</div>
              <div className="font-mono text-sm font-medium text-amber-200 mt-0.5">
                {ratios.facialThirds?.middleThird || '33.3%'}
              </div>
            </div>
            <div className="bg-neutral-950/80 border border-neutral-800/90 rounded-lg p-2.5">
              <div className="text-neutral-400 text-[11px]">Lower Third (Jaw-Chin)</div>
              <div className="font-mono text-sm font-medium text-amber-200 mt-0.5">
                {ratios.facialThirds?.lowerThird || '33.3%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Cranial Metrics Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
          <div className="text-[11px] text-neutral-400">Gonial Jaw Angle</div>
          <div className="text-base font-mono font-medium text-neutral-100 mt-1 tabular-nums">
            {ratios.gonialAngle}°
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Mandibular corner</div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
          <div className="text-[11px] text-neutral-400">Cheekbone Height</div>
          <div className="text-base font-mono font-medium text-neutral-100 mt-1">
            {ratios.cheekboneProminence}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Zygomatic prominence</div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
          <div className="text-[11px] text-neutral-400">Width : Length Ratio</div>
          <div className="text-base font-mono font-medium text-neutral-100 mt-1">
            {ratios.widthToLengthRatio}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Transverse to sagittal</div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-3">
          <div className="text-[11px] text-neutral-400">Forehead : Jaw Ratio</div>
          <div className="text-base font-mono font-medium text-neutral-100 mt-1">
            {ratios.foreheadToJawRatio}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Perimeter taper factor</div>
        </div>
      </div>

      {/* Cranial Hairline & Native Texture Specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Cranial Architecture</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-300">
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">Crown Volume Need:</span>
              <span className="font-medium text-neutral-100">{cranialArchitecture.crownVolumeRequirement}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">Hairline Contour:</span>
              <span className="font-medium text-neutral-100">{cranialArchitecture.hairlineType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">Temporal Recession:</span>
              <span className="font-medium text-neutral-100">{cranialArchitecture.hairlineRecessionRisk}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Ideal Parting Axis:</span>
              <span className="font-medium text-amber-300">{cranialArchitecture.recommendedParting}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>Fiber & Scalp Baseline</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-300">
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">Curl Pattern:</span>
              <span className="font-medium text-neutral-100">{detectedTexture.curlPattern}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">Strand Density:</span>
              <span className="font-medium text-neutral-100">{detectedTexture.density}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-400">Strand Caliber:</span>
              <span className="font-medium text-neutral-100">{detectedTexture.strandCaliber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400">Recommended Sheen:</span>
              <span className="font-medium text-amber-300">High-Refraction Satin Glaze</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flattering Styles vs Styles to Avoid */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Harmonious Hairstyle & Hairpiece Silhouettes</span>
          </div>
          <div className="space-y-2.5">
            {flatteringStyles.map((style, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/60 border border-neutral-800 hover:border-amber-400/50 rounded-lg p-3.5 transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-100">{style.name}</span>
                    <span className="text-[10px] font-mono text-amber-400">[{style.category}]</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {style.whyItWorks}
                  </p>
                  <div className="text-[11px] text-neutral-500 mt-1 font-mono">
                    Target: {style.silhouetteGoal}
                  </div>
                </div>

                {onSelectRecommendedStyle && (
                  <button
                    onClick={() => onSelectRecommendedStyle(style.name)}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-medium text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 rounded border border-amber-400/30 transition-colors"
                  >
                    Simulate
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {stylesToAvoid && stylesToAvoid.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-400/90 mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Silhouettes to Counter-Indicate</span>
            </div>
            <div className="space-y-2">
              {stylesToAvoid.map((avoid, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-950/60 border border-red-950/60 rounded-lg p-3 text-xs"
                >
                  <span className="font-medium text-neutral-200">{avoid.name}: </span>
                  <span className="text-neutral-400">{avoid.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
