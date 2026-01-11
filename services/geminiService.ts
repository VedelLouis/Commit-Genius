
import { GoogleGenAI } from "@google/genai";
import { CommitStyle, GenerationConfig } from "../types";

export const generateCommitMessage = async (
  input: string,
  config: GenerationConfig
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const stylePrompts = {
    [CommitStyle.CONVENTIONAL]: "Use the Conventional Commits specification (type(scope): description). Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.",
    [CommitStyle.GITMOJI]: "Use the Gitmoji style. Start with a relevant emoji followed by a concise description.",
    [CommitStyle.MINIMAL]: "Keep it extremely short and direct. No prefixes, just the core action.",
    [CommitStyle.DETAILED]: "Provide a clear summary followed by a bulleted list of changes for the body."
  };

  const systemInstruction = `You are a Senior Software Engineer and Git expert. 
Your task is to generate professional, accurate, and concise Git commit messages based on the provided code changes or descriptions.
Guidelines:
- ${stylePrompts[config.style]}
- ${config.scope ? `Use '${config.scope}' as the scope if applicable.` : ''}
- Use the imperative mood (e.g., "add", "fix", "change" instead of "added", "fixes", "changed").
- Do not include markdown code blocks in the final answer, just the raw commit text.
- If the input is a diff, analyze it carefully to understand the intent.
- Focus on "why" as well as "what" if the style is Detailed.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a commit message for these changes:\n\n${input}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate message.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to communicate with the AI agent.");
  }
};
