import cron from "node-cron";
import { logger } from "./logger";
import { generateCode, buildLink } from "./generateCode";
import { sendDiscordMessage } from "./discord";

/**
 * Démarre le scheduler cron qui envoie automatiquement un code sur Discord.
 * Configure via les variables d'environnement :
 *   CRON_SCHEDULE      — expression cron (défaut : "0 * * * *" = toutes les heures)
 *   DISCORD_WEBHOOK_URL — URL du webhook Discord
 *   LINK_TEMPLATE       — URL avec {code} à remplacer (ex: https://example.com/redeem/{code}/example)
 */
export function startScheduler(): void {
  const schedule = process.env["CRON_SCHEDULE"] ?? "0 * * * *";
  const webhookUrl = process.env["DISCORD_WEBHOOK_URL"];
  const linkTemplate =
    process.env["LINK_TEMPLATE"] ??
    "https://example.com/redeem/{code}/example";

  if (!webhookUrl) {
    logger.warn(
      "DISCORD_WEBHOOK_URL is not set — cron scheduler will not run",
    );
    return;
  }

  if (!cron.validate(schedule)) {
    logger.error({ schedule }, "Invalid CRON_SCHEDULE expression — scheduler will not run");
    return;
  }

  cron.schedule(schedule, async () => {
    const code = generateCode();
    const link = buildLink(linkTemplate, code);
    const message = `🔗 Nouveau lien généré : ${link}`;

    logger.info({ code, link }, "Cron: sending Discord message");

    try {
      await sendDiscordMessage(webhookUrl, message);
    } catch (err) {
      logger.error({ err }, "Cron: failed to send Discord message");
    }
  });

  logger.info({ schedule }, "Cron scheduler started");
}
