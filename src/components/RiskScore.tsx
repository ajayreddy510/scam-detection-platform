'use client';

interface RiskScoreProps {
  score: number;
}

export default function RiskScore({ score }: RiskScoreProps) {
  const getRiskLevel = () => {
    if (score > 70) {
      return {
        level: 'CRITICAL RISK',
        color: 'bg-red-50 border-red-300 text-red-900',
        bgGradient: 'bg-gradient-to-r from-red-500 to-red-600',
        textColor: 'text-red-700',
        badge: '🚨',
      };
    }
    if (score > 40) {
      return {
        level: 'MEDIUM RISK',
        color: 'bg-yellow-50 border-yellow-300 text-yellow-900',
        bgGradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        textColor: 'text-yellow-700',
        badge: '⚠️',
      };
    }
    return {
      level: 'LOW RISK',
      color: 'bg-green-50 border-green-300 text-green-900',
      bgGradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
      textColor: 'text-green-700',
      badge: '✅',
    };
  };

  const risk = getRiskLevel();

  return (
    <div className={`border-2 rounded-xl p-8 ${risk.color} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-1">FRAUD RISK SCORE</p>
          <h3 className="text-lg font-bold text-slate-900">JobShield Analysis</h3>
        </div>
        <span className="text-5xl font-bold text-slate-900 flex items-center gap-2">
          <span>{score}</span>
          <span className="text-3xl">/100</span>
        </span>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 shadow-lg ${risk.bgGradient}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{risk.badge}</span>
        <p className={`text-lg font-bold ${risk.textColor}`}>{risk.level}</p>
      </div>

      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <p className={`text-sm font-medium ${risk.textColor}`}>
          {score > 70
            ? 'Do NOT proceed. Verify through official channels immediately.'
            : score > 40
            ? 'Proceed with caution. Verify company details independently.'
            : 'Appears legitimate. Still verify independently as standard practice.'}
        </p>
      </div>
    </div>
  );
}
