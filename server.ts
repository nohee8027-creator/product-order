import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Lotto Numbers using OpenAI
  app.post('/api/lotto', async (req, res) => {
    try {
      const client = getOpenAI();
      
      const prompt = `당신은 행운을 예측하는 전문가입니다. 로또 번호 5개 세트를 생성해주세요. 
      각 세트는 1부터 45 사이의 중복되지 않는 숫자 6개로 구성되어야 합니다.
      반드시 다음 JSON 형식으로만 응답하세요:
      {
        "sets": [
          [1, 2, 3, 4, 5, 6],
          [7, 8, 9, 10, 11, 12],
          ... 총 5세트
        ]
      }`;

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('OpenAI returned empty response');
      
      const data = JSON.parse(content);
      res.json(data);
    } catch (error: any) {
      console.error('OpenAI Error:', error);
      res.status(500).json({ error: error.message || '번호 생성 중 오류가 발생했습니다.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
