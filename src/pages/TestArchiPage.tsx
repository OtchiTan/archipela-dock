import ArchiClient from "../hooks/ArchiClient";

function TestPage() {
    const archi = ArchiClient();

    return (
        <div>
            <h1>Test Archipelago Client</h1>
            <p>Archi client status : {archi ? "Connected" : "Not connected"}</p>
        </div>
    );
}

export default TestPage