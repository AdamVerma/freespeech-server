import express from "express";
import { prismaClient, s3 } from "../resources";

const router = express.Router();

type S3Response = {
  url: string | null;
  error: string | null;
};

// Upload
router.post<{}, S3Response>("/upload", async (req, res) => {
  const { file, authentication } = req.body;
});
