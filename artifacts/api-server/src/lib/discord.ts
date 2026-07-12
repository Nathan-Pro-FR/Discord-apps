import { logger } from "./logger";

/**
 * Envoie un message via un webhook Discord.
 * @param webhookUrl  URL du webhook Discord
 * @param content     Texte du message à envoyer
 */
export async function sendDiscordMessage(
  webhookUrl: string,
  content: string,
): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    logger.error(
      { status: res.status, body: text },
      "Discord webhook request failed",
    );
    throw new Error(`Discord webhook error ${res.status}: ${text}`);
  }

  logger.info({ status: res.status }, "Discord message sent");
}
