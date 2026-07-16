let GoogleGenAI, GoogleGenerativeAI;
try {
  ({ GoogleGenAI } = require("@google/genai"));
} catch (e) {
  try {
    ({ GoogleGenerativeAI } = require("@google/generative-ai"));
  } catch (err) {
    console.error("❌ ERROR: Neither '@google/genai' nor '@google/generative-ai' is installed! Run: npm install @google/generative-ai");
  }
}

async function analyzeCodeWithAI(codeContent) {
  try {
    // Safety check for missing API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from your .env file");
    }

    const prompt = `
      You are an expert code reviewer. Analyze the following code. 
      Provide an overall numerical score between 1 and 100 based on quality, security, and efficiency.
      Provide a concise 1-2 sentence summary of your feedback.
      
      Respond ONLY with a valid JSON object matching this structure:
      {
        "overall_score": 85,
        "summary": "Your analysis summary here."
      }

      Code to analyze:
      ${codeContent}
    `;

    let textResponse = "";

    // Automatically use the correct syntax based on which package you have installed
    if (GoogleGenAI) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      textResponse = response.text;
    } else if (GoogleGenerativeAI) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
      const response = await model.generateContent(prompt);
      textResponse = response.text;
    } else {
      throw new Error("No Google Gemini SDK libraries found.");
    }

    // Clean up the AI output (stripping away markdown code fences like ```json)
    let text = textResponse.trim();
    if (text.startsWith("```json")) text = text.replace(/```json|```/g, "");
    if (text.startsWith("```")) text = text.replace(/```/g, "");

    // Return the clean parsed result
    return JSON.parse(text.trim());

  } catch (error) {
    console.error("--- GEMINI DETAILED ERROR LOG ---");
    console.error(error);
    console.error("---------------------------------");
    
    // Fallback block that keeps the frontend from completely breaking
    return {
      overall_score: 50,
      summary: "AI review failed to process due to an internal API or parsing issue."
    };
  }
}

async function generateDocumentation(codeString, language) {
  const prompt = `
    You are a technical writer creating documentation for a codebase.
    Write clear documentation for the following ${language} code, in Markdown format.

    Include:
    - A one-paragraph overview of what this file does
    - A bullet list describing each function/class: its purpose, parameters, and what it returns
    - Any notable assumptions or edge cases a new developer should know about

    Keep it concise and skip any function that is trivial (like a one-line getter).
    Return ONLY the Markdown text, nothing else (no JSON, no extra commentary).

    Code:
    \`\`\`${language}
    ${codeString}
    \`\`\`
  `;

  try {
    // Safety check for missing API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from your .env file");
    }

    let textResponse = "";

    // Automatically use the correct syntax based on which package you have installed
    if (GoogleGenAI) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash", // Updated to matching active model version
        contents: prompt,
      });
      textResponse = response.text;
    } else if (GoogleGenerativeAI) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); // Updated to matching active model version
      const response = await model.generateContent(prompt);
      textResponse = response.text;
    } else {
      throw new Error("No Google Gemini SDK libraries found.");
    }

    return textResponse.trim();
  } catch (error) {
    console.error("Documentation generation error:", error);
    return "Documentation could not be generated for this submission.";
  }
}

// Export both functions safely together
module.exports = { analyzeCodeWithAI, generateDocumentation };