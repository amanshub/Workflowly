'use client'

import { useState } from 'react'
import TaskCard from './TaskCard'

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

interface TaskBoardProps {
    tasks: Task[]
    onTaskUpdate: () => void
}

export default function TaskBoard({ tasks, onTaskUpdate }: TaskBoardProps) {
    const [editingTask, setEditingTask] = useState<string | null>(null)

    const columns = [
        { id: 'backlog', title: 'Backlog', color: 'border-gray-300 bg-gray-50' },
        { id: 'in_progress', title: 'In Progress', color: 'border-primary-300 bg-primary-50' },
        { id: 'done', title: 'Done', color: 'border-success-300 bg-success-50' },
    ]

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status)
    }

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                onTaskUpdate()
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const handleTaskEdit = async (taskId: string, updates: Partial<Task>) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            })

            if (response.ok) {
                onTaskUpdate()
                setEditingTask(null)
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                onTaskUpdate()
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
        }
    }

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Task Board</h2>

            {tasks.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
                    <p className="text-gray-500">Upload a meeting transcript, email, or document to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {columns.map(column => (
                        <div key={column.id} className={`rounded-lg border-2 ${column.color} p-4 min-h-[400px]`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-700">{column.title}</h3>
                                <span className="badge badge-info">{getTasksByStatus(column.id).length}</span>
                            </div>

                            <div className="space-y-3">
                                {getTasksByStatus(column.id).map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        isEditing={editingTask === task.id}
                                        onEdit={() => setEditingTask(task.id)}
                                        onSave={(updates) => handleTaskEdit(task.id, updates)}
                                        onCancel={() => setEditingTask(null)}
                                        onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                                        onDelete={() => handleDeleteTask(task.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
