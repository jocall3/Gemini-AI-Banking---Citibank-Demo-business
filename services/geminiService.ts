
import { GoogleGenAI, Type } from "@google/genai";
import { BankingInsight, InvestmentOpportunity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Uses Gemini to generate dynamic banking insights based on mock transaction history.
 */
export async function getAIInsights(transactions: any[]): Promise<BankingInsight[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given these recent banking transactions: ${JSON.stringify(transactions)}, 
                 generate 3 personalized banking insights or recommendations. 
                 Return as a JSON array of objects with id, title, type, and description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["id", "title", "type", "description"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [
      {
        id: "error",
        title: "AI Analysis Offline",
        type: "Error",
        description: "Unable to reach the Gemini neural net for spending analysis."
      }
    ];
  }
}

/**
 * Uses Gemini to simulate an investment opportunity scan.
 */
export async function scanInvestmentOpportunities(): Promise<InvestmentOpportunity[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Analyze current market trends and generate 2 futuristic investment opportunities for a high-net-worth individual. Return as a JSON array.",
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              projectedReturn: { type: Type.NUMBER },
              riskLevel: { type: Type.STRING },
              description: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER }
            },
            required: ["id", "name", "type", "projectedReturn", "riskLevel", "description", "confidenceScore"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Investment Scan Error:", error);
    return [];
  }
}

/**
 * Chat with the Gemini AI Banking Assistant.
 */
export async function chatWithAssistant(history: {role: string, parts: {text: string}[]}[], message: string) {
  try {
    const chat = ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are the Gemini AI Banking Assistant. You are professional, concise, and have deep knowledge of futuristic banking concepts like Neuromorphic processors and Quantum-safe encryption. Always refer to the user's data with confidence and security in mind."
      }
    });

    return chat;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
}
