import { useArchipelago } from '../hooks/ArchipelagoContext';

export default function LogsPage() {
  const { logs, status, disconnectServer } = useArchipelago();

  return (
    <div>
      <header>
        <h2>Console Archipelago ({status})</h2>
        <button onClick={disconnectServer}>Se déconnecter</button>
      </header>
      
      <div style={{ backgroundColor: '#1e1e1e', color: '#fff', padding: '1rem', height: '400px', overflowY: 'auto' }}>
        {logs.length === 0 ? (
          <p>En attente de messages...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ fontFamily: 'monospace', marginBottom: '4px' }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}