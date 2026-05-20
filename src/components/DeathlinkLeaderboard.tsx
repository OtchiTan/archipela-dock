import { useEffect, useMemo, useState } from "react";
import type { EventStats } from "../types/socket.types";
import {
  getLeaderboardRows,
  type LeaderboardRow,
} from "../utils/deathlinkLeaderboard";
import "./DeathlinkLeaderboard.css";

interface DeathlinkLeaderboardProps {
  event: EventStats | null;
}

export function DeathlinkLeaderboard({ event }: DeathlinkLeaderboardProps) {
  const [maxVisibleRows, setMaxVisibleRows] = useState(0);

  const rows = useMemo<LeaderboardRow[]>(() => {
    return getLeaderboardRows(event);
  }, [event]);

  useEffect(() => {
    const computeMaxVisibleRows = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobile = width <= 720;
      const isTablet = width <= 960;

      const reservedSpace = isMobile ? 430 : isTablet ? 380 : 320;
      const rowHeight = isMobile ? 78 : 62;
      const gap = 10;

      const availableRows = Math.floor(
        Math.max(height - reservedSpace, rowHeight) / (rowHeight + gap),
      );

      setMaxVisibleRows(Math.max(1, availableRows));
    };

    computeMaxVisibleRows();
    window.addEventListener("resize", computeMaxVisibleRows);

    return () => window.removeEventListener("resize", computeMaxVisibleRows);
  }, []);

  const visibleRows = useMemo(() => {
    if (!maxVisibleRows) return rows;

    return rows.slice(0, maxVisibleRows);
  }, [rows, maxVisibleRows]);

  const hiddenRowsCount = Math.max(0, rows.length - visibleRows.length);

  const summary = useMemo(() => {
    if (!event) {
      return {
        totalDeathlinks: 0,
        totalKills: 0,
        playersCount: 0,
        eventName: "En attente d'un événement",
      };
    }

    return {
      totalDeathlinks: event.deathlink,
      totalKills: event.killCount,
      playersCount: event.playersStats.length,
      eventName: event.eventName,
    };
  }, [event]);

  return (
    <section
      className="deathlink-leaderboard"
      aria-label="Leaderboard DeathLink"
    >
      <img
        className="deathlink-leaderboard__cloud deathlink-leaderboard__cloud--left"
        src="/assets/images/cloud-0001.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="deathlink-leaderboard__cloud deathlink-leaderboard__cloud--top"
        src="/assets/images/cloud-0002.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="deathlink-leaderboard__cloud deathlink-leaderboard__cloud--right"
        src="/assets/images/cloud-0003.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="deathlink-leaderboard__island"
        src="/assets/images/island-a.webp"
        alt=""
        aria-hidden="true"
      />
      <img
        className="deathlink-leaderboard__rock"
        src="/assets/images/rock-single.webp"
        alt=""
        aria-hidden="true"
      />

      <header className="deathlink-leaderboard__hero">
        <div>
          <h1 className="deathlink-leaderboard__eyebrow">
            {summary.eventName}
          </h1>
        </div>

        <div className="deathlink-leaderboard__stats">
          <article>
            <span>Total DeathLink</span>
            <strong>{summary.totalDeathlinks}</strong>
          </article>
          <article>
            <span>Kills total</span>
            <strong>{summary.totalKills}</strong>
          </article>
        </div>
      </header>

      <div className="deathlink-leaderboard__panel">
        <div className="deathlink-leaderboard__headerRow">
          <span>Rang</span>
          <span>Joueur</span>
          <span>Kills</span>
          <span>Deathlink</span>
          <span>Jeux</span>
          <span>Jeu principal</span>
        </div>

        {rows.length === 0 ? (
          <div className="deathlink-leaderboard__empty">
            Aucun DeathLink reçu pour le moment.
          </div>
        ) : (
          <div className="deathlink-leaderboard__rows">
            {visibleRows.map((player, index) => (
              <article
                className={`deathlink-leaderboard__row deathlink-leaderboard__row--rank-${Math.min(index + 1, 4)}`}
                key={player.playerId}
              >
                <span className="deathlink-leaderboard__rank">
                  #{index + 1}
                </span>
                <span className="deathlink-leaderboard__player">
                  {player.playerName}
                </span>
                <span className="deathlink-leaderboard__kills">
                  {player.killCount}
                </span>
                <span className="deathlink-leaderboard__score">
                  {player.deathlink}
                </span>
                <span className="deathlink-leaderboard__games">
                  {player.totalGames}
                </span>
                <span className="deathlink-leaderboard__topGame">
                  {player.topGameName}
                </span>
              </article>
            ))}

            {hiddenRowsCount > 0 && (
              <div className="deathlink-leaderboard__more">
                +{hiddenRowsCount} autre{hiddenRowsCount > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
