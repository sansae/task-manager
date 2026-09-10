'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function AcquisitionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map((row) => row.count)
          }
        ]
      }
    })

    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />
}

export default function LearningArea() {
  return (
    <div className="lg:w-1/2 flex min-h-screen flex-col md:flex-row my-0 mx-auto px-4 py-6 font-sans text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-zinc-950 dark:text-zinc-50">Learning Area</h1>
            <p className="text-zinc-600 dark:text-zinc-400">My Learning playground</p>
          </div>
        </header>

        <div className="chart-js">
          <h3>Chart.js example</h3>
          <div className="w-[500px]">
            <AcquisitionChart />
          </div>
        </div>
      </div>
    </div>
  )
}