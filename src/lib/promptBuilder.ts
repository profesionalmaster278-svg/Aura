import { FaceShape } from '../types';

export interface InpaintPromptParams {
  styleName: string;
  category: string;
  faceShape: FaceShape;
  colorName: string;
  colorHex: string;
  genderTier?: string;
  customModifier?: string;
}

/**
 * Builds high-fidelity prompt for generative hair & wig inpainting
 */
export function buildInpaintPrompt(params: InpaintPromptParams): string {
  const {
    styleName,
    category,
    faceShape,
    colorName,
    genderTier = 'Unisex',
    customModifier = '',
  } = params;

  return `High-fashion salon lookbook editorial portrait, luxury digital atelier photography.
Inpaint and realistically synthesize hairstyle onto the client's cranial frame:
Target Hairstyle: "${styleName}" (${category})
Client Face Architecture: ${faceShape} (maintain natural bone structure, zygomatic cheekbones, and jawline).
Target Hair Color: "${colorName}" with dimensional highlights and satin gloss finish.
Demographic: ${genderTier} tier.
Perimeter Harmony: Realistic micro-plucked hairline transition, zero visible lace grid, authentic strand physics, natural crown volume and density.
${customModifier ? `Stylist Custom Directives: ${customModifier}` : ''}
Photorealistic lighting, 8k resolution, razor-sharp hair texture details, seamless edge integration.`;
}

/**
 * Builds prompt for Master Salon & Barbershop Technical Brief
 */
export function buildSalonBriefPrompt(
  clientName: string,
  faceShape: FaceShape,
  selectedStyle: string,
  clientNotes: string = '',
  stylistName: string = 'Aura Master Specialist'
): string {
  return `You are a Master Creative Director at a world-class luxury hair atelier and Master Barber.
Generate an actionable, professional salon and barbershop technical execution brief for:
Client: ${clientName}
Stylist: ${stylistName}
Face Architecture: ${faceShape}
Target Style: ${selectedStyle}
Special Notes/Sensitivities: ${clientNotes || 'Enhance natural bone structure with effortless luxury'}

Return strict JSON conforming to this schema:
{
  "summary": "2 concise sentences on the anatomical balance and aesthetic direction",
  "clipperSpecs": "Specific clipper guard progression (e.g., #0 foil, #0.5 open lever, #1.5 at parietal ridge, zero-gap trimmer at nape)",
  "shearWork": "Exact scissor angles, elevation degrees (e.g. 0° blunt, 45° graduation, 90° crown layering) and texturizing method",
  "hairpieceOrWigProtocol": "Lace specs (Swiss HD, monofilament), bleached knots, density transition, skin-prep adhesive",
  "colorFormulation": "Specific professional color formula (base level, reflect tones, developer volume, bond multiplier)",
  "finishProducts": "Prescribed home styling products and thermal protection regimen",
  "maintenanceCadenceWeeks": 4
}`;
}
