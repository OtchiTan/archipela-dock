// Deathlink Instance Types
export interface DeathlinkEventInstance {
  id: number;
  timestamp: string;
  cause: string;
  killCount: number;
  game: GameDetail;
}

export interface GameDetail {
  id: number;
  name: string;
  yaml: string;
  apworld: string | null;
  slot: string;
  isCoreGame: boolean;
  event?: EventInfo;
  player?: PlayerInfo;
}

export interface EventInfo {
  id: number;
  name: string;
  channelId: string;
  messageId: string;
  url: string;
  startTime: string;
  endTime: string | null;
  clientConnected: boolean;
}

export interface PlayerInfo {
  id: number;
  discord_id: string;
  username: string;
}

// Game Types
export interface Game {
  id: number;
  name: string;
  yaml: string;
  apworld: string | null;
  slot: string;
  isCoreGame: boolean;
  event: EventInfo;
  player: PlayerInfo;
}

export type Deathlink = {
  id: number;
  timestamp: number;
  cause: string;
  killCount: number;
  game: Game;
};

export class EventStats {
  eventId!: number;
  eventName!: string;
  playersStats: PlayerStats[] = [];
  playtime: number = 0;
  deathlink: number = 0;
  killCount: number = 0;
  startTime?: Date;
  endTime?: Date;
}

export class PlayerStats {
  playerId!: number;
  playerName!: string;
  gamesStats: GameStats[] = [];
  playtime: number = 0;
  deathlink: number = 0;
  killCount: number = 0;
}

export class GameStats {
  gameId!: number;
  slot!: string;
  gameName!: string;
  playtime: number = 0;
  deathlink: number = 0;
  killCount: number = 0;
}
