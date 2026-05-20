import "chartjs-adapter-date-fns";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { KillcountsEvolution } from "../components/KillcountsEvolution";
import { Stats } from "../components/Stats";
import useAxiosClient from "../hooks/AxiosClient";
import { EventStats, type Deathlink } from "../types/socket.types";

const EVENT_ID_STORAGE_KEY = "archiEventId";

function StatsPage() {
  const axios = useAxiosClient();
  const eventId = useMemo<number>(() => {
    const storedEventId = window.localStorage.getItem(EVENT_ID_STORAGE_KEY);

    if (!storedEventId) {
      return -1;
    }

    const parsedEventId = Number(storedEventId);

    if (Number.isFinite(parsedEventId) && parsedEventId > 0) {
      return parsedEventId;
    } else {
      return -1;
    }
  }, []);

  const [deathlinks, setDeathlinks] = useState<Deathlink[]>([]);
  const [playtimes, setPlaytimes] = useState<EventStats>(
    () => new EventStats(),
  );

  useEffect(() => {
    axios
      .get(`/ap-deathlinks`, {
        params: {
          eventId,
        },
      })
      .then(({ data }) => {
        setDeathlinks(data as Deathlink[]);
      })
      .catch((err) => console.error(err));
    axios
      .get(`/ap-events/${eventId}/stats`)
      .then(({ data }) => {
        setPlaytimes(data);
      })
      .catch((err) => console.error(err));
  }, [axios, eventId]);

  if (eventId === -1) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Stats eventPlaytime={playtimes} />
      <KillcountsEvolution deathlinks={deathlinks} />
    </>
  );
}

export default StatsPage;
