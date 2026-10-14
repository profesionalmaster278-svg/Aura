import React from 'react';
import { FaceShape } from '../types';

interface AtelierPortraitVisualProps {
  faceShape: FaceShape;
  selectedColorHex?: string;
  hairstyleKey?: string;
  showLandmarks?: boolean;
  showThirds?: boolean;
  showCranialMesh?: boolean;
  userImageSrc?: string | null;
  className?: string;
}

export const AtelierPortraitVisual: React.FC<AtelierPortraitVisualProps> = ({
  faceShape,
  selectedColorHex = '#8a5c32',
  hairstyleKey = 'italian-bob',
  showLandmarks = true,
  showThirds = true,
  showCranialMesh = true,
  userImageSrc = null,
  className = '',
}) => {
  // If user provided a webcam photo or uploaded image, display it with SVG HUD overlay
  if (userImageSrc) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center ${className}`}>
        <img
          src={userImageSrc}
          alt="Biometric client portrait"
          className="w-full h-full object-cover select-none"
        />

        {/* Biometric Cranial Wireframe Overlay HUD */}
        <svg
          viewBox="0 0 400 480"
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {showThirds && (
            <g stroke="rgba(212, 175, 55, 0.45)" strokeWidth="1" strokeDasharray="3 3">
              {/* Upper Third: Hairline / Trichion */}
              <line x1="40" y1="120" x2="360" y2="120" />
              <text x="44" y="115" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">TRICHION · 33.3%</text>

              {/* Middle Third: Brow / Glabella */}
              <line x1="40" y1="210" x2="360" y2="210" />
              <text x="44" y="205" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">GLABELLA · 33.4%</text>

              {/* Lower Third: Subnasale */}
              <line x1="40" y1="295" x2="360" y2="295" />
              <text x="44" y="290" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">SUBNASALE · 33.3%</text>

              {/* Chin / Menton Baseline */}
              <line x1="40" y1="390" x2="360" y2="390" />
              <text x="44" y="385" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">GNATHION</text>
            </g>
          )}

          {showCranialMesh && (
            <g stroke="rgba(212, 175, 55, 0.35)" strokeWidth="0.75" fill="none">
              {/* Cranial Apex Arc */}
              <path d="M 120 70 Q 200 35 280 70" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1" strokeDasharray="4 2" />
              {/* Zygomatic Arch Width */}
              <line x1="100" y1="240" x2="300" y2="240" stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="2 2" />
              {/* Mandibular Jawline Guide */}
              <path d="M 120 330 L 200 390 L 280 330" stroke="rgba(212, 175, 55, 0.5)" />
              {/* Central Biometric Symmetry Axis */}
              <line x1="200" y1="40" x2="200" y2="420" stroke="rgba(212, 175, 55, 0.4)" strokeDasharray="6 3" />
            </g>
          )}

          {showLandmarks && (
            <g fill="#e2b154">
              {/* Vertex / Apex */}
              <circle cx="200" cy="55" r="3" />
              {/* Trichion */}
              <circle cx="200" cy="120" r="3" />
              {/* Temples */}
              <circle cx="120" cy="150" r="2.5" />
              <circle cx="280" cy="150" r="2.5" />
              {/* Zygomatic Cheeks */}
              <circle cx="105" cy="240" r="3" />
              <circle cx="295" cy="240" r="3" />
              {/* Gonial Jaw Angles */}
              <circle cx="125" cy="330" r="3" />
              <circle cx="275" cy="330" r="3" />
              {/* Menton Chin */}
              <circle cx="200" cy="390" r="3.5" />
            </g>
          )}
        </svg>

        {/* Ambient atelier vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
      </div>
    );
  }

  // Pure Vector Atelier Portrait Rendering:
  // Dynamically alters facial contour curves according to faceShape and renders simulated hair model
  const getFaceContourPath = () => {
    switch (faceShape) {
      case 'Square':
        // Strong angular jaw, wide temples
        return 'M 115 130 C 115 80, 285 80, 285 130 C 290 220, 285 320, 265 340 L 200 375 L 135 340 C 115 320, 110 220, 115 130 Z';
      case 'Round':
        // Soft equal curves, soft chin
        return 'M 120 140 C 120 75, 280 75, 280 140 C 295 220, 285 330, 240 365 C 200 380, 200 380, 160 365 C 115 330, 105 220, 120 140 Z';
      case 'Heart':
        // Broad forehead, tapering down to a delicate pointed chin
        return 'M 105 130 C 105 70, 295 70, 295 130 C 295 210, 260 290, 220 345 L 200 375 L 180 345 C 140 290, 105 210, 105 130 Z';
      case 'Diamond':
        // Narrow forehead, wide cheekbones, narrow chin
        return 'M 135 125 C 135 75, 265 75, 265 125 C 298 210, 295 250, 250 330 L 200 375 L 150 330 C 105 250, 102 210, 135 125 Z';
      case 'Oblong':
        // Longer vertical axis, straight sides
        return 'M 120 115 C 120 70, 280 70, 280 115 C 285 220, 280 340, 245 375 L 200 395 L 155 375 C 120 340, 115 220, 120 115 Z';
      case 'Triangle':
        // Narrow forehead, widening to broad jaw
        return 'M 140 120 C 140 75, 260 75, 260 120 C 275 220, 300 310, 275 350 L 200 380 L 125 350 C 100 310, 125 220, 140 120 Z';
      case 'Oval':
      default:
        // Ideal golden curvature
        return 'M 115 130 C 115 70, 285 70, 285 130 C 295 215, 285 320, 250 360 L 200 380 L 150 360 C 115 320, 105 215, 115 130 Z';
    }
  };

  // Render stylized hair silhouette according to selected hair key
  const renderHairstyleSilhouette = () => {
    switch (hairstyleKey) {
      case 'textured-crop':
        return (
          <g>
            {/* Taper fade side gradients */}
            <path d="M 110 160 Q 100 230 115 290 L 125 285 Q 115 220 120 160 Z" fill={selectedColorHex} opacity="0.35" />
            <path d="M 290 160 Q 300 230 285 290 L 275 285 Q 285 220 280 160 Z" fill={selectedColorHex} opacity="0.35" />
            {/* Textured top & blunt cropped fringe */}
            <path
              d="M 110 145 C 100 70, 300 70, 290 145 L 285 155 L 270 140 L 255 152 L 235 142 L 215 152 L 195 140 L 175 150 L 155 142 L 135 152 L 115 142 Z"
              fill={selectedColorHex}
            />
            {/* Crown volume texture lines */}
            <path d="M 150 110 Q 200 90 250 110" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
            <path d="M 160 125 Q 200 110 240 125" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
          </g>
        );

      case 'coily-crown':
        return (
          <g>
            {/* Voluminous spherical geometric crown */}
            <circle cx="200" cy="130" r="115" fill={selectedColorHex} />
            {/* Defined coil texture dots & rings */}
            <circle cx="140" cy="80" r="22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="200" cy="60" r="24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="260" cy="80" r="22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="110" cy="140" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="290" cy="140" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 2" />
            {/* Clean temple taper fade cutouts */}
            <path d="M 115 170 Q 105 230 120 280" stroke="#0a0a0c" strokeWidth="8" fill="none" opacity="0.9" />
            <path d="M 285 170 Q 295 230 280 280" stroke="#0a0a0c" strokeWidth="8" fill="none" opacity="0.9" />
          </g>
        );

      case 'mature-bixie':
        return (
          <g>
            {/* Sleek layered pixie-bob */}
            <path
              d="M 105 150 C 95 65, 305 65, 295 150 C 295 200, 275 240, 260 250 C 255 220, 265 170, 250 145 C 230 160, 170 160, 150 145 C 135 170, 145 220, 140 250 C 125 240, 105 200, 105 150 Z"
              fill={selectedColorHex}
            />
            {/* Side-swept dimensional wisps */}
            <path d="M 140 120 Q 210 90 270 145" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
            <path d="M 155 135 Q 220 115 260 160" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
          </g>
        );

      case 'butterfly-layers':
      case 'lace-wig':
      case 'wolf-cut':
        return (
          <g>
            {/* Cascading long layers & curtain fringe framing */}
            <path
              d="M 100 135 C 90 50, 310 50, 300 135 C 330 220, 335 320, 320 420 C 290 410, 280 340, 270 270 C 255 190, 260 150, 240 140 C 220 160, 180 160, 160 140 C 140 150, 145 190, 130 270 C 120 340, 110 410, 80 420 C 65 320, 70 220, 100 135 Z"
              fill={selectedColorHex}
            />
            {/* Dimensional curtain highlights */}
            <path d="M 160 140 Q 130 220 140 300" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
            <path d="M 240 140 Q 270 220 260 300" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
            <path d="M 190 80 Q 200 120 160 140" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            <path d="M 210 80 Q 200 120 240 140" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
          </g>
        );

      case 'executive-pompadour':
        return (
          <g>
            {/* Sculpted swept-up pompadour */}
            <path
              d="M 115 150 C 110 45, 290 45, 285 150 L 275 160 C 265 110, 245 80, 200 75 C 155 80, 135 110, 125 160 Z"
              fill={selectedColorHex}
            />
            {/* Taper sides */}
            <path d="M 115 155 Q 105 210 118 260 L 125 255 Q 115 200 122 155 Z" fill={selectedColorHex} opacity="0.4" />
            <path d="M 285 155 Q 295 210 282 260 L 275 255 Q 285 200 278 155 Z" fill={selectedColorHex} opacity="0.4" />
            {/* Volume crest line */}
            <path d="M 150 95 Q 200 65 250 95" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
          </g>
        );

      case 'italian-bob':
      default:
        return (
          <g>
            {/* Blunt sculpted Italian bob grazing jawline */}
            <path
              d="M 105 130 C 95 60, 305 60, 295 130 C 315 210, 310 290, 290 340 L 270 335 C 280 270, 275 200, 260 145 C 240 160, 160 160, 140 145 C 125 200, 120 270, 130 335 L 110 340 C 90 290, 85 210, 105 130 Z"
              fill={selectedColorHex}
            />
            {/* Subtle french curtain fringe */}
            <path d="M 160 125 Q 180 150 165 170" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
            <path d="M 240 125 Q 220 150 235 170" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
            <path d="M 140 100 Q 200 80 260 100" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
          </g>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center select-none ${className}`}>
      {/* Background architectural dark studio canvas */}
      <div className="absolute inset-0 bg-radial from-neutral-900/90 via-neutral-950 to-[#070709]" />

      <svg
        viewBox="0 0 400 480"
        className="relative w-full h-full max-h-[540px] drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle skin tone gradient */}
          <linearGradient id="skinToneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#302621" />
            <stop offset="50%" stopColor="#251e1b" />
            <stop offset="100%" stopColor="#1a1513" />
          </linearGradient>

          {/* Neck gradient */}
          <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1815" />
            <stop offset="100%" stopColor="#120e0d" />
          </linearGradient>

          {/* Hair sheen filter */}
          <filter id="hairGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={selectedColorHex} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Neck & Shoulders */}
        <path d="M 160 360 L 160 450 L 70 480 L 330 480 L 240 450 L 240 360 Z" fill="url(#neckGrad)" />
        <path d="M 160 360 Q 200 375 240 360" stroke="#3d322d" strokeWidth="1" fill="none" />

        {/* Clavicle / Collarbone indication */}
        <path d="M 130 450 Q 200 465 270 450" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />

        {/* Facial Cranial Contour */}
        <path d={getFaceContourPath()} fill="url(#skinToneGrad)" stroke="#3e3029" strokeWidth="1" />

        {/* Ears */}
        <path d="M 115 210 C 95 210, 95 270, 115 270" stroke="#3a2e28" strokeWidth="1.5" fill="#241d1a" />
        <path d="M 285 210 C 305 210, 305 270, 285 270" stroke="#3a2e28" strokeWidth="1.5" fill="#241d1a" />

        {/* Subtle Minimalist Facial Features */}
        <g stroke="#665247" strokeWidth="1.2" strokeLinecap="round" fill="none">
          {/* Eyebrows */}
          <path d="M 145 200 Q 170 195 185 202" />
          <path d="M 215 202 Q 230 195 255 200" />

          {/* Eyes */}
          <path d="M 150 216 Q 165 210 180 216" />
          <path d="M 220 216 Q 235 210 250 216" />
          <circle cx="165" cy="217" r="2.5" fill="#9c7a68" stroke="none" />
          <circle cx="235" cy="217" r="2.5" fill="#9c7a68" stroke="none" />

          {/* Nose Bridge and Tip */}
          <path d="M 200 205 L 198 270 Q 200 278 206 273" />
          <path d="M 192 272 Q 200 277 208 272" stroke="#4d3b32" strokeWidth="1" />

          {/* Lips */}
          <path d="M 180 320 Q 200 315 220 320" stroke="#875850" strokeWidth="1.5" />
          <path d="M 185 320 Q 200 330 215 320" stroke="#70443d" strokeWidth="1" />
        </g>

        {/* Render Hairstyle Silhouette */}
        <g filter="url(#hairGlow)">
          {renderHairstyleSilhouette()}
        </g>

        {/* Biometric Cranial Wireframe Overlay HUD */}
        {showThirds && (
          <g stroke="rgba(212, 175, 55, 0.45)" strokeWidth="1" strokeDasharray="3 3">
            {/* Upper Third: Hairline / Trichion */}
            <line x1="40" y1="120" x2="360" y2="120" />
            <text x="44" y="115" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">TRICHION · UPPER 1/3</text>

            {/* Middle Third: Brow / Glabella */}
            <line x1="40" y1="202" x2="360" y2="202" />
            <text x="44" y="197" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">GLABELLA · MID 1/3</text>

            {/* Lower Third: Subnasale */}
            <line x1="40" y1="275" x2="360" y2="275" />
            <text x="44" y="270" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">SUBNASALE · LOWER 1/3</text>

            {/* Chin / Menton Baseline */}
            <line x1="40" y1="375" x2="360" y2="375" />
            <text x="44" y="370" fill="#e2b154" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.85">GNATHION / CHIN</text>
          </g>
        )}

        {showCranialMesh && (
          <g stroke="rgba(212, 175, 55, 0.35)" strokeWidth="0.75" fill="none">
            {/* Cranial Apex Arc */}
            <path d="M 120 70 Q 200 35 280 70" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1" strokeDasharray="4 2" />
            {/* Zygomatic Arch Width */}
            <line x1="100" y1="240" x2="300" y2="240" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="2 2" />
            {/* Mandibular Jawline Guide */}
            <path d="M 120 330 L 200 375 L 280 330" stroke="rgba(212, 175, 55, 0.5)" />
            {/* Central Biometric Symmetry Axis */}
            <line x1="200" y1="35" x2="200" y2="430" stroke="rgba(212, 175, 55, 0.4)" strokeDasharray="6 3" />
          </g>
        )}

        {showLandmarks && (
          <g fill="#e2b154">
            {/* Vertex / Apex */}
            <circle cx="200" cy="55" r="3" />
            {/* Trichion */}
            <circle cx="200" cy="120" r="3" />
            {/* Temples */}
            <circle cx="120" cy="150" r="2.5" />
            <circle cx="280" cy="150" r="2.5" />
            {/* Zygomatic Cheeks */}
            <circle cx="105" cy="240" r="3" />
            <circle cx="295" cy="240" r="3" />
            {/* Gonial Jaw Angles */}
            <circle cx="125" cy="330" r="3" />
            <circle cx="275" cy="330" r="3" />
            {/* Menton Chin */}
            <circle cx="200" cy="375" r="3.5" />
          </g>
        )}
      </svg>

      {/* High-fashion atelier ambient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
    </div>
  );
};
