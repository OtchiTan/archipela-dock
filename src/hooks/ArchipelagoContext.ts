import { createContext, useContext } from 'react';
import { Client } from 'archipelago.js';

export interface ArchipelagoContextType {
  getClient: () => Client | null;
  status: string;
  logs: string[];
  connectServer: (address: string, slotName: string, password?: string) => Promise<void>;
  disconnectServer: () => void;
}

export const ArchipelagoContext = createContext<ArchipelagoContextType | null>(null);

export const useArchipelago = () => {
  const context = useContext(ArchipelagoContext);
  if (!context) throw new Error("useArchipelago doit être utilisé à l'intérieur d'un ArchipelagoProvider");
  return context;
};