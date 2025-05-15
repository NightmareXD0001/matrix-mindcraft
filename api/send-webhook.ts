// api/send-webhook.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, questionNumber, finished } = req.body;

  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!DISCORD_WEBHOOK_URL) {
    return res.status(500).json({ message: 'Webhook URL not configured' });
  }

  const now = new Date();
  const formattedDate = now.toISOString();

  const payload = {
    username: "Matrix Mindcraft",
    avatar_url: "https://media.discordapp.net/attachments/1263456923135774813/1361614453614841886/a54a97f65ec79a095f427ba588fab8d5.png",
    embeds: [
      {
        title: "Matrix MindCraft Progress",
        color: 2067276,
        fields: [
          { name: "User", value: username, inline: false },
          { name: "Reached", value: finished ? "Finished" : `Question ${questionNumber}`, inline: false },
          { name: "Time", value: now.toLocaleString(), inline: false },
        ],
        timestamp: formattedDate,
        footer: { text: "Matrix MindCraft Protocol v1.2.5" },
      },
    ],
  };

  try {
    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) {
      return res.status(500).json({ message: "Failed to send webhook" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).json({ message: "Error sending webhook" });
  }
}
