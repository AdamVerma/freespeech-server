import prisma from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';

// Prisma
const { PrismaClient } = prisma;
export const prismaClient = new PrismaClient();

// OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
