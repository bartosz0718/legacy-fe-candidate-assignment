import { useLocalHistory } from '../providers/LocalHistoryProvider';

export default function History() {
  const { items, clear } = useLocalHistory();

  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gradient-to-b from-gray-800 to-gray-900/80 p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Local history</h2>
        <button
          onClick={clear}
          disabled={!items.length}
          className="inline-flex items-center rounded-lg bg-gray-600/80 hover:bg-gray-600 px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {!items.length && (
        <p className="text-sm text-gray-400">No signed messages yet.</p>
      )}

      <ul className="space-y-3 max-h-[500px] overflow-y-auto">
        {items.map(i => (
          <li key={i.id} className="rounded-xl border border-gray-700/60 bg-gray-900/60 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="space-y-1 col-span-2">
                <div className="text-gray-400 text-xs">Address</div>
                <div className="font-mono text-gray-100 break-all">{i.address}</div>
              </div>
              <div className="space-y-1 col-span-1">
                <div className="text-gray-400 text-xs">Signed</div>
                <div className="text-gray-200">{new Date(i.ts).toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-1 mt-3">
              <div className="text-gray-400 text-xs">Message</div>
              <pre className="font-mono text-gray-100 bg-gray-950/40 border border-gray-700/60 rounded-md px-3 py-2 whitespace-pre-wrap break-words">
                {i.message}
              </pre>
            </div>

            <div className="space-y-1 mt-3">
              <div className="text-gray-400 text-xs">Signature</div>
              <div className="text-xs break-all text-gray-400">{i.signature}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}