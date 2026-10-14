import { FaceShape, GenderTier, HairLengthTier } from '../types';

export interface CranialRatios {
  upperThirdPercent: number; // Trichion to Glabella
  middleThirdPercent: number; // Glabella to Subnasale
  lowerThirdPercent: number; // Subnasale to Menton
  widthToLengthRatio: number; // Zygomatic width / Cranial length
  foreheadToJawRatio: number; // Temple width / Mandibular width
  gonialAngleDegrees: number; // Jaw angle in degrees (110° - 130°)
  symmetryScorePercent: number; // 0 - 100
  goldenRatioDeviation: number; // Distance from 1.618
}

export interface InpaintRequestPayload {
  imageBase64: string;
  maskBase64?: string;
  styleName: string;
  styleCategory: string;
  hairColorHex: string;
  colorName?: string;
  genderTier?: GenderTier;
  isKidsMode?: boolean; // If true: Apple 5.1.2 & COPPA on-device 2D only
  promptModifier?: string;
}

export interface InpaintResponsePayload {
  success: boolean;
  simulatedImageBase64?: string;
  cranialHarmonyScore: number;
  faceShape: FaceShape;
  executionNotes: string;
}

export interface GenerateBriefRequestPayload {
  clientName: string;
  faceShape: FaceShape;
  selectedStyle: string;
  hairTexture?: string;
  clientNotes?: string;
  stylistName?: string;
}

export interface GenerateBriefResponsePayload {
  summary: string;
  clipperSpecs: string;
  shearWork: string;
  hairpieceOrWigProtocol: string;
  colorFormulation: string;
  finishProducts: string;
  maintenanceCadenceWeeks: number;
}
