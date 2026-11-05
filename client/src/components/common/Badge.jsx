export const PriorityBadge = ({ priority }) => {
  const styles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const currentStyle = styles[priority] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          priority === 'High'
            ? 'bg-rose-500'
            : priority === 'Medium'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-slate-100 text-slate-700 border-slate-200',
    'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const currentStyle = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      {status}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const isManager = role === 'manager';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
        isManager
          ? 'bg-purple-100 text-purple-800 border border-purple-200'
          : 'bg-blue-100 text-blue-800 border border-blue-200'
      }`}
    >
      {role}
    </span>
  );
};
