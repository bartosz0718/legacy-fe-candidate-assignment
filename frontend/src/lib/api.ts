import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL as string;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export type VerifyResponse = {
  isValid: boolean;
  signer: string | null;
  originalMessage: string | null;
  error?: string;
};

export async function verifySignature(message: string, signature: string) {
  const { data } = await api.post<VerifyResponse>("/verify-signature", {
    message,
    signature,
  });
  return data;
}
