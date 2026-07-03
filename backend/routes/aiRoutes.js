const express = require("express");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const { authMiddleware } = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateWithRetry = async (options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(options);
    } catch (error) {
      if (error.status === 503 && i < retries - 1) {
        console.log(`[Attempt ${i + 1}] Gemini is busy. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
};

router.post("/detect", authMiddleware, aiLimiter, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const prompt = `
You are Yatri AI, an expert Indian tourist guide.

Analyze the uploaded image carefully.

If it contains a famous monument, identify it and return ONLY valid JSON.

Format:

{
  "monument": "",
  "city": "",
  "state": "",
  "builtBy": "",
  "yearBuilt": "",
  "description": ""
}

If you cannot confidently identify the monument, return:

{
  "monument": "Unknown",
  "city": "",
  "state": "",
  "builtBy": "",
  "yearBuilt": "",
  "description": "Unable to identify the monument confidently."
}

Do NOT return markdown.
Do NOT return explanation.
Return ONLY JSON.
`;
    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: req.file.mimetype, data: imageBase64 } },
          ],
        },
      ],
    });

    const text = typeof response.text === "function" ? response.text() : response.text;
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleanedText);
    } catch (parseError) {
      console.log("Gemini Response:", cleanedText);
      return res.status(500).json({ success: false, message: "Gemini returned invalid JSON", raw: cleanedText });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/chat", authMiddleware, aiLimiter, async (req, res) => {
  try {
    const { monument, question, history } = req.body;
    if (!monument || !question) {
      return res.status(400).json({ success: false, message: "monument and question are required" });
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-8) : [];

    const contents = [
      {
        role: "user",
        parts: [{ text: `You are Yatri AI, an expert Indian tourist guide. The detected monument is: ${monument}. Answer the visitor's questions about it conversationally. Keep each answer under 150 words.` }],
      },
      ...trimmedHistory.map((turn) => ({
        role: turn.role === "ai" ? "model" : "user",
        parts: [{ text: String(turn.text || "").slice(0, 1000) }],
      })),
      { role: "user", parts: [{ text: question }] },
    ];

    const response = await generateWithRetry({ model: "gemini-2.5-flash", contents });
    const answer = typeof response.text === "function" ? response.text() : response.text;

    return res.json({ success: true, answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;