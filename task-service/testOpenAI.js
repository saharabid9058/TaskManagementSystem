require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });

async function test() {
  try {
    const res = await openai.models.list();
    console.log("✅ API Key works, models:", res.data.map(m => m.id));
  } catch (err) {
    console.error("❌ API Key error:", err.message);
  }
}

test();
