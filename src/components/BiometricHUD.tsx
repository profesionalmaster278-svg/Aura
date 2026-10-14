import React from 'react';
import { CranialLandmarks } from '../lib/faceGeometry';

interface BiometricHUDProps {
  landmarks?: Partial<CranialLandmarks>;
  showLandmarks?: boolean;
  showThirds?: boolean;
  showCranialMesh?: boolean;
  width?: number;
  height?: number;
  color?: string;
}

export const BiometricHUD: React.FC<BiometricHUDProps> = ({
  showLandmarks = true,
  showThirds = true,
  showCranialMesh = true,
  color = '#E0A99A',
}) => {
  return (
    <svg
      viewBox="0 0 400 480"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="hudGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Facial Thirds Guidance Grid */}
      {showThirds && (
        <g stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.65">
          {/* Trichion / Natural Hairline */}
          <line x1="30" y1="120" x2="370" y2="120" />
          <text x="35" y="114" fill={color} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.9">
            TRICHION · UPPER THIRD
          </text>

          {/* Glabella / Mid-Brow */}
          <line x1="30" y1="205" x2="370" y2="205" />
          <text x="35" y="199" fill={color} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.9">
            GLABELLA · MID THIRD
          </text>

          {/* Subnasale / Nose Base */}
          <line x1="30" y1="285" x2="370" y2="285" />
          <text x="35" y="279" fill={color} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.9">
            SUBNASALE · LOWER THIRD
          </text>

          {/* Menton / Gnathion Baseline */}
          <line x1="30" y1="380" x2="370" y2="380" />
          <text x="35" y="374" fill={color} fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.9">
            MENTON / GNATHION
          </text>
        </g>
      )}

      {/* Cranial Wireframe Mesh & Contour Guides */}
      {showCranialMesh && (
        <g stroke={color} strokeWidth="0.85" fill="none" opacity="0.5">
          {/* Vertex Crown Apex Arch */}
          <path d="M 115 75 Q 200 35 285 75" strokeWidth="1.2" strokeDasharray="5 2" />
          {/* Parietal Ridge Guides */}
          <path d="M 95 140 Q 200 110 305 140" strokeDasharray="3 2" />
          {/* Zygomatic Arch Transverse Line */}
          <line x1="90" y1="240" x2="310" y2="240" stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="2 2" />
          {/* Gonial Mandibular Angle Arc */}
          <path d="M 115 330 L 200 380 L 285 330" strokeWidth="1" />
          {/* Central Sagittal Symmetry Axis */}
          <line x1="200" y1="30" x2="200" y2="430" strokeDasharray="6 3" strokeWidth="1" />
          {/* Temple-to-Crown Triangulation */}
          <line x1="120" y1="150" x2="200" y2="55" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 2" />
          <line x1="280" y1="150" x2="200" y2="55" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 2" />
        </g>
      )}

      {/* High-Precision Biometric Landmark Nodes */}
      {showLandmarks && (
        <g fill={color}>
          {/* Vertex / Skull Apex */}
          <circle cx="200" cy="55" r="3.5" />
          {/* Trichion */}
          <circle cx="200" cy="120" r="3" />
          {/* Bitemporal Landmarks */}
          <circle cx="120" cy="150" r="2.5" />
          <circle cx="280" cy="150" r="2.5" />
          {/* Zygomatic Cheeks */}
          <circle cx="100" cy="240" r="3" />
          <circle cx="300" cy="240" r="3" />
          {/* Subnasale */}
          <circle cx="200" cy="285" r="2" />
          {/* Gonial Mandibular Corners */}
          <circle cx="120" cy="330" r="3" />
          <circle cx="280" cy="330" r="3" />
          {/* Gnathion / Menton Chin */}
          <circle cx="200" cy="380" r="3.5" />
        </g>
      )}
    </svg>
  );
};
