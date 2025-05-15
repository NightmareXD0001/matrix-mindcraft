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

    const now = new Date();
    const formattedDate = now.toISOString();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: "Missing webhook URL" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

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
            {
              name: "Reached",
              value: finished ? "Finished" : `Question ${questionNumber}`,
              inline: false,
            },
            { name: "Time", value: now.toLocaleString(), inline: false },
          ],
          timestamp: formattedDate,
          footer: { text: "Matrix MindCraft Protocol v1.2.5" },
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(await res.text());
      return new Response(JSON.stringify({ error: "Failed to send webhook" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in webhook handler:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
