import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

export const TaskFilterBar = ({
  filters,
  onlyMyTasks = false,
  onToggleMyTasks,
  onChange,
  onReset,
}) => {
  const handleSearchChange = (e) => {
    onChange({ search: e.target.value });
  };

  const activePill = onlyMyTasks ? 'My Tasks' : filters.status || 'All';

  const handlePillClick = (pill) => {
    if (pill === 'All') {
      if (onlyMyTasks && onToggleMyTasks) onToggleMyTasks(false);
      onChange({ status: '' });
    } else if (pill === 'My Tasks') {
      onChange({ status: '' });
      if (!onlyMyTasks && onToggleMyTasks) onToggleMyTasks(true);
    } else {
      if (onlyMyTasks && onToggleMyTasks) onToggleMyTasks(false);
      onChange({ status: pill });
    }
  };

  const pillOptions = ['All', 'My Tasks', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search tasks by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Sort By Field */}
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value })}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="createdAt">Sort by: Created Date</option>
            <option value="dueDate">Sort by: Due Date</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() =>
              onChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })
            }
            title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status & Filter Pills (Mutually Exclusive) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center">
          <Filter className="w-3 h-3 mr-1" /> Status:
        </span>
        {pillOptions.map((pill) => {
          const isActive = activePill === pill;
          return (
            <button
              key={pill}
              onClick={() => handlePillClick(pill)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskFilterBar;
