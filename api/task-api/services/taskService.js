import Task from '../models/Task.js';


const checkEmployeeExists = async (email, token) => {
    const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

    try {
        const response = await fetch(`${authUrl}/api/auth/verify-employee/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                Authorization: token, // forwards Bearer token
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Employee verification failed');
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.statusCode) throw error;
        const connError = new Error('Auth service is unreachable to verify employee email');
        connError.statusCode = 503;
        throw connError;
    }
};

export const createTask = async ({ taskData, user, token }) => {
    const { title, description, priority, status, dueDate, assignedTo } = taskData;

    let assignedUserEmail;

    if (user.role === 'manager') {
        // If manager didn't specify an email, default to self
        assignedUserEmail = assignedTo ? assignedTo.toLowerCase() : user.email;

        // If manager is assigning to someone else, verify with auth-api!
        if (assignedTo && assignedTo.toLowerCase() !== user.email) {
            await checkEmployeeExists(assignedTo, token);
        }
    } else {
        // Employees can only create tasks for themselves
        assignedUserEmail = user.email;
    }

    const task = await Task.create({
        title,
        description,
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate,
        assignedTo: assignedUserEmail,
        createdBy: user.email,
    });

    return task;
};

/**
 * Get tasks with search, filter, sort & RBAC scoping
 */
export const getTasks = async ({ query, user }) => {
    const { search, status, priority, sortBy, order } = query;

    // Base RBAC filter
    const filter = {};
    if (user.role === 'employee') {
        // Employees only see their own assigned tasks
        filter.assignedTo = user.email;
    }
    // Managers have no assignedTo restriction (see all tasks)

    // Status filter
    if (status) {
        filter.status = status;
    }

    // Priority filter
    if (priority) {
        filter.priority = priority;
    }

    // Title search (case-insensitive regex)
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    // Sorting
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    return tasks;
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (taskId, user) => {
    const task = await Task.findById(taskId);

    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    // RBAC check: Employees cannot view tasks assigned to others
    if (user.role === 'employee' && task.assignedTo !== user.email) {
        const error = new Error('Forbidden: You can only view your own tasks');
        error.statusCode = 403;
        throw error;
    }

    return task;
};

/**
 * Update a task (RBAC rules enforced)
 */
export const updateTask = async ({ taskId, updateData, user }) => {
    const task = await Task.findById(taskId);

    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    if (user.role === 'employee') {
        if (task.assignedTo !== user.email) {
            const error = new Error('Forbidden: You can only update tasks assigned to you');
            error.statusCode = 403;
            throw error;
        }

        if (updateData.status) {
            task.status = updateData.status;
        }

        const isCreator = task.createdBy === user.email;
        if (updateData.priority || updateData.dueDate || updateData.title || updateData.description) {
            if (!isCreator) {
                const error = new Error('Forbidden: You can only change priority, title, or due date on tasks you created');
                error.statusCode = 403;
                throw error;
            }
            if (updateData.title) task.title = updateData.title;
            if (updateData.description) task.description = updateData.description;
            if (updateData.priority) task.priority = updateData.priority;
            if (updateData.dueDate) task.dueDate = updateData.dueDate;
        }
    } else if (user.role === 'manager') {
        if (updateData.title) task.title = updateData.title;
        if (updateData.description) task.description = updateData.description;
        if (updateData.status) task.status = updateData.status;
        if (updateData.priority) task.priority = updateData.priority;
        if (updateData.dueDate) task.dueDate = updateData.dueDate;
        if (updateData.assignedTo) task.assignedTo = updateData.assignedTo.toLowerCase();
    }

    const updatedTask = await task.save();
    return updatedTask;
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId, user) => {
    const task = await Task.findById(taskId);

    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    // RBAC: Managers have full delete rights; employees can only delete tasks they created
    if (user.role === 'employee' && task.createdBy !== user.email) {
        const error = new Error('Forbidden: Employees can only delete tasks they personally created');
        error.statusCode = 403;
        throw error;
    }

    await task.deleteOne();
    return { message: 'Task deleted successfully' };
};

/**
 * Dashboard stats & metrics
 */
export const getDashboardStats = async (user) => {
    const matchFilter = {};

    if (user.role === 'employee') {
        matchFilter.assignedTo = user.email;
    }

    const stats = await Task.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
                completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
                highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
                mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'Medium'] }, 1, 0] } },
                lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'Low'] }, 1, 0] } },
            },
        },
    ]);

    return stats[0] || {
        totalTasks: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
    };
};

/**
 * Inter-service call: asks auth-api to verify employee email
 */
