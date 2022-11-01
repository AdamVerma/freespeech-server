import express from "express";
import auth from "./auth";
import openai from "./openai";
import s3 from "./s3";

const router = express.Router();

router.get<{}, { message: string }>("/", (req, res) => {
  res.json({
    message: "FreeSpeech API V1 - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/openai", openai);
router.use("/s3", s3);

export default router;
