import { Router, type IRouter } from "express";
import { sendDiscordMessage } from "../lib/discord";

const router: IRouter = Router();

/**
 * POST /api/report-code
 *
 * Envoie sur Discord le résultat d'un test pour un code donné.
 *
 * Body JSON :
 *   {
 *     code:    string   — le code de 18 caractères testé
 *     success: boolean  — true = réussi, false = échec
 *     message?: string  — détail optionnel (ex: "Token expiré")
 *   }
 *
 * Réponse JSON :
 *   { sent: true, code, success }
 */
router.post("/report-code", async (req, res): Promise<void> => {
  const webhookUrl = process.env["DISCORD_WEBHOOK_URL"];

  if (!webhookUrl) {
    req.log.warn("DISCORD_WEBHOOK_URL is not configured");
    res.status(503).json({
      error: "Discord webhook URL not configured.",
    });
    return;
  }

  const { code, success, message } = req.body as {
    code?: unknown;
    success?: unknown;
    message?: unknown;
  };

  if (typeof code !== "string" || code.trim() === "") {
    res.status(400).json({ error: "Champ 'code' requis (string)." });
    return;
  }

  if (typeof success !== "boolean") {
    res.status(400).json({ error: "Champ 'success' requis (boolean)." });
    return;
  }

  const status = success ? "✅ Réussi" : "❌ Échec";
  const detail =
    typeof message === "string" && message.trim() !== ""
      ? `\n> ${message.trim()}`
      : "";

  const discordMessage =
    `**Rapport de test**\n` +
    `🔑 Code : \`${code}\`\n` +
    `${status}${detail}`;

  req.log.info({ code, success }, "Reporting code result to Discord");

  await sendDiscordMessage(webhookUrl, discordMessage);

  res.status(200).json({ sent: true, code, success });
});

export default router;
