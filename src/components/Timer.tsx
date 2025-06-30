import { useState, useEffect } from "react";
import { Stack, Typography, Box } from "@mui/material";

const formatTimeRemaining = (
  seconds: number
): { days: number; hours: number; minutes: number; secs: number } => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return { days, hours, minutes, secs };
};

interface TimerProps {
  startTime: string | undefined;
  duration: number | undefined;
  status: "active" | "upcoming" | "past";
  onTimerEnd?: () => void; // Add callback prop
}

const Timer = ({ startTime, duration, status, onTimerEnd }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "active" || !startTime || !duration) {
      setTimeRemaining(null);
      return;
    }

    const start = new Date(startTime).getTime();
    const end = start + duration * 1000; // duration in seconds to milliseconds

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0 && status === "active" && onTimerEnd) {
        onTimerEnd(); // Call callback when timer reaches zero
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [startTime, duration, status, onTimerEnd]);

  const isAuctionEnded =
    timeRemaining === null || timeRemaining <= 0 || status !== "active";

  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 1,
        mt: 1,
        mx: "auto",
        width: "fit-content",
      }}
    >
      {isAuctionEnded ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Auction Ended
        </Typography>
      ) : timeRemaining !== null ? (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {formatTimeRemaining(timeRemaining).days} Days
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {formatTimeRemaining(timeRemaining).hours} Hours
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {formatTimeRemaining(timeRemaining).minutes} Minutes
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {formatTimeRemaining(timeRemaining).secs} Seconds
          </Typography>
        </Stack>
      ) : null}
    </Box>
  );
};

export default Timer;
