import { ClientProfile } from '../types';

export const PRESET_CLIENT_PROFILES: ClientProfile[] = [
  {
    id: 'client-1',
    name: 'Sophia Laurent',
    gender: 'Female',
    age: 28,
    faceShape: 'Oval',
    notes: 'Fashion editor seeking architectural definition that accentuates high cheekbones without hiding neck line.',
    biometricAnalysis: {
      faceShape: 'Oval',
      faceShapeDescription: 'Ideal golden-ratio oval blueprint with gentle curvature tapering smoothly from high zygomatic cheekbones to a defined soft chin.',
      symmetryScore: 96,
      goldenRatioFit: 94,
      ratios: {
        facialThirds: {
          upperThird: '33.3%',
          middleThird: '33.4%',
          lowerThird: '33.3%',
        },
        widthToLengthRatio: '1 : 1.41',
        foreheadToJawRatio: '1.18 : 1',
        cheekboneProminence: 'High',
        gonialAngle: 122,
      },
      cranialArchitecture: {
        crownVolumeRequirement: 'Medium Lift',
        hairlineType: 'Rounded Natural',
        hairlineRecessionRisk: 'None',
        recommendedParting: 'Slight Off-Center',
      },
      detectedTexture: {
        curlPattern: 'Wavy 2B',
        density: 'Medium-Dense',
        strandCaliber: 'Medium',
      },
      flatteringStyles: [
        {
          name: 'Italian Sculpted Bob with French Fringe',
          category: 'Cut',
          whyItWorks: 'Frames jawline and balances temple-to-cheekbone golden ratio, accentuating facial symmetry.',
          silhouetteGoal: 'Showcase jawline angle and maintain collarbone elegance.',
        },
        {
          name: 'Architectural Butterfly Layers & Volume Blowout',
          category: 'Layers',
          whyItWorks: 'Cascading tiers draw the eye outward, creating high-fashion volume around the zygomatic arch.',
          silhouetteGoal: 'Dynamic aerated movement with luxury shine.',
        },
        {
          name: 'Bespoke HD Swiss Lace Frontal Crown Unit',
          category: 'Wig',
          whyItWorks: 'Natural hairline integration with customized honey caramel balayage dimension.',
          silhouetteGoal: 'Ultra-luxurious full crown density.',
        },
      ],
      stylesToAvoid: [
        {
          name: 'Heavy Flat Blunt Bangs',
          reason: 'Compacts the ideal upper third and conceals balanced forehead symmetry.',
        },
      ],
      technicalSalonBrief: {
        clipperSpecs: 'Clean hairline outline with zero-gap detailer; gentle nape cleanup.',
        shearWork: '0-degree blunt baseline at jawline; 45-degree interior graduation to remove bulk; slide-cut curtain fringe.',
        hairpieceOrWigProtocol: '130% density Swiss HD lace with micro-bleached single knots; custom contoured hairline.',
        colorFormulation: 'Level 6.1 Cool Ash base with hand-painted Level 8.32 Warm Caramel ribbons; 10 vol developer toner gloss.',
        finishProducts: 'Hydrating prep primer, lightweight heat-activated smoothing serum, botanical argan shine mist.',
        maintenanceCadenceWeeks: 6,
      },
    },
  },
  {
    id: 'client-2',
    name: 'Marcus Vance',
    gender: 'Male',
    age: 32,
    faceShape: 'Square',
    notes: 'Creative director with strong gonial jaw angles looking for clean architectural sharpness and low daily maintenance.',
    biometricAnalysis: {
      faceShape: 'Square',
      faceShapeDescription: 'Distinct masculine geometry characterized by equivalent temple-to-jawline width and a prominent 116° gonial jaw angle.',
      symmetryScore: 92,
      goldenRatioFit: 89,
      ratios: {
        facialThirds: {
          upperThird: '32.8%',
          middleThird: '33.9%',
          lowerThird: '33.3%',
        },
        widthToLengthRatio: '1 : 1.25',
        foreheadToJawRatio: '1.02 : 1',
        cheekboneProminence: 'High',
        gonialAngle: 116,
      },
      cranialArchitecture: {
        crownVolumeRequirement: 'High Vertical Extension',
        hairlineType: 'Squared Sharp',
        hairlineRecessionRisk: 'Mild Temporal',
        recommendedParting: 'Free-Flow Texture',
      },
      detectedTexture: {
        curlPattern: 'Straight 1C',
        density: 'Thick',
        strandCaliber: 'Coarse',
      },
      flatteringStyles: [
        {
          name: 'Precision Low Skin Taper with Textured Crop',
          category: 'Fade',
          whyItWorks: 'Maintains crown texture to vertically elongate square facial proportions while showcasing sharp jawline.',
          silhouetteGoal: 'Elongate vertical axis and sharpen side profile.',
        },
        {
          name: 'Executive Mid Drop Fade with Side Pompadour',
          category: 'Fade',
          whyItWorks: 'Adds height at the apex to balance the strong mandibular width.',
          silhouetteGoal: 'Sculpted height with clean temple taper.',
        },
      ],
      stylesToAvoid: [
        {
          name: 'Wide Flared Sideburns',
          reason: 'Adds horizontal bulk to an already square jawline.',
        },
      ],
      technicalSalonBrief: {
        clipperSpecs: '#0 foil shaver at base, #0.5 open lever taper, #1.5 guard at parietal ridge, clipper-over-comb finish.',
        shearWork: '90-degree uniform crown elevation with aggressive deep notch point-cutting for jagged separation.',
        hairpieceOrWigProtocol: 'Not applicable (Native hair preservation and temporal lineup enhancement).',
        colorFormulation: 'Natural Jet Slate tone with subtle matte charcoal anti-shine wash.',
        finishProducts: 'Matte styling clay with bentonite earth, sea salt pre-styler, zero-shine hair spray.',
        maintenanceCadenceWeeks: 3,
      },
    },
  },
  {
    id: 'client-3',
    name: 'Amara Kalu',
    gender: 'Non-Binary',
    age: 26,
    faceShape: 'Heart',
    notes: 'Textured hair artist seeking celebratory crown sculpting that balances a delicate chin and prominent forehead.',
    biometricAnalysis: {
      faceShape: 'Heart',
      faceShapeDescription: 'Broad zygomatic arches and wide forehead tapering down to an exquisite narrow chin, featuring an inverted triangular balance.',
      symmetryScore: 95,
      goldenRatioFit: 91,
      ratios: {
        facialThirds: {
          upperThird: '35.1%',
          middleThird: '33.2%',
          lowerThird: '31.7%',
        },
        widthToLengthRatio: '1 : 1.32',
        foreheadToJawRatio: '1.34 : 1',
        cheekboneProminence: 'High',
        gonialAngle: 126,
      },
      cranialArchitecture: {
        crownVolumeRequirement: 'Sculptural Spherical Balance',
        hairlineType: 'Natural Curved',
        hairlineRecessionRisk: 'None',
        recommendedParting: 'Center Radial',
      },
      detectedTexture: {
        curlPattern: 'Coily 4B',
        density: 'High-Density',
        strandCaliber: 'Fine-to-Medium',
      },
      flatteringStyles: [
        {
          name: 'Geometric Coily Afro Crown with Temple Taper',
          category: 'Protective',
          whyItWorks: 'Spherical volume at crown softens the tapered chin and creates majestic, regal head shape harmony.',
          silhouetteGoal: 'Celebrates natural spring factor and balances facial thirds.',
        },
        {
          name: 'Shaggy Modern Wolf Cut with Wispy Curtain Fringe',
          category: 'Layers',
          whyItWorks: 'Wispy fringe reduces visual forehead width while jawline length fills in the hollow near the chin.',
          silhouetteGoal: 'Creates soft perimeter width around lower third.',
        },
      ],
      stylesToAvoid: [
        {
          name: 'Slicked High Bun with Severe Pull',
          reason: 'Over-accentuates upper third width and leaves the chin visually unsupported.',
        },
      ],
      technicalSalonBrief: {
        clipperSpecs: 'Zero-gap detailer on perimeter arc; #1 guard on soft temple fade transition.',
        shearWork: 'Dry freehand curl carving with 7-inch barber shears, following spherical cranial contours.',
        hairpieceOrWigProtocol: 'Silk-base custom cranial cap if protective wig styling is selected; breathable net.',
        colorFormulation: 'Deep espresso base with warm honey-amber balayage on coil crowns (Bond Builder Step 1 included).',
        finishProducts: 'Botanical leave-in curling butter, cold-pressed jojoba seal, scalp soothing peppermint elixir.',
        maintenanceCadenceWeeks: 5,
      },
    },
  },
  {
    id: 'client-4',
    name: 'Elena Rostova',
    gender: 'Female',
    age: 54,
    faceShape: 'Oblong',
    notes: 'Executive seeking an empowering, luminous silver transformation that lifts facial features and exudes luxury.',
    biometricAnalysis: {
      faceShape: 'Oblong',
      faceShapeDescription: 'Elongated vertical facial axis with uniform width between temples, cheekbones, and jaw, complemented by refined mature bone structure.',
      symmetryScore: 93,
      goldenRatioFit: 90,
      ratios: {
        facialThirds: {
          upperThird: '34.2%',
          middleThird: '33.4%',
          lowerThird: '32.4%',
        },
        widthToLengthRatio: '1 : 1.52',
        foreheadToJawRatio: '1.08 : 1',
        cheekboneProminence: 'Medium',
        gonialAngle: 125,
      },
      cranialArchitecture: {
        crownVolumeRequirement: 'Lateral Width Expansion',
        hairlineType: 'Soft Rounded',
        hairlineRecessionRisk: 'Mild Bitemporal',
        recommendedParting: 'Diagonal Side Sweep',
      },
      detectedTexture: {
        curlPattern: 'Straight 1B with Silver Wiriness',
        density: 'Medium',
        strandCaliber: 'Fine-to-Medium',
      },
      flatteringStyles: [
        {
          name: 'Refined Platinum Silver Modern Bixie (Bob-Pixie)',
          category: 'Cut',
          whyItWorks: 'Horizontal fullness at ear level counteracts vertical elongation, visually lifting cheekbones and eyes.',
          silhouetteGoal: 'Rejuvenate neck and cheek lines with architectural elegance.',
        },
        {
          name: 'Seamless Monofilament Crown Topper Unit',
          category: 'Wig',
          whyItWorks: 'Feather-light crown integration restores youthful cranial volume without weighing down fine silver strands.',
          silhouetteGoal: 'Weightless apex lift and multidirectional parting.',
        },
      ],
      stylesToAvoid: [
        {
          name: 'Ultra-Long Stick-Straight Parted Center',
          reason: 'Drags the visual plane downward and exaggerates the oblong facial vertical axis.',
        },
      ],
      technicalSalonBrief: {
        clipperSpecs: 'Scissor-over-comb only on perimeter nape; no aggressive machine clipping.',
        shearWork: '45-degree vertical graduation in occipital zone; soft horizontal perimeter above ears; feather razor on fringe.',
        hairpieceOrWigProtocol: 'Medical-grade polyurethane perimeter with monofilament top; hand-tied 100% European silver hair.',
        colorFormulation: 'Level 10 Oyster Platinum gloss with anti-brass violet pearl toner (Acidic pH glaze).',
        finishProducts: 'Keratin densifying mousse, boar-bristle blowout ceramic thermal spray, silk finishing mist.',
        maintenanceCadenceWeeks: 5,
      },
    },
  },
];
