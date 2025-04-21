
/**
 * Discord Webhook Service for Matrix Quest Protocol
 * Sends notifications to Discord when players progress through the game
 */

// Discord webhook URL - this would typically be stored in an environment variable
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1363844306712002802/nU90v1kPTEJpLZG8cDiUHsOxKejBoPBugbfhBDC42Jtvy3Ysna0HimliiEWhbGnevfuS";

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
      username: "Matrix Mindcraft",
      avatar_url: "https://media.discordapp.net/attachments/1263456923135774813/1361614453614841886/a54a97f65ec79a095f427ba588fab8d5.png?ex=68074ec7&is=6805fd47&hm=9aaf8333e79b3b1d3580aec858f52788a84dd3b4f1bfc6c5850ca482c3676355&=&format=webp&quality=lossless&width=490&height=490", // Matrix-themed avatar
      embeds: [
        {
          title: "Matrix MindCraft Progress",
          color: 2067276, // Matrix green color
          fields: [
            {
              name: "User",
              value: username,
              inline: false,
            },
            {
              name: "Reached",
              value: `Question ${questionNumber}`,
              inline: false,
            },
            {
              name: "Time",
              value: now.toLocaleString(),
              inline: false,
            },
          ],
          timestamp: formattedDate,
          footer: {
            text: "Matrix MindCraft Protocol v1.2.5",
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

export const sendFinishWebhook = async (
  username: string,
): Promise<boolean> => {
  try {
    // Format the current time
    const now = new Date();
    const formattedDate = now.toISOString();
    
    // Create the embed payload
    const payload: WebhookPayload = {
      username: "Matrix Mindcraft",
      avatar_url: "https://media.discordapp.net/attachments/1263456923135774813/1361614453614841886/a54a97f65ec79a095f427ba588fab8d5.png?ex=68074ec7&is=6805fd47&hm=9aaf8333e79b3b1d3580aec858f52788a84dd3b4f1bfc6c5850ca482c3676355&=&format=webp&quality=lossless&width=490&height=490", // Matrix-themed avatar
      embeds: [
        {
          title: "Matrix MindCraft Progress",
          color: 2067276, // Matrix green color
          fields: [
            {
              name: "User",
              value: username,
              inline: false,
            },
            {
              name: "Reached",
              value: `Finished`,
              inline: false,
            },
            {
              name: "Time",
              value: now.toLocaleString(),
              inline: false,
            },
          ],
          timestamp: formattedDate,
          footer: {
            text: "Matrix MindCraft Protocol v1.2.5",
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

