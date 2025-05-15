
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

    // Using Vercel environment variable - this is only available on the server-side
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Discord webhook URL not configured");
      return new Response(JSON.stringify({ error: "Webhook URL not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Format the current time
    const now = new Date();
    const formattedDate = now.toISOString();

    const payload = {
      username: "Matrix Mindcraft",
      avatar_url: "https://media.discordapp.net/attachments/1263456923135774813/1361614453614841886/a54a97f65ec79a095f427ba588fab8d5.png?ex=68074ec7&is=6805fd47&hm=9aaf8333e79b3b1d3580aec858f52788a84dd3b4f1bfc6c5850ca482c3676355&=&format=webp&quality=lossless&width=490&height=490",
      embeds: [
        {
          title: "Matrix MindCraft Progress",
          color: 2067276, // Matrix green color
          fields: [
            { name: "User", value: username, inline: true },
            {
              name: "Progress",
              value: finished ? "Finished!" : `Question ${questionNumber}`,
              inline: true,
            },
            { name: "Time", value: now.toLocaleString(), inline: false },
          ],
          timestamp: formattedDate,
          footer: { text: "Matrix MindCraft v1.2.5" },
        },
      ],
    };

    // Send the webhook to Discord
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
