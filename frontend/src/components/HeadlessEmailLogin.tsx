import { useEffect, useRef, useState } from "react";
import { useConnectWithOtp } from "@dynamic-labs/sdk-react-core";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";

export default function HeadlessEmailLogin() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "code">("idle");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(false);
  const [isLoginByEmail, setIsLoginByEmail] = useState(false);
  const [verifying, setVerifying] = useState(false); // prevent double-submit
  const verifiedOnceRef = useRef(false); // hard guard against re-verification

  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (otp.length === 6 && !verifying && !verifiedOnceRef.current) {
      void onVerify(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, verifying]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => navigate("/home"), 2000);
    }
  }, [isLoggedIn, navigate]);

  function maskEmail(v: string) {
    const [user, domain] = v.split("@");
    if (!user || !domain) return v;
    const head = user.slice(0, 3);
    const tail = user.slice(-3);
    return `${head}${user.length > 6 ? "…" : ""}${tail}@${domain}`;
  }

  async function onSend() {
    setError(undefined);
    try {
      setIsLoginByEmail(true);
      await connectWithEmail(email);
      setPhase("code");
      setCooldown(30);
    } catch (e: any) {
      setError(e?.message ?? "Failed to send OTP");
    } finally {
      setIsLoginByEmail(false);
    }
  }

  async function onVerify(code: string) {
    if (verifying || verifiedOnceRef.current) return;
    setVerifying(true);
    setError(undefined);
    try {
      const result = await verifyOneTimePassword(code);
      if (result) {
        setVerified(true);
        verifiedOnceRef.current = true; // block future verify attempts
      } else {
        setVerified(false);
      }
    } catch (e: any) {
      setVerified(false);
      // If the backend says the session is invalid, restart the flow
      const msg = e?.message ?? "Invalid code, please try again";
      setError(msg);
      if (
        String(e?.code) === "invalid_email_verification" ||
        /invalid/i.test(msg)
      ) {
        setPhase("idle");
        setOtp("");
      }
    } finally {
      setVerifying(false);
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    await onSend();
  }

  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-b from-gray-800 to-gray-900/80 p-6 shadow-xl space-y-5">
      {phase === "idle" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-white">
            Sign in (Headless Email OTP)
          </h2>
          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-gray-900/70 border border-gray-600/60 px-3 py-2 text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
          <button
            disabled={!email || isLoginByEmail}
            onClick={onSend}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600/90 hover:bg-blue-600 px-3 py-2 text-sm font-medium focus-visible:outline-none disabled:opacity-50"
          >
            {isLoginByEmail ? "Loading..." : "Sign in"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}

      {phase === "code" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setPhase("idle");
                setOtp("");
                setError(undefined);
                setVerified(false);
                verifiedOnceRef.current = false;
              }}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              ← Back
            </button>
            <div className="text-sm text-gray-400"></div>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-xl font-semibold text-white">
              Confirm verification code
            </h2>
            <div className="w-12 h-12 rounded-full bg-gray-900/70 border border-gray-700/60 flex items-center justify-center">
              <span className="text-gray-300 text-lg">✉️</span>
            </div>
            <p className="text-sm text-gray-300">
              We’ve sent a verification code to <b>{maskEmail(email)}</b>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <OtpInput
              value={otp}
              onChange={(v) => !verifiedOnceRef.current && setOtp(v)}
              numInputs={6}
              shouldAutoFocus
              inputType="tel"
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              inputStyle={{
                fontSize: "1.5rem",
                width: "3rem",
                height: "3rem",
                borderRadius: "0.5rem",
                border: "1px solid #6b7280",
                backgroundColor: "#1f2937",
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
                outline: "none",
                opacity: verifiedOnceRef.current ? 0.6 : 1,
              }}
              renderInput={(props) => <input {...props} />}
            />
            <p className="text-sm text-green-500 mt-2">
              {verified && "✅ Verified"}
            </p>
            {verifying && (
              <p className="text-sm text-gray-400 mt-1">Verifying…</p>
            )}
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-400">Didn’t receive a code? </span>
            <button
              onClick={resend}
              disabled={cooldown > 0 || verifying}
              className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
            >
              {cooldown > 0 ? `Re-send in ${cooldown}s` : "Re-send code"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
