import type { NextApiRequest, NextApiResponse } from "next";
import { KOKORO_VOICES } from "./tts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  return res.status(200).json({ success: true, data: KOKORO_VOICES });
}