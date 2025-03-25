const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); require ("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/haiku", async (req, res) => {
  const { title, summary } = req.body;

  const prompt = `Write a 3-line haiku (5-7-5 syllables) that captures the essence of a Wikipedia article titled "${title}" with the following summary:\n\n"${summary}"`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const haiku = completion.data.choices[0].message.content.trim();
    res.json({ haiku });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Failed to generate haiku." });
  }
});

app.listen(port, () => {
  console.log(`Wikus backend listening on port ${port}`);
});