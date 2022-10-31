import prisma from "@prisma/client";
import aws from "aws-sdk";
import { Configuration, OpenAIApi } from "openai";

// Prisma
const { PrismaClient } = prisma;
export const prismaClient = new PrismaClient();

// OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

// S3
export const s3 = new aws.S3({
  accessKeyId: process.env.FS_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.FS_AWS_SECRET_ACCESS_KEY,
});
