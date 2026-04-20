import { onCall } from "firebase-functions/v2/https";
import { GoogleGenerativeAI } from "@google/genai";
import * as admin from "firebase-admin";

// Initialize Firebase Admin to verify requests if needed
admin.initializeApp();

// Proxy function to Gemini
export const chatProxy = onCall(
  {
    secrets: ["GEMINI_API_KEY"], // Ensures key is not visible in logs/code
    cors: true, // Allow your frontend to call this
  },
  async (request) => {
    // 1. Verify user (optional but recommended for security)
    if (!request.auth) {
      throw new Error("Unauthenticated");
    }

    // 2. Get the prompt from the user
    const { prompt } = request.data;
    if (!prompt) {
      throw new Error("Missing prompt");
    }

    // 3. Initialize Gemini with secret key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Send request to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return { text: response.text() };
  }
);
