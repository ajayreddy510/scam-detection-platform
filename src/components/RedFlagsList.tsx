'use client';

interface RedFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string;
}

interface RedFlagsListProps {
  flags: RedFlag[];
}

export default function RedFlagsList({ flags }: RedFlagsListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-l-4 border-red-500 text-red-900 shadow-md hover:shadow-lg';
      case 'medium':
        return 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 shadow-md hover:shadow-lg';
      case 'low':
        return 'bg-blue-50 border-l-4 border-blue-500 text-blue-900 shadow-md hover:shadow-lg';
      default:
        return 'bg-slate-100 border-l-4 border-slate-500 text-slate-900 shadow-md hover:shadow-lg';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return { badge: '🚨', label: 'CRITICAL' };
      case 'medium':
        return { badge: '⚠️', label: 'WARNING' };
      case 'low':
        return { badge: 'ℹ️', label: 'INFO' };
      default:
        return { badge: '•', label: 'NOTICE' };
    }
  };

  if (flags.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-green-800">
        <p className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-2xl">✅</span>
          No red flags detected - This posting appears legitimate
        </p>
        <p className="text-sm text-green-700 mt-2">However, always verify independently through official channels</p>
      </div>
    );
  }

  const criticalFlags = flags.filter((f) => f.severity === 'high');
  const mediumFlags = flags.filter((f) => f.severity === 'medium');
  const lowFlags = flags.filter((f) => f.severity === 'low');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-xl mb-4 text-slate-900 flex items-center gap-2">
          <span className="text-2xl">🚩</span>
          Red Flags Detected ({flags.length})
        </h3>

        {criticalFlags.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">CRITICAL</span>
              Critical Issues ({criticalFlags.length})
            </h4>
            <div className="space-y-3">
              {criticalFlags.map((flag, index) => (
                <div key={index} className={`p-4 rounded-lg transition ${getSeverityColor(flag.severity)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getSeverityBadge(flag.severity).badge}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-base">{flag.type}</h4>
                      <p className="text-sm mt-1">{flag.description}</p>
                      <div className="bg-white bg-opacity-60 rounded mt-2 p-2 text-xs">
                        <strong>Evidence:</strong> {flag.evidence}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mediumFlags.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">WARNING</span>
              Medium Risk ({mediumFlags.length})
            </h4>
            <div className="space-y-3">
              {mediumFlags.map((flag, index) => (
                <div key={index} className={`p-4 rounded-lg transition ${getSeverityColor(flag.severity)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getSeverityBadge(flag.severity).badge}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-base">{flag.type}</h4>
                      <p className="text-sm mt-1">{flag.description}</p>
                      <div className="bg-white bg-opacity-60 rounded mt-2 p-2 text-xs">
                        <strong>Evidence:</strong> {flag.evidence}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowFlags.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">INFO</span>
              Minor Issues ({lowFlags.length})
            </h4>
            <div className="space-y-3">
              {lowFlags.map((flag, index) => (
                <div key={index} className={`p-4 rounded-lg transition ${getSeverityColor(flag.severity)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getSeverityBadge(flag.severity).badge}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-base">{flag.type}</h4>
                      <p className="text-sm mt-1">{flag.description}</p>
                      <div className="bg-white bg-opacity-60 rounded mt-2 p-2 text-xs">
                        <strong>Evidence:</strong> {flag.evidence}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
