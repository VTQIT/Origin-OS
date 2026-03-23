import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey });

export async function chatWithGemini(message: string, history: any[] = []) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: "You are Orange AI, the intelligent assistant of Orange AI OS. You are helpful, friendly, and concise. You provide information about the system and help users with their tasks.",
    },
  });

  return response.text;
}
