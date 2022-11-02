import express from "express";
import auth from "./auth";
import explore from "./explore";
import openai from "./openai";
import page from "./page";
import project from "./project";
import s3 from "./s3";
import tile from "./tile";
import tts from "./tts";
import user from "./user";

const router = express.Router();

router.get<{}, { message: string }>("/", (req, res) => {
  res.json({
    message: "FreeSpeech API V1 - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/explore", explore);
router.use("/openai", openai);
router.use("/page", page);
router.use("/project", project);
router.use("/s3", s3);
router.use("/tile", tile);
router.use("/tts", tts);
router.use("/user", user);

export default router;
