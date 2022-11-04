import express from "express";
import { prismaClient, s3 } from "../resources";

const router = express.Router();

type S3Response = {
  url: string | null;
  error: string | null;
};

// Upload
router.post("/upload", express.json({ limit: "50mb" }), async (req, res) => {
  const { file, name } = req.body;
  // generate new file name with the name of the file
  const filename: string = Date.now().toString().substring(0, 5) + name;
  // upload file to s3
  const response = await s3
    .putObject({
      Body: Buffer.from(file, "base64"),
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: filename,
    })
    .promise();
  // if there is an error, return the error
  if (!response.ETag) {
    res.status(500).send({ url: null, error: "Error uploading file" });
  }
  // get the url of the file
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${filename}`;
  // create a new file in the database for logging purposes
  await prismaClient.s3Resource.create({
    data: {
      url,
      author: {
        connect: {
          id: (req as unknown as { user: any }).user.id,
        },
      },
    },
  });
  // return the url
  return res.status(200).json({ error: null, url });
});

export default router;
