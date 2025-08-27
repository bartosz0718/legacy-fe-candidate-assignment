import { FormEvent, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { verifySignature } from '../lib/api';
import { useLocalHistory } from '../providers/LocalHistoryProvider';

export default function SignMessage() {
  const { primaryWallet } = useDynamicContext();
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<string>('');
  const [working, setWorking] = useState(false);
  const { add } = useLocalHistory();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!primaryWallet) return;

    try {
      setWorking(true);
      const signature = await primaryWallet.signMessage(message);
      if (!signature) {
        setResult('Error signing message.');
        return;
      }
      
      const verify = await verifySignature(message, signature);

      add({ message, signature, address: verify.signer });
      setResult(
        verify.isValid ? `✅ Valid. Signed by ${verify.signer}` : `❌ Invalid signature`
      );
      setMessage('');
    } catch {
      setResult('Error signing or verifying.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-b from-gray-800 to-gray-900/80 p-6 shadow-xl space-y-4">
      <h2 className="text-xl font-semibold text-white">Sign custom message</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Message</label>
          <textarea
            rows={3}
            placeholder="Type a message to sign…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl bg-gray-900/70 border border-gray-600/60 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          />
        </div>
        <button
          type="submit"
          disabled={!primaryWallet || !message.trim() || working}
          className="inline-flex items-center rounded-lg bg-blue-600/90 hover:bg-blue-600 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {working ? 'Signing…' : 'Sign & Verify'}
        </button>
      </form>
      {result && (
        <p className="text-sm text-gray-300 bg-gray-900/50 border border-gray-700/60 rounded-md px-3 py-2">
          {result}
        </p>
      )}
    </div>
  );
}