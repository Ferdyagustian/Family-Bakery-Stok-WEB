export default function ReportsLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72" />
      </div>

      {/* Export panel skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 space-y-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-40" />
      </div>
    </div>
  )
}
