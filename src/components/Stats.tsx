import { useState } from "react";
import type { EventStats } from "../types/socket.types";
import "./Stats.css";
import { Panel } from "./core/Panel";

type StatsType = {
  eventPlaytime: EventStats;
};

const formatPlaytime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

export const Stats = ({ eventPlaytime }: StatsType) => {
  const [expandedPlayers, setExpandedPlayers] = useState<
    Record<number, boolean>
  >({});

  const togglePlayer = (playerId: number) => {
    setExpandedPlayers((previous) => ({
      ...previous,
      [playerId]: !previous[playerId],
    }));
  };

  const players = eventPlaytime.playersStats ?? [];
  const totalPlaytime = formatPlaytime(eventPlaytime.playtime ?? 0);
  const playerCount = players.length;

  return (
    <section className="playtime" aria-label="Temps de jeu">
      <header className="playtime__hero">
        <div>
          <p className="playtime__eyebrow">Statistiques de jeu</p>
          <h2 className="playtime__title">
            {eventPlaytime.eventName || "Événement en attente"}
          </h2>
        </div>

        <div className="playtime__stats">
          <article>
            <span>Joueurs</span>
            <strong>{playerCount}</strong>
          </article>
          <article>
            <span>Temps total</span>
            <strong>{totalPlaytime}</strong>
          </article>
        </div>
      </header>

      <Panel>
        {players.length === 0 ? (
          <div className="playtime__empty">
            Aucun temps de jeu disponible pour le moment.
          </div>
        ) : (
          <div className="playtime__players">
            {players.map((player) => {
              const isOpen = Boolean(expandedPlayers[player.playerId]);

              return (
                <article className="playtime__player" key={player.playerId}>
                  <button
                    type="button"
                    className="playtime__playerSummary"
                    onClick={() => togglePlayer(player.playerId)}
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="playtime__playerName">
                        {player.playerName}
                      </span>
                      <span className="playtime__playerTime">
                        {formatPlaytime(player.playtime)}
                        {player.deathlink !== 0 && (
                          <>
                            {" "}
                            | {player.deathlink} deathlinks | {player.killCount}{" "}
                            killcount
                          </>
                        )}
                      </span>
                    </div>
                    <span
                      className={`playtime__playerToggle ${isOpen ? "open" : ""}`}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="playtime__gamesList">
                      <div className="playtime__gamesHeader">
                        <span>Slot</span>
                        <span>Jeu</span>
                        <span>Deathlink</span>
                        <span>Killcount</span>
                        <span>Temps</span>
                      </div>
                      {player.gamesStats.map((game) => (
                        <div className="playtime__gameRow" key={game.gameId}>
                          <div
                            className="playtime__gameField"
                            data-label="Slot"
                          >
                            {game.slot}
                          </div>
                          <div className="playtime__gameField" data-label="Jeu">
                            {game.gameName}
                          </div>
                          <div
                            className="playtime__gameField"
                            data-label="Deathlink"
                          >
                            {game.deathlink != 0 ? game.deathlink : ""}
                          </div>
                          <div
                            className="playtime__gameField"
                            data-label="Killcount"
                          >
                            {game.killCount != 0 ? game.killCount : ""}
                          </div>
                          <div
                            className="playtime__gameField"
                            data-label="Temps"
                          >
                            {formatPlaytime(game.playtime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </Panel>
    </section>
  );
};
