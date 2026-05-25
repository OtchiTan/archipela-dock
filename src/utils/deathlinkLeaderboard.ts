import { PlayerStats, type EventStats } from "../types/socket.types";

export type LeaderboardRow = PlayerStats & {
  totalGames: number;
  topGameName: string;
};

function pickTopGame(player: PlayerStats) {
  const topGame = [...player.gamesStats].sort((left, right) => {
    if (right.deathlink !== left.deathlink) {
      return right.deathlink - left.deathlink;
    }

    if (right.killCount !== left.killCount) {
      return right.killCount - left.killCount;
    }

    return left.gameName.localeCompare(right.gameName);
  })[0];

  return topGame?.gameName || "Aucun jeu";
}

export function getLeaderboardRows(event: EventStats | null) {
  if (!event) return [] as LeaderboardRow[];
  return [...event.playersStats]
    .sort((left, right) => {
      // Primary sort: total kills (desc)
      if (right.killCount !== left.killCount) {
        return right.killCount - left.killCount;
      }

      // Secondary sort: total deathlinks (desc)
      if (right.deathlink !== left.deathlink) {
        return right.deathlink - left.deathlink;
      }

      // Tertiary sort: alphabetical by player name
      return left.playerName.localeCompare(right.playerName);
    })
    .map((player) => ({
      ...player,
      totalGames: player.gamesStats.length,
      topGameName: pickTopGame(player),
    }));
}

export function getTopLeaderboardPlayer(event: EventStats | null) {
  return getLeaderboardRows(event)[0] ?? null;
}
