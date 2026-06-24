// src/components/ui/LoadingSpinner.jsx
export default function LoadingSpinner({ message = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  )
}
