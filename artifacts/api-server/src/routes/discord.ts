import { Router, type IRouter } from "express";
import { generateCode, buildLink } from "../lib/generateCode";
import { sendDiscordMessage } from "../lib/discord";

const router: IRouter = Router();

/**
 * POST /api/send-code
 *
 * Génère un code alphanumérique de 18 caractères, construit le lien
 * à partir du template configuré, et l'envoie via le webhook Discord.
 *
 * Réponse JSON :
 *   { code: string, link: string }
 */
router.post("/send-code", async (req, res): Promise<void> => {
  const webhookUrl = process.env["DISCORD_WEBHOOK_URL"];
  const linkTemplate =
    process.env["LINK_TEMPLATE"] ??
    "https://example.com/redeem/{code}/example";

  if (!webhookUrl) {
    req.log.warn("DISCORD_WEBHOOK_URL is not configured");
    res.status(503).json({
      error:
        "Discord webhook URL not configured. Please set the DISCORD_WEBHOOK_URL secret.",
    });
    return;
  }

  const code = generateCode();
  const link = buildLink(linkTemplate, code);
  const message = `🔗 Nouveau lien généré : ${link}`;

  req.log.info({ code, link }, "Sending Discord message via API");

  await sendDiscordMessage(webhookUrl, message);

  res.status(200).json({ code, link });
});

export default router;
