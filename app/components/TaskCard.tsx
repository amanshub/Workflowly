'use client'

import { useState } from 'react'

interface Task {
    id: string
    title: string
    description: string
    assignee: string | null
    dueDate: string | null
    status: 'backlog' | 'in_progress' | 'done'
    confidence: number
    sourceId: string
    createdAt: string
}

interface TaskCardProps {
    task: Task
    isEditing: boolean
    onEdit: () => void
    onSave: (updates: Partial<Task>) => void
    onCancel: () => void
    onStatusChange: (newStatus: string) => void
    onDelete: () => void
}

export default function TaskCard({
    task,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onStatusChange,
    onDelete,
}: TaskCardProps) {
    const [editedTitle, setEditedTitle] = useState(task.title)
    const [editedAssignee, setEditedAssignee] = useState(task.assignee || '')
    const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '')

    const getConfidenceBadge = (confidence: number) => {
        if (confidence >= 0.7) return <span className="badge-success">High Confidence</span>
        if (confidence >= 0.4) return <span className="badge-warning">Medium Confidence</span>
        return <span className="badge-danger">Low Confidence</span>
    }

    const handleSave = () => {
        onSave({
            title: editedTitle,
            assignee: editedAssignee || null,
            dueDate: editedDueDate || null,
        })
    }

    if (isEditing) {
        return (
            <div className="bg-white rounded-lg p-4 shadow-md border-2 border-primary-300 animate-fade-in">
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="input-field mb-3 text-sm"
                    placeholder="Task title"
                />
                <input
                    type="text"
                    value={editedAssignee}
                    onChange={(e) => setEditedAssignee(e.target.value)}
                    className="input-field mb-3 text-sm"
                    placeholder="Assignee"
                />
                <input
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    className="input-field mb-3 text-sm"
                />
                <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-primary-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-primary-700">
                        Save
                    </button>
                    <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-semibold hover:bg-gray-300">
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 group animate-slide-up">
            {/* Confidence Badge */}
            <div className="flex items-start justify-between mb-2">
                {getConfidenceBadge(task.confidence)}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                        onClick={onEdit}
                        className="text-primary-600 hover:text-primary-700 text-xs font-semibold"
                        title="Edit task"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-danger-600 hover:text-danger-700 text-xs font-semibold"
                        title="Delete task"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Task Title */}
            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{task.title}</h4>

            {/* Task Description */}
            {task.description && task.description !== task.title && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}

            {/* Assignee */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">👤</span>
                <span className="text-sm text-gray-700">
                    {task.assignee || <span className="text-gray-400 italic">Unassigned</span>}
                </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">📅</span>
                    <span className="text-sm text-gray-700">
                        {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                </div>
            )}

            {/* Status Selector */}
            <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full text-xs px-2 py-1 rounded border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none"
            >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
            </select>
        </div>
    )
}
