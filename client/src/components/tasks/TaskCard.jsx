import { PriorityBadge, StatusBadge } from '../common/Badge.jsx';
import { Calendar, User, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();

  const isCreator = user?.email?.toLowerCase() === task.createdBy?.toLowerCase();
  const isManager = user?.role === 'manager';
  const isAssigned = user?.email?.toLowerCase() === task.assignedTo?.toLowerCase();

  const canEdit = isManager || isCreator || isAssigned;
  const canDelete = isManager || isCreator; // Backend RBAC rule

  // Due date calculation
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isOverdue =
    task.dueDate &&
    task.status !== 'Completed' &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const statusOptions = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Priority Badge & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <PriorityBadge priority={task.priority} />

          <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {canEdit && (
              <button
                onClick={() => onEdit(task)}
                title="Edit Task"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(task._id)}
                title="Delete Task"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description ? (
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mt-1.5">No description provided</p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        {/* Meta Info: Due Date & Overdue flag */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDueDate ? formattedDueDate : 'No due date'}</span>
          </div>

          {isOverdue && (
            <span className="inline-flex items-center text-rose-600 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <AlertTriangle className="w-3 h-3 mr-1" /> Overdue
            </span>
          )}
        </div>

        {/* Assigned To User */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600 truncate max-w-[180px]">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={`Assigned to ${task.assignedTo}`}>
              {task.assignedTo}
            </span>
          </div>

          {/* Quick Status Select / Badge */}
          {canEdit ? (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="text-xs font-semibold rounded-lg px-2 py-1 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          ) : (
            <StatusBadge status={task.status} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
