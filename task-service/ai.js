console.log("OpenAI API key loaded:", !!process.env.OPENAI_API_KEY); // Should print true

require('dotenv').config(); // MUST be first

const OpenAI = require('openai');

console.log("OpenAI API key loaded:", !!process.env.OPENAI_API_KEY); // Should print true

const openai = new OpenAI({
  apiKey: "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" // replace with your actual key
});


async function analyzeTask(title, description, dueDate) {
  const prompt = `
Analyze this task and return JSON only:
Title: ${title}
Description: ${description}
Due Date: ${dueDate}

Return format:
{
  "priority": "low | medium | high",
  "risk": "low | medium | high",
  "suggestion": "short improvement tip"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { analyzeTask };


async function analyzeTask(title, description, dueDate) {
  const prompt = `
Analyze this task and return JSON only:
Title: ${title}
Description: ${description}
Due Date: ${dueDate}

Return format:
{
  "priority": "low | medium | high",
  "risk": "low | medium | high",
  "suggestion": "short improvement tip"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { analyzeTask };
