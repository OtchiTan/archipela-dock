import type { ChartData, ChartOptions } from "chart.js";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Deathlink } from "../types/socket.types";

type KillcountsEvolutionType = {
  deathlinks: Deathlink[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
);

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Historique des Deathlinks",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const rawData = context.raw as { y: number; game: string };
          return ` Kills: ${rawData.y} (${rawData.game})`;
        },
      },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        displayFormats: {
          day: "dd/MM",
        },
      },
      title: {
        display: true,
        text: "Date du décès",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Nombre de Kills",
      },
    },
  },
};

export const KillcountsEvolution = ({
  deathlinks,
}: KillcountsEvolutionType) => {
  const chartData: ChartData<"line"> = {
    datasets: [
      {
        label: "Évolution des Kills (Kill Count)",

        data: deathlinks.map((item) => ({
          x: item.timestamp,
          y: item.killCount,
          game: `${item.game.name} - ${item.game.player.username}`,
        })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.2,
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};
