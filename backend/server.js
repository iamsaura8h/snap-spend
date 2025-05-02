const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const axios = require("axios");
const cors = require("cors");
// require("dotenv").config();
require("dotenv").config({ path: "./.env" });


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello Saurabh from server!' });
});

const uploadRoute = require('./routes/uploadRoute');
app.use('/api', uploadRoute);

const upload = multer({ dest: "uploads/" });

// Gemini API integration
app.post("/analyze-transactions", upload.single("csvFile"), async (req, res) => {
  try {
    const csvFilePath = req.file.path;
    const transactions = [];

    // Parse CSV file to extract transaction descriptions
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.Description || row.description || row["Transaction Description"]) {
            const description =
              row.Description || row.description || row["Transaction Description"];
            transactions.push(description);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    fs.unlinkSync(csvFilePath);

    // Prepare prompt for Gemini API
    const prompt = `Categorize the following transaction descriptions into these 5 categories: Food, Travel, Shopping, Bills, and Other. Return result strictly as a JSON array where each item contains the original description and its category.

Example format:
[
  { "description": "Swiggy Order #123", "category": "Food" },
  { "description": "Uber Ride Mumbai", "category": "Travel" },
  ...
]

Transaction Descriptions:
${transactions.map((d, i) => `${i + 1}. ${d}`).join("\n")}`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const geminiText =
      geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    const jsonStart = geminiText.indexOf("[");
    const jsonEnd = geminiText.lastIndexOf("]");
    const clippedJson = geminiText.substring(jsonStart, jsonEnd + 1);

    const parsedData = JSON.parse(clippedJson);
    res.json(parsedData);
  } catch (error) {
    console.error(
      "Error processing transaction CSV:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to analyze transactions" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
