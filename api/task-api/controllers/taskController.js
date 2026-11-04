import * as taskService from '../services/taskService.js';

export const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask({
            taskData: req.body,
            user: req.user,
            token: req.headers.authorization, // <--- pass the auth token
        });
        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks({
            query: req.query,
            user: req.user,
        });
        res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user);
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask({
            taskId: req.params.id,
            updateData: req.body,
            user: req.user,
        });
        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await taskService.getDashboardStats(req.user);
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};