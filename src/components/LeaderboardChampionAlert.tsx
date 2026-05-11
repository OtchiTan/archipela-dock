import { useEffect, useState } from "react";
import "./LeaderboardChampionAlert.css";

export interface LeaderboardChampionAlertData {
  newLeaderName: string;
  oldLeaderName: string;
  eventName: string;
  newLeaderDeathlink: number;
}

interface LeaderboardChampionAlertProps {
  alert: LeaderboardChampionAlertData | null;
  onComplete?: () => void;
}

function playTrumpetFanfare() {
  try {
    const audio = new Audio('/assets/sounds/victory.mp3');
    audio.volume = 0.6;
    // Attempt to play; browsers may block autoplay — errors are caught.
    void audio.play().catch(() => undefined);
  } catch {
    // ignore any errors
  }
}

export function LeaderboardChampionAlert({ alert, onComplete }: LeaderboardChampionAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!alert) return;

    playTrumpetFanfare();

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 5200);

    const completeTimer = window.setTimeout(() => {
      onComplete?.();
    }, 5500);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(completeTimer);
    };
  }, [alert, onComplete]);

  if (!alert) return null;

  return (
    <div className={`leaderboard-champion-alert ${isVisible ? "show" : "hide"}`} role="alert" aria-live="polite">
      <div className="leaderboard-champion-alert__media">
        <img
          className="leaderboard-champion-alert__badge"
          src="/assets/gif/victory.gif"
          alt="victory"
          aria-hidden="true"
        />
      </div>

      <div className="leaderboard-champion-alert__copy">
        <div className="leaderboard-champion-alert__kicker">New leader</div>
        <div className="leaderboard-champion-alert__name">{alert.newLeaderName}</div>
        <div className="leaderboard-champion-alert__cause">
          a pris la première place dans <strong>{alert.eventName}</strong> avec {alert.newLeaderDeathlink} DeathLink,
          devant <strong>{alert.oldLeaderName}</strong>
        </div>
      </div>
    </div>
  );
}
