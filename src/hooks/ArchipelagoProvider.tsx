import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Client, itemsHandlingFlags } from 'archipelago.js';
import { ArchipelagoContext, type ArchipelagoContextType } from './ArchipelagoContext';

const LOGIN_STORAGE_KEY = 'ton_cle_de_stockage'; 

export const ArchipelagoProvider = ({ children }: { children: ReactNode }) => {
  const clientRef = useRef<Client | null>(null);
  
  const isConnectingRef = useRef(false);

  const [status, setStatus] = useState<string>(() => {
    return localStorage.getItem(LOGIN_STORAGE_KEY) ? 'Connexion en cours...' : 'Déconnecté';
  });
  
  const [logs, setLogs] = useState<string[]>([]);

  const connectServer = async (address: string, slotName: string, password = '') => {
    if (isConnectingRef.current) return;
    
    isConnectingRef.current = true;
    setStatus('Connexion en cours...');
    
    setLogs([]); 
    
    try {
      await clientRef.current?.login(address, slotName, '', {
        password: password,
        items: itemsHandlingFlags.all,
        tags: ["AP", "Tracker", "DeathLink"],
      });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setStatus('Erreur de connexion');
    } finally {
      isConnectingRef.current = false;
    }
  };

  const disconnectServer = () => {
    clientRef.current?.socket.disconnect();
    localStorage.removeItem(LOGIN_STORAGE_KEY);
  };

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new Client();

      clientRef.current.messages.on('message', (message: string) => {
        setLogs((prevLogs) => [...prevLogs, message]);
      });

      clientRef.current.socket.on('connected', () => setStatus('Connecté'));
      clientRef.current.socket.on('disconnected', () => setStatus('Déconnecté'));
    }

    const savedData = localStorage.getItem(LOGIN_STORAGE_KEY);
    
    if (savedData && !clientRef.current?.authenticated && !isConnectingRef.current) {
      try {
        const { address, slotName, game, password } = JSON.parse(savedData);
        
        isConnectingRef.current = true;
        
        clientRef.current?.login(address, slotName, game, {
          password: password,
          items: itemsHandlingFlags.all,
          tags: ["AP", "Tracker", "DeathLink"],
        }).catch((error) => {
          console.error('Erreur de reconnexion automatique:', error);
          setStatus('Erreur de connexion');
        }).finally(() => {
          isConnectingRef.current = false;
        });

      } catch (e) {
        console.error("Erreur lors du parsing du localStorage", e);
      }
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.socket.disconnect();
        clientRef.current = null; 
      }
    };
  }, []);

  const value: ArchipelagoContextType = {
    getClient: () => clientRef.current,
    status,
    logs,
    connectServer,
    disconnectServer
  };

  return (
    <ArchipelagoContext.Provider value={value}>
      {children}
    </ArchipelagoContext.Provider>
  );
};