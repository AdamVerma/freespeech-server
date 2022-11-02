import express from "express";
import Voices from "../tts/Voices";
import AWS from "../tts/AWS";
import Azure from "../tts/Azure";
import Google from "../tts/Google";

const router = express.Router();

type TTSResponse = {
  url: string | null;
  voices: any[] | null;
  error: string | null;
};

type Voice = {
  privShortName: string;
  languageCode: string;
  ssmlGender: any;
  voice: string;
  engine: string;
};

// voices
router.post<{}, TTSResponse>("/voices", async (req, res) => {
  return res.status(200).json({
    url: null,
    voices: Voices,
    error: null,
  });
});

// synthesize
router.post<{}, TTSResponse>("/synthesize", async (req, res) => {
  const { text, _voice, provider, name } = req.body;
  const voice: Voice = _voice;

  // If no text is provided, return an error
  if (!text) {
    return res.status(400).json({
      url: null,
      voices: null,
      error: "Missing text",
    });
  }
  // If no voice is provided, return an error
  if (!voice) {
    return res.status(400).json({
      url: null,
      voices: null,
      error: "Missing voice",
    });
  }
  // synthesize
  let url: string | null = null;
  if (provider === "azure") {
    const lastWord = name.split(" ").pop();
    if (lastWord === lastWord.toLowerCase()) {
      url = (await Azure(text, voice.privShortName, lastWord)) + "";
    } else {
      url = (await Azure(text, voice.privShortName, "")) + "";
    }
  } else if (provider === "google") {
    url = (await Google(text, voice.languageCode, voice.ssmlGender)) + "";
  } else if (provider === "aws") {
    url = (await AWS(text, voice.voice, voice.engine)) + "";
  } else {
    return res.status(400).json({
      url: null,
      voices: null,
      error: "Invalid provider",
    });
  }
  // return the url
  return res.status(200).json({
    url,
    voices: null,
    error: null,
  });
});

export default router;
