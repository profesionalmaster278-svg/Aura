import React from 'react';
import { HairstyleModel, ClientProfile, CranialAnalysis } from '../types';
import { Scissors, FileText, Sparkles, CheckCircle, Shield, Clock, Brush, ArrowRight } from 'lucide-react';

interface TechnicalExecutionBriefProps {
  currentProfile: ClientProfile;
  selectedStyle: HairstyleModel;
  onGenerateTicket: () => void;
}

export const TechnicalExecutionBrief: React.FC<TechnicalExecutionBriefProps> = ({
  currentProfile,
  selectedStyle,
  onGenerateTicket,
}) => {
  const brief = currentProfile.biometricAnalysis.technicalSalonBrief;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Overview Card */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-mono text-amber-400 mb-1">
            Master Stylist & Barber Blueprint
          </div>
          <h2 className="text-2xl font-serif font-semibold text-neutral-100">
            {selectedStyle.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>Client: {currentProfile.name}</span>
            <span aria-hidden="true">·</span>
            <span>Face Architecture: {currentProfile.faceShape}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-300">Category: {selectedStyle.category}</span>
          </div>
        </div>

        <button
          onClick={onGenerateTicket}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs tracking-wide rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Export Client Ticket</span>
        </button>
      </div>

      {/* 2-Column Technical Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Module 1: Barber Clipper & Perimeter Specifications */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
              <Scissors className="w-4 h-4" />
              <span>01. Clipper & Perimeter Geometry</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {selectedStyle.clipperGuard || brief.clipperSpecs}
            </p>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800/70 rounded-lg p-3 text-xs space-y-1.5">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">Perimeter Guidelines:</div>
            <div className="text-neutral-300">
              • Clean neckline transition with foil shaver below C-cup line
            </div>
            <div className="text-neutral-300">
              • Preserve parietal ridge density to avoid excessive horizontal width
            </div>
          </div>
        </div>

        {/* Module 2: Scissor / Shear Elevation & Texturizing */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
              <Scissors className="w-4 h-4" />
              <span>02. Shear Angles & Sectioning Elevation</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {selectedStyle.shearTechnique || brief.shearWork}
            </p>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800/70 rounded-lg p-3 text-xs space-y-1.5">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">Sectioning Invariants:</div>
            <div className="text-neutral-300">
              • Horseshoe parting isolating top crown plane from temples
            </div>
            <div className="text-neutral-300">
              • Deep point-cutting at 90° to eliminate heavy blunt shelf lines
            </div>
          </div>
        </div>

        {/* Module 3: Lace Wig / Topper Unit Protocols */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
              <Shield className="w-4 h-4" />
              <span>03. Wig & Hairpiece Customization</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {selectedStyle.wigInstallationGuide || brief.hairpieceOrWigProtocol}
            </p>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800/70 rounded-lg p-3 text-xs space-y-1.5">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">Adhesive & Scalp Prep:</div>
            <div className="text-neutral-300">
              • Scalp degreased with 99% isopropyl alcohol and skin barrier film
            </div>
            <div className="text-neutral-300">
              • 110% gradient density plucked hairline with single micro-knots
            </div>
          </div>
        </div>

        {/* Module 4: Chemical Formulation & Gloss Prescription */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
              <Brush className="w-4 h-4" />
              <span>04. Color Formulation & Gloss Glaze</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {selectedStyle.recommendedColor || brief.colorFormulation}
            </p>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800/70 rounded-lg p-3 text-xs space-y-1.5">
            <div className="text-[11px] font-mono text-neutral-400 uppercase">Developer & Bond Building:</div>
            <div className="text-neutral-300">
              • Acidic liquid demi-permanent gloss for ultra-high cuticle refraction
            </div>
            <div className="text-neutral-300">
              • Bond multiplier additive included in lightener mixtures
            </div>
          </div>
        </div>
      </div>

      {/* Home Care Prescription & Rebooking Cycle Strip */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Prescribed Home Care & Maintenance</span>
          </div>
          <p className="text-xs text-neutral-300">
            {brief.finishProducts}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-800 pt-3 sm:pt-0 sm:pl-6">
          <div className="text-[11px] font-mono text-neutral-400 uppercase">Recommended Cycle:</div>
          <div className="text-lg font-mono font-semibold text-amber-300 tabular-nums">
            Every {brief.maintenanceCadenceWeeks || 4} Weeks
          </div>
        </div>
      </div>
    </div>
  );
};
