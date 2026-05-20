import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DeathlinkEventInstance,
  EventStats,
  Game,
} from "../types/socket.types";
import "./DeathlinkAlert.css";

export const DEATHLINK_ALERT_DURATION_MS = 4200;

const DEATHLINK_GIF_OPTIONS = [
  "/assets/gif/annick-le-flambeau.gif",
  "/assets/gif/bruh-what-is-the-flop-everybody-do-the-flop.gif",
  "/assets/gif/caveira-skeleton.gif",
  "/assets/gif/colon-three-kitty.gif",
  "/assets/gif/cringe.gif",
  "/assets/gif/crushdiscord.gif",
  "/assets/gif/daeth-funi.gif",
  "/assets/gif/dancing-coffin-coffin-dance.gif",
  "/assets/gif/donut2.gif",
  "/assets/gif/grievous-star-wars.gif",
  "/assets/gif/jackass-3d.gif",
  "/assets/gif/jdg-joueur-du-grenier.gif",
  "/assets/gif/me-at-th-ep-ar-ty.gif",
  "/assets/gif/napoleon-there's-nothing-we-can-do-napoleon.gif",
  "/assets/gif/nelson-monfort.gif",
  "/assets/gif/nope.gif",
  "/assets/gif/nuh-uh.gif",
  "/assets/gif/old-man-stares-at-camera.gif",
  "/assets/gif/pou-shower.gif",
  "/assets/gif/shocked-computer.gif",
  "/assets/gif/sonic-sonic-the-hedgehog.gif",
  "/assets/gif/stickman-jumping.gif",
  "/assets/gif/tu-es-triste-tu.gif",
  "/assets/gif/turtle-crocs.gif",
];

const DEATHLINK_SOUND_OPTIONS = [
  "/assets/sounds/Bell1.mp3",
  "/assets/sounds/Bell2.mp3",
  "/assets/sounds/Directed_by_Robert.mp3",
  "/assets/sounds/faaah.mp3",
  "/assets/sounds/Fortnite.mp3",
  "/assets/sounds/He_fcked_up.mp3",
  "/assets/sounds/Machine.mp3",
  "/assets/sounds/Mario.mp3",
  "/assets/sounds/Nemesis.mp3",
  "/assets/sounds/OtchiPtoute.mp3",
  "/assets/sounds/Roblox.mp3",
  "/assets/sounds/Trombone.mp3",
  "/assets/sounds/Trombone2.mp3",
  "/assets/sounds/We_ll_Be_Right_Back.mp3",
];

const DEATHLINK_ALERT_MIN_DURATION_MS = 3000;

let hasPreloadedDeathlinkMedia = false;
const PRELOADED_DEATHLINK_AUDIOS: Map<string, HTMLAudioElement> = new Map();

function pickRandomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function preloadDeathlinkMedia() {
  if (hasPreloadedDeathlinkMedia) return;
  hasPreloadedDeathlinkMedia = true;

  DEATHLINK_GIF_OPTIONS.forEach((gifUrl) => {
    const image = new Image();
    image.src = gifUrl;
  });

  DEATHLINK_SOUND_OPTIONS.forEach((soundUrl) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = soundUrl;
    audio.load();
    PRELOADED_DEATHLINK_AUDIOS.set(soundUrl, audio);
  });
}

if (typeof window !== "undefined") {
  preloadDeathlinkMedia();
}

function playAlertSound(soundUrl: string, volume = 0.6) {
  const cached = PRELOADED_DEATHLINK_AUDIOS.get(soundUrl);
  if (cached) {
    try {
      cached.volume = volume;
      cached.currentTime = 0;
      void cached.play().catch(() => {
        // OBS/Browser policy may block autoplay in some setups.
      });
      return cached;
    } catch {
      // fallback to creating a new Audio if something goes wrong
    }
  }

  const audio = new Audio(soundUrl);
  audio.volume = volume;
  void audio.play().catch(() => {
    // OBS/Browser policy may block autoplay in some setups.
  });

  return audio;
}

function scheduleAlertDismissal(
  audio: HTMLAudioElement,
  onDismiss: () => void,
) {
  const minDurationTimer = window.setTimeout(() => {
    if (audio.ended || audio.paused) {
      onDismiss();
      return;
    }

    audio.addEventListener("ended", onDismiss, { once: true });
  }, DEATHLINK_ALERT_MIN_DURATION_MS);

  return () => {
    window.clearTimeout(minDurationTimer);
    audio.removeEventListener("ended", onDismiss);
    audio.pause();
    audio.currentTime = 0;
  };
}

interface DeathlinkAlertProps {
  event: EventStats | null;
  deathlink?: DeathlinkEventInstance;
  game?: Game;
}

export function DeathlinkAlert({
  event,
  deathlink,
  game,
}: DeathlinkAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const media = useState<{ gifUrl: string; soundUrl: string }>(() => ({
    gifUrl: pickRandomItem(DEATHLINK_GIF_OPTIONS),
    soundUrl: pickRandomItem(DEATHLINK_SOUND_OPTIONS),
  }))[0];
  const stopSoundRef = useRef<null | (() => void)>(null);

  const displayData = useMemo(() => {
    if (!event) return null;

    if (deathlink && game) {
      const playerName = game.player?.username || "Unknown Player";
      const gameName = game.name || "Unknown Game";
      const deathCount = deathlink.killCount || 0;
      return { playerName, gameName, deathCount };
    }

    const firstPlayer = event.playersStats[0];
    if (!firstPlayer) return null;

    const playerName = firstPlayer.playerName;
    const deathCount = firstPlayer.deathlink;

    const gameWithDeathlink = firstPlayer.gamesStats.find(
      (g) => g.deathlink > 0,
    );
    const gameName = gameWithDeathlink?.gameName || "Unknown Game";

    return { playerName, gameName, deathCount };
  }, [event, deathlink, game]);

  useEffect(() => {
    if (!displayData) return;

    stopSoundRef.current?.();
    const audio = playAlertSound(media.soundUrl);
    stopSoundRef.current = scheduleAlertDismissal(audio, () => {
      setIsVisible(false);
    });

    return () => {
      stopSoundRef.current?.();
      stopSoundRef.current = null;
    };
  }, [displayData, media.soundUrl]);

  useEffect(() => {
    return () => {
      stopSoundRef.current?.();
      stopSoundRef.current = null;
    };
  }, []);

  if (!displayData) return null;

  return (
    <div
      className={`deathlink-alert ${isVisible ? "show" : "hide"}`}
      aria-live="polite"
      role="alert"
    >
      <div className="deathlink-media">
        <img
          className="deathlink-gif"
          src={media.gifUrl}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="deathlink-copy">
        <div className="deathlink-kicker">DeathLink</div>
        <div className="deathlink-name">{displayData.playerName}</div>
        <div className="deathlink-cause">
          a déclenché un DeathLink ({displayData.deathCount}) dans{" "}
          <strong>{displayData.gameName}</strong>
        </div>
      </div>
    </div>
  );
}
