import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import PriorityBreakdown from '../components/dashboard/PriorityBreakdown.jsx';
import TaskCard from '../components/tasks/TaskCard.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';
import {
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Loader2,
  FolderOpen,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, isManager } = useAuth();
  const {
    tasks,
    dashboardStats,
    loadingTasks,
    fetchDashboardStats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    fetchTasks({ sortBy: 'createdAt', order: 'desc' });
  }, [fetchDashboardStats, fetchTasks]);

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

  const myTasks = tasks.filter(
    (t) => t.assignedTo?.toLowerCase() === user?.email?.toLowerCase()
  );
  const myRecentTasks = myTasks.slice(0, 4);
  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenCreateModal={handleOpenCreateModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs mb-3">
              {isManager ? 'Manager Workspace' : 'Employee Workspace'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              {isManager
                ? 'Oversee organization-wide workflows, monitor employee tasks, and assign priorities.'
                : 'Here is your active workload overview for today. Stay organized and complete on schedule.'}
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all hover:scale-102 shrink-0"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Task
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Tasks"
            count={dashboardStats.totalTasks}
            icon={ListTodo}
            color="indigo"
            subtitle="Overall recorded tasks"
          />
          <StatCard
            title="Pending"
            count={dashboardStats.pending}
            icon={Clock}
            color="amber"
            subtitle="Waiting to start"
          />
          <StatCard
            title="In Progress"
            count={dashboardStats.inProgress}
            icon={PlayCircle}
            color="blue"
            subtitle="Currently actively worked"
          />
          <StatCard
            title="Completed"
            count={dashboardStats.completed}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Done & resolved"
          />
        </div>

        {/* Priority & Workload Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PriorityBreakdown
              high={dashboardStats.highPriority}
              medium={dashboardStats.mediumPriority}
              low={dashboardStats.lowPriority}
            />
          </div>

          {/* Quick Stats / Info Widget */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Workflow Health</h4>
              <p className="text-xs text-slate-500 mb-4">
                Task completion progress across your workload
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Overall Completion Rate</span>
                    <span>
                      {dashboardStats.totalTasks > 0
                        ? `${Math.round(
                            (dashboardStats.completed / dashboardStats.totalTasks) * 100
                          )}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          dashboardStats.totalTasks > 0
                            ? (dashboardStats.completed / dashboardStats.totalTasks) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Logged in as: <strong className="text-slate-800">{user?.email}</strong></span>
                  <span className="font-semibold capitalize text-indigo-600">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">Need to see all records?</span>
              <Link
                to="/tasks"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center"
              >
                Go to Task Explorer
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* My Tasks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">My Tasks</h3>
              <p className="text-xs text-slate-500">Tasks assigned to you</p>
            </div>
            <Link
              to="/tasks?filter=my-tasks"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center"
            >
              View My Tasks ({myTasks.length})
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {loadingTasks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : myTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs">
              <p className="text-xs text-slate-500">No tasks currently assigned to you.</p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-3 inline-flex items-center px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Create Task for Yourself
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {myRecentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onDelete={deleteTask}
                  onStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Tasks</h3>
              <p className="text-xs text-slate-500">Your latest work items</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center"
            >
              View All ({tasks.length})
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {loadingTasks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No tasks found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't created or been assigned any tasks yet. Get started by adding your first task!
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Create First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onDelete={deleteTask}
                  onStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          )}
        </div>
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

export default DashboardPage;
