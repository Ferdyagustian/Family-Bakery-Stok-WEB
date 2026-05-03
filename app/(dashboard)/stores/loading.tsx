export default function StoresLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-52 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72" />
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-36 flex-shrink-0" />
        </div>
      </div>

      {/* Stores grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-100 dark:border-gray-800 shadow-sm p-5 h-40"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
