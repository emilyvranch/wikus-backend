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
  console.log("Received haiku request:", { title, summary });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Write a haiku about this topic:\nTitle: ${title}\nSummary: ${summary}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const haiku = completion.choices[0].message.content;
    res.json({ haiku });

  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to generate haiku." });
  }
});

app.listen(port, () => {
  console.log(`Wikus backend listening on port ${port}`);
});
