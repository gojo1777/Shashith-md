import { Router, type IRouter } from "express";
import { getBotStatus, getBotQr } from "../whatsapp/bot.js";

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

export default router;
