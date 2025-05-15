export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const { username, questionNumber, finished } = body;

  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!DISCORD_WEBHOOK_URL) {
    return new Response(JSON.stringify({ message: "Webhook URL not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const now = new Date();
  const formattedDate = now.toISOString();

  const payload = {
    username: "Matrix Mindcraft",
    avatar_url:
      "https://media.discordapp.net/attachments/1263456923135774813/1361614453614841886/a54a97f65ec79a095f427ba588fab8d5.png",
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
        footer: {
          text: "Matrix MindCraft Protocol v1.2.5",
        },
      },
    ],
  };

  try {
    const resp = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ message: "Failed to send webhook" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
