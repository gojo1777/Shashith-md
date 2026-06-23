import { cmd } from "../command.js";

cmd(
  { pattern: "owner", alias: ["dev", "creator"], desc: "Get owner contact", category: "main", react: "👑" },
  async (conn, msg, { from, reply }) => {
    try {
      const OWNER_NUM = process.env["OWNER_NUMBER"] || "94763210994";
      const ownerJid = OWNER_NUM.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const text = `👑 *SHASHITH MD — Owner Info*

| 👤 *Owner:* SHASHITH 
| 📱 *Number:* +${OWNER_NUM}
| 🌟 *Bot:* SHASHITH MD v1.0.0

> © *POWERED BY SHASHITH  MD* 🌟`;

      const sock = conn as Record<string, (jid: string, content: unknown, opts?: unknown) => Promise<void>>;
      await sock["sendMessage"](from as string, {
        text,
        mentions: [ownerJid],
      }, { quoted: msg });
    } catch (e) {
      await (reply as (t: string) => Promise<void>)("❌ " + (e as Error).message);
    }
  }
);
