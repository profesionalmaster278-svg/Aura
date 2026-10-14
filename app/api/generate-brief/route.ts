import { GoogleGenAI } from '@google/genai';
import { GenerateBriefRequestPayload, GenerateBriefResponsePayload } from '../../../src/lib/schemas';
import { buildSalonBriefPrompt } from '../../../src/lib/promptBuilder';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: Request) {
  try {
    const body: GenerateBriefRequestPayload = await req.json();

    const prompt = buildSalonBriefPrompt(
      body.clientName || 'Client',
      body.faceShape || 'Oval',
      body.selectedStyle || 'Precision Cut',
      body.clientNotes || '',
      body.stylistName || 'Aura Master Specialist'
    );

    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    });

    const parsed: GenerateBriefResponsePayload = JSON.parse(res.text || '{}');
    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      summary: 'Precision architectural cut calibrated to facial proportions.',
      clipperSpecs: '#0.5 open lever tapering down to #0 foil on neckline; #1.5 guard at parietal ridge.',
      shearWork: '45-degree vertical graduation in occipital zone; point cutting on crown.',
      hairpieceOrWigProtocol: 'Swiss HD lace front with bleached knots and plucked density gradient.',
      colorFormulation: 'Level 7.1 neutral ash base with caramel babylights and acidic gloss glaze.',
      finishProducts: 'Keratin smoothing primer, matte texturizing clay, and weightless argan elixir.',
      maintenanceCadenceWeeks: 4,
    });
  }
}
