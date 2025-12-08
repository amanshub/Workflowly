'use client'

import { useState } from 'react'
import useSWR from 'swr'
import TaskBoard from './components/TaskBoard'
import UploadPanel from './components/UploadPanel'
import ProcessingStatus from './components/ProcessingStatus'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Home() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingMessage, setProcessingMessage] = useState('')
    const [error, setError] = useState<string | null>(null)

    const { data, error: fetchError, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`,
        fetcher,
        { refreshInterval: 3000 }
    )

    const tasks = data?.tasks || []

    const handleProcess = async (sourceData: any) => {
        setIsProcessing(true)
        setError(null)
        setProcessingMessage('Processing with AI...')

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/process/source`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sourceData),
            })

            if (!response.ok) {
                throw new Error('Processing failed')
            }

            const result = await response.json()
            setProcessingMessage(`✓ Created ${result.tasksCreated} tasks!`)

            // Refresh tasks
            mutate()

            setTimeout(() => {
                setIsProcessing(false)
                setProcessingMessage('')
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setIsProcessing(false)
            setProcessingMessage('')
        }
    }

    return (
        <main className="min-h-screen p-6 md:p-10">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                            WorkFlowly
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Turn meetings, emails and documents into action — automatically.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">{tasks.length}</div>
                            <div className="text-sm text-gray-500">Total Tasks</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Processing Status */}
            {(isProcessing || error) && (
                <ProcessingStatus
                    isProcessing={isProcessing}
                    message={processingMessage}
                    error={error}
                    onDismissError={() => setError(null)}
                />
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Panel - Left Sidebar */}
                <div className="lg:col-span-1">
                    <UploadPanel onProcess={handleProcess} isProcessing={isProcessing} />
                </div>

                {/* Task Board - Main Area */}
                <div className="lg:col-span-2">
                    <TaskBoard tasks={tasks} onTaskUpdate={mutate} />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>Powered by Gemini AI • Built for Hackathon 2024</p>
            </footer>
        </main>
    )
}
