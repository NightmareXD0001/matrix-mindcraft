
/**
 * Discord Webhook Service for Matrix Quest Protocol
 * Sends notifications to Discord when players progress through the game
 */

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
const sendProgress = async (username: string, questionNumber: number, finished = false) => {
  try {
    await fetch("/api/send-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, questionNumber, finished }),
    });
    console.log("Progress webhook sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send progress webhook:", error);
    return false;
  }
};

/**
 * Send a completion notification to Discord
 */
export const sendFinishWebhook = async (
  username: string,
): Promise<boolean> => {
  try {
    await fetch("/api/send-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        username, 
        questionNumber: 0, 
        finished: true 
      }),
    });
    console.log("Finish webhook sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send finish webhook:", error);
    return false;
  }
};

export default { sendProgress, sendFinishWebhook };
