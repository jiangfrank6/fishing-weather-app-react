import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const TideChart = ({ tideData }) => {
  const textColor = 'rgba(226, 232, 240, 0.9)';
  const gridColor = 'rgba(226, 232, 240, 0.1)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 20,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        displayColors: false,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: (context) => `Height: ${context.raw} ft`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          lineWidth: 1.5,
          drawTicks: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
            weight: 'bold'
          },
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 30,
          padding: 8,
          callback: (value, index, values) => {
            const time = tideData[index]?.time;
            return time?.includes(':30') ? '' : time;
          }
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          color: gridColor,
          lineWidth: 1.5,
          drawTicks: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
            weight: 'bold'
          },
          callback: (value) => `${value} ft`,
          padding: 10
        },
        border: {
          display: false
        }
      },
    },
  };

  const data = {
    labels: tideData.map(point => point.time),
    datasets: [
      {
        fill: true,
        label: 'Tide Height',
        data: tideData.map(point => point.height),
        borderColor: 'rgb(56, 189, 248)',
        borderWidth: 2.5,
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        tension: 0.4,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(56, 189, 248)',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full h-[220px]">
      <Line options={options} data={data} />
    </div>
  );
};

export default TideChart; 