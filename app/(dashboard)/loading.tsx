export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-5"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>

      {/* Breakdown table skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-6 h-56" />

      {/* Chart skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-6 h-72" />
    </div>
  )
}
