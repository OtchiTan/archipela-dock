import { useArchipelago } from '../hooks/ArchipelagoContext';
import Logs from '../components/Logs'

function DashboardPage() {
    const { status } = useArchipelago();

    return (
        <div>
            <h1>Test Archipelago Client</h1>
            <p>Archi client status : {status}</p>
            <Logs />
        </div>
    )
}

export default DashboardPage