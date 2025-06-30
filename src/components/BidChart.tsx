import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface BidChartProps {
  bids: { userId: string; bid: number; timestamp: string }[];
  getUserName: (userId: string) => string;
}

function BidChart({ bids, getUserName }: BidChartProps) {
  const aggregateBids = () => {
    const bidMap: { [key: string]: number } = {};
    bids.forEach((bid) => {
      if (bidMap[bid.userId]) {
        bidMap[bid.userId] += bid.bid;
      } else {
        bidMap[bid.userId] = bid.bid;
      }
    });
    return Object.keys(bidMap).map((userId) => ({
      userId,
      totalBid: bidMap[userId],
      username: getUserName(userId),
    }));
  };

  const bidData = aggregateBids();
  const chartData = {
    labels: bidData.map((data) => data.username),
    datasets: [
      {
        label: "Total Bids",
        data: bidData.map((data) => data.totalBid),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ mt: 2, height: "300px" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bid Distribution by User
      </Typography>
      <Pie data={chartData} options={chartOptions} />
    </Box>
  );
}

export default BidChart;
