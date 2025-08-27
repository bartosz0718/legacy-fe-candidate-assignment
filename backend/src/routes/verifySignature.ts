import { Router } from "express";
import { verifyMessage, getAddress } from "ethers";
import { SignatureBody } from "../types";

export const router = Router();

/**
 * POST /verify-signature
 * body: { message: string, signature: string }
 */
router.post("/verify-signature", (req, res) => {
  const { message, signature } = req.body as SignatureBody;

  if (
    !message ||
    !signature ||
    typeof message !== "string" ||
    typeof signature !== "string"
  ) {
    return res.status(400).json({
      isValid: false,
      signer: null,
      originalMessage: null,
      error: "Invalid payload",
    });
  }

  try {
    const recovered = verifyMessage(message, signature); // ethers v6: returns address
    const signer = getAddress(recovered); // checksum
    return res.json({
      isValid: true,
      signer,
      originalMessage: message,
    });
  } catch (err: any) {
    return res.json({
      isValid: false,
      signer: null,
      originalMessage: message,
      error: err?.message ?? "Verification failed",
    });
  }
});
