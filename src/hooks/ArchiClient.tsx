import { useMemo } from "react"
import { Client } from "archipelago.js";

function ArchiClient() {
  return useMemo(() => {
    const client = new Client()
    client.messages.on("message", (content) => {
      console.log(content);
    });
    client.login("archipelago.gg:57732", "Tibouyou_CEL")
      .then(() => console.log("Connected to the Archipelago server!"))
      .catch(console.error);
    return client
  }, [])
}

export default ArchiClient