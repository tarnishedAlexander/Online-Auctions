import Timer from "../components/Timer";

interface TimerDisplayProps {
  startTime?: string;
  duration?: number;
  status: "active" | "upcoming" | "past";
  onTimerEnd?: () => void;
}

function TimerDisplay({
  startTime,
  duration,
  status,
  onTimerEnd,
}: TimerDisplayProps) {
  return (
    <Timer
      startTime={startTime}
      duration={duration}
      status={status}
      onTimerEnd={onTimerEnd}
    />
  );
}

export default TimerDisplay;
