
/**
 * Discord Webhook Service for Matrix Quest Protocol
 * Sends notifications to Discord when players progress through the game
 */

// Discord webhook URL - this would typically be stored in an environment variable
const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";

interface WebhookPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number; // Discord color code
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
}

/**
 * Send a progress notification to Discord
 */
export const sendProgressWebhook = async (
  username: string,
  questionNumber: number
): Promise<boolean> => {
  try {
    // Format the current time
    const now = new Date();
    const formattedDate = now.toISOString();
    
    // Create the embed payload
    const payload: WebhookPayload = {
      username: "Matrix Quest Protocol",
      avatar_url: "https://i.imgur.com/4M34hi2.png", // Matrix-themed avatar
      embeds: [
        {
          title: "[MATRIX QUEST PROGRESS]",
          color: 2067276, // Matrix green color
          fields: [
            {
              name: "User",
              value: username,
              inline: true,
            },
            {
              name: "Reached",
              value: `Question ${questionNumber}`,
              inline: true,
            },
            {
              name: "Time",
              value: now.toLocaleString(),
              inline: true,
            },
          ],
          timestamp: formattedDate,
          footer: {
            text: "Matrix Quest Protocol v1.0",
          },
        },
      ],
    };

    // Don't actually send if the webhook URL isn't configured
    if (DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL") {
      console.log("Discord webhook URL not configured. Would have sent:", payload);
      return true;
    }
    
    // Send the request to Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
    return false;
  }
};
