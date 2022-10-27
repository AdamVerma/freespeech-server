import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import auth from './auth';
import openai from './openai';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'FreeSpeech API V1 - 👋🌎🌍🌏',
  });
});

router.use('/auth', auth);
router.use('/openai', openai);

export default router;
