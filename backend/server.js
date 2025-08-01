import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

app.post('/api/improve-email', async (req, res) => {
  const { emailText, tone } = req.body;

  if (!emailText) {
    return res.status(400).json({ error: 'Email text is required' });
  }

  try {
    const prompt = `
      Provide three improved versions of the following email in a ${tone} tone:
      1. Concise & Professional
      2. More Formal
      3. Softer, Detailed
      
      Email:
      ${emailText}
    `;

    const result = await model.generateContent(prompt);

    console.log("🔹 Gemini raw response:", JSON.stringify(result, null, 2));

    const improvedText = result?.response?.text()?.trim();

    if (!improvedText) {
      return res.json({ improvedText: "⚠️ AI could not generate an improved email." });
    }

    res.json({ improvedText });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
