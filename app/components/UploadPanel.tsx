'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadPanelProps {
    onProcess: (sourceData: any) => void
    isProcessing: boolean
}

export default function UploadPanel({ onProcess, isProcessing }: UploadPanelProps) {
    const [sourceType, setSourceType] = useState<'meeting' | 'email' | 'document'>('meeting')
    const [textInput, setTextInput] = useState('')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setUploadedFile(acceptedFiles[0])
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
    })

    const handleProcess = async () => {
        if (!textInput && !uploadedFile) {
            alert('Please provide text or upload a file')
            return
        }

        if (uploadedFile) {
            // Handle file upload
            const formData = new FormData()
            formData.append('file', uploadedFile)
            formData.append('type', sourceType)

            try {
                const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingest/file`, {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadResponse.ok) throw new Error('Upload failed')

                const uploadResult = await uploadResponse.json()

                // Process the uploaded file
                onProcess({
                    sourceId: uploadResult.sourceId,
                    type: sourceType,
                })

                // Clear form
                setUploadedFile(null)
                setTextInput('')
            } catch (error) {
                console.error('Upload error:', error)
                alert('Failed to upload file')
            }
        } else {
            // Handle text input
            onProcess({
                text: textInput,
                type: sourceType,
            })

            // Clear form
            setTextInput('')
        }
    }

    return (
        <div className="card sticky top-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Source</h2>

            {/* Source Type Selector */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Source Type</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'meeting', label: '🎤 Meeting', icon: '🎤' },
                        { value: 'email', label: '📧 Email', icon: '📧' },
                        { value: 'document', label: '📄 Document', icon: '📄' },
                    ].map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setSourceType(type.value as any)}
                            className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${sourceType === type.value
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <div className="text-2xl mb-1">{type.icon}</div>
                            <div className="text-xs">{type.label.split(' ')[1]}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload File</label>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragActive
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400 bg-gray-50'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="text-4xl mb-2">📎</div>
                    {uploadedFile ? (
                        <div>
                            <p className="text-sm font-semibold text-primary-600">{uploadedFile.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setUploadedFile(null)
                                }}
                                className="text-xs text-danger-600 hover:text-danger-700 mt-2 font-semibold"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-600">
                                {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">TXT, PDF, or DOCX</p>
                        </div>
                    )}
                </div>
            </div>

            {/* OR Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
                </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Paste Text</label>
                <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={
                        sourceType === 'meeting'
                            ? 'Paste meeting transcript here...'
                            : sourceType === 'email'
                                ? 'Paste email content here...'
                                : 'Paste document text here...'
                    }
                    className="input-field min-h-[150px] resize-none text-sm"
                    disabled={!!uploadedFile}
                />
            </div>

            {/* Process Button */}
            <button
                onClick={handleProcess}
                disabled={isProcessing || (!textInput && !uploadedFile)}
                className={`w-full btn-primary ${isProcessing || (!textInput && !uploadedFile)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⚙️</span>
                        Processing...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <span>✨</span>
                        Extract Tasks with AI
                    </span>
                )}
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>💡 Tip:</strong> The AI will automatically extract action items, assignees, and due dates from your content.
                </p>
            </div>
        </div>
    )
}
