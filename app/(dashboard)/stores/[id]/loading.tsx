export default function StoreDetailLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-52" />
        <div className="ml-auto h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
      </div>

      {/* Sub-header skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="h-44 sm:h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
