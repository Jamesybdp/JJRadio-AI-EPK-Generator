
import { GoogleGenAI, Type } from "@google/genai";
import type { ArtistInput, EpkOutput } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        status: { type: Type.STRING, enum: ["EPK_READY"] },
        filename_slug: { type: Type.STRING },
        deliverables: {
            type: Type.OBJECT,
            properties: {
                artist_bio: { type: Type.STRING },
                one_sheet_summary: { type: Type.STRING },
                social_captions: {
                    type: Type.OBJECT,
                    properties: {
                        instagram: { type: Type.STRING },
                        tiktok: { type: Type.STRING },
                        x_twitter: { type: Type.STRING },
                    },
                    required: ["instagram", "tiktok", "x_twitter"]
                },
                cultural_dna_report: { type: Type.STRING },
            },
            required: ["artist_bio", "one_sheet_summary", "social_captions", "cultural_dna_report"]
        },
        submission_guidance: {
            type: Type.OBJECT,
            properties: {
                strategic_opportunities: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ["Sync Library", "Grant/Accelerator", "Radio Station"] },
                            name: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                        },
                        required: ["type", "name", "reasoning"]
                    }
                },
                email_pitch_blurb: { type: Type.STRING },
            },
            required: ["strategic_opportunities", "email_pitch_blurb"]
        },
        feedback_loop_data: {
            type: Type.OBJECT,
            properties: {
                ai_confidence_score: { type: Type.NUMBER },
                training_data_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                lyric_radio_clean: { type: Type.BOOLEAN },
            },
            required: ["ai_confidence_score", "training_data_tags", "lyric_radio_clean"]
        }
    },
    required: ["status", "filename_slug", "deliverables", "submission_guidance", "feedback_loop_data"]
};


const createPrompt = (data: ArtistInput): string => {
    return `
You are the JJRadio Alien Intelligence (J-AI), a proprietary cultural processing agent. Your mission is to transform raw musical IP into a globally compliant, submission-ready electronic press kit (EPK) for Afro Creatives. Apply "exponential thinking over linearism" to the artist's work. Your tone is playful, authoritative, Afro-optimistic, and street-smart.

**Input Data:**
- Artist Name: ${data.artist_name}
- Track Title: ${data.track_title}
- Genre: ${data.genre}
- Vibe Tags: ${data.vibe_tags.join(', ')}
- Artist's Intent: ${data.artist_intent}
- Lyrics: ${data.lyrics_text}
- Cultural References Explained by Artist: ${data.cultural_refs_explained}
- Connection to Local Issues/Opportunities: ${data.problem_solving_connection}
- Sync Library Submission Link: ${data.sync_submission_link}
- Grant Application Link: ${data.grant_application_link}

**Processing Steps:**
1.  **Cultural DNA Analysis:** Analyze lyrics and cultural references to create a succinct 3-sentence Cultural DNA Report. Assess if lyrics are radio-clean.
2.  **Professional Copy Generation:**
    - Generate a compelling Artist Bio (150 words) using the artist's intent as the core narrative.
    - Generate a One-Sheet Summary (100 words) optimized for sync/radio.
    - Generate 3 engaging, platform-specific Social Media Captions (IG/TikTok/X).
3.  **Strategic Opportunity Matching:** Based on genre, vibe, and themes, suggest 5 submission outlets (e.g., 3 sync libraries/grants, 2 radio stations). For this demo, use aspirational but relevant targets like "Def Jam Africa A&R", "Boomplay Editorial Playlist", "Music In Africa Foundation Grant", "Audiomack 'Trending' Feature", "Empire Publishing Sync Department". Provide a brief reasoning for each.
4.  **Assemble Output:** Format everything into the required JSON structure.

Generate the full EPK JSON object based on these instructions.
`;
}


export const generateEpk = async (data: ArtistInput): Promise<EpkOutput> => {
    const prompt = createPrompt(data);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as EpkOutput;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate EPK from AI service.");
    }
};
