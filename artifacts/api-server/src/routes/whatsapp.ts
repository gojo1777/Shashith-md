import { Router, type IRouter } from "express";
import { getBotStatus, getBotQr, requestPairingCodeForNumber } from "../whatsapp/bot.js";

const router: IRouter = Router();

router.get("/whatsapp/status", (_req, res) => {
  const status = getBotStatus();

  res.json({
    connected: status.connected,
    user: status.user ? String(status.user.id) : null,
  });
});

router.get("/whatsapp/qr", (_req, res) => {
  const qrData = getBotQr();

  if (!qrData.qr) {
    return res.status(404).json({
      error: "QR not available",
      connected: qrData.connected,
    });
  }

  const base64 = qrData.qr.replace(
    /^data:image\/png;base64,/,
    ""
  );

  const imageBuffer = Buffer.from(base64, "base64");

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-store");
  res.send(imageBuffer);
});

// Link device using a phone number instead of scanning the QR code.
// POST body: { "number": "9476xxxxxxx" }  -> returns { "code": "ABCD-1234" }
router.post("/whatsapp/pair", async (req, res) => {
  const body = req.body as { number?: unknown };
  const number = typeof body?.number === "string" ? body.number.trim() : "";

  if (!number) {
    return res.status(400).json({ error: "number is required (e.g. 9476xxxxxxx)" });
  }

  try {
    const code = await requestPairingCodeForNumber(number);
    res.json({ code });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
