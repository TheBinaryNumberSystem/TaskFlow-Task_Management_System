import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            //   required: [true, 'Please provide a task description'],
            //   trim: true,
        },
        priority: {
            type: String,
            enum: {
                values: ['Low', 'Medium', 'High'],
                message: '{VALUE} is not a valid priority (Low, Medium, High)',
            },
            default: 'Medium',
        },
        status: {
            type: String,
            enum: {
                values: ['Pending', 'In Progress', 'Completed'],
                message: '{VALUE} is not a valid status (Pending, In Progress, Completed)',
            },
            default: 'Pending',
        },
        dueDate: {
            type: Date,
            //   required: [true, 'Please provide a due date'],
        },
        assignedTo: {
            type: String,
            ref: 'User',
            required: [true, 'Task must be assigned to self or to an employee'],
            lowercase: true,
            trim: true,
        },
        createdBy: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for high-performance searching and filtering
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);

export default Task;