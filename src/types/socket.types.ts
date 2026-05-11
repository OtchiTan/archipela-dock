// Event Types
export interface DeathlinkEvent {
  eventId: number;
  eventName: string;
  playerDeathlinks: PlayerDeathlink[];
  deathlink: number;
  killCount: number;
}

export interface PlayerDeathlink {
  playerId: number;
  playerName: string;
  gamesDeathlinks: GameDeathlink[];
  deathlink: number;
  killCount: number;
}

export interface GameDeathlink {
  gameId: number;
  slot: string;
  gameName: string;
  deathlink: number;
  killCount: number;
}

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
