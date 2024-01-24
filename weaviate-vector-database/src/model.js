import OpenAI from "openai";
import dotenv from 'dotenv'

dotenv.config();

// initialize openai instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// configure function to respond as a knowledge oracle
async function getChatCompletion({ prompt, context }) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
        You are a knowledgebase oracle. You are given a question and a context. You answer the question based on the context.
        Analyse the information from the context and draw fundamental insights to accurately answer the question to the best of your ability.

        Context: ${context}
      `,
      },
      { role: "user", content: prompt },
    ],
  });
  return chatCompletion.choices[0].message;
}

export { getChatCompletion };