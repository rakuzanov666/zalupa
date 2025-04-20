const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Твой Discord ID
const DISCORD_ID = "141026525409";

// Запрос к API Lanyard
async function getDiscordActivity() {
  try {
    const res = await axios.get(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    return res.data;
  } catch (err) {
    return { error: "Failed to fetch activity", details: err.message };
  }
}

app.get("/", async (req, res) => {
  const data = await getDiscordActivity();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
