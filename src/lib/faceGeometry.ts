import { FaceShape } from '../types';
import { CranialRatios } from './schemas';

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function euclideanDistance(p1: Point3D, p2: Point3D): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2);
}

export interface CranialLandmarks {
  vertex: Point2D; // Top of skull / crown apex
  trichion: Point2D; // Natural hairline baseline
  glabella: Point2D; // Mid-brow level
  subnasale: Point2D; // Base of nose
  menton: Point2D; // Chin tip
  leftTemple: Point2D;
  rightTemple: Point2D;
  leftZygoma: Point2D; // Left cheekbone
  rightZygoma: Point2D; // Right cheekbone
  leftGonion: Point2D; // Left jaw angle
  rightGonion: Point2D; // Right jaw angle
  leftOtobasion: Point2D; // Left ear insertion
  rightOtobasion: Point2D; // Right ear insertion
}

/**
 * Calculates Euclidean distance between two points
 */
export function distance(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Calculates the interior gonial jaw angle in degrees
 */
export function calculateGonialAngle(condyle: Point2D, gonion: Point2D, gnathion: Point2D): number {
  const d12 = distance(condyle, gonion);
  const d23 = distance(gonion, gnathion);
  const d13 = distance(condyle, gnathion);

  if (d12 === 0 || d23 === 0) return 120; // fallback standard

  // Law of Cosines: c^2 = a^2 + b^2 - 2ab*cos(C)
  const cosTheta = (d12 * d12 + d23 * d23 - d13 * d13) / (2 * d12 * d23);
  const clampedCos = Math.max(-1, Math.min(1, cosTheta));
  const angleRad = Math.acos(clampedCos);
  return Math.round((angleRad * 180) / Math.PI);
}

/**
 * Overloaded face shape classification:
 * 1) classifyFaceShape(landmarks: Point3D[]): { faceShape, metrics }
 * 2) classifyFaceShape(templeWidth, cheekboneWidth, jawWidth, faceHeight): { shape, rationale, confidence }
 */
export function classifyFaceShape(landmarks: Point3D[]): {
  faceShape: "oval" | "round" | "square" | "heart" | "diamond" | "oblong" | "triangle";
  metrics: Record<string, number>;
};
export function classifyFaceShape(
  templeWidth: number,
  cheekboneWidth: number,
  jawWidth: number,
  faceHeight: number
): { shape: FaceShape; rationale: string; confidence: number };
export function classifyFaceShape(
  arg1: number | Point3D[],
  arg2?: number,
  arg3?: number,
  arg4?: number
): any {
  if (Array.isArray(arg1)) {
    const landmarks = arg1;
    // Key MediaPipe landmark landmarks
    const trichion = landmarks[10] || { x: 0, y: 0, z: 0 };     // Top of forehead
    const gnathion = landmarks[152] || { x: 0, y: 1, z: 0 };    // Bottom of chin
    const leftCheek = landmarks[234] || { x: -0.5, y: 0.5, z: 0 };   // Left zygomatic arch
    const rightCheek = landmarks[454] || { x: 0.5, y: 0.5, z: 0 };  // Right zygomatic arch
    const leftJaw = landmarks[132] || { x: -0.4, y: 0.8, z: 0 };     // Left gonial angle
    const rightJaw = landmarks[361] || { x: 0.4, y: 0.8, z: 0 };    // Right gonial angle
    const leftTemple = landmarks[109] || { x: -0.4, y: 0.2, z: 0 };
    const rightTemple = landmarks[338] || { x: 0.4, y: 0.2, z: 0 };

    const faceLength = euclideanDistance(trichion, gnathion);
    const cheekboneWidth = euclideanDistance(leftCheek, rightCheek);
    const jawWidth = euclideanDistance(leftJaw, rightJaw);
    const foreheadWidth = euclideanDistance(leftTemple, rightTemple);

    const lengthToWidthRatio = faceLength / (cheekboneWidth || 1);
    const jawToCheekRatio = jawWidth / (cheekboneWidth || 1);
    const foreheadToCheekRatio = foreheadWidth / (cheekboneWidth || 1);

    let faceShape: "oval" | "round" | "square" | "heart" | "diamond" | "oblong" | "triangle" = "oval";

    if (lengthToWidthRatio > 1.45) {
      faceShape = "oblong";
    } else if (Math.abs(lengthToWidthRatio - 1.0) < 0.18 && jawToCheekRatio < 0.82) {
      faceShape = "round";
    } else if (jawToCheekRatio > 0.88 && lengthToWidthRatio < 1.35) {
      faceShape = "square";
    } else if (foreheadToCheekRatio > 0.95 && jawToCheekRatio < 0.72) {
      faceShape = "heart";
    } else if (cheekboneWidth > foreheadWidth && cheekboneWidth > jawWidth && lengthToWidthRatio > 1.25) {
      faceShape = "diamond";
    } else if (jawWidth > foreheadWidth && jawWidth > cheekboneWidth) {
      faceShape = "triangle";
    }

    return {
      faceShape,
      metrics: {
        lengthToWidthRatio: Number(lengthToWidthRatio.toFixed(2)),
        jawToCheekRatio: Number(jawToCheekRatio.toFixed(2)),
        foreheadToCheekRatio: Number(foreheadToCheekRatio.toFixed(2)),
      },
    };
  }

  const templeWidth = arg1;
  const cheekboneWidth = arg2 ?? 100;
  const jawWidth = arg3 ?? 80;
  const faceHeight = arg4 ?? 140;

  const widthToHeight = cheekboneWidth / faceHeight;
  const jawToCheekRatio = jawWidth / cheekboneWidth;
  const foreheadToCheekRatio = templeWidth / cheekboneWidth;

  // 1. Oblong: distinctly long face relative to width
  if (widthToHeight < 0.68) {
    return {
      shape: 'Oblong',
      rationale: 'Vertical facial axis significantly exceeds transverse width, presenting an elongated, elegant profile.',
      confidence: 0.94,
    };
  }

  // 2. Square: jaw width nearly equals cheekbone and temple width with sharp angle
  if (jawToCheekRatio > 0.88 && widthToHeight >= 0.72) {
    return {
      shape: 'Square',
      rationale: 'Equivalent mandibular and temple width with pronounced gonial angles creating an architectural frame.',
      confidence: 0.92,
    };
  }

  // 3. Round: cheekbone width is high, jaw is soft, width-to-height close to 1:1
  if (widthToHeight >= 0.78 && jawToCheekRatio < 0.82 && foreheadToCheekRatio < 0.88) {
    return {
      shape: 'Round',
      rationale: 'Curvilinear perimeter with equal transverse and vertical proportions and softened mandibular curvature.',
      confidence: 0.91,
    };
  }

  // 4. Heart: broad forehead/temples tapering down to a delicate narrow chin
  if (foreheadToCheekRatio > 0.92 && jawToCheekRatio < 0.75) {
    return {
      shape: 'Heart',
      rationale: 'Inverted triangular balance with prominent temporal width tapering down to a delicate mental apex.',
      confidence: 0.93,
    };
  }

  // 5. Diamond: cheekbones are dramatically wider than both forehead and jaw
  if (foreheadToCheekRatio < 0.84 && jawToCheekRatio < 0.78) {
    return {
      shape: 'Diamond',
      rationale: 'High zygomatic arches acting as the dominant transverse axis with tapered hairline and jawline.',
      confidence: 0.89,
    };
  }

  // 6. Default / Oval: Golden ratio harmony
  return {
    shape: 'Oval',
    rationale: 'Balanced curvature with jawline gently narrower than cheekbones and proportional golden thirds.',
    confidence: 0.96,
  };
}

/**
 * Computes cranial ratios and golden thirds from landmark points
 */
export function computeCranialRatios(landmarks: CranialLandmarks): CranialRatios {
  const upperDist = distance(landmarks.trichion, landmarks.glabella);
  const midDist = distance(landmarks.glabella, landmarks.subnasale);
  const lowerDist = distance(landmarks.subnasale, landmarks.menton);
  const totalVertical = upperDist + midDist + lowerDist || 1;

  const templeWidth = distance(landmarks.leftTemple, landmarks.rightTemple);
  const cheekWidth = distance(landmarks.leftZygoma, landmarks.rightZygoma);
  const jawWidth = distance(landmarks.leftGonion, landmarks.rightGonion);

  const leftGonial = calculateGonialAngle(landmarks.leftOtobasion, landmarks.leftGonion, landmarks.menton);
  const rightGonial = calculateGonialAngle(landmarks.rightOtobasion, landmarks.rightGonion, landmarks.menton);
  const avgGonialAngle = Math.round((leftGonial + rightGonial) / 2);

  // Symmetry score calculation: bilateral comparison relative to central axis
  const centerX = landmarks.menton.x;
  const leftCheekOffset = Math.abs(centerX - landmarks.leftZygoma.x);
  const rightCheekOffset = Math.abs(landmarks.rightZygoma.x - centerX);
  const symmetryRatio = Math.min(leftCheekOffset, rightCheekOffset) / Math.max(leftCheekOffset, rightCheekOffset || 1);
  const symmetryScore = Math.round(symmetryRatio * 100);

  const widthToLength = cheekWidth / totalVertical;
  const goldenRatio = 1.618;
  const actualRatio = totalVertical / (cheekWidth || 1);
  const goldenDev = Math.abs(actualRatio - goldenRatio);

  return {
    upperThirdPercent: Math.round((upperDist / totalVertical) * 1000) / 10,
    middleThirdPercent: Math.round((midDist / totalVertical) * 1000) / 10,
    lowerThirdPercent: Math.round((lowerDist / totalVertical) * 1000) / 10,
    widthToLengthRatio: Math.round(widthToLength * 100) / 100,
    foreheadToJawRatio: Math.round((templeWidth / (jawWidth || 1)) * 100) / 100,
    gonialAngleDegrees: avgGonialAngle,
    symmetryScorePercent: symmetryScore,
    goldenRatioDeviation: Math.round(goldenDev * 100) / 100,
  };
}
