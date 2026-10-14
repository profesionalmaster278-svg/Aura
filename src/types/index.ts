export type FaceShape = 
  | 'Oval' 
  | 'Square' 
  | 'Round' 
  | 'Heart' 
  | 'Diamond' 
  | 'Oblong' 
  | 'Triangle';

export interface FacialThirds {
  upperThird: string;
  middleThird: string;
  lowerThird: string;
}

export interface BiometricRatios {
  facialThirds: FacialThirds;
  widthToLengthRatio: string;
  foreheadToJawRatio: string;
  cheekboneProminence: 'High' | 'Medium' | 'Subtle';
  gonialAngle: number;
}

export interface CranialArchitecture {
  crownVolumeRequirement: string;
  hairlineType: string;
  hairlineRecessionRisk: string;
  recommendedParting: string;
}

export interface DetectedTexture {
  curlPattern: string;
  density: string;
  strandCaliber: string;
}

export interface StyleRecommendation {
  name: string;
  category: 'Cut' | 'Wig' | 'Fade' | 'Layers' | 'Protective';
  whyItWorks: string;
  silhouetteGoal: string;
}

export interface StyleAvoidance {
  name: string;
  reason: string;
}

export interface TechnicalSalonBrief {
  clipperSpecs: string;
  shearWork: string;
  hairpieceOrWigProtocol: string;
  colorFormulation: string;
  finishProducts: string;
  maintenanceCadenceWeeks: number;
}

export interface CranialAnalysis {
  faceShape: FaceShape;
  faceShapeDescription: string;
  symmetryScore: number;
  goldenRatioFit: number;
  ratios: BiometricRatios;
  cranialArchitecture: CranialArchitecture;
  detectedTexture: DetectedTexture;
  flatteringStyles: StyleRecommendation[];
  stylesToAvoid: StyleAvoidance[];
  technicalSalonBrief: TechnicalSalonBrief;
}

export type GenderTier = 'All' | 'Women' | 'Men' | 'Unisex' | 'Mature' | 'Avant-Garde';
export type HairLengthTier = 'Short / Fade' | 'Medium / Bob' | 'Long / Flow' | 'Wig / System';

export interface HairstyleModel {
  id: string;
  name: string;
  category: 'Precision Cut' | 'Taper / Fade' | 'Lace Wig / Topper' | 'Architectural Layers' | 'Textured Crown';
  genderCategory: GenderTier;
  lengthCategory: HairLengthTier;
  targetFaceShapes: FaceShape[];
  description: string;
  cranialHarmonyNote: string;
  clipperGuard: string;
  shearTechnique: string;
  wigInstallationGuide?: string;
  recommendedColor: string;
  textureCompatibility: string;
  imageVectorKey: string;
  accentBadge?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  gender: string;
  age: number;
  faceShape: FaceShape;
  portraitSvgPath?: string;
  presetAvatarUrl?: string;
  notes: string;
  biometricAnalysis: CranialAnalysis;
}

export interface ConsultationTicket {
  ticketId: string;
  timestamp: string;
  clientName: string;
  stylistName: string;
  faceShape: FaceShape;
  symmetryScore: number;
  selectedStyleName: string;
  styleCategory: string;
  barberClipperSpecs: string;
  shearProtocol: string;
  hairpieceNotes?: string;
  colorFormula: string;
  finishPrescription: string;
  rebookingWeeks: number;
  notes?: string;
}
