const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "8644047107:AAFn7gsQy0c1hz6F-b5mXPqsIdOjcjoi5Qg";
const CHAT_ID = "-1003483487582";

app.post("/github", async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  let msg = "";

  if (event === "push") {
    const branch = payload.ref.split("/").pop(); // Extracts 'development'
    const repo = payload.repository.full_name;
    const user = payload.sender.login;
    
    msg = `🚀 *New Push to ${repo}*\n`;
    msg += `🌿 *Branch:* \`${branch}\`\n`;
    msg += `👤 *By:* ${user}\n\n`;

    if (payload.commits && payload.commits.length > 0) {
      msg += `📝 *Commits:*\n`;
      payload.commits.forEach(c => {
        msg += `• ${c.message}\n`;
      });
    }
    
    msg += `\n🔗 [View Changes](${payload.compare})`;
  } else {
    msg = `🔔 *GitHub Event:* ${event} in ${payload.repository.full_name}`;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: msg,
      parse_mode: "Markdown",
      disable_web_page_preview: false
    });
    console.log("Message sent to Telegram!");
  } catch (err) {
    console.error("Error sending to Telegram:", err.response?.data || err.message);
  }

  res.sendStatus(200);
});

// Added a root route to test if the server is up
app.get("/", (req, res) => res.send("Bot Server is Active!"));

app.listen(3000, () => console.log("Listening on port 3000"));