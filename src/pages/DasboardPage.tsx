import useArchiClient from '../hooks/ArchiClient'

function DashboardPage() {
    const { status } = useArchiClient()

    return (
        <div>
            <h1>Test Archipelago Client</h1>
            <p>Archi client status : {status}</p>
        </div>
    )
}

export default DashboardPage