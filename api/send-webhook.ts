export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { username, questionNumber, finished } = body;

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: "Webhook URL not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = {
      username: "Matrix Mindcraft",
      avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
      embeds: [
        {
          title: "Matrix MindCraft Progress",
          color: 0x1abc9c,
          fields: [
            { name: "User", value: username, inline: true },
            {
              name: "Progress",
              value: finished ? "Finished!" : `Question ${questionNumber}`,
              inline: true,
            },
            { name: "Time", value: new Date().toLocaleString(), inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "Matrix MindCraft v1.2.5" },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Discord webhook error:", errText);
      return new Response(JSON.stringify({ error: "Failed to send webhook" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
