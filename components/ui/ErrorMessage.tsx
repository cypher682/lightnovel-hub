import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
