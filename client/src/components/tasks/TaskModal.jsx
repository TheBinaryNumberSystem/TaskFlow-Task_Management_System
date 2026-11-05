import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import authApi from '../../api/authApi.js';
import toast from 'react-hot-toast';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

const TaskModalInner = ({ task, isManager, user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'Pending',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    assignedTo: task ? task.assignedTo : isManager ? '' : user?.email || '',
  });

  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(task ? true : null);
  const [submitting, setSubmitting] = useState(false);

  const isCreator = !task || task.createdBy === user?.email;
  // If employee and not creator, can only edit status
  const isEmployeeRestricted = !isManager && task && !isCreator;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'assignedTo') {
      setEmailVerified(null);
    }
  };

  const handleVerifyEmployee = async () => {
    if (!formData.assignedTo) {
      toast.error('Please enter an employee email');
      return;
    }
    setVerifyingEmail(true);
    try {
      await authApi.verifyEmployee(formData.assignedTo);
      setEmailVerified(true);
      toast.success('Valid employee email confirmed!');
    } catch (err) {
      setEmailVerified(false);
      toast.error(err.response?.data?.message || 'Employee email not found');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.dueDate) delete payload.dueDate;
      if (!isManager) {
        payload.assignedTo = user.email;
      }
      await onSave(payload, task?._id);
      onClose();
    } catch {
      // Error handled in context toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEmployeeRestricted && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            As an employee assigned to this task, you can update its status. Title, priority, and due dates can only be changed by the creator or manager.
          </span>
        </div>
      )}

      {/* Task Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isEmployeeRestricted}
          placeholder="e.g. Design Dashboard Components"
          maxLength={100}
          required
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          disabled={isEmployeeRestricted}
          placeholder="Add relevant notes, guidelines, or requirements..."
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 resize-none"
        />
      </div>

      {/* Priority & Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isEmployeeRestricted}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Due Date & Assignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={isEmployeeRestricted}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
          />
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Assigned To {isManager && <span className="text-slate-400 font-normal">(Email)</span>}
          </label>
          {isManager ? (
            <div className="flex space-x-2">
              <input
                type="email"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="employee@domain.com (or empty for self)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formData.assignedTo && (
                <button
                  type="button"
                  onClick={handleVerifyEmployee}
                  disabled={verifyingEmail}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center"
                >
                  {verifyingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : emailVerified ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    'Verify'
                  )}
                </button>
              )}
            </div>
          ) : (
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500"
            />
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {task ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export const TaskModal = ({ isOpen, onClose, task = null, onSave }) => {
  const { user, isManager } = useAuth();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-xl"
    >
      {isOpen && (
        <TaskModalInner
          key={task?._id || 'new-task'}
          task={task}
          isManager={isManager}
          user={user}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default TaskModal;
