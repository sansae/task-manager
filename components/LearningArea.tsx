export default function LearningArea() {
  return (
    <div className="flex min-h-screen flex-col items-center my-0 mx-auto px-4 py-6 font-sans text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-semibold sm:text-3xl text-zinc-950 dark:text-zinc-50 py-4">Learning Area</h1>
        </header>

        <div className="chart-js">
          <h3>Chart.js</h3>
        </div>
      </div>
    </div>
  )
}