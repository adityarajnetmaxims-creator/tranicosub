import { GoogleGenAI, Type } from "@google/genai";
import { Engineer } from "../types";

// NOTE: In a real production app, you should not expose API keys on the client side.
// This is for demonstration purposes within the required constraints.
const API_KEY = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface RecommendationResult {
  engineerId: string | null;
  reasoning: string;
}

export const getEngineerRecommendation = async (
  title: string,
  description: string,
  engineers: Engineer[]
): Promise<RecommendationResult> => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing.");
    return { engineerId: null, reasoning: "AI configuration missing." };
  }

  const engineerProfiles = engineers.map(e => ({
    id: e.id,
    name: e.name,
    specialties: e.specialties,
    tags: e.tags
  }));

  const prompt = `
    You are an intelligent dispatcher for a field service company.
    Based on the following Issue Title and Description, recommend the best suited Engineer from the provided list.
    
    Issue Title: "${title}"
    Issue Description: "${description}"
    
    Available Engineers:
    ${JSON.stringify(engineerProfiles, null, 2)}
    
    Return the ID of the best engineer and a short reasoning (max 1 sentence).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            engineerId: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["engineerId", "reasoning"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      engineerId: result.engineerId || null,
      reasoning: result.reasoning || "Could not determine best fit.",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { engineerId: null, reasoning: "AI service unavailable." };
  }
};