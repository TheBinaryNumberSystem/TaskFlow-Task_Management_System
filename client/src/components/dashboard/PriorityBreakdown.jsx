import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export const PriorityBreakdown = ({ high = 0, medium = 0, low = 0 }) => {
  const total = high + medium + low;
  const highPct = total ? Math.round((high / total) * 100) : 0;
  const medPct = total ? Math.round((medium / total) * 100) : 0;
  const lowPct = total ? Math.round((low / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <h4 className="text-base font-bold text-slate-900 mb-1">Tasks by Priority</h4>
      <p className="text-xs text-slate-500 mb-4">Distribution across current workload</p>

      {/* Stacked Progress Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex mb-6">
        <div
          style={{ width: `${highPct}%` }}
          className="bg-rose-500 transition-all duration-500"
          title={`High: ${high}`}
        />
        <div
          style={{ width: `${medPct}%` }}
          className="bg-amber-400 transition-all duration-500"
          title={`Medium: ${medium}`}
        />
        <div
          style={{ width: `${lowPct}%` }}
          className="bg-emerald-500 transition-all duration-500"
          title={`Low: ${low}`}
        />
      </div>

      {/* Priority Legend & Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-center">
          <div className="flex items-center justify-center space-x-1 text-rose-700 mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">High</span>
          </div>
          <span className="text-xl font-bold text-rose-900">{high}</span>
          <span className="block text-[10px] text-rose-500 font-medium">{highPct}%</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
          <div className="flex items-center justify-center space-x-1 text-amber-700 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Medium</span>
          </div>
          <span className="text-xl font-bold text-amber-900">{medium}</span>
          <span className="block text-[10px] text-amber-500 font-medium">{medPct}%</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
          <div className="flex items-center justify-center space-x-1 text-emerald-700 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Low</span>
          </div>
          <span className="text-xl font-bold text-emerald-900">{low}</span>
          <span className="block text-[10px] text-emerald-500 font-medium">{lowPct}%</span>
        </div>
      </div>
    </div>
  );
};

export default PriorityBreakdown;
