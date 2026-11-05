import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import TaskCard from '../components/tasks/TaskCard.jsx';
import TaskFilterBar from '../components/tasks/TaskFilterBar.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';
import { PriorityBadge, StatusBadge } from '../components/common/Badge.jsx';
import {
  PlusCircle,
  Loader2,
  FolderOpen,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  Edit3,
  Trash2,
} from 'lucide-react';

export const TasksPage = () => {
  const { user, isManager } = useAuth();
  const {
    tasks,
    filters,
    loadingTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    resetFilters,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchParams, setSearchParams] = useSearchParams();

  const onlyMyTasks = searchParams.get('filter') === 'my-tasks';

  // Trigger search/filter fetch whenever backend query filters change
  useEffect(() => {
    fetchTasks();
  }, [filters, fetchTasks]);

  const handleToggleMyTasks = (enable) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (enable === false) {
        next.delete('filter');
      } else if (enable === true) {
        next.set('filter', 'my-tasks');
      } else {
        if (onlyMyTasks) {
          next.delete('filter');
        } else {
          next.set('filter', 'my-tasks');
        }
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('filter');
      return next;
    });
    resetFilters();
  };

  // Client-side filter for logged in user's tasks
  const displayedTasks = tasks.filter((task) => {
    if (onlyMyTasks && user?.email) {
      return task.assignedTo?.toLowerCase() === user.email.toLowerCase();
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData, taskId) => {
    if (taskId) {
      await updateTask(taskId, taskData);
    } else {
      await createTask(taskData);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const statusOptions = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenCreateModal={handleOpenCreateModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Task Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isManager
                ? 'All company tasks across employees. Manage, filter, and assign.'
                : 'Tasks assigned to you. Track progress and keep priorities clear.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              New Task
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <TaskFilterBar
          filters={filters}
          onlyMyTasks={onlyMyTasks}
          onToggleMyTasks={handleToggleMyTasks}
          onChange={updateFilters}
          onReset={handleResetFilters}
        />

        {/* Tasks View: Loading / Empty / Grid / Table */}
        {loadingTasks ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-500">Loading your tasks...</p>
          </div>
        ) : displayedTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching tasks found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any tasks matching your active filters. Try clearing your search or filter options.
            </p>
            <div className="mt-5 flex justify-center space-x-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={deleteTask}
                onStatusChange={handleQuickStatusChange}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Title & Details</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedTasks.map((task) => {
                    const isCreator = user?.email?.toLowerCase() === task.createdBy?.toLowerCase();
                    const canEdit = isManager || isCreator || user?.email?.toLowerCase() === task.assignedTo?.toLowerCase();
                    const canDelete = isManager || isCreator;

                    return (
                      <tr key={task._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td className="px-6 py-4">
                          {canEdit ? (
                            <select
                              value={task.status}
                              onChange={(e) => handleQuickStatusChange(task._id, e.target.value)}
                              className="text-xs font-semibold rounded-lg px-2 py-1 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
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
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          {task.dueDate ? (
                            <div className="flex items-center space-x-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-700 truncate max-w-[140px]">
                          {task.assignedTo}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center space-x-1">
                            {canEdit && (
                              <button
                                onClick={() => handleOpenEditModal(task)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TasksPage;
