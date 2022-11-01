import express from "express";
import auth from "./auth";
import openai from "./openai";

const router = express.Router();

router.get<{}, { message: string }>("/", (req, res) => {
  res.json({
    message: "FreeSpeech API V1 - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/openai", openai);

export default router;
