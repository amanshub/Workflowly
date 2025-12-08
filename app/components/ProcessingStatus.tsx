'use client'

interface ProcessingStatusProps {
    isProcessing: boolean
    message: string
    error: string | null
    onDismissError: () => void
}

export default function ProcessingStatus({
    isProcessing,
    message,
    error,
    onDismissError,
}: ProcessingStatusProps) {
    if (!isProcessing && !error) return null

    return (
        <div className="mb-6 animate-slide-up">
            {error ? (
                <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-lg shadow-md">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">❌</span>
                            <div>
                                <h3 className="font-semibold text-danger-800">Error</h3>
                                <p className="text-sm text-danger-700 mt-1">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={onDismissError}
                            className="text-danger-600 hover:text-danger-800 font-bold text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl animate-spin">⚙️</span>
                        <div>
                            <h3 className="font-semibold text-primary-800">Processing</h3>
                            <p className="text-sm text-primary-700 mt-1">{message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
