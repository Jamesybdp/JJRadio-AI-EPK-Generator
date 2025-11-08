import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET;
const googleApiKey = process.env.GOOGLE_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not configured');
}

if (!googleApiKey) {
  throw new Error('GOOGLE_API_KEY is not configured');
}

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins || '*'
}));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    message: 'Too many requests. Please try again later.'
  }
});

app.use('/api/', limiter);

const artistInputSchema = z.object({
  artist_name: z.string().min(1),
  track_title: z.string().min(1),
  email: z.string().email(),
  genre: z.string().default(''),
  vibe_tags: z.array(z.string()).default([]),
  lyrics_text: z.string().min(1),
  artist_intent: z.string().default(''),
  cultural_refs_explained: z.string().default(''),
  problem_solving_connection: z.string().default(''),
  streaming_links: z.array(z.string()).default([]),
  sync_submission_link: z.string().url().or(z.literal('')).default(''),
  grant_application_link: z.string().url().or(z.literal('')).default('')
});

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const responseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['EPK_READY'] },
    filename_slug: { type: 'string' },
    deliverables: {
      type: 'object',
      properties: {
        artist_bio: { type: 'string' },
        one_sheet_summary: { type: 'string' },
        social_captions: {
          type: 'object',
          properties: {
            instagram: { type: 'string' },
            tiktok: { type: 'string' },
            x_twitter: { type: 'string' }
          },
          required: ['instagram', 'tiktok', 'x_twitter']
        },
        cultural_dna_report: { type: 'string' }
      },
      required: ['artist_bio', 'one_sheet_summary', 'social_captions', 'cultural_dna_report']
    },
    submission_guidance: {
      type: 'object',
      properties: {
        strategic_opportunities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['Sync Library', 'Grant/Accelerator', 'Radio Station'] },
              name: { type: 'string' },
              reasoning: { type: 'string' }
            },
            required: ['type', 'name', 'reasoning']
          }
        },
        email_pitch_blurb: { type: 'string' }
      },
      required: ['strategic_opportunities', 'email_pitch_blurb']
    },
    feedback_loop_data: {
      type: 'object',
      properties: {
        ai_confidence_score: { type: 'number' },
        training_data_tags: { type: 'array', items: { type: 'string' } },
        lyric_radio_clean: { type: 'boolean' }
      },
      required: ['ai_confidence_score', 'training_data_tags', 'lyric_radio_clean']
    }
  },
  required: ['status', 'filename_slug', 'deliverables', 'submission_guidance', 'feedback_loop_data']
};

const genAI = new GoogleGenerativeAI(googleApiKey);
const model = genAI.getGenerativeModel({ model: geminiModel });

const createPrompt = (data) => `
You are the JJRadio Alien Intelligence (J-AI), a proprietary cultural processing agent. Your mission is to transform raw musical
IP into a globally compliant, submission-ready electronic press kit (EPK) for Afro Creatives. Apply "exponential thinking over
linearism" to the artist's work. Your tone is playful, authoritative, Afro-optimistic, and street-smart.

**Input Data:**
- Artist Name: ${data.artist_name}
- Track Title: ${data.track_title}
- Genre: ${data.genre}
- Vibe Tags: ${data.vibe_tags.join(', ')}
- Artist's Intent: ${data.artist_intent}
- Lyrics: ${data.lyrics_text}
- Cultural References Explained by Artist: ${data.cultural_refs_explained}
- Connection to Local Issues/Opportunities: ${data.problem_solving_connection}
- Sync Library Submission Link: ${data.sync_submission_link}
- Grant Application Link: ${data.grant_application_link}

**Processing Steps:**
1.  **Cultural DNA Analysis:** Analyze lyrics and cultural references to create a succinct 3-sentence Cultural DNA Report. Assess if lyrics are radio-clean.
2.  **Professional Copy Generation:**
    - Generate a compelling Artist Bio (150 words) using the artist's intent as the core narrative.
    - Generate a One-Sheet Summary (100 words) optimized for sync/radio.
    - Generate 3 engaging, platform-specific Social Media Captions (IG/TikTok/X).
3.  **Strategic Opportunity Matching:** Based on genre, vibe, and themes, suggest 5 submission outlets (e.g., 3 sync libraries/grants, 2 radio stations). For this demo, use aspirational but relevant targets like "Def Jam Africa A&R", "Boomplay Editorial Playlist", "Music In Africa Foundation Grant", "Audiomack 'Trending' Feature", "Empire Publishing Sync Department". Provide a brief reasoning for each.
4.  **Assemble Output:** Format everything into the required JSON structure.

Generate the full EPK JSON object based on these instructions.
`;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

app.post('/api/signup', asyncHandler(async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email or password format.' });
  }

  const { email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '1h' });

  res.status(201).json({ token, user: { id: user.id, email: user.email } });
}));

app.post('/api/login', asyncHandler(async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email or password format.' });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '1h' });

  res.json({ token, user: { id: user.id, email: user.email } });
}));

app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

app.post('/api/generate-epk', authenticate, asyncHandler(async (req, res) => {
  const parsed = artistInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid artist input data.', details: parsed.error.flatten() });
  }

  const artistInput = parsed.data;

  const prompt = createPrompt(artistInput);

  let epk;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema
      }
    });

    const text = result.response.text();
    epk = JSON.parse(text);
  } catch (error) {
    console.error('Error generating EPK with Gemini:', error);
    return res.status(502).json({ message: 'Failed to generate EPK from AI service.' });
  }

  const savedInput = await prisma.artistInput.create({
    data: {
      artistName: artistInput.artist_name,
      trackTitle: artistInput.track_title,
      email: artistInput.email,
      genre: artistInput.genre,
      vibeTags: artistInput.vibe_tags,
      lyricsText: artistInput.lyrics_text,
      artistIntent: artistInput.artist_intent,
      culturalRefsExplained: artistInput.cultural_refs_explained,
      problemSolvingConnection: artistInput.problem_solving_connection,
      streamingLinks: artistInput.streaming_links,
      syncSubmissionLink: artistInput.sync_submission_link,
      grantApplicationLink: artistInput.grant_application_link,
      userId: req.user.id
    }
  });

  await prisma.epkOutput.create({
    data: {
      status: epk.status,
      filenameSlug: epk.filename_slug,
      deliverables: epk.deliverables,
      submissionGuidance: epk.submission_guidance,
      feedbackLoopData: epk.feedback_loop_data,
      artistInputId: savedInput.id,
      userId: req.user.id
    }
  });

  res.json(epk);
}));

app.get('/api/epks', authenticate, asyncHandler(async (req, res) => {
  const epks = await prisma.epkOutput.findMany({
    where: { userId: req.user.id },
    include: {
      artistInput: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(epks);
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
