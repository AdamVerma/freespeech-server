import express from "express";
import { prismaClient, openai } from "../resources";

const router = express.Router();

type OpenAIResponse = {
  conjugations: string[] | null;
  error: string | null;
};

// Conjugate
router.post<{}, OpenAIResponse>("/conjugate", async (req, res) => {
  // Grab the request body
  const { word, language } = req.body;

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `list all ${language} conjugations and variations of the word "${word}", one word only, comma seperated list:`,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  if (!response)
    return res
      .status(400)
      .json({ error: "OpenAI failed.", conjugations: null });

  const conjugated = response.data.choices[0].text
    ?.split(",")
    .map((conjugated_word) => conjugated_word.trim());
  if (!conjugated)
    return res
      .status(400)
      .json({ error: "OpenAI failed.", conjugations: null });

  return res.status(200).json({ error: null, conjugations: conjugated });
});

export default router;
