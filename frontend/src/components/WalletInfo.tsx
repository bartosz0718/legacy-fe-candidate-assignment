import { useEffect, useState } from 'react';
import { useDynamicContext, useEmbeddedWallet } from '@dynamic-labs/sdk-react-core';

export default function WalletInfo() {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const { createEmbeddedWallet, userHasEmbeddedWallet } = useEmbeddedWallet();
  const [ensured, setEnsured] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      if (!userHasEmbeddedWallet) {
        await createEmbeddedWallet(); // Headless creation
      }
      setEnsured(true);
    })();
  }, [user, userHasEmbeddedWallet, createEmbeddedWallet]);

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-b from-gray-800 to-gray-900/80 p-6 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Connected</h2>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
            ensured
              ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 ring-amber-500/30'
          }`}
        >
          {ensured ? 'Wallet ready' : 'Initializing...'}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <div className="text-gray-400">User</div>
          <div className="font-mono text-gray-100 break-all">{user.email ?? user.userId}</div>
        </div>
        <div className="space-y-1">
          <div className="text-gray-400">Wallet address</div>
          <div className="font-mono text-gray-100 truncate">{primaryWallet?.address ?? '(creating...)'}</div>
        </div>
      </div>

      <button
        onClick={handleLogOut}
        className="mt-2 inline-flex items-center rounded-lg bg-red-600/90 hover:bg-red-600 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
      >
        Log out
      </button>
    </div>
  );
}