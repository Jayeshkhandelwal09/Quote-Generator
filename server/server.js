const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors")
const app = express();
app.use(cors())
app.use(express.json());

app.post("/generate-Quote", async (req, res) => {
  try {
    const { input } = req.body;
    const apikey = process.env.OPENAI_API_KEY;
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `give me a short Quote on ${input}` }],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${apikey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
        const data = response.data.choices[0].message.content;
        res.status(200).send({ code: data });
      } else {
        // Handle the case when response.data.choices is empty
        res.status(500).send({ msg: 'No valid response from the API' });
      }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the quote." });
  }
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });