import { memo, forwardRef, useImperativeHandle, useRef } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { ChartData, ChartOptions } from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'

// Registrar componentes y plugins de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartDataLabels
)

interface ChartProps {
  data: Array<Record<string, string | number>>
  showLabels?: boolean
}

export const MemoizedAreaChart = memo(
  forwardRef<ChartJS<'line'>, ChartProps>(({ data, showLabels = false }, ref) => {
    const dataKey = Object.keys(data[0] || {}).find(k => k !== 'name') || 'value'
    const chartRef = useRef<ChartJS<'line'>>(null)

    useImperativeHandle(ref, () => chartRef.current as ChartJS<'line'>)
    
    const chartData: ChartData<'line'> = {
      labels: data.map((item) => String(item.name)),
      datasets: [
        {
          fill: true,
          label: dataKey.replace(/([A-Z])/g, ' $1').toUpperCase(),
          data: data.map((item) => Number(item[dataKey])),
          borderColor: '#E11D48',
          backgroundColor: 'rgba(225, 29, 72, 0.1)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#E11D48',
        },
      ],
    }

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: showLabels ? 0 : 400 },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        datalabels: {
          display: showLabels,
          align: 'top',
          color: '#E11D48',
          font: { weight: 'bold', size: 10 },
          formatter: (value) => value,
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#0F172A',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
        },
      },
      scales: {
        y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    }

    return <Line ref={chartRef} data={chartData} options={options} />
  })
)

export const MemoizedPieChart = memo(
  forwardRef<ChartJS<'pie'>, ChartProps>(({ data, showLabels = false }, ref) => {
    const chartRef = useRef<ChartJS<'pie'>>(null)
    const chartData: ChartData<'pie'> = {
      labels: data.map((item) => String(item.name)),
      datasets: [
        {
          data: data.map((item) => Number(item.value || 0)),
          backgroundColor: data.map((item) => String(item.color || '#E11D48')),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    }

    useImperativeHandle(ref, () => chartRef.current as ChartJS<'pie'>)

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: showLabels ? 0 : 400 },
      plugins: {
        datalabels: {
          display: showLabels,
          color: '#fff',
          font: { weight: 'bold', size: 10 },
          formatter: (value) => `${value}%`,
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#0F172A',
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
        },
        legend: {
          position: 'bottom' as const,
          labels: {
            boxWidth: 12,
            padding: 20,
            font: { size: 10, weight: 'bold' },
            color: '#64748b',
          },
        },
      },
    }

    return <Pie ref={chartRef} data={chartData} options={options} />
  })
)
